import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import {
  PROMPT_CATEGORIES,
  PROMPT_COUNT,
  FREE_PROMPTS,
  categoryLabel,
} from "@/lib/prompts/library";

// Un échantillon : le 1er prompt gratuit de 6 domaines différents, pour
// donner un aperçu concret du contenu (et donner envie d'aller voir le reste).
function sample() {
  const out = [];
  for (const c of PROMPT_CATEGORIES.slice(0, 6)) {
    const p = FREE_PROMPTS.find((x) => x.category === c.key);
    if (p) out.push({ ...p, emoji: c.emoji });
  }
  return out;
}

export function PromptTeaser() {
  const samples = sample();
  if (samples.length === 0) return null;

  return (
    <section className="bg-white py-24 md:py-32">
      <Container>
        <div className="text-center mb-14">
          <Eyebrow align="center">La bibliothèque incluse</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium leading-[1.15] tracking-tight text-ink">
            {PROMPT_COUNT} prompts <span className="accent-serif">prêts à l&apos;emploi</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted max-w-[640px] mx-auto">
            Pas des slogans : de vrais prompts testés, avec leurs variables à
            remplir, classés par métier. Voici un avant-goût (ceux-ci sont
            gratuits).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {samples.map((p) => (
            <article
              key={p.slug}
              className="flex flex-col rounded-[18px] border border-line bg-cream-soft p-6"
            >
              <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-coral">
                {p.emoji} {categoryLabel(p.category)}
              </span>
              <h3 className="mt-3 text-[16px] font-semibold leading-snug text-ink">
                {p.title}
              </h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
                {p.useCase}
              </p>
              <p className="mt-4 line-clamp-4 rounded-[10px] bg-white p-3 font-mono text-[12.5px] leading-relaxed text-ink-soft">
                {p.prompt.slice(0, 160).trim()}…
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button href="/prompts" variant="primary" size="lg">
            Explorer les {PROMPT_COUNT} prompts
          </Button>
          <p className="mt-3 text-[13px] text-muted">
            Bibliothèque complète incluse dans le Pass Mastery.
          </p>
        </div>
      </Container>
    </section>
  );
}
