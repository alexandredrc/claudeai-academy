import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { Guarantee } from "@/components/landing/guarantee";
import { getCatalogStats } from "@/lib/courses/stats";
import { PROMPT_COUNT } from "@/lib/prompts/library";
import { SITE_URL, ORG_ID, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo/jsonld";

// Page pilier organique sur la requête de tête « formation intelligence
// artificielle » et sa famille (« formation IA », « se former à l'IA »,
// « formation IA en ligne », « formation IA obligatoire »).
//
// Raison d'être : jusqu'ici tout le site visait « formation Claude AI », une
// requête à très faible volume en France. Cette page ouvre la porte large —
// la spécialisation Claude reste le différenciant, pas le mot d'entrée.
// Elle est indexable et distincte de /formation-claude-ai, qui est la landing
// publicitaire en noindex.

export const metadata: Metadata = {
  title:
    "Formation intelligence artificielle en ligne, en français — dès 47 € | ClaudeAI Academy",
  description:
    "Formation à l'intelligence artificielle générative en ligne, en français, à votre rythme : prompt engineering, IA au travail, automatisation, données. Sans CPF ni dossier, accès à vie, garantie 14 jours. Dès 47 €.",
  alternates: { canonical: "/formation-intelligence-artificielle" },
  keywords: [
    "formation intelligence artificielle",
    "formation IA",
    "formation IA en ligne",
    "se former à l'intelligence artificielle",
    "formation IA générative",
    "formation IA entreprise",
    "formation IA obligatoire AI Act",
    "apprendre l'intelligence artificielle",
    "formation prompt engineering",
  ],
  openGraph: {
    title: "Formation intelligence artificielle en ligne, en français",
    description:
      "Se former à l'IA générative en pratique : prompt engineering, IA au travail, automatisation, données. À votre rythme, dès 47 €.",
    url: "/formation-intelligence-artificielle",
    type: "article",
  },
};

const faq = [
  {
    q: "Quelle formation en intelligence artificielle choisir en 2026 ?",
    a: "Cela dépend de ce que vous voulez pouvoir faire lundi matin. Pour utiliser l'IA générative dans votre métier — rédiger, analyser, coder, décider — une formation courte et pratique en ligne suffit, et coûte entre 40 € et 600 €. Pour concevoir des modèles d'IA, il faut un cursus long en machine learning, généralement diplômant, et le budget se compte en milliers d'euros. La confusion entre ces deux besoins est la première cause d'abandon : 90 % des professionnels cherchent le premier et s'inscrivent au second.",
  },
  {
    q: "La formation à l'IA est-elle obligatoire en entreprise ?",
    a: "Oui, en partie. L'article 4 du règlement européen sur l'IA (AI Act) est applicable depuis le 2 février 2025 et impose à tout « déployeur » d'un système d'IA de garantir un niveau suffisant de maîtrise de l'IA chez les personnes qui l'utilisent. Il n'y a ni seuil d'effectif ni seuil de chiffre d'affaires : une TPE dont un salarié utilise ChatGPT est concernée. Aucune certification n'est exigée — la Commission européenne accepte un simple registre des actions de formation et de sensibilisation.",
  },
  {
    q: "Faut-il savoir coder pour se former à l'intelligence artificielle ?",
    a: "Non, pas pour l'IA générative. Écrire un prompt, c'est écrire en français. Nos parcours de démarrage, de rédaction, de marketing et de stratégie ne demandent aucune ligne de code. Seuls les parcours Claude Code, data/SQL et trading supposent une culture technique, et ils sont signalés comme tels.",
  },
  {
    q: "Cette formation IA est-elle éligible au CPF ?",
    a: "Non. ClaudeAI Academy n'est pas un organisme certifié Qualiopi et la formation n'est pas éligible au CPF, ni à un financement OPCO. C'est un choix assumé : pas de dossier, pas de délai d'instruction, pas de session à date fixe. Vous payez une fois, vous commencez dans la minute, et vous gardez l'accès à vie. Si le financement CPF est indispensable pour vous, il vaut mieux vous orienter vers un organisme certifié.",
  },
  {
    q: "Combien de temps faut-il pour se former à l'IA générative ?",
    a: "Comptez 4 à 6 heures pour être autonome sur les usages courants — rédaction, synthèse, analyse de documents — et une vingtaine d'heures pour couvrir un programme complet incluant prompt engineering avancé, automatisation et données. Nos leçons durent 10 à 20 minutes et se suivent dans l'ordre ou à la carte, sans horaire imposé.",
  },
  {
    q: "Pourquoi une formation IA centrée sur Claude plutôt que sur ChatGPT ?",
    a: "Parce que les compétences se transfèrent, pas les boutons. La structure d'un prompt, la gestion du contexte, la vérification des réponses et l'automatisation fonctionnent de la même façon sur Claude, ChatGPT ou Gemini. Nous entraînons sur Claude parce qu'il est le plus exigeant sur la rigueur des consignes — ce qui marche sur Claude marche partout ailleurs. Chaque leçon signale les différences quand elles existent.",
  },
  {
    q: "Quelle différence entre IA générative et machine learning ?",
    a: "Le machine learning est la discipline qui consiste à entraîner des modèles à partir de données ; c'est un métier d'ingénieur. L'IA générative désigne l'usage de modèles déjà entraînés — Claude, ChatGPT, Gemini — pour produire du texte, du code ou des analyses. Se former à l'IA générative, c'est apprendre à piloter un outil ; se former au machine learning, c'est apprendre à en construire un.",
  },
];

const typologie = [
  {
    type: "IA générative appliquée au métier",
    pour: "Tout professionnel : rédaction, analyse, support, gestion, marketing.",
    duree: "5 à 25 h",
    budget: "40 € à 600 €",
    nous: true,
  },
  {
    type: "Prompt engineering et automatisation",
    pour: "Ceux qui veulent des résultats reproductibles, pas des coups de chance.",
    duree: "10 à 30 h",
    budget: "100 € à 900 €",
    nous: true,
  },
  {
    type: "Développement assisté par IA",
    pour: "Développeurs, data analysts, profils techniques.",
    duree: "15 à 40 h",
    budget: "200 € à 1 500 €",
    nous: true,
  },
  {
    type: "Machine learning et data science",
    pour: "Futurs ingénieurs IA, construction de modèles.",
    duree: "300 h à 2 ans",
    budget: "3 000 € à 15 000 €",
    nous: false,
  },
];

const criteres = [
  {
    titre: "Elle date de moins de six mois",
    texte:
      "Les modèles changent tous les trimestres. Une formation IA enregistrée en 2024 enseigne des limites qui n'existent plus et ignore des capacités devenues centrales. Demandez la date de dernière révision du contenu — pas la date de mise en ligne.",
  },
  {
    titre: "Elle vous fait produire, pas regarder",
    texte:
      "Regarder quelqu'un utiliser l'IA ne transmet rien. La compétence se forme en écrivant vos propres consignes sur vos propres dossiers, et en constatant ce qui casse.",
  },
  {
    titre: "Elle traite la vérification, pas seulement la production",
    texte:
      "Un modèle qui se trompe avec assurance coûte plus cher qu'un modèle lent. Toute formation sérieuse consacre une part significative à repérer et corriger les réponses fausses.",
  },
  {
    titre: "Elle vous laisse quelque chose de réutilisable",
    texte:
      "À la fin, vous devez repartir avec des modèles de prompts adaptés à votre métier, pas avec des notes. C'est la différence entre une formation et une conférence.",
  },
  {
    titre: "Elle dit ce qu'elle ne couvre pas",
    texte:
      "Une formation qui promet de couvrir « toute l'IA » en trois heures ne couvre rien. Le périmètre annoncé est le premier indicateur de sérieux.",
  },
];

export default async function FormationIAPage() {
  const stats = await getCatalogStats();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "Article"],
    "@id": `${SITE_URL}/formation-intelligence-artificielle#page`,
    headline:
      "Formation intelligence artificielle en ligne, en français : comment se former à l'IA générative en 2026",
    description: metadata.description,
    url: `${SITE_URL}/formation-intelligence-artificielle`,
    inLanguage: "fr-FR",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": ORG_ID },
    author: {
      "@type": "Person",
      name: "Alexandre Dos Reis Caetano",
      url: `${SITE_URL}/a-propos`,
    },
    dateModified: new Date().toISOString().slice(0, 10),
    about: [
      { "@type": "Thing", name: "Intelligence artificielle générative" },
      { "@type": "Thing", name: "Formation professionnelle" },
      { "@type": "Thing", name: "Prompt engineering" },
    ],
    // Sources primaires citées dans le corps de page. Les moteurs génératifs
    // s'appuient dessus pour décider s'ils peuvent nous citer comme source.
    citation: [
      {
        "@type": "CreativeWork",
        name: "Les technologies de l'information et de la communication dans les entreprises en 2025, Insee Première n° 2120",
        url: "https://www.insee.fr/fr/statistiques/9025878",
      },
      {
        "@type": "CreativeWork",
        name: "Règlement (UE) 2024/1689 sur l'intelligence artificielle, article 4 — Maîtrise de l'IA",
        url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=OJ:L_202401689",
      },
    ],
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
            {
              name: "Formation intelligence artificielle",
              path: "/formation-intelligence-artificielle",
            },
          ]),
        )}
      />

      {/* ---------------------------------------------------------------- */}
      {/* Hero — réponse directe en tête, comme attendu par les moteurs     */}
      {/* génératifs : la première phrase doit pouvoir être citée seule.    */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden pt-16 pb-16 md:pt-24 md:pb-20">
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
            <span>Formation intelligence artificielle</span>
          </nav>

          <Eyebrow>Formation IA générative · 100 % en ligne</Eyebrow>

          <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.025em] text-ink">
            Formation intelligence artificielle,{" "}
            <span className="accent-serif">en français</span> et à votre rythme.
          </h1>

          <p className="mt-7 text-xl leading-relaxed text-ink">
            <strong>
              ClaudeAI Academy est une formation en ligne à l’intelligence
              artificielle générative, en français, sans CPF ni dossier de
              financement.
            </strong>{" "}
            {stats.courseCount} parcours, {stats.lessonCount} leçons et{" "}
            {PROMPT_COUNT} prompts prêts à l’emploi pour utiliser l’IA dans votre
            métier — pas pour en parler. Paiement unique dès 47 €, accès à vie,
            garantie 14 jours.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/tarifs" variant="primary" size="lg">
              Voir les formules
            </Button>
            <Button href="/kit" variant="ghost" size="lg">
              Commencer gratuitement
            </Button>
          </div>

          <p className="mt-6 text-[14px] text-muted">
            Aucune carte bancaire pour le kit gratuit. La première leçon de chacun
            des {stats.courseCount} parcours est en accès libre.
          </p>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Contexte chiffré — données primaires, sourcées et datées.         */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-line bg-cream-soft py-16 md:py-20">
        <Container size="narrow">
          <Eyebrow>Où en est la France</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            L’écart ne se creuse plus entre ceux qui connaissent l’IA et les
            autres. Il se creuse entre ceux qui s’en servent et les autres.
          </h2>

          <dl className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <Stat
              value="18 %"
              label="des entreprises françaises de 10 salariés ou plus utilisaient au moins une technologie d’IA en 2025, contre 10 % en 2024."
            />
            <Stat
              value="58 %"
              label="chez les entreprises de 250 salariés et plus — contre 15 % chez celles de 10 à 49 salariés."
            />
            <Stat
              value="2 févr. 2025"
              label="date d’entrée en application de l’article 4 de l’AI Act, qui impose la maîtrise de l’IA aux utilisateurs professionnels."
            />
          </dl>

          <div className="prose-lesson mt-10">
            <p>
              Le taux d’adoption a presque doublé en un an et triplé en deux ans.
              Mais la moyenne cache l’essentiel : une entreprise de plus de 250
              salariés a près de quatre fois plus de chances d’utiliser l’IA
              qu’une PME de moins de 50. Autrement dit, l’avantage n’est pas
              encore acquis par les gros — il est simplement pris plus vite.
            </p>
            <p>
              À cela s’ajoute une contrainte que beaucoup découvrent tard.
              L’article 4 du règlement européen sur l’IA, applicable depuis le{" "}
              <strong>2 février 2025</strong>, oblige tout employeur dont les
              équipes utilisent un système d’IA à garantir un niveau suffisant de
              « maîtrise de l’IA ». Il n’existe ni seuil d’effectif, ni seuil de
              chiffre d’affaires : une entreprise de cinq personnes dont un
              salarié rédige ses e-mails avec ChatGPT entre dans le champ. Aucune
              certification n’est exigée ; un registre des actions de formation
              suffit à documenter la conformité.
            </p>
            <p className="text-[14px] text-muted">
              Sources :{" "}
              <a
                href="https://www.insee.fr/fr/statistiques/9025878"
                target="_blank"
                rel="noopener noreferrer"
              >
                Insee Première n° 2120, « Les TIC dans les entreprises en 2025 »
              </a>{" "}
              ·{" "}
              <a
                href="https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=OJ:L_202401689"
                target="_blank"
                rel="noopener noreferrer"
              >
                Règlement (UE) 2024/1689, article 4
              </a>
              .
            </p>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Typologie — le tableau comparatif, format que les moteurs         */}
      {/* génératifs restituent particulièrement bien.                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Choisir</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Quatre formations portent le nom « formation IA ». Une seule
            correspond à ce que vous cherchez.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            La plupart des abandons viennent d’une erreur d’aiguillage, pas d’un
            manque de travail : on s’inscrit à un cursus de data science alors
            qu’on voulait simplement écrire de meilleurs prompts.
          </p>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b-2 border-ink">
                  <th className="py-3 pr-4 font-semibold text-ink">Type</th>
                  <th className="py-3 pr-4 font-semibold text-ink">Pour qui</th>
                  <th className="py-3 pr-4 font-semibold text-ink">Durée</th>
                  <th className="py-3 font-semibold text-ink">Budget usuel</th>
                </tr>
              </thead>
              <tbody>
                {typologie.map((t) => (
                  <tr
                    key={t.type}
                    className={`border-b border-line align-top ${
                      t.nous ? "bg-coral-soft/20" : ""
                    }`}
                  >
                    <td className="py-4 pr-4 font-semibold text-ink">
                      {t.type}
                      {t.nous ? (
                        <span className="mt-1 block text-[12px] font-semibold uppercase tracking-[0.1em] text-coral">
                          Couvert ici
                        </span>
                      ) : null}
                    </td>
                    <td className="py-4 pr-4 text-muted">{t.pour}</td>
                    <td className="py-4 pr-4 text-muted">{t.duree}</td>
                    <td className="py-4 text-muted">{t.budget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-[14px] text-muted">
            Fourchettes de budget observées sur le marché francophone de la
            formation continue en 2026, hors financement public.
          </p>

          <div className="prose-lesson mt-10">
            <p>
              ClaudeAI Academy couvre les trois premières lignes. Nous ne formons
              pas au machine learning et nous ne prétendons pas le faire : si
              votre objectif est de construire des modèles, un cursus long et
              diplômant reste le bon chemin.
            </p>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Critères de qualité                                               */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-line bg-cream-soft py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Grille de lecture</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Cinq critères pour reconnaître une formation IA qui tient debout.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Applicables à n’importe quel organisme, y compris le nôtre.
          </p>

          <ol className="mt-10 space-y-8">
            {criteres.map((c, i) => (
              <li key={c.titre} className="flex gap-5">
                <span className="font-serif text-3xl font-medium leading-none text-coral">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-serif text-xl font-medium text-ink">
                    {c.titre}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted">{c.texte}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Le pont vers l'offre : pourquoi Claude comme terrain              */}
      {/* ---------------------------------------------------------------- */}
      <section className="py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Notre parti pris</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            On apprend l’IA sur un outil. On la garde sur tous les autres.
          </h2>

          <div className="prose-lesson mt-8">
            <p>
              Une formation qui survole cinq assistants n’en apprend aucun. Nous
              faisons l’inverse : nous entraînons sur{" "}
              <strong>Claude, le modèle d’Anthropic</strong>, et nous signalons
              les différences quand elles comptent. Ce choix n’est pas une
              question de préférence — c’est une question de transfert.
            </p>
            <p>
              Ce qui s’apprend est indépendant de l’outil : structurer une
              consigne, fournir le bon contexte, découper une tâche complexe,
              repérer une réponse fausse, automatiser ce qui se répète. Ces
              compétences fonctionnent à l’identique sur ChatGPT et Gemini. Ce
              qui change d’un modèle à l’autre — l’emplacement d’un bouton, le
              nom d’une fonctionnalité — s’apprend en dix minutes.
            </p>
            <p>
              Claude est le terrain d’entraînement le plus exigeant sur la rigueur
              des consignes. Une instruction floue y produit un résultat
              visiblement moyen, là où d’autres modèles masquent le problème sous
              une réponse agréable. C’est inconfortable au début, et c’est
              exactement pour ça que ça forme.
            </p>
          </div>

          <div className="mt-10 rounded-[18px] border border-line bg-white p-8">
            <h3 className="font-serif text-xl font-medium text-ink">
              Ce que couvrent les {stats.courseCount} parcours
            </h3>
            <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-muted">
              <li>
                <Link
                  href="/courses/bien-demarrer-avec-claude"
                  className="font-semibold text-coral hover:text-coral-dark"
                >
                  Bien démarrer avec l’IA générative
                </Link>{" "}
                — installer, comprendre ce que le modèle sait et ignore, premiers
                usages fiables.
              </li>
              <li>
                <Link
                  href="/courses/prompt-engineering-pro"
                  className="font-semibold text-coral hover:text-coral-dark"
                >
                  Prompt engineering
                </Link>{" "}
                — obtenir un résultat reproductible plutôt qu’un coup de chance.
              </li>
              <li>
                <Link
                  href="/courses/claude-code-ia-agentic"
                  className="font-semibold text-coral hover:text-coral-dark"
                >
                  Développement assisté par IA
                </Link>{" "}
                — écrire, relire et déboguer du code avec un agent.
              </li>
              <li>
                <Link
                  href="/courses/claude-data-sql"
                  className="font-semibold text-coral hover:text-coral-dark"
                >
                  Données et SQL
                </Link>{" "}
                — interroger, nettoyer et expliquer un jeu de données.
              </li>
              <li>
                <Link
                  href="/courses/contenu-et-marketing"
                  className="font-semibold text-coral hover:text-coral-dark"
                >
                  Contenu et marketing
                </Link>{" "}
                — produire sans que ça sente le texte généré.
              </li>
              <li>
                <Link
                  href="/courses/strategie-conduite-ia"
                  className="font-semibold text-coral hover:text-coral-dark"
                >
                  Stratégie et conduite du changement
                </Link>{" "}
                — choisir les bons cas d’usage, encadrer l’usage dans une équipe.
              </li>
            </ul>
            <div className="mt-7">
              <Button href="/courses" variant="ghost" size="md">
                Voir le catalogue complet
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Guarantee />

      {/* ---------------------------------------------------------------- */}
      {/* FAQ — miroir exact du schema FAQPage ci-dessus.                   */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-line py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Questions fréquentes</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Formation intelligence artificielle : ce qu’on nous demande le plus.
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
            D’autres questions ? La{" "}
            <Link href="/faq" className="font-semibold text-coral hover:text-coral-dark">
              FAQ complète
            </Link>{" "}
            couvre l’accès, la facturation et le remboursement, et vous pouvez
            toujours{" "}
            <Link href="/contact" className="font-semibold text-coral hover:text-coral-dark">
              nous écrire
            </Link>
            .
          </p>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section className="bg-ink py-16 text-cream md:py-24">
        <Container size="narrow">
          <h2 className="font-serif text-3xl font-medium leading-[1.2] tracking-tight md:text-[2.5rem]">
            Le meilleur moment pour se former à l’IA, c’était il y a deux ans.
          </h2>
          <p className="mt-5 max-w-[620px] text-lg leading-relaxed text-cream/70">
            Le deuxième meilleur, c’est maintenant. Commencez par le kit gratuit
            si vous voulez juger sur pièce — 15 prompts, aucune carte bancaire.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/tarifs" variant="primary" size="lg">
              Voir les formules, dès 47 €
            </Button>
            <Button href="/kit" variant="ghost-light" size="lg">
              Recevoir le kit gratuit
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-serif text-4xl font-medium leading-none text-coral md:text-5xl">
        {value}
      </dt>
      <dd className="mt-3 text-[15px] leading-relaxed text-muted">{label}</dd>
    </div>
  );
}
