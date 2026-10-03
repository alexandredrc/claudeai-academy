import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { SITE_URL, ORG_ID, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo/jsonld";

// Page d'entrée. Requête visée : « claude cowork », en progression record
// autour de « Claude AI », « Claude Code » et « n8n » (Trends FR, 12 mois au
// 02/10/2026). La réponse honnête tient en une phrase : Cowork n'existe plus
// en tant que produit séparé depuis le 16 septembre 2026. Le reste de la page
// dit ce que ces visiteurs cherchaient réellement et où c'est passé.
//
// Source : annonce « Claude Cowork and chat are now one Claude »,
// claude.com/blog/cowork-is-now-claude, 16 septembre 2026, et claude.com/pricing
// au 3 octobre 2026.

export const metadata: Metadata = {
  title: "Claude Cowork : ce que c'est devenu depuis le 16 septembre 2026",
  description:
    "Claude Cowork n'existe plus comme produit séparé : depuis le 16 septembre 2026, le chat et Cowork sont un seul Claude. Ce que Cowork faisait, où ces fonctions vivent maintenant, pour quels plans, et ce que ça change pour vous.",
  alternates: { canonical: "/claude-cowork" },
  keywords: [
    "claude cowork",
    "cowork claude",
    "claude cowork c'est quoi",
    "claude cowork gratuit",
    "cowork anthropic",
  ],
  openGraph: {
    title: "Claude Cowork : ce que c'est devenu",
    description:
      "Depuis le 16 septembre 2026, le chat et Cowork sont un seul Claude. Ce qui a changé, pour quels plans.",
    url: "/claude-cowork",
    type: "article",
  },
};

const faq = [
  {
    q: "Claude Cowork, c'est quoi ?",
    a: "Cowork était l'espace de travail de Claude pour les tâches longues et complexes : des sessions soutenues où Claude travaillait sur vos fichiers et vos applications, planifiait des tâches, et enchaînait des étapes sans que vous ayez à tout dicter. Il vivait dans l'application de bureau, à côté du chat. Depuis le 16 septembre 2026, ce n'est plus un produit séparé.",
  },
  {
    q: "Qu'est-ce qui a changé le 16 septembre 2026 ?",
    a: "Anthropic a fusionné le chat et Cowork en un seul Claude. Vous n'avez plus à choisir où une tâche appartient : Claude détermine ce dont la tâche a besoin et l'exécute. Pour les utilisateurs de Cowork, l'annonce précise que tout est resté en place : conversations, projets, artefacts, connecteurs et skills. Aucune migration à faire.",
  },
  {
    q: "Pour quels plans ?",
    a: "Le déploiement a commencé par les plans Pro et Max, sur le web, le bureau et le mobile, sur plusieurs semaines. Anthropic annonce que les plans Team et Free suivront, et que les administrateurs Enterprise sont prévenus au moins 30 jours à l'avance. Au 3 octobre 2026, la page de tarifs indique encore « en cours de déploiement vers Pro et Max, d'autres plans suivront ».",
  },
  {
    q: "Les fonctions de Cowork sont-elles gratuites maintenant ?",
    a: "Non. Le travail long (déléguer et planifier des tâches, Claude Code, Claude dans Chrome et dans Microsoft 365) reste dans les plans payants. Le plan gratuit garde le chat, la recherche web, les projets, les connecteurs, les skills et les applications. Ce qui a fusionné, c'est l'interface, pas la grille tarifaire.",
  },
  {
    q: "Et Claude Docs, Slides et Design ?",
    a: "Trois produits lancés en bêta avec la fusion : ils s'ouvrent depuis n'importe quelle conversation, avec le contexte, les skills et les connecteurs que vous avez déjà. Ils sont listés dans le plan Pro au 3 octobre 2026.",
  },
  {
    q: "Dois-je encore chercher « Cowork » dans l'application ?",
    a: "Non. Si votre application est à jour et que votre plan a reçu le déploiement, il n'y a plus d'onglet Cowork : vous demandez la tâche dans la conversation. Si vous voyez encore l'ancien Cowork, c'est que le déploiement n'a pas atteint votre compte ; il n'y a rien à installer.",
  },
];

export default function ClaudeCoworkPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "Article"],
    "@id": `${SITE_URL}/claude-cowork#page`,
    headline: "Claude Cowork : ce que c'est devenu depuis le 16 septembre 2026",
    description: metadata.description,
    url: `${SITE_URL}/claude-cowork`,
    inLanguage: "fr-FR",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": ORG_ID },
    author: {
      "@type": "Person",
      name: "Alexandre Dos Reis Caetano",
      url: `${SITE_URL}/a-propos`,
    },
    dateModified: "2026-10-03",
    about: [{ "@type": "Thing", name: "Claude (Anthropic)" }],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(articleJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqJsonLd)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "FAQ", path: "/faq" },
            { name: "Claude Cowork", path: "/claude-cowork" },
          ]),
        )}
      />

      <section className="relative overflow-hidden pt-16 pb-14 md:pt-24 md:pb-16">
        <div
          aria-hidden="true"
          className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(242,213,199,0.9), transparent 70%)",
          }}
        />
        <Container size="narrow">
          <nav className="mb-5 text-[13px] text-muted" aria-label="Fil d’Ariane">
            <Link href="/" className="transition-colors hover:text-coral">
              Accueil
            </Link>
            <span className="mx-2 text-line">/</span>
            <Link href="/faq" className="transition-colors hover:text-coral">
              FAQ
            </Link>
            <span className="mx-2 text-line">/</span>
            <span>Claude Cowork</span>
          </nav>

          <Eyebrow>Guide · Relevé le 3 octobre 2026</Eyebrow>

          <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.025em] text-ink">
            Claude Cowork n’existe plus. Ce qu’il faisait,{" "}
            <span className="accent-serif">si</span>.
          </h1>

          <div className="mt-8 rounded-[18px] border-l-[3px] border-coral bg-cream-soft p-7">
            <p className="text-lg leading-relaxed text-ink">
              <strong>Réponse courte :</strong> depuis le{" "}
              <strong>16 septembre 2026</strong>, le chat et Cowork sont un
              seul Claude. Vous ne choisissez plus où une tâche appartient :
              vous la demandez dans la conversation, et Claude détermine ce dont
              elle a besoin. Vos conversations, projets, artefacts, connecteurs
              et skills sont restés en place. Le déploiement a commencé par Pro
              et Max ; Team et Free suivent.
            </p>
          </div>

          <p className="mt-8 text-lg leading-relaxed text-muted">
            Nous avions une leçon entière sur « chat ou Cowork, lequel
            choisir ». Elle a été réécrite le 20 septembre, parce qu’enseigner
            une décision qui n’existe plus ne sert personne. Voici la version
            courte.
          </p>
        </Container>
      </section>

      <section className="border-y border-line bg-cream-soft py-16 md:py-20">
        <Container size="narrow">
          <Eyebrow>Avant, après</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Ce que Cowork faisait, et où c’est passé.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-[18px] border border-line bg-white p-7">
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
                Cowork, jusqu’au 15 septembre 2026
              </span>
              <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-soft">
                <li>Un espace séparé du chat, dans l’application de bureau</li>
                <li>Des sessions longues sur vos fichiers et vos applications</li>
                <li>Des tâches à déléguer et à planifier</li>
                <li>À vous de décider, avant de commencer, si la tâche relevait du chat ou de Cowork</li>
              </ul>
            </div>
            <div className="rounded-[18px] border-[1.5px] border-coral bg-white p-7">
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-coral">
                Claude, depuis le 16 septembre 2026
              </span>
              <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-soft">
                <li>Une seule conversation, sur le web, le bureau et le mobile</li>
                <li>Claude détermine ce dont la tâche a besoin et l’exécute</li>
                <li>Déléguer et planifier des tâches : dans la conversation, plans payants</li>
                <li>Docs, Slides et Design en bêta, depuis n’importe quelle conversation</li>
              </ul>
            </div>
          </div>
          <p className="mt-8 text-[14px] leading-relaxed text-muted">
            Source : annonce d’Anthropic du 16 septembre 2026, « Claude Cowork
            and chat are now one Claude », et page de tarifs au 3 octobre 2026.
          </p>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Ce que ça change pour vous</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            La compétence a changé de nature.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Avant, il fallait savoir <em>où</em> poser une tâche. Maintenant, il
            faut savoir la <em>formuler</em> pour qu’un agent qui va travailler
            seul pendant vingt minutes ne parte pas dans la mauvaise direction :
            le contexte, le résultat attendu, les limites à ne pas franchir, et
            ce qu’il doit vous demander plutôt que deviner. C’est exactement ce
            que le prompt engineering enseigne, et c’est devenu plus important,
            pas moins.
          </p>
          <div className="mt-10 rounded-[18px] border border-line bg-white p-8">
            <h3 className="font-serif text-xl font-medium text-ink">
              Le test en une consigne
            </h3>
            <p className="mt-3 font-mono text-[14px] leading-relaxed text-ink">
              « Prépare le compte rendu de la réunion à partir des notes dans
              le dossier Réunions/2026-10. Format : décisions, actions avec
              responsable et date, points ouverts. Ne modifie aucun fichier
              existant, crée un nouveau document. Si une action n’a pas de
              responsable identifiable, laisse la case vide et liste ces cas à
              la fin plutôt que de deviner. »
            </p>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-cream-soft py-16 md:py-24">
        <Container size="narrow">
          <h2 className="font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Quinze prompts pour un Claude qui travaille seul.
          </h2>
          <p className="mt-5 max-w-[620px] text-lg leading-relaxed text-muted">
            Le kit de démarrage, en français, classé par métier. Chaque prompt
            dit le contexte, le format et les limites : la structure qui fait
            qu’une tâche déléguée revient utilisable.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/kit?src=guide-cowork" variant="primary" size="lg">
              Recevoir le kit gratuit
            </Button>
            <Button href="/courses/bien-demarrer-avec-claude" variant="ghost" size="lg">
              Le parcours « Bien démarrer »
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Questions fréquentes</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Cowork : ce qu’on nous demande.
          </h2>
          <dl className="mt-10 divide-y divide-line border-y border-line">
            {faq.map((item) => (
              <div key={item.q} className="py-7">
                <dt className="font-serif text-xl font-medium leading-snug text-ink">
                  {item.q}
                </dt>
                <dd className="mt-3 leading-relaxed text-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-[15px] text-muted">
            À lire ensuite :{" "}
            <Link href="/claude-ai-gratuit" className="font-semibold text-coral hover:text-coral-dark">
              Claude gratuit ou Pro
            </Link>{" "}
            ·{" "}
            <Link href="/prompt-engineering" className="font-semibold text-coral hover:text-coral-dark">
              le prompt engineering
            </Link>{" "}
            ·{" "}
            <Link href="/claude-code-skills" className="font-semibold text-coral hover:text-coral-dark">
              les skills de Claude Code
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
