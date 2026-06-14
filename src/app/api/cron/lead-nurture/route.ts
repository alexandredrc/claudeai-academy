import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendLeadEmail, type LeadEmailKind } from "@/lib/email/lead-magnet";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DAY_MS = 24 * 60 * 60 * 1000;

// Plancher : on n'envoie jamais la séquence à un lead antérieur à la mise en
// service (évite de réveiller rétroactivement d'anciens leads au 1er déploiement).
const LEAD_EPOCH = "2026-06-14T00:00:00.000Z";

// Séquence A — vente Pass Starter. Idempotence via lead_email_log (unique lead_id+kind).
const STEPS: { kind: LeadEmailKind; minAgeDays: number }[] = [
  { kind: "lead_a1", minAgeDays: 2 },
  { kind: "lead_a2", minAgeDays: 3 },
  { kind: "lead_a3", minAgeDays: 5 },
  { kind: "lead_a4", minAgeDays: 7 },
  { kind: "lead_a5", minAgeDays: 10 },
];

type Lead = { id: string; email: string; first_name: string | null };

// Emails de leads déjà devenus clients (achat payé) → on arrête de pitcher.
async function convertedEmails(emails: string[]): Promise<Set<string>> {
  const set = new Set<string>();
  if (emails.length === 0) return set;

  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("id, email")
    .in("email", emails);
  if (!profiles || profiles.length === 0) return set;

  const idToEmail = new Map<string, string>();
  for (const prof of profiles) {
    if (prof.email) idToEmail.set(prof.id, prof.email.toLowerCase());
  }

  const { data: paid } = await supabaseAdmin
    .from("purchases")
    .select("user_id")
    .eq("status", "paid")
    .in("user_id", [...idToEmail.keys()]);
  for (const row of paid ?? []) {
    const email = idToEmail.get(row.user_id);
    if (email) set.add(email);
  }
  return set;
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[cron-lead-nurture] CRON_SECRET non défini — refus (fail closed).");
    return new NextResponse("Cron secret not configured", { status: 500 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const now = Date.now();
  const report: Record<string, { eligible: number; sent: number; skipped: number; failed: number }> = {};

  for (const step of STEPS) {
    const olderThan = new Date(now - step.minAgeDays * DAY_MS).toISOString();
    const r = { eligible: 0, sent: 0, skipped: 0, failed: 0 };
    report[step.kind] = r;

    // Leads assez « vieux » pour l'étape, dans la fenêtre, non désinscrits.
    const { data: leads, error } = await supabaseAdmin
      .from("leads")
      .select("id, email, first_name")
      .is("unsubscribed_at", null)
      .lte("created_at", olderThan)
      .gte("created_at", LEAD_EPOCH)
      .order("created_at", { ascending: true })
      .limit(500);

    if (error) {
      console.error(`[cron-lead-nurture] select leads (${step.kind}) failed:`, error.message);
      return new NextResponse(`DB error: ${error.message}`, { status: 500 });
    }
    if (!leads || leads.length === 0) continue;
    r.eligible = leads.length;

    // Déjà envoyés pour cette étape.
    const leadIds = leads.map((l) => l.id);
    const { data: already } = await supabaseAdmin
      .from("lead_email_log")
      .select("lead_id")
      .eq("kind", step.kind)
      .in("lead_id", leadIds);
    const sentSet = new Set((already ?? []).map((x) => x.lead_id));

    // Leads devenus clients → on ne pitche plus.
    const converted = await convertedEmails(leads.map((l) => l.email.toLowerCase()));

    for (const lead of leads as Lead[]) {
      if (sentSet.has(lead.id) || converted.has(lead.email.toLowerCase())) {
        r.skipped++;
        continue;
      }
      try {
        const ok = await sendLeadEmail({ kind: step.kind, to: lead.email, firstName: lead.first_name });
        if (!ok) {
          r.skipped++;
          continue;
        }
        const { error: logErr } = await supabaseAdmin
          .from("lead_email_log")
          .upsert(
            { lead_id: lead.id, email: lead.email, kind: step.kind },
            { onConflict: "lead_id,kind", ignoreDuplicates: true },
          );
        if (logErr) {
          console.error(`[cron-lead-nurture] log insert failed (${lead.id}/${step.kind}):`, logErr.message);
        }
        r.sent++;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[cron-lead-nurture] send failed (${lead.id}/${step.kind}):`, message);
        r.failed++;
      }
    }
  }

  console.log("[cron-lead-nurture] report:", JSON.stringify(report));
  return NextResponse.json({ ok: true, report });
}
