/**
 * Deux notions distinctes, qu'il ne faut jamais confondre :
 *
 *  - `PlanTier`   = le NIVEAU D'ACCÈS au contenu. C'est la valeur écrite dans
 *                   `purchases.tier`, contrainte par l'énumération PostgreSQL
 *                   `course_tier` et lue par `user_has_tier()` et les règles
 *                   RLS. Y toucher demande une migration risquée sur quatre
 *                   tables. On ne l'étend pas.
 *
 *  - `PlanCode`   = l'OFFRE COMMERCIALE vendue. Il peut en exister plusieurs
 *                   qui donnent le même accès : l'Accompagnement débloque le
 *                   même catalogue que le Mastery, ce qu'il ajoute c'est du
 *                   temps humain. Stocké dans `purchases.plan_code`, une
 *                   simple colonne texte.
 *
 * Conséquence pratique : ajouter une offre ne touche ni l'énumération, ni les
 * règles de sécurité, ni la fonction d'accès.
 */
export type PlanTier = "starter" | "mastery";
export type PlanCode = "starter" | "mastery" | "elite";

export type Plan = {
  /** L'offre vendue. */
  code: PlanCode;
  /** Le niveau d'accès qu'elle débloque (ce qui part en base). */
  tier: PlanTier;
  name: string;
  priceId: string;
  amountEur: number;
};

function priceIdOrThrow(envKey: string): string {
  const id = process.env[envKey];
  if (!id) {
    throw new Error(
      `${envKey} is not set. Add it to .env.local (Stripe Dashboard → product page → Pricing).`,
    );
  }
  return id;
}

export function getPlan(code: PlanCode): Plan {
  switch (code) {
    case "starter":
      return {
        code: "starter",
        tier: "starter",
        name: "Pass Starter",
        priceId: priceIdOrThrow("STRIPE_PRICE_STARTER"),
        amountEur: 47,
      };
    case "mastery":
      return {
        code: "mastery",
        tier: "mastery",
        name: "Pass Mastery",
        priceId: priceIdOrThrow("STRIPE_PRICE_MASTERY"),
        amountEur: 497,
      };
    case "elite":
      return {
        code: "elite",
        // Même accès au catalogue que le Mastery : ce palier vend de
        // l'accompagnement, pas du contenu supplémentaire.
        tier: "mastery",
        name: "Pass Accompagnement",
        priceId: priceIdOrThrow("STRIPE_PRICE_ELITE"),
        amountEur: 1497,
      };
  }
}

/** Valide un NIVEAU D'ACCÈS (valeur destinée à `purchases.tier`). */
export function isValidTier(value: unknown): value is PlanTier {
  return value === "starter" || value === "mastery";
}

/** Valide une OFFRE COMMERCIALE (valeur reçue du formulaire de checkout). */
export function isValidPlanCode(value: unknown): value is PlanCode {
  return value === "starter" || value === "mastery" || value === "elite";
}

/**
 * Le palier Accompagnement engage du temps humain : il ne doit apparaître sur
 * la vitrine que lorsque les créneaux sont réellement tenables. Piloté par une
 * variable d'environnement, pour qu'ouvrir ou fermer l'offre ne demande pas un
 * déploiement.
 */
export const ELITE_ENABLED = process.env.NEXT_PUBLIC_ELITE_ENABLED === "1";

/** Nombre de places ouvertes par mois, affiché sur la vitrine. */
export const ELITE_SEATS_PER_MONTH = 3;
