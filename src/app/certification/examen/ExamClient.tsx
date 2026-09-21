"use client";

import { useState } from "react";
import { Button } from "@/components/site/button";
import { demarrerExamenAction, corrigerExamenAction } from "./actions";

type Question = { q: string; options: string[] };
type Phase = "intro" | "encours" | "resultat";

/**
 * L'examen final.
 *
 * Deux règles de conception, différentes de celles des QCM de leçon :
 *  - aucune correction pendant l'épreuve. Le QCM de leçon corrige à chaque
 *    question parce qu'il sert à apprendre ; ici on évalue, et montrer la
 *    réponse fausserait les suivantes.
 *  - les bonnes réponses ne descendent jamais dans le navigateur. Le serveur
 *    envoie des énoncés, reçoit des indices, et corrige seul.
 */
export function ExamClient({
  questionCount,
  passPercent,
}: {
  questionCount: number;
  passPercent: number;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [busy, setBusy] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [index, setIndex] = useState(0);

  const [resultat, setResultat] = useState<{
    score: number;
    total: number;
    passed: boolean;
    code?: string;
  } | null>(null);

  async function demarrer() {
    setBusy(true);
    setErreur(null);
    const r = await demarrerExamenAction();
    setBusy(false);
    if (!r.ok) {
      setErreur(r.message);
      return;
    }
    setAttemptId(r.attemptId);
    setQuestions(r.questions);
    setAnswers(r.questions.map(() => null));
    setIndex(0);
    setPhase("encours");
  }

  async function envoyer() {
    if (!attemptId) return;
    setBusy(true);
    setErreur(null);
    const r = await corrigerExamenAction(attemptId, answers);
    setBusy(false);
    if (!r.ok) {
      setErreur(r.message);
      return;
    }
    setResultat({ score: r.score, total: r.total, passed: r.passed, code: r.code });
    setPhase("resultat");
  }

  // ---------- Intro ----------
  if (phase === "intro") {
    return (
      <div className="rounded-[22px] border border-line bg-white p-8 md:p-10">
        <h2 className="font-serif text-2xl font-semibold text-ink">
          Avant de commencer
        </h2>
        <ul className="mt-6 space-y-3.5">
          {[
            `${questionCount} questions tirées au hasard dans l'ensemble de votre programme.`,
            `Il faut ${passPercent} % de bonnes réponses pour obtenir le certificat.`,
            "Aucune correction pendant l'épreuve : vous verrez votre score à la fin.",
            "Pas de limite de temps, mais une tentative se termine en une seule fois.",
            "En cas d'échec, vous pouvez repasser l'examen — le tirage sera différent.",
          ].map((t) => (
            <li key={t} className="relative pl-7 text-[15px] leading-relaxed text-ink-soft">
              <span className="absolute left-0 top-0 font-bold text-coral">✓</span>
              {t}
            </li>
          ))}
        </ul>

        {erreur && (
          <p className="mt-6 rounded-[10px] border border-coral bg-coral-soft px-4 py-3 text-[14px] text-ink">
            {erreur}
          </p>
        )}

        <button
          type="button"
          onClick={demarrer}
          disabled={busy}
          className="mt-8 w-full rounded-full bg-coral px-7 py-3.5 text-[16px] font-semibold text-cream transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
        >
          {busy ? "Préparation du sujet…" : "Commencer l'examen"}
        </button>
      </div>
    );
  }

  // ---------- Résultat ----------
  if (phase === "resultat" && resultat) {
    const pct = Math.round((resultat.score / resultat.total) * 100);
    return (
      <div className="rounded-[22px] border border-line bg-white p-8 text-center md:p-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-coral">
          {resultat.passed ? "Examen réussi" : "Examen non validé"}
        </p>
        <p className="mt-5 font-serif text-6xl font-medium text-ink">
          {resultat.score}
          <span className="text-3xl text-muted">/{resultat.total}</span>
        </p>
        <p className="mt-2 text-[15px] text-muted">{pct} %</p>

        {resultat.passed ? (
          <>
            <p className="mx-auto mt-7 max-w-[460px] text-[16px] leading-relaxed text-ink-soft">
              Votre certificat est délivré. Il part par email avec le PDF en pièce
              jointe, et reste vérifiable en ligne par toute personne à qui vous
              donnez le code.
            </p>
            {resultat.code && (
              <>
                <p className="mt-7 text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">
                  Code de vérification
                </p>
                <p className="mt-1.5 font-mono text-xl tracking-wide text-ink">
                  {resultat.code}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button
                    href={`/certification/${resultat.code}/certificat.pdf`}
                    variant="primary"
                  >
                    Télécharger mon certificat
                  </Button>
                  <Button href={`/certification/${resultat.code}`} variant="ghost">
                    Voir la page de vérification
                  </Button>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <p className="mx-auto mt-7 max-w-[460px] text-[16px] leading-relaxed text-ink-soft">
              Il fallait {passPercent} %. Reprenez les parcours sur lesquels vous
              avez hésité, puis repassez l’examen : le sujet sera tiré à nouveau.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setPhase("intro");
                  setResultat(null);
                }}
                className="rounded-full bg-coral px-7 py-3.5 text-[16px] font-semibold text-cream transition-opacity hover:opacity-90"
              >
                Repasser l’examen
              </button>
              <Button href="/courses" variant="ghost">
                Revoir les parcours
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }

  // ---------- Épreuve ----------
  const current = questions[index];
  const repondues = answers.filter((a) => a !== null).length;
  const toutesRepondues = repondues === questions.length;
  const isLast = index === questions.length - 1;

  return (
    <div className="rounded-[22px] border border-line bg-white p-7 md:p-10">
      {/* Progression */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">
          Question {index + 1} sur {questions.length}
        </span>
        <span className="text-[13px] text-muted">{repondues} répondues</span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-cream">
        <div
          className="h-full rounded-full bg-coral transition-all duration-300"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      <h2 className="mt-8 font-serif text-xl leading-snug text-ink md:text-2xl">
        {current.q}
      </h2>

      <div className="mt-6 space-y-3">
        {current.options.map((opt, i) => {
          const choisi = answers[index] === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() =>
                setAnswers((prev) => {
                  const copy = prev.slice();
                  copy[index] = i;
                  return copy;
                })
              }
              className={`block w-full rounded-[12px] border px-5 py-4 text-left text-[15px] leading-relaxed transition-colors ${
                choisi
                  ? "border-coral bg-coral-soft text-ink"
                  : "border-line bg-cream-soft text-ink-soft hover:border-coral"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {erreur && (
        <p className="mt-6 rounded-[10px] border border-coral bg-coral-soft px-4 py-3 text-[14px] text-ink">
          {erreur}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="text-[15px] text-muted underline underline-offset-4 disabled:opacity-40"
        >
          Précédente
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={envoyer}
            disabled={busy || !toutesRepondues}
            className="rounded-full bg-coral px-7 py-3 text-[15px] font-semibold text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
            title={toutesRepondues ? undefined : "Répondez à toutes les questions"}
          >
            {busy ? "Correction…" : "Terminer et corriger"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
            className="rounded-full bg-ink px-7 py-3 text-[15px] font-semibold text-cream transition-opacity hover:opacity-90"
          >
            Suivante
          </button>
        )}
      </div>
    </div>
  );
}
