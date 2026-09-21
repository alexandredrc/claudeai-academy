import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { getCatalogStats } from "@/lib/courses/stats";
import { PROMPT_COUNT } from "@/lib/prompts/library";

export async function Hero() {
  const stats = await getCatalogStats();
  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
      {/* Halo coral en arrière-plan */}
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(242,213,199,0.9), transparent 70%)",
        }}
      />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center relative">
          <div>
            {/* L'accroche nomme la douleur AVANT de nommer le produit : la
                très grande majorité des visiteurs a déjà essayé une IA et en
                est repartie déçue. Leur dire que l'échec ne venait pas d'eux
                lève la honte, qui est le vrai frein à l'achat d'une formation. */}
            <Eyebrow>Vous avez essayé l&apos;IA. Elle vous a répondu à côté.</Eyebrow>

            <h1 className="mt-5 font-serif text-[clamp(2.5rem,5.5vw,4.25rem)] font-medium leading-[1.05] tracking-[-0.025em] text-ink">
              La formation <span className="accent-serif">Claude AI</span>
              <br />
              qui vous apprend quoi lui demander.
            </h1>

            <p className="mt-7 text-lg leading-relaxed text-muted max-w-[540px]">
              Ce n&apos;est pas l&apos;outil qui était mauvais : c&apos;est la
              question. {stats.courseCount} parcours et {stats.lessonCount} leçons
              en français, {PROMPT_COUNT} prompts prêts à copier, et un mentor IA
              qui corrige les vôtres pendant que vous apprenez.
              <strong className="text-ink-soft"> Sans une ligne de code, sans jargon,
              à votre rythme.</strong>
            </p>

            <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
              <Button href="/tarifs" variant="primary" size="lg">
                Commencer — à partir de 47 €
              </Button>
              <a
                href="#programme"
                className="text-[15px] text-muted underline underline-offset-4 decoration-line hover:text-coral transition-colors"
              >
                Voir les {stats.lessonCount} leçons
              </a>
            </div>

            {/* Objection nº1 du marché français de la formation : « il faut
                monter un dossier ». La lever ici, et pas seulement sur /tarifs. */}
            <p className="mt-4 text-[14px] text-muted">
              Sans dossier CPF ni devis à attendre : vous commencez dans les
              5&nbsp;minutes.
            </p>

            <dl className="mt-14 pt-8 border-t border-line flex flex-wrap gap-x-12 gap-y-5">
              <TrustItem value={String(stats.lessonCount)} label="Leçons, en français" />
              <TrustItem value={String(PROMPT_COUNT)} label="Prompts prêts à copier" />
              <TrustItem value="14 j" label="Satisfait ou remboursé" />
            </dl>
          </div>

          <div className="relative h-[440px] hidden lg:block">
            {/* Orbes coral en blur */}
            <div
              aria-hidden="true"
              className="absolute top-[10%] right-[8%] w-[280px] h-[280px] rounded-full opacity-30 blur-[40px] bg-coral"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-[6%] left-[4%] w-[220px] h-[220px] rounded-full opacity-25 blur-[40px] bg-[#E8A87C]"
            />

            {/* Card chat flottante */}
            <div
              className="relative bg-white border border-line rounded-[22px] overflow-hidden shadow-[0_4px_8px_rgba(31,31,30,0.05),0_24px_48px_rgba(31,31,30,0.10)] mt-16"
              style={{ animation: "float 6s ease-in-out infinite" }}
            >
              <div className="flex items-center gap-2 px-5 py-3.5 bg-cream-soft border-b border-line">
                <span className="w-[10px] h-[10px] rounded-full bg-[#E76F51]" />
                <span className="w-[10px] h-[10px] rounded-full bg-[#F4A261]" />
                <span className="w-[10px] h-[10px] rounded-full bg-green" />
                <span className="ml-auto text-[12px] text-muted font-mono">
                  claudeai-academy.com
                </span>
              </div>
              <div className="p-7 space-y-3">
                <p className="px-4 py-3 rounded-[10px] bg-cream font-mono text-[14px] text-ink-soft leading-relaxed">
                  &gt; Comment industrialiser nos prompts en équipe ?
                </p>
                <div className="px-4 py-3 rounded-[10px] bg-coral-soft text-ink leading-relaxed text-[15px]">
                  <span className="inline-block font-bold text-coral-dark text-[13px] mr-1.5">
                    Claude
                  </span>
                  Bonne question. La leçon 4 du parcours Prompt Engineering
                  couvre exactement ça : versioning, bibliothèque partagée,
                  tests de régression. Je te résume ?
                </div>
                <div
                  className="w-2 h-4 bg-coral rounded-sm mt-2"
                  style={{ animation: "pulse-soft 1.4s ease-in-out infinite" }}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function TrustItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <dt className="font-serif text-3xl font-semibold text-ink leading-none">{value}</dt>
      <dd className="mt-1.5 text-[13px] text-muted">{label}</dd>
    </div>
  );
}
