import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/page-metadata";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { INSTAGRAM_URL } from "@/components/site/instagram";

export const metadata: Metadata = pageMetadata({
  path: "/a-propos",
  title: "À propos | ClaudeAI Academy",
  description:
    "Pourquoi ClaudeAI Academy existe : une référence francophone et opérationnelle pour maîtriser Claude, portée par un fondateur qui l'utilise chaque jour.",
});

// Compte Instagram de marque. Le compte personnel vient de `instagram.tsx` ;
// la même constante existe dans `src/app/layout.tsx` (un layout ne peut pas
// exporter autre chose que ses champs Next).
const INSTAGRAM_ACADEMY_URL = "https://www.instagram.com/official_claude_ai_academy/";

// Page auteur (E-E-A-T) : `ProfilePage` dont l'entité principale est le
// fondateur. Le même `@id` est utilisé par `founder` dans l'Organization du
// layout, pour que les moteurs relient les deux blocs à une seule personne.
// La fonction reprend celle affichée dans la page ; aucun parcours chiffré ni
// profil LinkedIn (aucune URL connue), rien n'est inventé.
const profilePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": "https://www.claudeai-academy.com/a-propos#profilepage",
  url: "https://www.claudeai-academy.com/a-propos",
  name: "À propos de ClaudeAI Academy",
  inLanguage: "fr-FR",
  dateModified: "2026-10-15",
  isPartOf: { "@id": "https://www.claudeai-academy.com/#website" },
  about: { "@id": "https://www.claudeai-academy.com/#organization" },
  mainEntity: {
    "@type": "Person",
    "@id": "https://www.claudeai-academy.com/a-propos#alexandre-dos-reis-caetano",
    name: "Alexandre Dos Reis Caetano",
    jobTitle: ["Restaurant Manager en Suisse", "Fondateur de ClaudeAI Academy"],
    description:
      "Restaurant Manager en Suisse, fondateur d'ADRC Group et de ClaudeAI Academy. Utilise Claude au quotidien dans un métier de terrain.",
    url: "https://www.claudeai-academy.com/a-propos",
    image: "https://www.claudeai-academy.com/alexandre.jpg",
    sameAs: [INSTAGRAM_URL, INSTAGRAM_ACADEMY_URL],
    affiliation: { "@id": "https://www.claudeai-academy.com/#organization" },
  },
};

export default function AProposPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }}
      />

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
            <Link href="/" className="hover:text-coral transition-colors">
              Accueil
            </Link>
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
              Tout est pensé pour un public francophone (particuliers,
              indépendants, équipes) qui veut passer de «&nbsp;je teste&nbsp;» à
              «&nbsp;je livre des résultats&nbsp;».
            </p>

            <h2>Qui porte le projet</h2>

            {/* Photo réelle du fondateur (public/alexandre.jpg, 800 × 800, la
                même que sur l'accueil). Une page auteur sans visage reste une
                entité anonyme pour un visiteur comme pour un moteur. */}
            <div className="not-prose flex items-center gap-5">
              <Image
                src="/alexandre.jpg"
                alt="Portrait d'Alexandre Dos Reis Caetano, fondateur de ClaudeAI Academy"
                width={400}
                height={400}
                sizes="(min-width: 768px) 136px, 112px"
                className="h-[112px] w-[112px] shrink-0 rounded-[18px] object-cover shadow-[0_10px_28px_rgba(31,31,30,0.18)] md:h-[136px] md:w-[136px]"
              />
              <div>
                <p className="font-serif text-xl font-medium leading-tight text-ink">
                  Alexandre Dos Reis Caetano
                </p>
                <p className="mt-1 text-[15px] text-muted">
                  Fondateur de ClaudeAI Academy
                </p>
              </div>
            </div>

            <p>
              ClaudeAI Academy est portée par{" "}
              <strong>Alexandre Dos Reis Caetano</strong>,{" "}
              <strong>Restaurant Manager en Suisse</strong> et fondateur d’ADRC
              Group. Pas un profil tech&nbsp;: un métier de terrain, où l’IA se
              juge à ce qu’elle fait gagner dans la journée.
            </p>
            <p>
              Cette pratique quotidienne l’a conduit à développer plusieurs
              applications, dont un outil de pilotage destiné aux hôtels et aux
              restaurants, pour aider les directeurs et les patrons
              d’établissement à mieux gérer leur affaire. ClaudeAI Academy est
              née du même mouvement&nbsp;: bâtir la ressource qui manquait,
              rigoureuse, opérationnelle, et honnête sur ce que l’IA permet (et
              ne permet pas).
            </p>
            <p>
              ClaudeAI Academy est un organisme de formation indépendant, non
              affilié à Anthropic, l’entreprise qui édite Claude.
            </p>

            <h2>Notre engagement contenu</h2>
            <p>
              Fiable, vérifié, à jour. Les sources sont tracées, les exemples
              sont réels, et les mises à jour sont incluses à vie, quel que soit
              le pass. Si une leçon ne vous apporte pas une vraie valeur, elle
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
