import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";

export function Hero() {
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
            <Eyebrow>5 parcours · 27 leçons · Accès à vie</Eyebrow>

            <h1 className="mt-5 font-serif text-[clamp(2.5rem,5.5vw,4.25rem)] font-medium leading-[1.05] tracking-[-0.025em] text-ink">
              Devenez opérationnel
              <br />
              sur <span className="accent-serif">Claude</span>, vraiment.
            </h1>

            <p className="mt-7 text-lg leading-relaxed text-muted max-w-[540px]">
              La méthode complète pour utiliser l&apos;IA générative comme un pro.
              Prompt engineering, Claude Code, business, marketing, data : un
              programme structuré pour passer de &laquo; je teste &raquo; à
              &laquo; je livre des résultats &raquo;.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/tarifs" variant="primary" size="lg">
                Voir les tarifs
              </Button>
              <Button href="#programme" variant="ghost" size="lg">
                Découvrir le programme
              </Button>
            </div>

            <dl className="mt-14 pt-8 border-t border-line flex flex-wrap gap-x-12 gap-y-5">
              <TrustItem value="5" label="Parcours métiers" />
              <TrustItem value="27" label="Leçons structurées" />
              <TrustItem value="120+" label="Prompts opérationnels" />
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
