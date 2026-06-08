import data from "./data.json";

/**
 * QCM d'auto-évaluation par leçon.
 *
 * Stocké en code-JSON (pas en base) : la correction est côté client, c'est un
 * auto-test, pas un examen. Zéro migration, zéro coût API, versionné dans git.
 * Source de vérité : src/lib/quizzes/data.json, keyé par slug de leçon.
 */
export type QuizQuestion = {
  /** Énoncé de la question. */
  q: string;
  /** 3 à 4 réponses possibles. */
  options: string[];
  /** Index (0-based) de la bonne réponse dans `options`. */
  correct: number;
  /** Explication montrée après correction (sourcée sur la leçon). */
  explanation: string;
};

type QuizData = Record<string, QuizQuestion[]>;

const QUIZZES = data as QuizData;

/** Retourne le QCM d'une leçon, ou null si aucun QCM n'est encore défini. */
export function quizForLesson(lessonSlug: string): QuizQuestion[] | null {
  const qs = QUIZZES[lessonSlug];
  return qs && qs.length > 0 ? qs : null;
}

/** Nombre de leçons disposant d'un QCM (pour affichage / debug). */
export const QUIZ_LESSON_COUNT = Object.keys(QUIZZES).length;
