import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { userHasTier } from "@/lib/courses/access";
import { CopyButton } from "@/components/site/copy-button";
import {
  PROMPT_CATEGORIES,
  PROMPT_COUNT,
  FREE_PROMPTS,
  promptsByCategory,
  type Prompt,
} from "@/lib/prompts/library";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bibliothèque de prompts — ClaudeAI Academy",
  description: `${PROMPT_COUNT} prompts opérationnels, prêts à copier-coller, classés par domaine : prompt engineering, Claude Code, business, marketing, data, trading, sécurité, design.`,
};

export default async function PromptsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const unlocked = await userHasTier(supabase, "mastery");

  return (
    <section className="bg-cream-soft">
      <div className="mx-auto max-w-[1100px] px-6 py-16 md:py-24">
        <span className="mb-5 inline-block text-[13px] font-semibold uppercase tracking-[0.12em] text-coral">
          Bibliothèque
        </span>
        <h1 className="font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
          {PROMPT_COUNT}{" "}
          <span className="font-serif font-medium italic text-coral">
            prompts
          </span>{" "}
          prêts à l&apos;emploi.
        </h1>
        <p className="mt-6 max-w-[660px] text-lg leading-relaxed text-muted">
          Classés par domaine, testés, avec leurs variables à remplir. Copiez,
          adaptez, gagnez du temps.{" "}
          {unlocked
            ? "Vous avez accès à l'intégralité."
            : `${FREE_PROMPTS.length} sont en accès libre — le reste est inclus dans le Pass Mastery.`}
        </p>

        {/* Navigation par catégorie */}
        <nav className="mt-8 flex flex-wrap gap-2" aria-label="Catégories de prompts">
          {PROMPT_CATEGORIES.map((c) => {
            const n = promptsByCategory(c.key).length;
            if (n === 0) return null;
            return (
              <a
                key={c.key}
                href={`#${c.key}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-medium text-ink-soft transition-colors hover:border-coral hover:text-coral"
              >
                <span aria-hidden="true">{c.emoji}</span>
                {c.label}
                <span className="text-muted">· {n}</span>
              </a>
            );
          })}
        </nav>

        {/* Sections par catégorie */}
        <div className="mt-14 space-y-16">
          {PROMPT_CATEGORIES.map((c) => {
            const prompts = promptsByCategory(c.key);
            if (prompts.length === 0) return null;
            return (
              <div key={c.key} id={c.key} className="scroll-mt-24">
                <h2 className="font-serif text-2xl font-semibold text-ink md:text-3xl">
                  <span aria-hidden="true" className="mr-2">
                    {c.emoji}
                  </span>
                  {c.label}
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {prompts.map((p) => (
                    <PromptCard
                      key={p.slug}
                      prompt={p}
                      unlocked={unlocked || p.tier === "free"}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {!unlocked && (
          <div className="mt-16 rounded-[22px] border border-coral-soft bg-coral-soft/30 p-6 text-center md:p-8">
            <h2 className="font-serif text-2xl font-semibold text-ink">
              Débloquez les {PROMPT_COUNT} prompts
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              La bibliothèque complète est incluse dans le Pass Mastery, avec les
              parcours, le mentor IA et les mises à jour à vie.
            </p>
            <Link
              href="/tarifs"
              className="mt-6 inline-block rounded-[14px] bg-coral px-6 py-3 text-sm font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-coral-dark"
            >
              {user ? "Voir le Pass Mastery" : "Voir les tarifs"}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function PromptCard({ prompt, unlocked }: { prompt: Prompt; unlocked: boolean }) {
  return (
    <article className="flex flex-col rounded-[18px] border border-line bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[16px] font-semibold leading-snug text-ink">
          {prompt.title}
        </h3>
        {prompt.tier === "free" && (
          <span className="shrink-0 rounded-full bg-green-soft px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-green">
            Gratuit
          </span>
        )}
      </div>
      <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
        {prompt.useCase}
      </p>

      {unlocked ? (
        <>
          <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap rounded-[12px] bg-cream-soft p-4 font-mono text-[13px] leading-relaxed text-ink-soft">
            {prompt.prompt}
          </pre>
          <div className="mt-3">
            <CopyButton text={prompt.prompt} label="Copier le prompt" />
          </div>
        </>
      ) : (
        <div className="relative mt-4">
          {/* Aperçu flouté factice — le vrai contenu n'est PAS envoyé au client */}
          <div aria-hidden="true" className="select-none space-y-2 rounded-[12px] bg-cream-soft p-4 blur-[5px]">
            <div className="h-2.5 w-[85%] rounded bg-cream-dark" />
            <div className="h-2.5 w-[70%] rounded bg-cream-dark" />
            <div className="h-2.5 w-[90%] rounded bg-cream-dark" />
            <div className="h-2.5 w-[55%] rounded bg-cream-dark" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Link
              href="/tarifs"
              className="inline-flex items-center gap-1.5 rounded-[12px] bg-ink/90 px-4 py-2 text-[13px] font-semibold text-cream backdrop-blur transition-colors hover:bg-ink"
            >
              🔒 Débloquer avec Mastery
            </Link>
          </div>
        </div>
      )}
    </article>
  );
}
