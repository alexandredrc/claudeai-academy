/**
 * Prix du Pass Mastery dans le temps : UNE seule source.
 *
 * Décision du fondateur le 16/10/2026 : pas de prix barré (un prix barré doit
 * être le plus bas pratiqué dans les 30 jours avant la baisse, art. L112-1-1
 * du Code de la consommation), mais une hausse réelle, annoncée à l'avance :
 * 497 € jusqu'au 31 octobre 2026 inclus, 697 € à partir du 1er novembre 2026
 * à minuit, heure de Paris (UTC+1, heure d'hiver depuis le 25/10).
 *
 * La bascule se fait seule à la date : pages, checkout, emails et données
 * structurées lisent tous ces fonctions, et les pages sont rendues à la
 * demande. Aucune action humaine n'est nécessaire le 01/11.
 *
 * Prix barré futur : 697 € ne deviendra un prix de référence sûr que 30
 * jours après la DERNIÈRE vente possible à 497 €. Les liens de reprise de
 * panier Stripe restent valables 30 jours et rouvrent une session au prix
 * d'origine : un panier ouvert le 31/10 peut se payer à 497 € jusqu'à début
 * décembre (décision du 16/10 : honorer le prix affiché à l'ouverture). Pas
 * de « 697 € barré » avant début janvier 2027.
 */
export const MASTERY_HAUSSE_LE = new Date("2026-11-01T00:00:00+01:00");
export const PRIX_MASTERY_AVANT = 497;
export const PRIX_MASTERY_APRES = 697;
/** « jusqu'au 31 octobre », « à partir du 1er novembre » */
export const MASTERY_DERNIER_JOUR_LIBELLE = "31 octobre";
export const MASTERY_HAUSSE_LIBELLE = "1er novembre";

/**
 * L'instant de référence. En développement seulement, `OFFRE_DATE_TEST`
 * (date ISO) simule un autre jour pour tester la bascule de bout en bout ;
 * en production la variable est ignorée.
 */
export function maintenant(): Date {
  if (process.env.NODE_ENV !== "production") {
    const force = process.env.OFFRE_DATE_TEST;
    if (force) {
      const d = new Date(force);
      if (!Number.isNaN(d.getTime())) return d;
    }
  }
  return new Date();
}

export function hausseMasteryAppliquee(at: Date = maintenant()): boolean {
  return at >= MASTERY_HAUSSE_LE;
}

/** Prix public du Pass Mastery à l'instant donné, en euros. */
export function prixMastery(at: Date = maintenant()): number {
  return hausseMasteryAppliquee(at) ? PRIX_MASTERY_APRES : PRIX_MASTERY_AVANT;
}

/** Prix du Pass Starter, déduit du Mastery pour un acheteur Starter connecté. */
export const PRIX_STARTER = 47;

/** Ce que paie un acheteur Starter qui passe au Mastery : 450 € puis 650 €. */
export function prixMasteryApresCreditStarter(at: Date = maintenant()): number {
  return prixMastery(at) - PRIX_STARTER;
}

/**
 * Mensualité Klarna en 3 fois, au format français : 497 → « 165,67 »,
 * 697 → « 232,34 ». Arrondi au centime SUPÉRIEUR, comme le vérificateur de
 * la veille (scripts/veille/check-facts.mjs) : on n'affiche jamais une
 * mensualité plus basse que ce que le client paiera.
 */
export function mensualiteKlarna3x(prix: number): string {
  return (Math.ceil(Math.round((prix / 3) * 1e6) / 1e4) / 100).toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Annonce de la hausse tant qu'elle est à venir, `null` une fois appliquée :
 * « Puis 697 € à partir du 1er novembre ».
 */
export function annonceHausseMastery(at: Date = maintenant()): string | null {
  if (hausseMasteryAppliquee(at)) return null;
  // « heure de Paris » : un visiteur des Antilles ou du Québec lirait sinon
  // « jusqu'au 31 octobre » à son heure locale, et trouverait 697 € dès 20 h.
  return `Puis ${PRIX_MASTERY_APRES} € à partir du ${MASTERY_HAUSSE_LIBELLE} (heure de Paris)`;
}

/**
 * Variante en fin de phrase : « (697 € à partir du 1er novembre) », ou
 * chaîne vide une fois la hausse appliquée. Pratique dans les gabarits.
 */
export function parentheseHausseMastery(at: Date = maintenant()): string {
  if (hausseMasteryAppliquee(at)) return "";
  return ` (${PRIX_MASTERY_APRES} € à partir du ${MASTERY_HAUSSE_LIBELLE}, heure de Paris)`;
}

/**
 * ID des prix Stripe à 697 €, créés le 16/10/2026 sur les produits Mastery
 * existants. Un ID de prix n'est pas un secret : il est écrit ici pour que la
 * bascule ne dépende d'aucune variable d'environnement à poser en production.
 * Une variable `STRIPE_PRICE_MASTERY_697` reste prioritaire si elle existe.
 */
export const STRIPE_PRICE_MASTERY_697 = {
  live: "price_1URDYxAXvleX5zadCq1TDWly",
  test: "price_1URDYwAXvleX5zad5pnhPdkb",
} as const;

export function priceIdMastery697(): string {
  const override = process.env.STRIPE_PRICE_MASTERY_697;
  if (override) return override;
  // Clé secrète ou clé restreinte : « sk_live_… » ou « rk_live_… ».
  return /^(sk|rk)_live_/.test(process.env.STRIPE_SECRET_KEY ?? "")
    ? STRIPE_PRICE_MASTERY_697.live
    : STRIPE_PRICE_MASTERY_697.test;
}

/** Tous les ID de prix 697 €, live et test : le webhook doit les reconnaître. */
export const TOUS_LES_PRIX_MASTERY_697: readonly string[] = [
  STRIPE_PRICE_MASTERY_697.live,
  STRIPE_PRICE_MASTERY_697.test,
];
