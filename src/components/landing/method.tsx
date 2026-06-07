import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";

const items = [
  "Une méthodologie claire pour structurer vos prompts",
  "Des dizaines d'exemples concrets et de cas d'usage",
  "Une bibliothèque de 120+ prompts opérationnels",
  "Un mentor IA Claude pour vos questions, 24/7",
  "Des mises à jour à chaque évolution majeure",
];

export function Method() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <div>
            <Eyebrow>La méthode ClaudeAI Academy</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium leading-[1.15] tracking-tight text-ink">
              Une <span className="accent-serif">progression structurée</span>,
              pas une accumulation de vidéos.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted max-w-[540px]">
              L&apos;académie est conçue pour vous faire passer du tâtonnement à
              la maîtrise en quelques semaines. Chaque parcours est dense, court,
              100 % orienté pratique. Pas de théorie pour la théorie.
            </p>

            <ul className="mt-8 space-y-4">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[5px] inline-flex w-5 h-5 shrink-0 rounded-full bg-coral text-cream items-center justify-center text-[11px] font-bold"
                  >
                    ✓
                  </span>
                  <span className="text-ink-soft leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <Button href="#programme" variant="primary">
                Voir le programme détaillé
              </Button>
            </div>
          </div>

          {/* Mockup window — perspective subtle */}
          <div className="hidden lg:block" style={{ perspective: "1200px" }}>
            <div
              className="bg-white border border-line rounded-[22px] overflow-hidden shadow-[0_4px_8px_rgba(31,31,30,0.05),0_24px_48px_rgba(31,31,30,0.10)] transition-transform duration-500 hover:[transform:rotateY(0)_rotateX(0)]"
              style={{ transform: "rotateY(-6deg) rotateX(4deg)" }}
            >
              <div className="flex items-center gap-2 px-5 py-3.5 bg-cream border-b border-line">
                <span className="w-[11px] h-[11px] rounded-full bg-[#E76F51]" />
                <span className="w-[11px] h-[11px] rounded-full bg-[#F4A261]" />
                <span className="w-[11px] h-[11px] rounded-full bg-green" />
              </div>
              <div className="grid grid-cols-[80px_1fr] min-h-[340px]">
                <div className="bg-cream p-4 border-r border-line space-y-2">
                  <div className="h-9 rounded-md bg-coral" />
                  <div className="h-9 rounded-md bg-cream-dark" />
                  <div className="h-9 rounded-md bg-cream-dark" />
                  <div className="h-9 rounded-md bg-cream-dark" />
                </div>
                <div className="p-6 space-y-3.5">
                  <div className="h-2.5 rounded bg-cream-dark w-[90%]" />
                  <div className="h-2.5 rounded bg-cream-dark w-[70%]" />
                  <div className="h-2.5 rounded bg-coral-soft w-[50%]" />
                  <div className="my-5 h-20 rounded-[10px] bg-gradient-to-br from-coral-soft to-cream-dark" />
                  <div className="h-2.5 rounded bg-cream-dark w-[70%]" />
                  <div className="h-2.5 rounded bg-cream-dark w-[90%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
