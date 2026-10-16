import { after, NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { notifierTemoignage } from "@/lib/notify/telegram";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Garde-fous contre un robot qui remplirait la table : 3 envois par adresse
// et 60 en tout sur 24 h. Au 16/10/2026, la collecte vise ~100 personnes.
const MAX_PAR_EMAIL_24H = 3;
const MAX_TOTAL_24H = 60;

const PUBLICATIONS = ["prenom_metier_ville", "metier_seul", "non"] as const;
type Publication = (typeof PUBLICATIONS)[number];

function isValidEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const email = value.trim();
  if (email.length < 5 || email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clean(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (!v) return null;
  return v.slice(0, max);
}

/** Minutes saisies : entier de 0 à 6 000 (100 h), sinon null. */
function minutes(value: unknown): number | null {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value.replace(",", ".")) : NaN;
  if (!Number.isFinite(n) || n < 0 || n > 6000) return null;
  return Math.round(n);
}

/**
 * Statut calculé ici, jamais déclaré par la personne : c'est lui qui
 * s'affiche à côté d'un avis publié (art. D111-10 du Code de la consommation).
 */
async function statutDe(email: string): Promise<"acheteur" | "kit" | "inconnu"> {
  const { data: profil } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .limit(1)
    .maybeSingle();
  if (profil) {
    const { count } = await supabaseAdmin
      .from("purchases")
      .select("id", { count: "exact", head: true })
      .eq("user_id", profil.id)
      .eq("status", "paid");
    if ((count ?? 0) > 0) return "acheteur";
  }
  const { data: lead } = await supabaseAdmin.from("leads").select("id").eq("email", email).maybeSingle();
  return lead ? "kit" : "inconnu";
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  // Pot de miel : un humain ne voit pas ce champ.
  if (clean(body.company, 100)) return NextResponse.json({ ok: true });

  if (!isValidEmail(body.email)) {
    return NextResponse.json({ ok: false, error: "Adresse email invalide." }, { status: 400 });
  }
  const email = (body.email as string).trim().toLowerCase();
  const metier = clean(body.metier, 120);
  const tache = clean(body.tache, 300);
  const citation = clean(body.citation, 1500);
  const publication = PUBLICATIONS.includes(body.publication as Publication)
    ? (body.publication as Publication)
    : null;

  if (!metier || !tache || !citation || !publication) {
    return NextResponse.json(
      { ok: false, error: "Il manque le métier, la tâche, ton retour ou ton choix de publication." },
      { status: 400 },
    );
  }
  if (publication !== "non" && body.accord !== true) {
    return NextResponse.json(
      { ok: false, error: "Coche la case d'accord, ou choisis « ne pas publier »." },
      { status: 400 },
    );
  }

  const depuis = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const [{ count: parEmail }, { count: total }] = await Promise.all([
    supabaseAdmin
      .from("temoignages")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .gte("created_at", depuis),
    supabaseAdmin.from("temoignages").select("id", { count: "exact", head: true }).gte("created_at", depuis),
  ]);
  if ((parEmail ?? 0) >= MAX_PAR_EMAIL_24H || (total ?? 0) >= MAX_TOTAL_24H) {
    return NextResponse.json(
      { ok: false, error: "Trop d'envois aujourd'hui. Réponds plutôt à l'email, je lis tout." },
      { status: 429 },
    );
  }

  const statut = await statutDe(email);
  const minutesAvant = minutes(body.minutes_avant);
  const minutesApres = minutes(body.minutes_apres);

  const { error } = await supabaseAdmin.from("temoignages").insert({
    email,
    prenom: clean(body.prenom, 80),
    metier,
    ville: clean(body.ville, 120),
    tache,
    minutes_avant: minutesAvant,
    minutes_apres: minutesApres,
    citation,
    publication,
    statut,
    source: clean(body.source, 60),
  });
  if (error) {
    console.error("[api/temoignage] insert failed:", error.message);
    return NextResponse.json(
      { ok: false, error: "Enregistrement impossible. Réessaie, ou réponds à l'email." },
      { status: 500 },
    );
  }

  after(() =>
    notifierTemoignage({ metier, statut, publication, minutesAvant, minutesApres }).then(() => undefined),
  );
  return NextResponse.json({ ok: true });
}
