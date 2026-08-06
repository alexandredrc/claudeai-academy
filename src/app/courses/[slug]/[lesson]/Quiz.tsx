"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/quizzes/library";

/**
 * QCM d'auto-évaluation, une question à la fois.
 *
 * Le format « toutes les questions puis correction » laissait l'apprenant sans
 * retour pendant l'effort. Ici chaque réponse est corrigée immédiatement et
 * expliquée : c'est le feedback rapproché qui fait apprendre, pas la note.
 */
export function LessonQuiz({ questions }: { questions: QuizQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    questions.map(() => null),
  );

  const current = questions[index];
  const chosen = answers[index];
  const answered = chosen !== null;
  const isLast = index === questions.length - 1;
  const answeredCount = answers.filter((a) => a !== null).length;
  const finished = answeredCount === questions.length;
  const score = questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0),
    0,
  );

  function choose(optIndex: number) {
    if (answered) return; // une seule tentative par question
    setAnswers((prev) => {
      const copy = prev.slice();
      copy[index] = optIndex;
      return copy;
    });
  }

  function reset() {
    setAnswers(questions.map(() => null));
    setIndex(0);
  }

  // Écran de fin : score, message calibré, relance.
  if (finished && index === questions.length) {
    const perfect = score === questions.length;
    const good = score >= Math.ceil(questions.length * 0.7);
    return (
      <section className="mt-14 rounded-[22px] border border-line bg-white p-6 text-center md:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-coral">
          Quiz terminé
        </p>
        <p className="mt-4 font-serif text-5xl font-medium text-ink">
          {score}
          <span className="text-2xl text-muted">/{questions.length}</span>
        </p>
        <p className="mx-auto mt-4 max-w-[420px] text-[15px] leading-relaxed text-ink-soft">
          {perfect
            ? "Sans faute. Tu peux passer à la suite les yeux fermés."
            : good
              ? "Solide. Relis les explications des questions ratées avant d'enchaîner."
              : "La leçon n'est pas encore acquise — relis-la, puis refais le quiz. C'est normal, et c'est le moment de le faire."}
        </p>

        <ol className="mx-auto mt-8 max-w-[520px] space-y-2 text-left">
          {questions.map((q, i) => {
            const ok = answers[i] === q.correct;
            return (
              <li
                key={i}
                className="flex items-start gap-3 rounded-[12px] border border-line bg-cream-soft px-4 py-3"
              >
                <span
                  className={
                    "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white " +
                    (ok ? "bg-green" : "bg-coral")
                  }
                  aria-hidden
                >
                  {ok ? "✓" : "✗"}
                </span>
                <span className="text-[14px] leading-snug text-ink-soft">
                  {q.q}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-[14px] bg-coral px-5 py-2.5 text-sm font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_8px_20px_rgba(217,119,87,0.35)]"
          >
            Refaire le quiz
          </button>
          <button
            type="button"
            onClick={() => setIndex(questions.length - 1)}
            className="rounded-[14px] border border-line bg-cream-soft px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:border-coral-soft hover:text-ink"
          >
            Revoir les explications
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-14 rounded-[22px] border border-line bg-white p-6 md:p-8">
      <header>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-coral">
            Teste ta compréhension
          </span>
          <span className="text-[12px] font-semibold tabular-nums text-muted">
            Question {index + 1} / {questions.length}
          </span>
        </div>

        {/* Progression : une pastille par question, remplie une fois répondue. */}
        <div className="mt-3 flex gap-1.5" aria-hidden>
          {questions.map((_, i) => (
            <span
              key={i}
              className={
                "h-1.5 flex-1 rounded-full " +
                (answers[i] === null
                  ? i === index
                    ? "bg-coral-soft"
                    : "bg-cream-dark"
                  : answers[i] === questions[i].correct
                    ? "bg-green"
                    : "bg-coral")
              }
            />
          ))}
        </div>
      </header>

      <p className="mt-6 font-serif text-xl font-medium leading-snug text-ink">
        {current.q}
      </p>

      <div className="mt-4 space-y-2">
        {current.options.map((opt, oi) => {
          const isChosen = chosen === oi;
          const isCorrect = oi === current.correct;

          let cls =
            "flex w-full items-start gap-3 rounded-[12px] border px-4 py-3 text-left text-[14px] leading-relaxed transition-colors";
          if (!answered) {
            cls +=
              " border-line bg-cream-soft text-ink-soft hover:border-coral hover:bg-coral-soft/25";
          } else if (isCorrect) {
            cls += " border-green/50 bg-green-soft text-ink";
          } else if (isChosen) {
            cls += " border-coral bg-coral-soft/40 text-ink";
          } else {
            cls += " border-line bg-cream-soft text-muted opacity-60";
          }

          return (
            <button
              key={oi}
              type="button"
              onClick={() => choose(oi)}
              disabled={answered}
              className={cls}
            >
              <span
                className={
                  "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[12px] font-semibold " +
                  (answered && isCorrect
                    ? "border-green bg-green text-white"
                    : answered && isChosen
                      ? "border-coral bg-coral text-white"
                      : "border-line")
                }
                aria-hidden
              >
                {answered && isCorrect
                  ? "✓"
                  : answered && isChosen
                    ? "✗"
                    : String.fromCharCode(65 + oi)}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={
            "mt-4 rounded-[12px] px-4 py-3.5 text-[14px] leading-relaxed " +
            (chosen === current.correct
              ? "bg-green-soft text-ink-soft"
              : "bg-coral-soft/40 text-ink-soft")
          }
        >
          <strong className="font-semibold text-ink">
            {chosen === current.correct
              ? "Exact. "
              : "Pas tout à fait. "}
          </strong>
          {current.explanation}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-5">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="text-[13px] font-semibold text-muted transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← Précédente
        </button>

        {answered ? (
          <button
            type="button"
            onClick={() => setIndex((i) => i + 1)}
            className="rounded-[14px] bg-coral px-5 py-2.5 text-sm font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_8px_20px_rgba(217,119,87,0.35)]"
          >
            {isLast ? "Voir mon score" : "Question suivante →"}
          </button>
        ) : (
          <span className="text-[13px] text-muted">
            Choisis une réponse pour voir l&apos;explication.
          </span>
        )}
      </div>
    </section>
  );
}
