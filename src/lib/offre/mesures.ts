/**
 * Temps mesurés par le fondateur (source : marketing/MESURE-GAINS-CLAUDE-2026-10.xlsx).
 *
 * Déclaré par le fondateur le 15/10/2026 :
 *  - `sans` : chronométré autrefois, sur de vraies tâches faites à la main ;
 *  - `avec` : chronométré le 15/10/2026 dans une conversation Claude vierge,
 *    demande et relecture comprises.
 *
 * Les fréquences par mois du fichier sont des estimations : aucun total
 * mensuel n'est affiché comme un fait, seulement des calculs « si ».
 */
export const MESURES_DATE = "15 octobre 2026";

/** Prix public du Pass Mastery (src/lib/stripe/plans.ts) et taux horaire d'exemple du site. */
export const PRIX_MASTERY = 497;
export const TAUX_HORAIRE_EXEMPLE = 50;

export type Mesure = {
  id: string;
  tache: string;
  sans: number;
  avec: number;
};

export const MESURES: Mesure[] = [
  { id: "R1", tache: "Fiche technique chiffrée d'un plat (8 ingrédients)", sans: 190, avec: 2 },
  { id: "R2", tache: "Prix de la carte après une hausse fournisseur (20 plats)", sans: 365, avec: 3 },
  { id: "R3", tache: "Réponse à un avis Google négatif", sans: 15, avec: 2 },
  { id: "R4", tache: "Descriptions de 5 plats pour la carte", sans: 25, avec: 2 },
  { id: "T1", tache: "Relance d'une facture impayée (3 messages)", sans: 37, avec: 2 },
  { id: "T2", tache: "Réponse à un client qui conteste une facture", sans: 24, avec: 1 },
  { id: "T3", tache: "Publication Instagram d'un produit", sans: 19, avec: 3 },
  { id: "T4", tache: "Compte rendu d'une réunion d'une heure", sans: 41, avec: 2 },
  { id: "T5", tache: "Fiche de poste pour un recrutement", sans: 79, avec: 4 },
  { id: "T6", tache: "Procédure d'ouverture ou de fermeture", sans: 78, avec: 5 },
];

/** Les tâches affichées sur la vitrine, dans cet ordre (les plus proches d'une TPE d'abord). */
export const MESURES_VITRINE = ["T2", "T1", "T4", "T3", "R3", "R1"];

/** Les trois tâches du calcul « si vous les faites chaque semaine ». */
export const MESURES_SEMAINE = ["T1", "T4", "T2"];

export function mesure(id: string): Mesure | undefined {
  return MESURES.find((m) => m.id === id);
}

/**
 * 190 → « 3 h 10 », 41 → « 41 min », 365 → « 6 h 05 ». Espaces insécables :
 * une durée ne doit jamais se couper en fin de ligne (« 14 h » / « 33 »).
 */
export function duree(minutes: number): string {
  const nb = " ";
  const m = Math.round(minutes);
  if (m < 60) return `${m}${nb}min`;
  const h = Math.floor(m / 60);
  const reste = m % 60;
  return reste === 0 ? `${h}${nb}h` : `${h}${nb}h${nb}${String(reste).padStart(2, "0")}`;
}
