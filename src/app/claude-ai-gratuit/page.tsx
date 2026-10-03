import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { SITE_URL, ORG_ID, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo/jsonld";

// Page d'entrée. Requêtes visées : « claude ai gratuit », « claude gratuit »,
// « claude ai prix », « claude pro prix », « claude ai free ».
// Google Trends FR, 12 mois au 02/10/2026 : « claude ai gratuit » est la
// 13e requête associée à « Claude AI » (indice 50), « claude ai prix » la 17e,
// « telecharger claude ai gratuit » progresse de 1 450 %.
//
// Faits relevés sur claude.com/pricing le 3 octobre 2026. Tout ce qui est
// chiffré est daté dans le texte : un tarif change, une page datée ne
// devient pas fausse, seulement à rafraîchir.

export const metadata: Metadata = {
  title: "Claude AI gratuit ou Pro : ce que le plan gratuit permet vraiment",
  description:
    "Claude AI est gratuit, sans carte bancaire, avec les modèles Sonnet et Haiku, la recherche web, les projets et les applications. Ce que le plan gratuit permet, où il s'arrête, ce que Pro ajoute à 17 ou 20 $ par mois, et comment décider. Relevé le 3 octobre 2026.",
  alternates: { canonical: "/claude-ai-gratuit" },
  keywords: [
    "claude ai gratuit",
    "claude gratuit",
    "claude ai prix",
    "claude pro prix",
    "claude ai free",
    "claude ai abonnement",
    "claude gratuit ou payant",
  ],
  openGraph: {
    title: "Claude AI gratuit ou Pro : ce que le plan gratuit permet vraiment",
    description:
      "Ce que le plan gratuit de Claude permet, où il s'arrête, et ce que Pro ajoute. Relevé le 3 octobre 2026.",
    url: "/claude-ai-gratuit",
    type: "article",
  },
};

const gratuit = [
  "Discuter sur le web, dans l'application de bureau (Windows, macOS, Linux en bêta) et sur mobile (iOS, Android)",
  "Chercher sur le web, créer des fichiers et exécuter du code dans la conversation",
  "Une mémoire d'une conversation à l'autre",
  "Connecter vos applications et vos outils (connecteurs), et utiliser des skills",
  "Créer des artefacts : documents, pages, visuels interactifs",
  "Jusqu'à 5 projets, avec leurs documents de référence et leurs consignes",
  "Les modèles Sonnet et Haiku",
  "Le mode vocal",
];

const pro = [
  "Davantage d'usage : la limite du gratuit est la raison numéro un du passage à Pro",
  "Déléguer et planifier des tâches : Claude travaille pendant que vous faites autre chose",
  "Claude Docs, Slides et Design, dans la conversation",
  "Claude Code, l'agent de code dans le terminal",
  "Les modèles Opus et Fable, en plus de Sonnet et Haiku",
  "Claude dans Chrome et dans Microsoft 365",
];

const faq = [
  {
    q: "Claude AI est-il vraiment gratuit ?",
    a: "Oui. Le plan Free coûte 0 $, ne demande pas de carte bancaire, et donne accès aux modèles Sonnet et Haiku, à la recherche web, aux projets (cinq au maximum), aux connecteurs, aux skills et aux applications de bureau et mobiles. Ce qui est limité, c'est la quantité d'usage par période : quand vous atteignez la limite, il faut attendre qu'elle se réinitialise, ou passer à Pro. Relevé sur claude.com/pricing le 3 octobre 2026.",
  },
  {
    q: "Combien coûte Claude Pro ?",
    a: "20 $ par mois en mensuel, ou 17 $ par mois en engagement annuel, soit 200 $ payés d'avance. Les plans Max démarrent à 100 $ par mois, avec deux paliers d'usage. Pour une équipe, le siège standard est à 20 $ par mois en annuel (25 $ en mensuel), le siège premium à 100 $ en annuel (125 $ en mensuel). Prix relevés le 3 octobre 2026, affichés hors taxes en dollars.",
  },
  {
    q: "Qu'est-ce que Pro ajoute concrètement ?",
    a: "Trois choses qui changent l'usage : plus de volume, les modèles Opus et Fable (les plus capables de la gamme, pour le raisonnement long et les tâches de fond), et les outils de travail autonome, à savoir les tâches déléguées et planifiées, Claude Code dans le terminal, Claude dans Chrome et dans Microsoft 365, ainsi que Docs, Slides et Design dans la conversation.",
  },
  {
    q: "Le plan gratuit suffit-il pour apprendre à utiliser Claude ?",
    a: "Pour apprendre, oui. Les méthodes qui font la différence (donner le contexte, dire le format, découper, exiger que le modèle signale ses incertitudes, donner un exemple) s'appliquent sur Sonnet exactement comme sur Opus. Ce qui manque au gratuit, c'est le volume pour un usage professionnel quotidien, et les modèles de tête pour les dossiers longs. Notre kit gratuit de 15 prompts fonctionne intégralement sur le plan Free.",
  },
  {
    q: "Mes données du plan gratuit servent-elles à entraîner les modèles ?",
    a: "Cela dépend de vos réglages de confidentialité, que vous pouvez modifier dans les paramètres de votre compte. Quel que soit le plan, ne collez jamais de données personnelles de clients ou de documents confidentiels dans une conversation sans les anonymiser : c'est une règle de métier, pas une règle de plan.",
  },
  {
    q: "Claude Cowork est-il compris dans le gratuit ?",
    a: "Cowork n'existe plus en tant que produit séparé : depuis le 16 septembre 2026, le chat et Cowork sont un seul Claude. Le déploiement a commencé par les plans Pro et Max, et Anthropic annonce que les plans Team et Free suivront. Les fonctions de travail long (tâches déléguées, planifiées) restent réservées aux plans payants.",
  },
];

export default function ClaudeAiGratuitPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "Article"],
    "@id": `${SITE_URL}/claude-ai-gratuit#page`,
    headline: "Claude AI gratuit ou Pro : ce que le plan gratuit permet vraiment",
    description: metadata.description,
    url: `${SITE_URL}/claude-ai-gratuit`,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(articleJsonLd)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(faqJsonLd)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "FAQ", path: "/faq" },
            { name: "Claude AI gratuit ou Pro", path: "/claude-ai-gratuit" },
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
            <span>Claude AI gratuit ou Pro</span>
          </nav>

          <Eyebrow>Guide · Relevé le 3 octobre 2026</Eyebrow>

          <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.025em] text-ink">
            Claude AI est gratuit. La question, c’est{" "}
            <span className="accent-serif">jusqu’où</span>.
          </h1>

          <div className="mt-8 rounded-[18px] border-l-[3px] border-coral bg-cream-soft p-7">
            <p className="text-lg leading-relaxed text-ink">
              <strong>Réponse courte :</strong> le plan gratuit de Claude ne
              demande pas de carte bancaire et donne accès aux modèles Sonnet et
              Haiku, à la recherche web, aux projets, aux connecteurs et aux
              applications de bureau et mobiles. Ce qui est limité, c’est la{" "}
              <strong>quantité d’usage</strong> par période, et l’accès aux
              modèles de tête (Opus, Fable) et aux outils de travail autonome,
              réservés à Pro, à 17 ou 20 $ par mois.
            </p>
          </div>

          <p className="mt-8 text-lg leading-relaxed text-muted">
            Nous vendons une formation sur Claude, pas des abonnements : nous
            n’avons aucun intérêt à vous pousser vers Pro. Le gratuit suffit
            pour apprendre. Il ne suffit pas pour un usage professionnel
            quotidien, et voici pourquoi.
          </p>
        </Container>
      </section>

      <section className="border-y border-line bg-cream-soft py-16 md:py-20">
        <Container size="narrow">
          <Eyebrow>Ce que chaque plan contient</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Gratuit et Pro, tels qu’affichés par Anthropic.
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-[18px] border border-line bg-white p-7">
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
                Free · 0 $
              </span>
              <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-soft">
                {gratuit.map((g) => (
                  <li key={g} className="flex gap-2">
                    <span className="mt-[2px] text-coral">✓</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[18px] border-[1.5px] border-coral bg-white p-7">
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-coral">
                Pro · 20 $ par mois, ou 17 $ en annuel
              </span>
              <p className="mt-3 text-[14px] text-muted">
                Tout le gratuit, plus :
              </p>
              <ul className="mt-3 space-y-2.5 text-[15px] leading-relaxed text-ink-soft">
                {pro.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-[2px] text-coral">✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-8 text-[14px] leading-relaxed text-muted">
            Prix affichés en dollars, hors taxes, relevés sur claude.com/pricing
            le 3 octobre 2026. Les plans Max démarrent à 100 $ par mois.
          </p>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Comment décider</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Trois questions, et la réponse est évidente.
          </h2>

          <ol className="mt-10 space-y-8">
            <li className="flex gap-5">
              <span className="font-serif text-3xl font-medium leading-none text-coral">01</span>
              <div>
                <h3 className="font-serif text-2xl font-medium leading-snug text-ink">
                  Atteignez-vous la limite d’usage plusieurs fois par semaine ?
                </h3>
                <p className="mt-3 leading-relaxed text-muted">
                  Si oui, Pro se rembourse en une matinée de travail. Si vous
                  ne l’atteignez jamais, le gratuit vous suffit, quoi qu’on vous
                  dise.
                </p>
              </div>
            </li>
            <li className="flex gap-5">
              <span className="font-serif text-3xl font-medium leading-none text-coral">02</span>
              <div>
                <h3 className="font-serif text-2xl font-medium leading-snug text-ink">
                  Travaillez-vous sur des dossiers longs, du code, ou des tâches à déléguer ?
                </h3>
                <p className="mt-3 leading-relaxed text-muted">
                  Opus et Fable, Claude Code, les tâches planifiées et Claude
                  dans Chrome sont des outils de travail autonome. Un usage
                  ponctuel de rédaction ne les justifie pas ; un usage
                  professionnel quotidien, oui.
                </p>
              </div>
            </li>
            <li className="flex gap-5">
              <span className="font-serif text-3xl font-medium leading-none text-coral">03</span>
              <div>
                <h3 className="font-serif text-2xl font-medium leading-snug text-ink">
                  Savez-vous déjà obtenir un résultat reproductible ?
                </h3>
                <p className="mt-3 leading-relaxed text-muted">
                  Sinon, payer plus de modèle ne changera rien : un prompt vague
                  donne un résultat vague sur Opus comme sur Haiku. Apprenez
                  d’abord la méthode sur le gratuit, et montez quand la limite
                  devient le vrai obstacle.
                </p>
              </div>
            </li>
          </ol>
        </Container>
      </section>

      <section className="border-y border-line bg-cream-soft py-16 md:py-24">
        <Container size="narrow">
          <h2 className="font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            15 prompts qui tournent sur le plan gratuit.
          </h2>
          <p className="mt-5 max-w-[620px] text-lg leading-relaxed text-muted">
            Le kit de démarrage, en français, classé par métier. Sans carte
            bancaire, ni chez Anthropic, ni chez nous.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/kit?src=guide-gratuit" variant="primary" size="lg">
              Recevoir le kit gratuit
            </Button>
            <Button href="/tarifs" variant="ghost" size="lg">
              La formation complète
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Questions fréquentes</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Claude gratuit : ce qu’on nous demande.
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
            <Link href="/telecharger-claude" className="font-semibold text-coral hover:text-coral-dark">
              télécharger Claude sur PC, Mac et mobile
            </Link>{" "}
            ·{" "}
            <Link href="/claude-vs-chatgpt" className="font-semibold text-coral hover:text-coral-dark">
              Claude ou ChatGPT
            </Link>{" "}
            ·{" "}
            <Link href="/prompt-engineering" className="font-semibold text-coral hover:text-coral-dark">
              le prompt engineering
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
