"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";

/* =========================================
   Barre de progression de lecture
   ========================================= */

/**
 * Fine barre coral collée sous le header, qui se remplit à mesure que
 * l'article défile. Repère de progression : on voit ce qu'il reste.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    let frame = 0;
    function compute() {
      frame = 0;
      const node = document.getElementById(targetId);
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      // Lu = ce qui est passé au-dessus du bas de la fenêtre.
      const read = viewport - rect.top;
      const total = rect.height;
      const ratio = total <= 0 ? 0 : read / total;
      setPercent(Math.min(100, Math.max(0, Math.round(ratio * 100))));
    }
    function onScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(compute);
    }

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);

  return (
    <div
      className="fixed inset-x-0 top-0 z-40 h-[3px] bg-transparent"
      role="progressbar"
      aria-label="Progression de lecture"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-coral transition-[width] duration-150 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

/* =========================================
   Sommaire latéral
   ========================================= */

/**
 * Sommaire sticky (desktop) qui surligne la section en cours.
 * Sur mobile, il se replie dans un <details> en tête de leçon.
 */
export function LessonToc({
  headings,
}: {
  headings: { id: string; text: string }[];
}) {
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? null,
  );
  const ids = useMemo(() => headings.map((h) => h.id), [headings]);

  useEffect(() => {
    if (ids.length === 0) return;
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => n !== null);
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // La section active est la plus haute de celles visibles.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-88px 0px -65% 0px", threshold: 0 },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [ids]);

  if (headings.length < 3) return null;

  const list = (
    <ol className="space-y-1.5">
      {headings.map((h, i) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            className={
              "block border-l-2 py-1 pl-3 text-[13px] leading-snug transition-colors " +
              (activeId === h.id
                ? "border-coral font-semibold text-ink"
                : "border-line text-muted hover:border-coral-soft hover:text-ink-soft")
            }
          >
            <span className="mr-1.5 tabular-nums text-[11px] text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      {/* Mobile : repliable, au-dessus du contenu */}
      <details className="mt-8 rounded-[18px] border border-line bg-white p-4 xl:hidden">
        <summary className="flex cursor-pointer items-center justify-between text-[13px] font-semibold text-ink">
          Sommaire de la leçon
          <span className="chevron text-muted transition-transform">▾</span>
        </summary>
        <div className="mt-3">{list}</div>
      </details>

      {/* Desktop : colonne sticky à gauche du contenu */}
      <nav
        aria-label="Sommaire de la leçon"
        className="pointer-events-none fixed left-[max(1.5rem,calc(50vw-620px))] top-32 hidden w-[210px] xl:block"
      >
        <div className="pointer-events-auto max-h-[70vh] overflow-y-auto pr-2">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Sommaire
          </p>
          {list}
        </div>
      </nav>
    </>
  );
}

/* =========================================
   Défi : critères cochables persistés
   ========================================= */

/**
 * Cases cochées d'un défi, persistées d'une visite à l'autre.
 *
 * localStorage est une source de vérité *externe* à React : on la lit avec
 * `useSyncExternalStore` plutôt qu'en hydratant un state dans un effet — pas de
 * rendu en cascade, et le serveur rend simplement « rien de coché ».
 * `memoryStore` prend le relais quand l'écriture échoue (navigation privée,
 * quota) : l'état reste alors valable pour la session en cours.
 */
const memoryStore = new Map<string, string>();
const listeners = new Set<() => void>();

function subscribeToStorage(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readStored(key: string): string | null {
  try {
    return window.localStorage.getItem(key) ?? memoryStore.get(key) ?? null;
  } catch {
    return memoryStore.get(key) ?? null;
  }
}

function writeStored(key: string, value: string) {
  memoryStore.set(key, value);
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Écriture impossible : `memoryStore` garde l'état pour la session.
  }
  listeners.forEach((notify) => notify());
}

function useLocalChecklist(storageKey: string, size: number) {
  const raw = useSyncExternalStore(
    subscribeToStorage,
    () => readStored(storageKey),
    () => null,
  );

  const done = useMemo(() => {
    let parsed: unknown = null;
    try {
      parsed = raw ? JSON.parse(raw) : null;
    } catch {
      parsed = null;
    }
    return Array.from(
      { length: size },
      (_, i) => Array.isArray(parsed) && parsed[i] === true,
    );
  }, [raw, size]);

  const toggle = useCallback(
    (index: number) => {
      const next = done.slice();
      next[index] = !next[index];
      writeStored(storageKey, JSON.stringify(next));
    },
    [done, storageKey],
  );

  return { done, toggle };
}

export function Challenge({
  storageKey,
  title,
  intro,
  items,
}: {
  storageKey: string;
  title: string;
  intro: ReactNode;
  items: ReactNode[];
}) {
  const { done, toggle } = useLocalChecklist(storageKey, items.length);
  const count = done.filter(Boolean).length;
  const complete = items.length > 0 && count === items.length;

  return (
    <section
      className={
        "not-prose my-8 rounded-[22px] border-2 p-6 transition-colors md:p-7 " +
        (complete
          ? "border-green/40 bg-green-soft/50"
          : "border-coral-soft bg-white")
      }
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-[20px]" aria-hidden>
            🎯
          </span>
          <h3 className="font-serif text-xl font-semibold text-ink">{title}</h3>
        </div>
        <span
          className={
            "rounded-full px-3 py-1 text-[12px] font-semibold tabular-nums " +
            (complete ? "bg-green text-white" : "bg-cream-dark text-ink-soft")
          }
        >
          {complete ? "✓ Défi relevé" : `${count}/${items.length}`}
        </span>
      </header>

      {intro && <div className="prose-block mt-3">{intro}</div>}

      <ul className="mt-5 space-y-2">
        {items.map((item, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-pressed={done[i]}
              className={
                "flex w-full items-start gap-3 rounded-[12px] border px-4 py-3 text-left transition-colors " +
                (done[i]
                  ? "border-green/40 bg-green-soft"
                  : "border-line bg-cream-soft hover:border-coral-soft")
              }
            >
              <span
                className={
                  "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border text-[12px] font-bold " +
                  (done[i]
                    ? "border-green bg-green text-white"
                    : "border-line bg-white text-transparent")
                }
                aria-hidden
              >
                ✓
              </span>
              <span
                className={
                  "prose-block text-[14px] leading-relaxed " +
                  (done[i] ? "text-muted line-through" : "text-ink-soft")
                }
              >
                {item}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {complete && (
        <p className="mt-4 text-[14px] font-semibold text-green">
          Bien joué — tu as fait le travail, pas seulement la lecture.
        </p>
      )}
    </section>
  );
}

/* =========================================
   Cartes de révision (recto / verso)
   ========================================= */

export function Flashcards({
  cards,
  title,
}: {
  cards: { q: string; a: string }[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [seen, setSeen] = useState<number[]>([]);

  if (cards.length === 0) return null;
  const card = cards[index];
  const isLast = index === cards.length - 1;

  function reveal() {
    setRevealed(true);
    setSeen((prev) => (prev.includes(index) ? prev : [...prev, index]));
  }
  function go(delta: number) {
    setRevealed(false);
    setIndex((i) => Math.min(cards.length - 1, Math.max(0, i + delta)));
  }
  function restart() {
    setRevealed(false);
    setSeen([]);
    setIndex(0);
  }

  const allSeen = seen.length === cards.length;

  return (
    <section className="not-prose my-10 rounded-[22px] border border-line bg-ink p-6 text-cream md:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-coral">
            Révision active
          </span>
          <h3 className="mt-1 font-serif text-xl font-semibold text-cream">
            {title}
          </h3>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold tabular-nums text-cream/80">
          {index + 1} / {cards.length}
        </span>
      </header>

      <p className="mt-2 text-[13px] leading-relaxed text-cream/60">
        Réponds dans ta tête avant de retourner la carte. C&apos;est l&apos;effort
        de rappel qui ancre, pas la relecture.
      </p>

      <div className="mt-5 min-h-[168px] rounded-[16px] bg-white/[0.06] p-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-cream/40">
          Question
        </p>
        <p className="mt-2 text-[17px] font-medium leading-relaxed text-cream">
          {card.q}
        </p>

        {revealed ? (
          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-coral">
              Réponse
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-cream/85">
              {card.a}
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={reveal}
            className="mt-5 rounded-[12px] border border-cream/25 px-4 py-2 text-[13px] font-semibold text-cream transition-colors hover:border-coral hover:text-coral"
          >
            Retourner la carte
          </button>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          className="rounded-[12px] px-3 py-2 text-[13px] font-semibold text-cream/70 transition-colors hover:text-cream disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← Précédente
        </button>

        <div className="flex gap-1.5" aria-hidden>
          {cards.map((_, i) => (
            <span
              key={i}
              className={
                "h-1.5 w-1.5 rounded-full " +
                (i === index
                  ? "bg-coral"
                  : seen.includes(i)
                    ? "bg-cream/50"
                    : "bg-cream/20")
              }
            />
          ))}
        </div>

        {isLast && allSeen ? (
          <button
            type="button"
            onClick={restart}
            className="rounded-[12px] bg-coral px-4 py-2 text-[13px] font-semibold text-cream transition-colors hover:bg-coral-dark"
          >
            Refaire le paquet
          </button>
        ) : (
          <button
            type="button"
            onClick={() => go(1)}
            disabled={isLast}
            className="rounded-[12px] px-3 py-2 text-[13px] font-semibold text-cream/70 transition-colors hover:text-cream disabled:cursor-not-allowed disabled:opacity-30"
          >
            Suivante →
          </button>
        )}
      </div>
    </section>
  );
}
