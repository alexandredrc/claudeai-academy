import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendActivationEmail, type ActivationKind } from "@/lib/email/activation";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Réveil des comptes dormants.
 *
 * Le nurture d'achat suppose qu'on a commencé la formation ; ce cron-ci
 * s'adresse à ceux qui ne l'ont jamais ouverte — 63 comptes sur 67 au
 * 27/08/2026. Signal d'inactivité retenu : aucune ligne dans
 * `lesson_progress`. C'est imparfait (on peut lire sans cocher « terminé »),
 * mais c'est le seul signal d'usage que la base enregistre, et il est du bon
 * côté de l'erreur : on ne relance jamais quelqu'un qui a validé une leçon.
 */
const STEPS: { kind: ActivationKind; minAgeDays: number }[] = [
  { kind: "activation_j3", minAgeDays: 3 },
  { kind: "activation_j10", minAgeDays: 10 },
  { kind: "activation_j21", minAgeDays: 21 },
];

const ACTIVATION_KINDS = STEPS.map((s) => s.kind);

/**
 * Deux garde-fous de délivrabilité, et ils comptent autant que le contenu.
 *
 * COOLDOWN : au premier déploiement, tous les comptes dormants sont éligibles
 * aux trois étapes en même temps. Sans espacement, un compte de six mois
 * recevrait la séquence entière en trois jours. On impose donc une semaine
 * entre deux emails d'activation, quel que soit l'âge du compte.
 *
 * MAX_PER_RUN : le domaine expédie peu et sa réputation est jeune. Envoyer
 * 63 emails d'un coup après des semaines de silence est le meilleur moyen
 * d'atterrir en indésirables. On monte en charge par paliers quotidiens.
 */
const COOLDOWN_DAYS = 7;
const MAX_PER_RUN = 20;

type Candidate = {
  id: string;
  email: string;
  first_name: string | null;
  ageDays: number;
};

export async function GET(req: NextRequest) {
  // --- Auth : Vercel Cron envoie `Authorization: Bearer $CRON_SECRET`. ---
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[cron-activation] CRON_SECRET non défini — refus (fail closed).");
    return new NextResponse("Cron secret not configured", { status: 500 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const now = Date.now();
  const youngest = STEPS[0].minAgeDays;
  const olderThan = new Date(now - youngest * DAY_MS).toISOString();

  // 1. Comptes assez anciens pour mériter une relance. Les plus vieux d'abord :
  //    ce sont eux qui dorment depuis le plus longtemps.
  const { data: profiles, error: profErr } = await supabaseAdmin
    .from("profiles")
    .select("id, email, first_name, created_at")
    .lte("created_at", olderThan)
    .order("created_at", { ascending: true })
    .limit(500);

  if (profErr) {
    console.error("[cron-activation] select profiles failed:", profErr.message);
    return new NextResponse(`DB error: ${profErr.message}`, { status: 500 });
  }

  const all = (profiles ?? []).filter((p) => p.email);
  if (all.length === 0) {
    return NextResponse.json({ ok: true, report: emptyReport() });
  }
  const ids = all.map((p) => p.id);

  // 2. Qui a déjà validé au moins une leçon ? Ceux-là ne sont pas dormants.
  const { data: active, error: actErr } = await supabaseAdmin
    .from("lesson_progress")
    .select("user_id")
    .in("user_id", ids);
  if (actErr) {
    console.error("[cron-activation] select lesson_progress failed:", actErr.message);
    return new NextResponse(`DB error: ${actErr.message}`, { status: 500 });
  }
  const activeSet = new Set((active ?? []).map((r) => r.user_id));

  const dormant: Candidate[] = all
    .filter((p) => !activeSet.has(p.id))
    .map((p) => ({
      id: p.id,
      email: p.email as string,
      first_name: p.first_name ?? null,
      ageDays: Math.floor((now - new Date(p.created_at).getTime()) / DAY_MS),
    }));

  if (dormant.length === 0) {
    return NextResponse.json({ ok: true, report: emptyReport(), dormant: 0 });
  }
  const dormantIds = dormant.map((c) => c.id);

  // 3. Qui a un accès payé ? Le discours n'est pas le même pour un acheteur
  //    qui n'a jamais ouvert son pass et pour un visiteur qui s'est juste
  //    inscrit. Les accès offerts (0 €) comptent comme des accès.
  const { data: paid } = await supabaseAdmin
    .from("purchases")
    .select("user_id")
    .eq("status", "paid")
    .in("user_id", dormantIds);
  const accessSet = new Set((paid ?? []).map((r) => r.user_id));

  // 4. Historique d'activation : étapes déjà envoyées et date du dernier envoi.
  const { data: logs } = await supabaseAdmin
    .from("email_log")
    .select("user_id, kind, sent_at")
    .in("kind", ACTIVATION_KINDS)
    .in("user_id", dormantIds);

  const sentKinds = new Map<string, Set<string>>();
  const lastSentAt = new Map<string, number>();
  for (const row of logs ?? []) {
    const set = sentKinds.get(row.user_id) ?? new Set<string>();
    set.add(row.kind);
    sentKinds.set(row.user_id, set);
    const at = new Date(row.sent_at).getTime();
    lastSentAt.set(row.user_id, Math.max(lastSentAt.get(row.user_id) ?? 0, at));
  }

  // 5. Une seule étape par compte et par exécution, dans l'ordre.
  const report = emptyReport();
  report.dormant = dormant.length;
  let budget = MAX_PER_RUN;

  for (const c of dormant) {
    if (budget <= 0) {
      report.deferred++;
      continue;
    }

    const last = lastSentAt.get(c.id);
    if (last && now - last < COOLDOWN_DAYS * DAY_MS) {
      report.cooldown++;
      continue;
    }

    const done = sentKinds.get(c.id) ?? new Set<string>();
    const step = STEPS.find((s) => !done.has(s.kind) && c.ageDays >= s.minAgeDays);
    if (!step) {
      report.completed++;
      continue;
    }

    try {
      const ok = await sendActivationEmail({
        kind: step.kind,
        to: c.email,
        hasAccess: accessSet.has(c.id),
        firstName: c.first_name,
      });
      if (!ok) {
        // Resend non configuré : ne rien tracer, pour pouvoir renvoyer plus tard.
        report.skipped++;
        continue;
      }
      const { error: logErr } = await supabaseAdmin
        .from("email_log")
        .upsert(
          { user_id: c.id, email: c.email, kind: step.kind },
          { onConflict: "user_id,kind", ignoreDuplicates: true },
        );
      if (logErr) {
        console.error(
          `[cron-activation] email_log insert failed (${c.id}/${step.kind}):`,
          logErr.message,
        );
      }
      report.sent[step.kind]++;
      budget--;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[cron-activation] send failed (${c.id}/${step.kind}):`, message);
      report.failed++;
    }
  }

  console.log("[cron-activation] report:", JSON.stringify(report));
  return NextResponse.json({ ok: true, report });
}

function emptyReport() {
  return {
    dormant: 0,
    sent: { activation_j3: 0, activation_j10: 0, activation_j21: 0 } as Record<
      ActivationKind,
      number
    >,
    cooldown: 0,
    completed: 0,
    deferred: 0,
    skipped: 0,
    failed: 0,
  };
}
