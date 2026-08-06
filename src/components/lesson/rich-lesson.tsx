import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyButton } from "@/components/site/copy-button";
import { Challenge, Flashcards } from "@/components/lesson/interactive";
import {
  parseFlashcards,
  parseLessonContent,
  parseListItems,
  parseStats,
  slugifyHeading,
  splitParts,
  type LessonSegment,
} from "@/lib/lessons/blocks";

/* =========================================
   Rendu Markdown
   ========================================= */

/** Markdown compact, pour l'intérieur des blocs. */
function Md({ children }: { children: string }) {
  return (
    <div className="prose-block">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

/** Markdown inline : pas de <p> autour, pour les puces et libellés. */
function MdInline({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{ p: ({ children }) => <>{children}</> }}
    >
      {children}
    </ReactMarkdown>
  );
}

/** Texte brut d'un nœud markdown, pour les ancres de titres. */
function nodeText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (typeof node === "object" && "props" in node) {
    return nodeText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

/* =========================================
   Blocs
   ========================================= */

/** Cartouche générique : bandeau coloré + pastille + titre. */
function Callout({
  tone,
  icon,
  label,
  title,
  children,
}: {
  tone: "coral" | "amber" | "green" | "neutral";
  icon: string;
  label: string;
  title: string | null;
  children: ReactNode;
}) {
  const tones = {
    coral: "border-coral-soft bg-coral-soft/25",
    amber: "border-amber-soft bg-amber-soft/60",
    green: "border-green/25 bg-green-soft/60",
    neutral: "border-line bg-white",
  } as const;
  const labelTones = {
    coral: "text-coral",
    amber: "text-amber",
    green: "text-green",
    neutral: "text-muted",
  } as const;

  return (
    <aside
      className={`not-prose my-7 rounded-[18px] border ${tones[tone]} p-5 md:p-6`}
    >
      <div className="flex items-baseline gap-2.5">
        <span className="text-[15px] leading-none" aria-hidden>
          {icon}
        </span>
        <span
          className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${labelTones[tone]}`}
        >
          {label}
        </span>
      </div>
      {title && (
        <p className="mt-2 font-serif text-lg font-semibold leading-snug text-ink">
          {title}
        </p>
      )}
      <div className={title ? "mt-1.5" : "mt-2.5"}>{children}</div>
    </aside>
  );
}

function Objectives({ title, body }: { title: string | null; body: string }) {
  const items = parseListItems(body);
  return (
    <section className="not-prose my-8 rounded-[22px] border border-line bg-white p-6 md:p-7">
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-coral">
        À la fin de cette leçon
      </span>
      <p className="mt-1.5 font-serif text-xl font-semibold text-ink">
        {title ?? "Tu sauras faire ça"}
      </p>
      <ul className="mt-4 space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="mt-[3px] inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-coral-soft text-[10px] font-bold text-coral-dark"
              aria-hidden
            >
              ✓
            </span>
            <span className="text-[15px] leading-relaxed text-ink-soft">
              <MdInline>{item}</MdInline>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Flash({ title, body }: { title: string | null; body: string }) {
  return (
    <section className="not-prose my-8 rounded-[22px] bg-ink p-6 text-cream md:p-7">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-coral">
        {title ?? "En 30 secondes"}
      </span>
      <div className="prose-block prose-block-dark mt-2.5 text-[16px] leading-relaxed">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
      </div>
    </section>
  );
}

function Steps({ title, body }: { title: string | null; body: string }) {
  const items = parseListItems(body);
  return (
    <section className="not-prose my-8">
      {title && (
        <p className="mb-4 font-serif text-lg font-semibold text-ink">{title}</p>
      )}
      <ol className="space-y-3">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-4 rounded-[16px] border border-line bg-white p-4 md:p-5"
          >
            <span
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-coral font-serif text-[15px] font-semibold text-cream"
              aria-hidden
            >
              {i + 1}
            </span>
            <span className="pt-1 text-[15px] leading-relaxed text-ink-soft">
              <MdInline>{item}</MdInline>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function PromptCard({ title, body }: { title: string | null; body: string }) {
  return (
    <section className="not-prose my-8 overflow-hidden rounded-[18px] border border-line bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-cream-soft px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[14px]" aria-hidden>
            ⌨️
          </span>
          <span className="text-[13px] font-semibold text-ink">
            {title ?? "Prompt prêt à l'emploi"}
          </span>
        </div>
        <CopyButton text={body} label="Copier le prompt" />
      </header>
      <pre className="overflow-x-auto bg-ink px-5 py-5 text-[13.5px] leading-[1.65] text-cream/90">
        <code className="whitespace-pre-wrap break-words font-mono">{body}</code>
      </pre>
    </section>
  );
}

function BeforeAfter({ title, body }: { title: string | null; body: string }) {
  const parts = splitParts(body);
  const [before, after] = [parts[0] ?? "", parts[1] ?? ""];
  const [labelBefore, labelAfter] = (title ?? "").includes("|")
    ? title!.split("|").map((s) => s.trim())
    : ["Ce qu'on écrit spontanément", "Ce qui marche vraiment"];

  return (
    <section className="not-prose my-8 grid gap-4 md:grid-cols-2">
      <div className="rounded-[18px] border border-line bg-cream-dark/40 p-5">
        <div className="flex items-center gap-2">
          <span aria-hidden>✗</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
            {labelBefore}
          </span>
        </div>
        <div className="prose-block mt-3 text-[14.5px] text-ink-soft">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{before}</ReactMarkdown>
        </div>
      </div>
      <div className="rounded-[18px] border border-green/30 bg-green-soft/60 p-5">
        <div className="flex items-center gap-2">
          <span aria-hidden>✓</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-green">
            {labelAfter}
          </span>
        </div>
        <div className="prose-block mt-3 text-[14.5px] text-ink-soft">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{after}</ReactMarkdown>
        </div>
      </div>
    </section>
  );
}

function Stats({ body }: { body: string }) {
  const stats = parseStats(body);
  if (stats.length === 0) return null;
  return (
    <section className="not-prose my-8 grid gap-3 sm:grid-cols-3">
      {stats.slice(0, 4).map((s, i) => (
        <div
          key={i}
          className="rounded-[18px] border border-line bg-white p-5 text-center"
        >
          <p className="font-serif text-3xl font-medium leading-none text-coral">
            {s.value}
          </p>
          <p className="mt-2 text-[13px] leading-snug text-ink-soft">
            <MdInline>{s.label}</MdInline>
          </p>
        </div>
      ))}
    </section>
  );
}

function Update({ title, body }: { title: string | null; body: string }) {
  return (
    <aside className="not-prose my-7 rounded-[18px] border border-green/30 bg-green-soft/50 p-5 md:p-6">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="rounded-full bg-green px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
          Nouveau
        </span>
        {title && (
          <span className="text-[12px] font-semibold text-green">{title}</span>
        )}
      </div>
      <div className="prose-block mt-2.5">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
      </div>
    </aside>
  );
}

/* =========================================
   Assemblage
   ========================================= */

function renderBlock(
  segment: Extract<LessonSegment, { kind: "block" }>,
  key: number,
  lessonSlug: string,
) {
  const { type, title, body } = segment;

  switch (type) {
    case "objectifs":
      return <Objectives key={key} title={title} body={body} />;
    case "flash":
      return <Flash key={key} title={title} body={body} />;
    case "etapes":
      return <Steps key={key} title={title} body={body} />;
    case "prompt":
      return <PromptCard key={key} title={title} body={body} />;
    case "avant-apres":
      return <BeforeAfter key={key} title={title} body={body} />;
    case "chiffres":
      return <Stats key={key} body={body} />;
    case "maj":
      return <Update key={key} title={title} body={body} />;
    case "cle":
      return (
        <Callout key={key} tone="coral" icon="🔑" label="À retenir" title={title}>
          <Md>{body}</Md>
        </Callout>
      );
    case "piege":
      return (
        <Callout
          key={key}
          tone="amber"
          icon="⚠️"
          label="Piège fréquent"
          title={title}
        >
          <Md>{body}</Md>
        </Callout>
      );
    case "astuce":
      return (
        <Callout key={key} tone="green" icon="💡" label="Astuce" title={title}>
          <Md>{body}</Md>
        </Callout>
      );
    case "memo":
      return (
        <Flashcards
          key={key}
          title={title ?? "Les cartes de cette leçon"}
          cards={parseFlashcards(body)}
        />
      );
    case "defi": {
      // Le texte d'intro précède la première puce ; les puces sont les critères.
      const firstBullet = body.search(/^\s*(?:[-*+]|\d+[.)])\s+/m);
      const intro = firstBullet === -1 ? body : body.slice(0, firstBullet).trim();
      const listPart = firstBullet === -1 ? "" : body.slice(firstBullet);
      const items = listPart ? parseListItems(listPart) : [];
      if (items.length === 0) {
        return (
          <Callout key={key} tone="coral" icon="🎯" label="À toi de jouer" title={title}>
            <Md>{body}</Md>
          </Callout>
        );
      }
      return (
        <Challenge
          key={key}
          storageKey={`defi:${lessonSlug}:${key}`}
          title={title ?? "À toi de jouer"}
          intro={intro ? <MdInline>{intro}</MdInline> : null}
          items={items.map((item, i) => (
            <MdInline key={i}>{item}</MdInline>
          ))}
        />
      );
    }
    default:
      return <Md key={key}>{body}</Md>;
  }
}

/**
 * Rend le contenu d'une leçon : markdown standard + blocs pédagogiques.
 * Les `##` reçoivent une ancre pour le sommaire (même algorithme que
 * `extractHeadings`, dédoublonnage compris).
 */
export function RichLesson({
  markdown,
  lessonSlug,
}: {
  markdown: string;
  lessonSlug: string;
}) {
  const segments = parseLessonContent(markdown);
  const seen = new Map<string, number>();

  function headingId(children: ReactNode): string {
    const base = slugifyHeading(nodeText(children));
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  }

  return (
    <article className="prose-lesson">
      {segments.map((segment, i) =>
        segment.kind === "block" ? (
          renderBlock(segment, i, lessonSlug)
        ) : (
          <ReactMarkdown
            key={i}
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => (
                <h2 id={headingId(children)} className="scroll-mt-24">
                  {children}
                </h2>
              ),
            }}
          >
            {segment.content}
          </ReactMarkdown>
        ),
      )}
    </article>
  );
}
