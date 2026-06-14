import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isValidTier, type PlanTier } from "@/lib/stripe/plans";
import { sendNurtureEmail, type NurtureKind } from "@/lib/email/nurture";

export const dynamic = "force-dynamic";
// Sécurité : on ne veut pas qu'une exécution traîne ; petit budget suffisant.
export const maxDuration = 60;

const DAY_MS = 24 * 60 * 60 * 1000;

// Plancher : on n'envoie JAMAIS de nurture pour un achat antérieur à la mise
// en service de la séquence (évite de réveiller rétroactivement les clients/comptes
// de test existants au premier déploiement). Seuls les achats >= cette date entrent.
const NURTURE_EPOCH = "2026-06-13T00:00:00.000Z";

// On cible les achats « assez vieux » pour l'étape. L'idempotence vient de
// email_log (unique user_id+kind) : un cron en retard rattrape sans doublon.
// onlyTier : restreint l'étape à un tier (ex. ascension d14 réservée aux Starter).
const STEPS: { kind: NurtureKind; minAgeDays: number; onlyTier?: PlanTier }[] = [
  { kind: "nurture_d1", minAgeDays: 1 },
  { kind: "nurture_d7", minAgeDays: 7 },
  { kind: "nurture_d14", minAgeDays: 14, onlyTier: "starter" },
];

type Candidate = {
  user_id: string;
  tier: PlanTier;
  purchase_id: string;
  email: string;
  first_name: string | null;
};

export async function GET(req: NextRequest) {
  // --- Auth : Vercel Cron envoie `Authorization: Bearer $CRON_SECRET`. ---
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[cron-nurture] CRON_SECRET non défini — refus (fail closed).");
    return new NextResponse("Cron secret not configured", { status: 500 });
  }
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const now = Date.now();
  const report: Record<string, { eligible: number; sent: number; skipped: number; failed: number }> = {};

  for (const step of STEPS) {
    const olderThan = new Date(now - step.minAgeDays * DAY_MS).toISOString();
    const r = { eligible: 0, sent: 0, skipped: 0, failed: 0 };
    report[step.kind] = r;

    // Achats payés, dans la fenêtre, non remboursés.
    // NB: pas d'embed PostgREST purchases→profiles (les deux pointent vers
    // auth.users, pas de FK directe) → on récupère les profils en 2e requête.
    const { data: purchases, error } = await supabaseAdmin
      .from("purchases")
      .select("id, user_id, tier, paid_at")
      .eq("status", "paid")
      .lte("paid_at", olderThan)
      .gte("paid_at", NURTURE_EPOCH)
      .order("paid_at", { ascending: true });

    if (error) {
      console.error(`[cron-nurture] select purchases (${step.kind}) failed:`, error.message);
      return new NextResponse(`DB error: ${error.message}`, { status: 500 });
    }

    // Dédoublonne par user (un user peut avoir 2 achats) : on garde le 1er payé.
    const firstByUser = new Map<string, { id: string; tier: PlanTier }>();
    for (const row of purchases ?? []) {
      if (!isValidTier(row.tier)) continue;
      if (firstByUser.has(row.user_id)) continue;
      firstByUser.set(row.user_id, { id: row.id, tier: row.tier });
    }
    if (firstByUser.size === 0) continue;

    // Étape restreinte à un tier (ex. ascension Starter) : on ne garde que ce tier,
    // et on exclut ceux qui ont DÉJÀ acheté le Mastery (ne jamais re-pitcher un client).
    if (step.onlyTier) {
      for (const [userId, p] of [...firstByUser]) {
        if (p.tier !== step.onlyTier) firstByUser.delete(userId);
      }
      if (firstByUser.size === 0) continue;
      if (step.onlyTier === "starter") {
        const { data: upgraders } = await supabaseAdmin
          .from("purchases")
          .select("user_id")
          .eq("status", "paid")
          .eq("tier", "mastery")
          .in("user_id", [...firstByUser.keys()]);
        for (const u of upgraders ?? []) firstByUser.delete(u.user_id);
        if (firstByUser.size === 0) continue;
      }
    }

    // Profils (email + prénom) pour ces users.
    const ids = [...firstByUser.keys()];
    const { data: profiles, error: profErr } = await supabaseAdmin
      .from("profiles")
      .select("id, email, first_name")
      .in("id", ids);
    if (profErr) {
      console.error(`[cron-nurture] select profiles (${step.kind}) failed:`, profErr.message);
      return new NextResponse(`DB error: ${profErr.message}`, { status: 500 });
    }

    const byUser = new Map<string, Candidate>();
    for (const prof of profiles ?? []) {
      if (!prof.email) continue;
      const purchase = firstByUser.get(prof.id);
      if (!purchase) continue;
      byUser.set(prof.id, {
        user_id: prof.id,
        tier: purchase.tier,
        purchase_id: purchase.id,
        email: prof.email,
        first_name: prof.first_name ?? null,
      });
    }
    r.eligible = byUser.size;
    if (byUser.size === 0) continue;

    // Qui a déjà reçu cet email ?
    const userIds = [...byUser.keys()];
    const { data: already } = await supabaseAdmin
      .from("email_log")
      .select("user_id")
      .eq("kind", step.kind)
      .in("user_id", userIds);
    const sentSet = new Set((already ?? []).map((x) => x.user_id));

    for (const c of byUser.values()) {
      if (sentSet.has(c.user_id)) {
        r.skipped++;
        continue;
      }
      try {
        const ok = await sendNurtureEmail({
          kind: step.kind,
          to: c.email,
          tier: c.tier,
          firstName: c.first_name,
        });
        if (!ok) {
          // RESEND non configuré : on n'enregistre PAS (pour pouvoir renvoyer plus tard).
          r.skipped++;
          continue;
        }
        // Trace l'envoi (idempotence). onConflict : si course entre 2 runs, on ignore.
        const { error: logErr } = await supabaseAdmin
          .from("email_log")
          .upsert(
            {
              user_id: c.user_id,
              email: c.email,
              kind: step.kind,
              purchase_id: c.purchase_id,
            },
            { onConflict: "user_id,kind", ignoreDuplicates: true },
          );
        if (logErr) {
          console.error(`[cron-nurture] email_log insert failed (${c.user_id}/${step.kind}):`, logErr.message);
        }
        r.sent++;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[cron-nurture] send failed (${c.user_id}/${step.kind}):`, message);
        r.failed++;
      }
    }
  }

  console.log("[cron-nurture] report:", JSON.stringify(report));
  return NextResponse.json({ ok: true, report });
}
