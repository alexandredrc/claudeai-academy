import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";

export const metadata: Metadata = {
  title: "À propos — ClaudeAI Academy",
  description:
    "Pourquoi ClaudeAI Academy existe : une référence francophone rigoureuse et opérationnelle pour maîtriser Claude, portée par Alexandre Dos Reis Caetano (ADRC Group).",
};

export default function AProposPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-12 md:pt-24 md:pb-16">
        <div
          aria-hidden="true"
          className="absolute -top-32 -right-32 h-[460px] w-[460px] rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(242,213,199,0.9), transparent 70%)",
          }}
        />
        <Container size="narrow">
          <nav className="text-[13px] text-muted mb-5" aria-label="Fil d’Ariane">
            <a href="/" className="hover:text-coral transition-colors">
              Accueil
            </a>
            <span aria-hidden="true" className="mx-2 opacity-50">
              /
            </span>
            <span className="text-ink-soft">À propos</span>
          </nav>

          <Eyebrow>À l’origine du projet</Eyebrow>
          <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.05] tracking-tight text-ink">
            Une référence francophone, <span className="accent-serif">pas un tuto de plus</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted max-w-[640px]">
            ClaudeAI Academy est née d’un constat simple : la plupart des
            contenus sur Claude sont superficiels, en anglais, ou produits par
            des gens qui ne l’utilisent pas vraiment au quotidien.
          </p>
        </Container>
      </section>

      <section className="bg-white py-16 md:py-20">
        <Container size="narrow">
          <div className="prose-lesson mx-auto">
            <h2>Le constat de départ</h2>
            <p>
              L’IA générative est passée en deux ans du gadget à l’outil de
              travail. Mais entre les démonstrations virales et la réalité d’un
              usage professionnel fiable, il y a un fossé. La majorité des gens
              «&nbsp;testent&nbsp;» Claude sans jamais en tirer un vrai gain de
              productivité, faute de méthode.
            </p>

            <h2>Notre parti pris</h2>
            <p>
              Un programme structuré, pas une succession de tutos isolés. De la
              densité plutôt que du remplissage&nbsp;: chaque leçon vise un
              résultat concret et actionnable, avec des prompts et des templates
              prêts à l’emploi. Et une exigence d’actualité&nbsp;: l’écosystème
              Claude évolue vite, le contenu suit.
            </p>
            <p>
              Tout est pensé pour un public francophone — particuliers,
              indépendants, équipes — qui veut passer de «&nbsp;je teste&nbsp;» à
              «&nbsp;je livre des résultats&nbsp;».
            </p>

            <h2>Qui porte le projet</h2>
            <p>
              ClaudeAI Academy est portée par{" "}
              <strong>Alexandre Dos Reis Caetano</strong>, fondateur d’ADRC
              Group. L’objectif&nbsp;: bâtir la ressource qui manquait — rigoureuse,
              opérationnelle, et honnête sur ce que l’IA permet (et ne permet
              pas).
            </p>

            <h2>Notre engagement contenu</h2>
            <p>
              Fiable, vérifié, à jour. Les sources sont tracées, les exemples
              sont réels, et les mises à jour sont incluses à vie dans le Pass
              Mastery. Si une leçon ne vous apporte pas une vraie valeur, elle
              n’a rien à faire dans le programme.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Button href="/tarifs" variant="primary">
              Découvrir les parcours
            </Button>
            <Button href="/contact" variant="ghost">
              Nous contacter
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
