import "server-only";
import crypto from "node:crypto";
import { SITE_URL } from "@/lib/email/send";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Désinscription en un clic des emails envoyés aux leads du kit.
 *
 * Le formulaire du kit promet « désinscription en un clic » depuis juin, et
 * seul « réponds STOP » existait : une réponse à traiter à la main, et un
 * prospect qui ne trouve pas comment partir finit par cliquer « spam », ce qui
 * coûte la délivrabilité de tous les autres. Un email commercial doit de toute
 * façon offrir un moyen simple de s'opposer (CPCE, art. L34-5).
 *
 * Le lien porte l'identifiant du lead et une signature HMAC : personne ne peut
 * désinscrire quelqu'un d'autre en devinant un identifiant. La clé est dérivée
 * de `CRON_SECRET` avec une étiquette propre à cet usage, ce qui évite un
 * secret de plus à poser ; si la variable manque, aucun lien n'est produit et
 * l'email retombe sur « réponds STOP » (fail closed, jamais un lien invalide).
 *
 * Le clic sur le lien n'agit pas seul : la page demande une confirmation
 * (POST). Les antivirus de messagerie ouvrent les liens d'un email avant
 * l'humain ; un GET qui désinscrit viderait la liste à leur insu. Le POST
 * « un clic » de Gmail et Apple Mail (en-tête List-Unsubscribe-Post) passe par
 * la route `/api/lead/desinscription`.
 */

const ETIQUETTE = "lead-desinscription:v1:";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function signer(leadId: string): string | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) return null;
  return crypto
    .createHmac("sha256", secret)
    .update(ETIQUETTE + leadId)
    .digest("base64url")
    .slice(0, 32);
}

/** Vrai si la signature correspond à ce lead. Comparaison à temps constant. */
export function jetonValide(leadId: unknown, jeton: unknown): leadId is string {
  if (typeof leadId !== "string" || typeof jeton !== "string") return false;
  if (!UUID.test(leadId)) return false;
  const attendu = signer(leadId);
  if (!attendu || jeton.length !== attendu.length) return false;
  return crypto.timingSafeEqual(Buffer.from(jeton), Buffer.from(attendu));
}

/** Page de confirmation (lien visible dans l'email). `lang=en` affiche la page en anglais. */
export function lienDesinscription(leadId: string, lang: "fr" | "en" = "fr"): string | null {
  const t = signer(leadId);
  if (!t) return null;
  return `${SITE_URL}/desinscription?l=${leadId}&t=${t}${lang === "en" ? "&lang=en" : ""}`;
}

/**
 * Pose `unsubscribed_at` (idempotent : un second clic ne change pas la date).
 * Le cron des leads exclut déjà les lignes où ce champ est rempli.
 */
export async function desinscrireLead(leadId: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("leads")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("id", leadId)
    .is("unsubscribed_at", null);
  if (error) {
    console.error("[desinscription] update failed:", error.message);
    return false;
  }
  return true;
}

/** En-têtes « se désabonner » natifs de Gmail, Apple Mail, Outlook. */
export function enTetesDesinscription(leadId: string): Record<string, string> {
  const t = signer(leadId);
  if (!t) return {};
  return {
    "List-Unsubscribe": `<${SITE_URL}/api/lead/desinscription?l=${leadId}&t=${t}>, <mailto:contact@claudeai-academy.com?subject=STOP>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}
