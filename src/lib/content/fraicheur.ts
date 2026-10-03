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
export const CONTENU_A_JOUR_AU = "3 octobre 2026";

/** Ce que cette passe a intégré, dit en une ligne pour un visiteur. */
export const DERNIERE_PASSE =
  "Claude Code 2.1.288 et ses mods (1er octobre 2026), retrait de Sonnet 4.5 annoncé pour le 30 novembre";

/** Notes de mise à jour datées (blocs `:::maj`) présentes dans les leçons. */
export const NOTES_DE_MISE_A_JOUR = 89;

/** Sources de référence surveillées par la veille (`scripts/veille/sources.mjs`). */
export const SOURCES_SURVEILLEES = 11;
