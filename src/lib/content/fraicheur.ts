/**
 * Fraîcheur du contenu : UNE seule copie.
 *
 * Le Mentor IA, les pages de vente et la FAQ lisent ces valeurs ici. Avant ce
 * fichier, la date vivait à deux endroits écrits à la main : la page de vente
 * annonçait encore « dernière mise à jour : juillet 2026 » le 29 septembre,
 * soit deux mois de travail de veille invisibles pour celui qui hésite à payer.
 *
 * Constantes en dur, jamais `new Date()` : le Mentor injecte la date dans sa
 * base de connaissance, qui doit rester identique d'un octet à l'autre entre
 * deux requêtes, sinon le cache de prompt saute à chaque message.
 *
 * À mettre à jour à chaque passe de veille appliquée au contenu. Le registre
 * de faits (`scripts/veille/facts.mjs`) contrôle les trois valeurs chiffrées
 * contre ce que le dépôt contient réellement.
 */

/** Date de la dernière passe de vérification appliquée aux leçons. */
export const CONTENU_A_JOUR_AU = "9 octobre 2026";

/** Ce que cette passe a intégré, dit en une ligne pour un visiteur. */
export const DERNIERE_PASSE =
  "Claude Haiku 5.5 (7 octobre 2026) dans toutes les grilles de modèles et de tarifs, crédits API inclus dans Max et Team, lecture de cache Sonnet 5.5 à 0,10 $, Claude Code 2.1.295 et le blocage des hooks en panne";

/** Notes de mise à jour datées (blocs `:::maj`) présentes dans les leçons. */
export const NOTES_DE_MISE_A_JOUR = 96;

/** Sources de référence surveillées par la veille (`scripts/veille/sources.mjs`). */
export const SOURCES_SURVEILLEES = 11;
