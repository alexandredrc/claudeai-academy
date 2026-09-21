"use server";

import { createClient } from "@/lib/supabase/server";
import {
  startExam,
  gradeExam,
  certificateByCode,
  type GradeResult,
} from "@/lib/certification/core";
import { renderCertificatePdf } from "@/lib/certification/pdf";
import { sendCertificationEmail } from "@/lib/email/certification";
import { SITE_URL } from "@/lib/email/send";

export type StartResult =
  | { ok: true; attemptId: string; questions: { q: string; options: string[] }[] }
  | { ok: false; message: string };

const REFUS: Record<string, string> = {
  "no-purchase": "Il faut un pass actif pour passer l'examen.",
  "lessons-incomplete":
    "Toutes les leçons de votre parcours doivent être terminées avant l'examen.",
  "no-questions":
    "L'examen n'est pas encore disponible pour votre parcours. Écrivez-nous, on règle ça.",
};

export async function demarrerExamenAction(): Promise<StartResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Connectez-vous pour passer l'examen." };

  const r = await startExam(user.id);
  if (!r.ok) return { ok: false, message: REFUS[r.reason] ?? "Examen indisponible." };
  return { ok: true, attemptId: r.attemptId, questions: r.questions };
}

export type SubmitResult =
  | (GradeResult & { ok: true })
  | { ok: false; message: string };

export async function corrigerExamenAction(
  attemptId: string,
  answers: (number | null)[],
): Promise<SubmitResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Session expirée. Reconnectez-vous." };

  let result: GradeResult;
  try {
    result = await gradeExam(user.id, attemptId, answers);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[examen] correction échouée:", message);
    return { ok: false, message: "La correction a échoué. Réessayez." };
  }

  // Le certificat vient d'être créé : on envoie l'email avec le PDF joint.
  // Un échec d'envoi ne doit JAMAIS masquer la réussite — le certificat existe,
  // il est téléchargeable, et la page de résultat donne le lien.
  if (result.justIssued && result.code) {
    try {
      const cert = await certificateByCode(result.code);
      if (cert && user.email) {
        const pdf = await renderCertificatePdf(cert, SITE_URL);
        await sendCertificationEmail({ to: user.email, cert, pdf });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[examen] envoi du certificat échoué:", message);
    }
  }

  return { ...result, ok: true };
}
