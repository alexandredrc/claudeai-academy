import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { buildAccessLink } from "@/lib/auth/access-link";
import { sendAccesRelanceEmail, type RelanceKind } from "@/lib/email/acces-relance";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Relance des acheteurs qui ne sont jamais entrés.
 *
 * Le rapport quotidien savait déjà les nommer — « 2 clients payants sans
 * accès » — depuis des semaines. Nommer ne fait entrer personne : entre le
 * 07/08 et le 20/09, un Pass Mastery est resté fermé 43 jours sous les yeux
 * de tout le monde, et un autre a conduit une société à repayer 497 € le
 * 19/09 plutôt que d'attendre. Ce cron transforme le constat en envoi.
 *
 * Ce qui le distingue du cron d'activation : le signal (« ne s'est jamais
 * connecté », pas « n'a pas validé de leçon ») et surtout le contenu — un
 * lien d'accès en un clic, régénéré à chaque envoi, au lieu d'un renvoi vers
 * un formulaire de connexion que ces comptes-là ne savent pas remplir.
 */
const STEPS: { kind: RelanceKind; minJours: number }[] = [
  { kind: "acces_relance_1", minJours: 2 },
  { kind: "acces_relance_2", minJours: 5 },
  { kind: "acces_relance_3", minJours: 12 },
];

const KINDS = STEPS.map((s) => s.kind);

/** Trois jours entre deux relances : assez pour laisser le temps d'ouvrir sa
 *  boîte, assez peu pour ne pas laisser un accès payé dormir un mois. */
const COOLDOWN_DAYS = 3;

/** Le domaine expédie peu ; on ne déclenche jamais une salve. */
const MAX_PER_RUN = 15;

type Acheteur = {
  user_id: string;
  email: string;
  tier: string;
  paid_at: string;
  jours: number;
  amount_total: number;
};

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[cron-acces] CRON_SECRET non défini — refus (fail closed).");
    return new NextResponse("Cron secret not configured", { status: 500 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 48 h de grâce : en deçà, l'email de bienvenue vient de partir et la
  // personne est simplement en train de vivre sa vie.
  const { data, error } = await supabaseAdmin.rpc("acheteurs_sans_acces", {
    min_heures: 48,
  });
  if (error) {
    console.error("[cron-acces] RPC acheteurs_sans_acces:", error.message);
    return new NextResponse(`DB error: ${error.message}`, { status: 500 });
  }

  const cibles = (data ?? []) as Acheteur[];
  const report = {
    candidats: cibles.length,
    envoyes: { acces_relance_1: 0, acces_relance_2: 0, acces_relance_3: 0 } as Record<RelanceKind, number>,
    cooldown: 0,
    epuises: 0,
    sansLien: 0,
    echecs: 0,
    reportes: 0,
  };
  if (cibles.length === 0) {
    return NextResponse.json({ ok: true, report });
  }

  const ids = cibles.map((c) => c.user_id);

  // Historique : quelles étapes sont déjà parties, et quand.
  const { data: logs } = await supabaseAdmin
    .from("email_log")
    .select("user_id, kind, sent_at")
    .in("kind", KINDS)
    .in("user_id", ids);

  const faites = new Map<string, Set<string>>();
  const dernier = new Map<string, number>();
  for (const row of logs ?? []) {
    const set = faites.get(row.user_id) ?? new Set<string>();
    set.add(row.kind);
    faites.set(row.user_id, set);
    dernier.set(
      row.user_id,
      Math.max(dernier.get(row.user_id) ?? 0, new Date(row.sent_at).getTime()),
    );
  }

  // Prénom : un email qui commence par « Bonjour, » sent le robot.
  const { data: profs } = await supabaseAdmin
    .from("profiles")
    .select("id, first_name")
    .in("id", ids);
  const prenoms = new Map((profs ?? []).map((p) => [p.id, p.first_name as string | null]));

  const now = Date.now();
  let budget = MAX_PER_RUN;

  // Les plus anciens d'abord : ce sont eux qui attendent depuis le plus
  // longtemps, et ceux dont le remboursement devient légitime.
  for (const c of [...cibles].sort((a, b) => b.jours - a.jours)) {
    if (budget <= 0) {
      report.reportes++;
      continue;
    }

    const last = dernier.get(c.user_id);
    if (last && now - last < COOLDOWN_DAYS * DAY_MS) {
      report.cooldown++;
      continue;
    }

    const done = faites.get(c.user_id) ?? new Set<string>();
    const step = STEPS.find((s) => !done.has(s.kind) && c.jours >= s.minJours);
    if (!step) {
      // Les trois étapes sont parties et la personne n'est toujours pas
      // entrée : l'automatique a fait son travail, c'est un humain qui doit
      // prendre le relais. Le rapport quotidien continue de l'afficher.
      report.epuises++;
      continue;
    }

    try {
      // Le lien est régénéré ici, jamais réutilisé : un token de magic link
      // expire, et renvoyer un lien mort serait pire que ne rien envoyer.
      const { data: link, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: c.email,
      });
      const tokenHash = link?.properties?.hashed_token;
      if (linkErr || !tokenHash) {
        console.error(
          `[cron-acces] generateLink échoué (${c.email}):`,
          linkErr?.message ?? "token manquant",
        );
        report.sansLien++;
        continue;
      }

      const ok = await sendAccesRelanceEmail({
        kind: step.kind,
        to: c.email,
        tier: c.tier,
        jours: c.jours,
        firstName: prenoms.get(c.user_id) ?? null,
        // Un siège offert (code fondateur à −100 %) n'a rien payé : ni
        // « ton paiement est enregistré », ni proposition de remboursement.
        paye: (c.amount_total ?? 0) > 0,
        accessLink: buildAccessLink({
          tokenHash,
          email: c.email,
          next: "/courses",
        }),
      });
      if (!ok) {
        // Resend non configuré : ne rien tracer, pour renvoyer plus tard.
        report.echecs++;
        continue;
      }

      const { error: logErr } = await supabaseAdmin
        .from("email_log")
        .upsert(
          { user_id: c.user_id, email: c.email, kind: step.kind },
          { onConflict: "user_id,kind", ignoreDuplicates: true },
        );
      if (logErr) {
        console.error(`[cron-acces] email_log (${c.user_id}/${step.kind}):`, logErr.message);
      }

      report.envoyes[step.kind]++;
      budget--;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[cron-acces] envoi échoué (${c.email}/${step.kind}):`, message);
      report.echecs++;
    }
  }

  console.log("[cron-acces] report:", JSON.stringify(report));
  return NextResponse.json({ ok: true, report });
}
