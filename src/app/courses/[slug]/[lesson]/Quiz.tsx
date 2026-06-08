"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/quizzes/library";

export function LessonQuiz({ questions }: { questions: QuizQuestion[] }) {
  // answers[i] = index choisi pour la question i (null = pas répondu)
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => questions.map(() => null),
  );
  const [checked, setChecked] = useState(false);

  const allAnswered = answers.every((a) => a !== null);
  const score = questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0),
    0,
  );

  function choose(qIndex: number, optIndex: number) {
    if (checked) return; // figé après correction
    setAnswers((prev) => {
      const copy = prev.slice();
      copy[qIndex] = optIndex;
      return copy;
    });
  }

  function reset() {
    setAnswers(questions.map(() => null));
    setChecked(false);
  }

  return (
    <section className="mt-14 rounded-[22px] border border-line bg-white p-6 md:p-8">
      <header className="mb-6">
        <span className="inline-block text-[12px] font-semibold uppercase tracking-[0.12em] text-coral">
          Teste ta compréhension
        </span>
        <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight text-ink">
          Quiz de la leçon
        </h2>
        <p className="mt-2 text-[14px] text-muted">
          {questions.length} questions. Réponds, puis vérifie : chaque réponse
          est expliquée.
        </p>
      </header>

      <ol className="space-y-7">
        {questions.map((q, qi) => {
          const chosen = answers[qi];
          return (
            <li key={qi}>
              <p className="text-[15px] font-semibold leading-relaxed text-ink">
                {qi + 1}. {q.q}
              </p>
              <div className="mt-3 space-y-2">
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  const isCorrect = oi === q.correct;

                  // Styles : neutre avant correction, vert/rouge après.
                  let cls =
                    "flex w-full items-start gap-3 rounded-[12px] border px-4 py-3 text-left text-[14px] leading-relaxed transition-colors";
                  if (!checked) {
                    cls += isChosen
                      ? " border-coral bg-coral-soft/40 text-ink"
                      : " border-line bg-cream-soft text-ink-soft hover:border-coral-soft";
                  } else if (isCorrect) {
                    cls += " border-green/50 bg-green-soft text-ink";
                  } else if (isChosen) {
                    cls += " border-coral-dark/40 bg-coral-soft/40 text-ink";
                  } else {
                    cls += " border-line bg-cream-soft text-muted";
                  }

                  return (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => choose(qi, oi)}
                      disabled={checked}
                      className={cls}
                    >
                      <span
                        className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[12px] font-semibold"
                        aria-hidden
                      >
                        {checked && isCorrect
                          ? "✓"
                          : checked && isChosen
                            ? "✗"
                            : String.fromCharCode(65 + oi)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {checked && (
                <p
                  className={
                    "mt-3 rounded-[12px] px-4 py-3 text-[14px] leading-relaxed " +
                    (chosen === q.correct
                      ? "bg-green-soft text-green"
                      : "bg-coral-soft/40 text-ink-soft")
                  }
                >
                  <strong className="font-semibold">
                    {chosen === q.correct ? "Correct. " : "Pas tout à fait. "}
                  </strong>
                  {q.explanation}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-8 flex flex-col items-start gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        {!checked ? (
          <button
            type="button"
            onClick={() => setChecked(true)}
            disabled={!allAnswered}
            className="rounded-[14px] bg-coral px-6 py-3 text-sm font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_8px_20px_rgba(217,119,87,0.35)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            Vérifier mes réponses
          </button>
        ) : (
          <>
            <p className="text-[15px] font-semibold text-ink">
              Score :{" "}
              <span className={score === questions.length ? "text-green" : "text-coral"}>
                {score}/{questions.length}
              </span>
              {score === questions.length
                ? " — sans faute, c'est acquis."
                : " — relis l'explication des questions ratées."}
            </p>
            <button
              type="button"
              onClick={reset}
              className="rounded-[14px] border border-line bg-cream-soft px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:border-coral-soft hover:text-ink"
            >
              Recommencer
            </button>
          </>
        )}
        {!checked && !allAnswered && (
          <span className="text-[13px] text-muted">
            Réponds à toutes les questions pour vérifier.
          </span>
        )}
      </div>
    </section>
  );
}
