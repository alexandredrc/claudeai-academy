/**
 * Traduire `?src=` en `utm_*`.
 *
 * Les liens qui circulent déjà — bio Instagram, réponses automatiques
 * ManyChat, posts LinkedIn — portent tous `?src=quelque-chose`. Or GA4 ne
 * connaît que les paramètres `utm_*` : une vente venue d'Instagram arrivait
 * donc en « direct », exactement comme une vente venue des annonces. Ça
 * fausse la seule décision qui compte en ce moment (est-ce que la pub
 * convertit ?), et on ne peut pas rappeler les liens déjà publiés.
 *
 * D'où la traduction côté serveur : le visiteur garde son `src` (la page
 * /kit s'en sert pour `leads.source`) et gagne les `utm_*` que GA4 lit
 * nativement, sans rien changer aux liens existants.
 */

/** Canaux connus : source et support explicites plutôt que devinés. */
const CANAUX: Record<string, { source: string; medium: string }> = {
  "instagram-dm": { source: "instagram", medium: "dm" },
  "instagram-bio": { source: "instagram", medium: "bio" },
  "instagram-story": { source: "instagram", medium: "story" },
  instagram: { source: "instagram", medium: "bio" },
  "linkedin-post": { source: "linkedin", medium: "post" },
  linkedin: { source: "linkedin", medium: "social" },
  facebook: { source: "facebook", medium: "social" },
  tiktok: { source: "tiktok", medium: "social" },
  email: { source: "email", medium: "newsletter" },
};

export type Utm = { source: string; medium: string; campaign: string };

/**
 * Un `src` inconnu ne doit pas disparaître : on le range en `referral` sous
 * son propre nom, quitte à ce que GA4 affiche un canal exotique. Un canal
 * mal nommé se corrige ; un canal absent se confond avec le trafic direct.
 */
export function utmDepuisSrc(raw: string): Utm | null {
  const clean = raw.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40);
  if (!clean) return null;
  const connu = CANAUX[clean];
  if (connu) return { ...connu, campaign: clean };
  const [source] = clean.split("-");
  return { source: source || clean, medium: "referral", campaign: clean };
}
