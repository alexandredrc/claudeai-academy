import "server-only";

/**
 * Bonus décidé par le fondateur le 15/10/2026 : les 10 premiers Pass Mastery
 * payés entre le 15 et le 31 octobre 2026 inclus reçoivent un audit vidéo de
 * 15 minutes de leurs prompts, enregistré par Alexandre.
 *
 * Rareté réelle, pas décorative : le compteur lit les achats en base. Si la
 * lecture échoue, le bonus n'est pas affiché du tout, plutôt que d'afficher un
 * nombre de places qu'on ne peut pas prouver. Il disparaît seul après le
 * 31/10 ou quand les 10 places sont prises.
 *
 * Le client service-role est importé à la demande : `admin.ts` lève une
 * erreur au chargement si la clé manque (dev local), et une vitrine ne doit
 * jamais planter pour un compteur.
 */
export const BONUS_AUDIT_PLACES = 10;
export const BONUS_AUDIT_DEBUT = new Date("2026-10-15T00:00:00+02:00");
// Heure d'hiver depuis le 25/10/2026 : minuit à Paris le 01/11 = UTC+1.
export const BONUS_AUDIT_FIN = new Date("2026-11-01T00:00:00+01:00");
export const BONUS_AUDIT_FIN_LIBELLE = "31 octobre";
export const BONUS_AUDIT_DELAI_JOURS = 7;

export function bonusDansLaFenetre(at: Date = new Date()): boolean {
  return at >= BONUS_AUDIT_DEBUT && at < BONUS_AUDIT_FIN;
}

/**
 * Pass Mastery payés depuis le début du bonus, jusqu'à `jusqua` inclus.
 * `created_at` et non `paid_at` : le webhook réécrit `paid_at` à chaque rejeu
 * Stripe, `created_at` ne bouge plus après l'insertion.
 */
async function masteryPayesDepuisDebut(jusqua?: string): Promise<number | null> {
  try {
    const { supabaseAdmin } = await import("@/lib/supabase/admin");
    let q = supabaseAdmin
      .from("purchases")
      .select("id", { count: "exact", head: true })
      .eq("plan_code", "mastery")
      .eq("status", "paid")
      .gte("created_at", BONUS_AUDIT_DEBUT.toISOString());
    if (jusqua) q = q.lte("created_at", jusqua);
    const { count, error } = await q;
    if (error || count === null) return null;
    return count;
  } catch {
    return null;
  }
}

/** Places encore libres, ou null si le bonus ne doit pas s'afficher. */
export async function placesBonusRestantes(): Promise<number | null> {
  if (!bonusDansLaFenetre()) return null;
  const prises = await masteryPayesDepuisDebut();
  if (prises === null) return null;
  const restantes = BONUS_AUDIT_PLACES - prises;
  return restantes > 0 ? restantes : null;
}

/**
 * Rang (1 à 10) d'un achat Mastery dans le bonus, ou null s'il n'y a pas
 * droit. Appelé par le webhook juste après l'enregistrement de l'achat.
 */
export async function rangBonusAudit(stripeSessionId: string): Promise<number | null> {
  try {
    const { supabaseAdmin } = await import("@/lib/supabase/admin");
    const { data } = await supabaseAdmin
      .from("purchases")
      .select("created_at, plan_code, status")
      .eq("stripe_session_id", stripeSessionId)
      .maybeSingle();
    if (!data || data.plan_code !== "mastery" || data.status !== "paid") return null;
    if (!bonusDansLaFenetre(new Date(data.created_at as string))) return null;
    const rang = await masteryPayesDepuisDebut(data.created_at as string);
    if (rang === null || rang < 1 || rang > BONUS_AUDIT_PLACES) return null;
    return rang;
  } catch {
    return null;
  }
}
