import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { PROMPT_COUNT } from "@/lib/prompts/library";

const items = [
  "Une méthodologie claire pour structurer vos prompts",
  "Des dizaines d'exemples concrets et de cas d'usage",
  `Une bibliothèque de ${PROMPT_COUNT} prompts opérationnels`,
  "Un mentor IA Claude pour vos questions, 24/7",
  "Des mises à jour à chaque évolution majeure",
];

const LESSON_HREF =
  "/courses/prompt-engineering-pro/intro-pourquoi-le-prompt-est-de-l-ingenierie";

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
              Les trois premières leçons prennent une heure. Le reste se suit à
              votre rythme, parcours par parcours : court, pratique, sans
              théorie pour la théorie.
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

          {/* Vraie leçon en aperçu gratuit (capture : scripts/render-lecon-landing.mjs).
              Remplace l'ancienne maquette sans contenu, lue comme une fenêtre vide. */}
          <div className="hidden lg:block" style={{ perspective: "1200px" }}>
            <Link
              href={LESSON_HREF}
              aria-label="Ouvrir la leçon gratuite : Pourquoi le prompt est de l'ingénierie, pas de l'art"
              className="block bg-white border border-line rounded-[22px] overflow-hidden shadow-[0_4px_8px_rgba(31,31,30,0.05),0_24px_48px_rgba(31,31,30,0.10)] transition-transform duration-500 hover:[transform:rotateY(0)_rotateX(0)]"
              style={{ transform: "rotateY(-6deg) rotateX(4deg)" }}
            >
              <div className="flex items-center gap-2 px-5 py-3.5 bg-cream border-b border-line">
                <span className="w-[11px] h-[11px] rounded-full bg-[#E76F51]" />
                <span className="w-[11px] h-[11px] rounded-full bg-[#F4A261]" />
                <span className="w-[11px] h-[11px] rounded-full bg-green" />
                <span className="ml-auto text-[12px] text-muted font-mono">
                  claudeai-academy.com/courses
                </span>
              </div>
              <Image
                src="/landing/lecon-apercu.png"
                alt="Leçon 1 sur 7 du parcours Prompt Engineering pro : titre, durée, quiz et objectifs de la leçon"
                width={1280}
                height={1551}
                sizes="540px"
                className="block w-full h-auto"
              />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
