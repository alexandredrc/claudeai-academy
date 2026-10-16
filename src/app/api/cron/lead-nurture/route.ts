import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendLeadEmail, type LeadEmailKind } from "@/lib/email/lead-magnet";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DAY_MS = 24 * 60 * 60 * 1000;
// Le cron passe une fois par jour à heure fixe, mais jamais à la seconde près :
// sans marge, un écart « 7 jours » mesuré à 09:30:04 contre 09:30:09 la semaine
// d'avant ferait glisser l'email au lendemain.
const MARGE_MS = 3 * 60 * 60 * 1000;
// Resend accepte environ deux envois par seconde, et la fonction vit 60 s. Le
// matin où la série B démarre, ~70 leads sont éligibles d'un coup : on espace
// les envois et on plafonne, le reste part le lendemain (même règle d'un email
// par jour et par lead, rien n'est perdu).
const MAX_ENVOIS = 40;
const PAUSE_MS = 550;

// Plancher : on n'envoie jamais la séquence à un lead antérieur à la mise en
// service (évite de réveiller rétroactivement d'anciens leads au 1er déploiement).
const LEAD_EPOCH = "2026-06-14T00:00:00.000Z";

/**
 * Le planning, dans l'ordre. Un lead reçoit l'étape suivante quand il a l'âge
 * voulu ET que son dernier email date d'au moins `ecartJours`.
 *
 * Pourquoi l'écart compte autant que l'âge : la série B (une étude de cas par
 * semaine) a été ajoutée le 04/10/2026 alors que 74 leads avaient déjà fini
 * la série A. Planifiée sur l'âge seul, elle leur serait tombée dessus en huit
 * emails le même matin. Avec l'écart, chacun la reçoit au rythme promis par le
 * formulaire du kit : un usage concret par semaine.
 *
 * - A1 à A5 : les dix premiers jours, découverte puis offre d'entrée (47 €).
 * - B1 à B8 : un cas concret par semaine, chiffré et sourcé, puis l'offre.
 */
const STEPS: { kind: LeadEmailKind; ageJours: number; ecartJours: number }[] = [
  { kind: "lead_a1", ageJours: 2, ecartJours: 1 },
  { kind: "lead_a2", ageJours: 3, ecartJours: 1 },
  { kind: "lead_a3", ageJours: 5, ecartJours: 2 },
  { kind: "lead_a4", ageJours: 7, ecartJours: 2 },
  { kind: "lead_a5", ageJours: 10, ecartJours: 2 },
  { kind: "lead_b1", ageJours: 14, ecartJours: 4 },
  { kind: "lead_b2", ageJours: 21, ecartJours: 7 },
  { kind: "lead_b3", ageJours: 28, ecartJours: 7 },
  { kind: "lead_b4", ageJours: 35, ecartJours: 7 },
  { kind: "lead_b5", ageJours: 42, ecartJours: 7 },
  { kind: "lead_b6", ageJours: 49, ecartJours: 7 },
  { kind: "lead_b7", ageJours: 56, ecartJours: 7 },
  { kind: "lead_b8", ageJours: 63, ecartJours: 7 },
];

/**
 * Envoi unique hors chaîne : demande de retours sur le kit (décision du
 * fondateur le 16/10/2026, « deux salves »). Le plan Resend gratuit plafonne à
 * 100 emails par jour : les ~95 leads le reçoivent en deux passages du cron,
 * deux matins de suite, 48 au plus par matin. Pendant la fenêtre, un lead dû
 * pour la collecte la reçoit À LA PLACE de son email de chaîne du jour (un
 * seul email par jour) ; elle compte ensuite comme « dernier email » pour
 * l'écart de la chaîne. Fenêtre fermée avant la séquence de hausse du 25/10.
 */
const COLLECTE = {
  kind: "lead_collecte" as LeadEmailKind,
  debut: new Date("2026-10-17T00:00:00+02:00").getTime(),
  fin: new Date("2026-10-24T00:00:00+02:00").getTime(),
  // Un lead de moins d'une semaine n'a pas eu le temps d'essayer le kit.
  ageMinJours: 7,
  maxParPassage: 48,
  // Relance unique 3 jours après, sauf pour qui a rempli /temoignage. Même
  // fenêtre, même plafond de 48 par matin (partagé avec la collecte) : les
  // salves du 17 et du 18/10 donnent des relances le 20 et le 21/10.
  relance: "lead_collecte_relance" as LeadEmailKind,
  relanceApresJours: 3,
};
// Plafond global les jours de collecte : 48 + les quelques emails A des
// nouveaux leads. ~0,9 s par envoi (pause comprise) : reste sous les 60 s.
const MAX_ENVOIS_COLLECTE = 52;

type Lead = { id: string; email: string; first_name: string | null; created_at: string };

/** `.in()` passe dans l'URL de l'API : au-delà de quelques centaines d'ids, elle casse. */
function paquets<T>(items: T[], taille = 150): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += taille) out.push(items.slice(i, i + taille));
  return out;
}

// Emails de leads déjà devenus clients (achat payé) → on arrête de pitcher.
async function convertedEmails(emails: string[]): Promise<Set<string>> {
  const set = new Set<string>();
  for (const lot of paquets(emails)) {
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, email")
      .in("email", lot);
    if (!profiles || profiles.length === 0) continue;

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
  const report: Record<string, number> = { eligibles: 0, envoyes: 0, attente: 0, convertis: 0, termines: 0, echecs: 0 };
  const parEtape: Record<string, number> = {};

  const { data: leads, error } = await supabaseAdmin
    .from("leads")
    .select("id, email, first_name, created_at")
    .is("unsubscribed_at", null)
    // Les leads anglophones (source « en-… », page /en/kit) ne reçoivent pas la
    // séquence française. Un simple `not like` exclurait aussi les sources
    // nulles des premiers leads : d'où le `or`.
    .or("source.is.null,source.not.like.en-%")
    .gte("created_at", LEAD_EPOCH)
    .order("created_at", { ascending: true })
    .limit(2000);

  if (error) {
    console.error("[cron-lead-nurture] select leads failed:", error.message);
    return new NextResponse(`DB error: ${error.message}`, { status: 500 });
  }
  if (!leads || leads.length === 0) return NextResponse.json({ ok: true, report });
  report.eligibles = leads.length;

  // Tout l'historique d'envoi des leads concernés (magnet compris : il compte
  // comme « dernier email » pour l'écart avant A1).
  const historique = new Map<string, Map<string, number>>();
  for (const lot of paquets(leads.map((l) => l.id))) {
    const { data: logs, error: logErr } = await supabaseAdmin
      .from("lead_email_log")
      .select("lead_id, kind, sent_at")
      .in("lead_id", lot);
    if (logErr) {
      console.error("[cron-lead-nurture] select log failed:", logErr.message);
      return new NextResponse(`DB error: ${logErr.message}`, { status: 500 });
    }
    for (const row of logs ?? []) {
      const h = historique.get(row.lead_id) ?? new Map<string, number>();
      h.set(row.kind, new Date(row.sent_at).getTime());
      historique.set(row.lead_id, h);
    }
  }

  const converted = await convertedEmails(leads.map((l) => l.email.toLowerCase()));

  const collecteOuverte = now >= COLLECTE.debut && now < COLLECTE.fin;

  // Qui a déjà répondu par le formulaire : pas de relance. Table absente ou
  // illisible = personne n'est exclu, mais on le dit dans les logs.
  const ontRepondu = new Set<string>();
  if (collecteOuverte) {
    const { data: rep, error: repErr } = await supabaseAdmin.from("temoignages").select("email").limit(2000);
    if (repErr) console.error("[cron-lead-nurture] select temoignages failed:", repErr.message);
    for (const r of rep ?? []) ontRepondu.add(String(r.email).toLowerCase());
  }
  // Rang de tri : les emails A (index 0 à 4) passent avant la collecte, la
  // collecte avant la série hebdomadaire B.
  const RANG_COLLECTE = 4.5;

  // 1. Qui est dû aujourd'hui, et pour quelle étape.
  const dus: { lead: Lead; etape: { kind: LeadEmailKind }; rang: number }[] = [];
  for (const lead of leads as Lead[]) {
    if (converted.has(lead.email.toLowerCase())) {
      report.convertis++;
      continue;
    }
    const h = historique.get(lead.id) ?? new Map<string, number>();
    if (
      collecteOuverte &&
      !h.has(COLLECTE.kind) &&
      now - new Date(lead.created_at).getTime() >= COLLECTE.ageMinJours * DAY_MS - MARGE_MS
    ) {
      const dernierEnvoi = h.size ? Math.max(...h.values()) : 0;
      if (now - dernierEnvoi >= DAY_MS - MARGE_MS) {
        dus.push({ lead, etape: { kind: COLLECTE.kind }, rang: RANG_COLLECTE });
      } else {
        report.attente++;
      }
      // Dû pour la collecte : pas d'email de chaîne en plus aujourd'hui.
      continue;
    }
    const collecteLe = h.get(COLLECTE.kind);
    if (
      collecteOuverte &&
      collecteLe !== undefined &&
      !h.has(COLLECTE.relance) &&
      !ontRepondu.has(lead.email.toLowerCase()) &&
      now - collecteLe >= COLLECTE.relanceApresJours * DAY_MS - MARGE_MS
    ) {
      const dernierEnvoi = Math.max(...h.values());
      if (now - dernierEnvoi >= DAY_MS - MARGE_MS) {
        dus.push({ lead, etape: { kind: COLLECTE.relance }, rang: RANG_COLLECTE });
      } else {
        report.attente++;
      }
      continue;
    }
    const rang = STEPS.findIndex((s) => !h.has(s.kind));
    if (rang === -1) {
      report.termines++;
      continue;
    }
    const etape = STEPS[rang];
    const age = now - new Date(lead.created_at).getTime();
    const dernier = h.size ? Math.max(...h.values()) : new Date(lead.created_at).getTime();
    if (age < etape.ageJours * DAY_MS - MARGE_MS || now - dernier < etape.ecartJours * DAY_MS - MARGE_MS) {
      report.attente++;
      continue;
    }
    dus.push({ lead, etape, rang });
  }

  // 2. Les premières étapes passent avant la série hebdomadaire : un lead de
  // trois jours attend son email du lendemain, un cas de la semaine peut
  // glisser d'un jour sans dommage si le plafond est atteint.
  dus.sort((a, b) => a.rang - b.rang);

  // 3. Envoi : un seul email par lead et par passage, quoi qu'il arrive.
  const plafond = collecteOuverte ? MAX_ENVOIS_COLLECTE : MAX_ENVOIS;
  let collectesTentees = 0;
  for (const { lead, etape } of dus) {
    if (report.envoyes + report.echecs >= plafond) {
      report.attente++;
      continue;
    }
    if (etape.kind === COLLECTE.kind || etape.kind === COLLECTE.relance) {
      if (collectesTentees >= COLLECTE.maxParPassage) {
        report.attente++;
        continue;
      }
      collectesTentees++;
    }
    if (report.envoyes + report.echecs > 0) await new Promise((r) => setTimeout(r, PAUSE_MS));

    try {
      const ok = await sendLeadEmail({
        kind: etape.kind,
        to: lead.email,
        firstName: lead.first_name,
        leadId: lead.id,
      });
      if (!ok) {
        report.attente++;
        continue;
      }
      const { error: logErr } = await supabaseAdmin
        .from("lead_email_log")
        .upsert(
          { lead_id: lead.id, email: lead.email, kind: etape.kind },
          { onConflict: "lead_id,kind", ignoreDuplicates: true },
        );
      if (logErr) {
        console.error(`[cron-lead-nurture] log insert failed (${lead.id}/${etape.kind}):`, logErr.message);
      }
      report.envoyes++;
      parEtape[etape.kind] = (parEtape[etape.kind] ?? 0) + 1;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[cron-lead-nurture] send failed (${lead.id}/${etape.kind}):`, message);
      report.echecs++;
    }
  }

  console.log("[cron-lead-nurture] report:", JSON.stringify({ report, parEtape }));
  return NextResponse.json({ ok: true, report, parEtape });
}
