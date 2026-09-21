import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { quizForLesson, type QuizQuestion } from "@/lib/quizzes/library";
import type { PlanTier } from "@/lib/stripe/plans";

/**
 * Certification ClaudeAI Academy — règles du jeu.
 *
 * Un certificat qui se contente d'attester une présence ne vaut rien, et tout
 * le monde le sait. Celui-ci demande deux choses vérifiables :
 *
 *   1. avoir terminé TOUTES les leçons du niveau acheté ;
 *   2. avoir réussi un examen final, corrigé côté serveur.
 *
 * L'examen est tiré au sort dans les QCM des leçons du parcours. Il n'y a donc
 * aucun contenu nouveau à rédiger, et le sujet couvre réellement l'ensemble du
 * programme — pas un chapitre isolé.
 */

/** Nombre de questions tirées au sort pour l'examen final. */
export const EXAM_QUESTIONS = 20;

/** Score minimum, en pourcentage, pour obtenir le certificat. */
export const EXAM_PASS_RATIO = 0.8;

/** Niveaux d'accès contenus dans un niveau acheté (mastery inclut starter). */
function tiersIncludedIn(tier: PlanTier): string[] {
  return tier === "mastery" ? ["free", "starter", "mastery"] : ["free", "starter"];
}

export type CertificationStatus = {
  /** Niveau le plus élevé réellement payé, ou null si aucun achat. */
  tier: PlanTier | null;
  lessonsTotal: number;
  lessonsCompleted: number;
  /** Toutes les leçons du niveau sont terminées. */
  lessonsDone: boolean;
  /** Certificat déjà délivré pour ce niveau. */
  certification: { code: string; issued_at: string; score: number; total: number } | null;
};

/** Niveau d'accès le plus élevé effectivement payé (et non remboursé). */
export async function paidTier(userId: string): Promise<PlanTier | null> {
  const { data } = await supabaseAdmin
    .from("purchases")
    .select("tier")
    .eq("user_id", userId)
    .eq("status", "paid");
  if (!data?.length) return null;
  return data.some((p) => p.tier === "mastery") ? "mastery" : "starter";
}

/** Slugs des leçons comprises dans un niveau, dans l'ordre du programme. */
async function lessonSlugsForTier(
  tier: PlanTier,
): Promise<{ id: string; slug: string }[]> {
  const { data: courses } = await supabaseAdmin
    .from("courses")
    .select("id")
    .in("tier_required", tiersIncludedIn(tier));
  const courseIds = (courses ?? []).map((c) => c.id);
  if (!courseIds.length) return [];

  const { data: lessons } = await supabaseAdmin
    .from("lessons")
    .select("id, slug")
    .in("course_id", courseIds);
  return lessons ?? [];
}

export async function certificationStatus(
  userId: string,
): Promise<CertificationStatus> {
  const tier = await paidTier(userId);
  if (!tier) {
    return {
      tier: null,
      lessonsTotal: 0,
      lessonsCompleted: 0,
      lessonsDone: false,
      certification: null,
    };
  }

  const lessons = await lessonSlugsForTier(tier);
  const lessonIds = new Set(lessons.map((l) => l.id));

  const { data: progress } = await supabaseAdmin
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", userId);
  const completed = (progress ?? []).filter((p) => lessonIds.has(p.lesson_id)).length;

  const { data: cert } = await supabaseAdmin
    .from("certifications")
    .select("code, issued_at, score, total")
    .eq("user_id", userId)
    .eq("tier", tier)
    .is("revoked_at", null)
    .maybeSingle();

  return {
    tier,
    lessonsTotal: lessons.length,
    lessonsCompleted: completed,
    // Garde-fou : un catalogue vide ne doit pas valoir « tout terminé ».
    lessonsDone: lessons.length > 0 && completed >= lessons.length,
    certification: cert ?? null,
  };
}

/** Tirage sans remise, déterministe uniquement par le hasard de Math.random. */
function sample<T>(items: T[], n: number): T[] {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

type StoredQuestion = QuizQuestion & { lesson_slug: string };

/**
 * Crée une tentative d'examen et renvoie son sujet SANS les bonnes réponses.
 * Les réponses restent en base, côté serveur, jusqu'à la correction.
 */
export async function startExam(userId: string): Promise<
  | { ok: true; attemptId: string; questions: { q: string; options: string[] }[] }
  | { ok: false; reason: "no-purchase" | "lessons-incomplete" | "no-questions" }
> {
  const status = await certificationStatus(userId);
  if (!status.tier) return { ok: false, reason: "no-purchase" };
  if (!status.lessonsDone) return { ok: false, reason: "lessons-incomplete" };

  const lessons = await lessonSlugsForTier(status.tier);
  const pool: StoredQuestion[] = [];
  for (const lesson of lessons) {
    for (const q of quizForLesson(lesson.slug) ?? []) {
      pool.push({ ...q, lesson_slug: lesson.slug });
    }
  }
  if (pool.length < 5) return { ok: false, reason: "no-questions" };

  const picked = sample(pool, Math.min(EXAM_QUESTIONS, pool.length));

  const { data, error } = await supabaseAdmin
    .from("exam_attempts")
    .insert({
      user_id: userId,
      tier: status.tier,
      questions: picked,
      total: picked.length,
    })
    .select("id")
    .single();
  if (error || !data) throw new Error(`exam_attempts insert: ${error?.message}`);

  return {
    ok: true,
    attemptId: data.id,
    questions: picked.map((p) => ({ q: p.q, options: p.options })),
  };
}

/** Identifiant public : lisible à voix haute, sans caractères ambigus. */
function newCertificateCode(): string {
  const alphabet = "ACDEFGHJKLMNPQRTUVWXY3479"; // ni 0/O, ni 1/I, ni S/5, ni 2/Z
  let body = "";
  for (let i = 0; i < 8; i++) {
    body += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `CAA-${body.slice(0, 4)}-${body.slice(4)}`;
}

export type GradeResult = {
  score: number;
  total: number;
  passed: boolean;
  /** Présent uniquement si l'examen est réussi. */
  code?: string;
  /** Vrai si le certificat vient d'être créé (et l'email envoyé). */
  justIssued?: boolean;
};

/**
 * Corrige une tentative et, si elle est réussie, délivre le certificat.
 * L'envoi de l'email est délégué à l'appelant via `onIssued` pour garder ce
 * module sans dépendance d'email (et donc testable).
 */
export async function gradeExam(
  userId: string,
  attemptId: string,
  answers: (number | null)[],
): Promise<GradeResult> {
  const { data: attempt, error } = await supabaseAdmin
    .from("exam_attempts")
    .select("id, user_id, tier, questions, total, submitted_at")
    .eq("id", attemptId)
    .maybeSingle();
  if (error || !attempt) throw new Error("Tentative d'examen introuvable.");
  if (attempt.user_id !== userId) throw new Error("Tentative d'un autre compte.");
  if (attempt.submitted_at) throw new Error("Cette tentative a déjà été corrigée.");

  const questions = attempt.questions as StoredQuestion[];
  let score = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.correct) score += 1;
  });
  const total = attempt.total;
  const passed = score / total >= EXAM_PASS_RATIO;

  await supabaseAdmin
    .from("exam_attempts")
    .update({ score, passed, submitted_at: new Date().toISOString() })
    .eq("id", attemptId);

  if (!passed) return { score, total, passed };

  // Déjà certifié pour ce niveau : on ne réémet pas, on renvoie l'existant.
  const { data: existing } = await supabaseAdmin
    .from("certifications")
    .select("code")
    .eq("user_id", userId)
    .eq("tier", attempt.tier)
    .maybeSingle();
  if (existing) return { score, total, passed, code: existing.code };

  const status = await certificationStatus(userId);
  const holderName = await holderNameFor(userId);

  // Collision de code : improbable (25^8), mais une clé unique doit être
  // défendue, pas espérée. Trois essais puis on abandonne proprement.
  let code = newCertificateCode();
  for (let attemptNo = 0; attemptNo < 3; attemptNo++) {
    const { error: insertError } = await supabaseAdmin.from("certifications").insert({
      user_id: userId,
      code,
      tier: attempt.tier,
      holder_name: holderName,
      score,
      total,
      lessons_completed: status.lessonsCompleted,
    });
    if (!insertError) return { score, total, passed, code, justIssued: true };
    if (!insertError.message.includes("duplicate")) throw new Error(insertError.message);
    code = newCertificateCode();
  }
  throw new Error("Impossible de générer un code de certificat unique.");
}

/** Nom imprimé sur le certificat : profil d'abord, email en dernier recours. */
export async function holderNameFor(userId: string): Promise<string> {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", userId)
    .maybeSingle();
  const full = [profile?.first_name, profile?.last_name]
    .filter((p): p is string => Boolean(p && p.trim()))
    .join(" ")
    .trim();
  if (full) return full;

  const { data } = await supabaseAdmin.auth.admin.getUserById(userId);
  const email = data.user?.email ?? "";
  return email ? email.split("@")[0] : "Titulaire";
}

export type PublicCertificate = {
  code: string;
  holderName: string;
  tier: PlanTier;
  score: number;
  total: number;
  lessonsCompleted: number;
  issuedAt: string;
  revoked: boolean;
};

/** Lecture publique par code — la seule voie d'accès à un certificat. */
export async function certificateByCode(
  code: string,
): Promise<PublicCertificate | null> {
  const { data } = await supabaseAdmin
    .from("certifications")
    .select("code, holder_name, tier, score, total, lessons_completed, issued_at, revoked_at")
    .eq("code", code.trim().toUpperCase())
    .maybeSingle();
  if (!data) return null;
  return {
    code: data.code,
    holderName: data.holder_name,
    tier: data.tier as PlanTier,
    score: data.score,
    total: data.total,
    lessonsCompleted: data.lessons_completed,
    issuedAt: data.issued_at,
    revoked: Boolean(data.revoked_at),
  };
}

/** Intitulé du programme, tel qu'il est imprimé sur le certificat. */
export function programmeLabel(tier: PlanTier): string {
  return tier === "mastery"
    ? "Programme complet — Formation Claude AI"
    : "Parcours fondateurs — Formation Claude AI";
}
