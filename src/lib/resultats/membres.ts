/**
 * Résultats mesurés chez les membres, affichés sur /resultats.
 *
 * Règle non négociable : une entrée n'existe ici que si elle vient d'une
 * réponse réelle (table `temoignages` ou email gardé dans contact@), avec
 * l'accord écrit de publication. Le statut est celui calculé par le serveur
 * (achat payé, lead du kit) ou constaté (accès offert), jamais déclaré.
 * Procédure de remplissage : marketing/FINALISATION-V4-2026-10-16.md, C2.
 *
 * Au 16/10/2026 : aucune réponse reçue, la liste est vide et la page le dit.
 */

export const RESULTATS_MIS_A_JOUR = "16 octobre 2026";

export type Categorie = "artisans" | "commerces" | "consultants" | "dirigeants";

export const CATEGORIES: { id: Categorie; label: string }[] = [
  { id: "artisans", label: "Artisans" },
  { id: "commerces", label: "Commerces" },
  { id: "consultants", label: "Consultants" },
  { id: "dirigeants", label: "Dirigeants" },
];

export type StatutAvis = "acheteur" | "kit" | "acces_offert";

export const LIBELLE_STATUT: Record<StatutAvis, string> = {
  acheteur: "A payé sa formation",
  kit: "A utilisé le kit gratuit, n'a pas acheté",
  acces_offert: "Accès offert en échange d'un avis",
};

export type ResultatMembre = {
  /** Absent si la personne a choisi « métier seulement ». */
  prenom?: string;
  metier: string;
  ville?: string;
  categorie: Categorie;
  /** Situation de départ, avec les mots de la personne (2 à 4 lignes). */
  situation: string;
  /** Leçons ou parcours suivis, tels que la personne les cite. */
  apprentissage: string;
  tache: string;
  minutesAvant: number;
  minutesApres: number;
  /** Citation exacte, corrigée à l'orthographe seulement. */
  citation: string;
  statut: StatutAvis;
  /** Mois de la réponse, ex. « octobre 2026 ». */
  mois: string;
};

export const RESULTATS_MEMBRES: ResultatMembre[] = [];

/** Seuil d'affichage des filtres : en dessous, filtrer ne montre rien d'utile. */
export const SEUIL_FILTRES = 4;
