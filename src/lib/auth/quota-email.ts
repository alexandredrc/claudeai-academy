import "server-only";
import { createHash } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Quota d'emails des formulaires publics (audit global du 16/10/2026, point 2).
 *
 * Resend gratuit = 100 emails par jour pour tout le site, lien d'accès des
 * acheteurs compris. /signup, /acces, /auth/confirm et /api/lead envoient un
 * email à n'importe quelle adresse : sans limite, un script vidait le quota.
 * Chaque envoi consomme une ligne de `quota_emails` (migration 0015) ; la
 * fonction SQL refuse au-delà des seuils ci-dessous, sur 24 h glissantes.
 *
 * Le webhook Stripe et les crons n'appellent jamais ce module : l'email
 * d'accès envoyé après un achat ne peut pas être bloqué ici.
 *
 * Budget : 30 (signup + acces) + 40 kits (plafond de /api/lead) = 70 au pire,
 * il reste 30 envois par jour pour les acheteurs et les crons.
 */
const MAX_PAR_IP = 6; // tous formulaires confondus : kit + inscription + 2 ou 3 liens
const MAX_PAR_EMAIL = 4; // une même boîte ne reçoit pas plus de 4 liens par jour
const MAX_GLOBAL_ACCES = 30; // signup + acces, partagé
const FORMULAIRES_ACCES = ["signup", "acces"];

export type Formulaire = "signup" | "acces" | "lead";

/**
 * IP du visiteur. Sur Vercel, `x-real-ip` et `x-forwarded-for` sont écrits
 * par la plateforme (le client ne peut pas les imposer). En local, aucun des
 * deux : toutes les requêtes partagent la même clé, ce qui suffit au test.
 */
export function ipDe(h: Headers): string {
  return (
    h.get("x-real-ip")?.trim() ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "inconnue"
  );
}

function empreinte(valeur: string): string {
  return createHash("sha256").update(`claudeai-academy:${valeur}`).digest("hex").slice(0, 32);
}

async function estAcheteur(email: string): Promise<boolean> {
  const { data: profil } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .limit(1)
    .maybeSingle();
  if (!profil) return false;
  const { count } = await supabaseAdmin
    .from("purchases")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profil.id)
    .eq("status", "paid");
  return (count ?? 0) > 0;
}

/**
 * `true` si l'email peut partir (la ligne est consommée), `false` si un seuil
 * est atteint. L'appelant renvoie alors exactement la même réponse que si
 * l'email était parti (pas d'énumération, rien à apprendre pour un robot).
 *
 * Un acheteur qui redemande son lien sur /acces passe le plafond global (pas
 * les seuils par IP et par adresse) : un script qui vide le budget du jour ne
 * le prive pas de son accès.
 *
 * Panne de la base : on laisse passer et on le journalise. Bloquer
 * reviendrait à couper l'accès de tout le monde pour se protéger d'un abus.
 */
export async function consommerQuotaEmail(params: {
  formulaire: Formulaire;
  ip: string;
  email: string;
}): Promise<boolean> {
  const email = params.email.trim().toLowerCase();
  const appel = (maxGlobal: number | null) =>
    supabaseAdmin.rpc("consommer_quota_email", {
      p_formulaire: params.formulaire,
      p_ip_empreinte: empreinte(params.ip),
      p_email_empreinte: empreinte(email),
      p_max_ip: MAX_PAR_IP,
      // Le kit est déjà dédoublonné par adresse (lead_email_log).
      p_max_email: params.formulaire === "lead" ? null : MAX_PAR_EMAIL,
      // Le kit a son propre plafond de 40 sur 24 h dans /api/lead.
      p_max_global: params.formulaire === "lead" ? null : maxGlobal,
      p_formulaires_globaux: FORMULAIRES_ACCES,
    });

  try {
    let { data, error } = await appel(MAX_GLOBAL_ACCES);
    if (!error && data === "global" && params.formulaire === "acces" && (await estAcheteur(email))) {
      ({ data, error } = await appel(null));
    }
    if (error) {
      console.error(`[quota-email] ${params.formulaire} : base injoignable, envoi autorisé :`, error.message);
      return true;
    }
    if (data === "ok") return true;
    console.warn(
      `[quota-email] ${params.formulaire} : seuil « ${String(data)} » atteint, email NON envoyé (ip ${empreinte(params.ip).slice(0, 8)})`,
    );
    return false;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[quota-email] ${params.formulaire} : erreur, envoi autorisé :`, message);
    return true;
  }
}

/**
 * Captcha invisible Cloudflare Turnstile, facultatif. Actif seulement si les
 * deux clés existent : `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (widget) et
 * `TURNSTILE_SECRET_KEY` (vérification). Sans l'une des deux, on s'en passe
 * et seul le quota protège.
 *
 * Jeton absent ou refusé : `false`. Cloudflare injoignable : `true` (le quota
 * reste en place, un acheteur ne doit pas perdre son lien pour une panne
 * tierce).
 */
export function turnstileActif(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}

export async function verifierTurnstile(jeton: unknown, ip: string): Promise<boolean> {
  if (!turnstileActif()) return true;
  if (typeof jeton !== "string" || !jeton) {
    console.warn("[turnstile] jeton absent : email NON envoyé");
    return false;
  }
  try {
    const corps = new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY as string,
      response: jeton,
    });
    if (ip !== "inconnue") corps.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: corps,
      signal: AbortSignal.timeout(5000),
    });
    const verdict = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (verdict.success) return true;
    console.warn("[turnstile] jeton refusé, email NON envoyé :", verdict["error-codes"]?.join(", "));
    return false;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[turnstile] vérification impossible, envoi autorisé :", message);
    return true;
  }
}
