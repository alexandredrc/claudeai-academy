import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { CheckoutButton } from "@/components/site/checkout-button";
import { SITE_URL, ORG_ID, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo/jsonld";

// Page de vente du parcours « Claude Code et l'IA agentique », côté requête.
// Search Console, 28 jours au 4 octobre 2026 : « formation claude code »,
// « claude code formation », « claude code course », « certification claude
// code » apparaissent toutes entre la position 59 et la position 90, avec
// zéro clic, parce qu'aucune page du site ne porte ces mots en titre. Le
// Keyword Planner donne 90 500 recherches par mois sur « claude code » en
// France (+83 % sur un an) et 1 300 sur « claude code skills ».
//
// La page dit ce que Claude Code est, à qui le parcours s'adresse, ce que
// contiennent les huit leçons, et ce qu'elle n'est pas (ni un cours
// d'Anthropic, ni une certification). Les chiffres viennent du contenu du
// dépôt (scripts/content/claude-code.mjs) : 8 leçons, 188 minutes, Starter.

export const metadata: Metadata = {
  title: "Formation Claude Code en français : 8 leçons, dès 47 €",
  description:
    "La formation Claude Code en français : CLAUDE.md, skills et boucles de vérification, hooks, MCP, sous-agents, plugins et mods, puis l'Agent SDK pour sortir du terminal. 8 leçons, 188 minutes, la première en accès libre. Incluse dans le Pass Starter à 47 €, accès à vie, garantie 14 jours. Vérifiée sur Claude Code 2.1.288.",
  alternates: { canonical: "/formation-claude-code" },
  keywords: [
    "formation claude code",
    "claude code formation",
    "apprendre claude code",
    "cours claude code",
    "claude code tutoriel français",
    "claude code débutant",
    "formation agent de code",
    "claude code CLAUDE.md",
    "claude code MCP",
  ],
  openGraph: {
    title: "Formation Claude Code en français : 8 leçons, dès 47 €",
    description:
      "Du premier CLAUDE.md à l'agent qui tourne sans vous : skills, hooks, MCP, sous-agents, plugins et mods, Agent SDK. En français, vérifié sur Claude Code 2.1.295.",
    url: "/formation-claude-code",
    type: "website",
  },
};

const lecons = [
  {
    slug: "ce-qui-change-vraiment-avec-claude-code",
    titre: "Ce qui change vraiment avec Claude Code",
    duree: 16,
    libre: true,
    texte:
      "Ce qu'un agent de code fait que le chat ne fait pas : lire un dépôt entier, modifier des fichiers, lancer des commandes et vérifier son résultat. Ce qu'on lui confie, ce qu'on garde, et ce que ça coûte réellement.",
  },
  {
    slug: "bien-demarrer-claude-md-et-contexte",
    titre: "Bien démarrer : projet, CLAUDE.md et contexte",
    duree: 24,
    libre: false,
    texte:
      "Installer, ouvrir un projet, écrire un CLAUDE.md court qui tient dans la durée, et comprendre comment le contexte se remplit et se vide d'une session à l'autre.",
  },
  {
    slug: "slash-commands-et-skills",
    titre: "Slash commands et skills : industrialiser vos workflows",
    duree: 26,
    libre: false,
    texte:
      "Transformer une consigne que vous retapez en skill que Claude charge au bon moment, et construire une boucle de vérification que l'agent exécute avant de rendre son travail.",
  },
  {
    slug: "hooks-automatiser-les-invariants",
    titre: "Hooks : automatiser les invariants",
    duree: 22,
    libre: false,
    texte:
      "Déclencher un script, une requête ou un prompt sur un évènement de Claude Code : avant un appel d'outil, après une édition, à la fin d'un tour. Les règles qui ne dépendent plus de votre vigilance.",
  },
  {
    slug: "mcp-connecter-vos-outils",
    titre: "MCP : connecter vos outils et vos données",
    duree: 22,
    libre: false,
    texte:
      "Brancher une base de données, un service web ou un outil maison par le Model Context Protocol, et décider quels outils l'agent voit, et avec quels droits.",
  },
  {
    slug: "sub-agents-et-workflow-agentic",
    titre: "Sous-agents et architecture d'un workflow agentique",
    duree: 28,
    libre: false,
    texte:
      "Déléguer pour isoler du contexte et spécialiser, pas pour se débarrasser du travail. Les limites réelles de la délégation et la consigne qui évite la sur-vérification avec Opus 5.",
  },
  {
    slug: "sortir-du-terminal-agent-sdk-et-agents-geres",
    titre: "Sortir du terminal : programmer votre agent ou le faire héberger",
    duree: 26,
    libre: false,
    texte:
      "L'Agent SDK pour écrire votre propre agent, les agents gérés pour le faire tourner chez Anthropic, et les critères qui tranchent entre les deux selon le budget et la maintenance.",
  },
  {
    slug: "plugins-et-mods-etendre-claude-code",
    titre: "Plugins et mods : étendre Claude Code sans le forker",
    duree: 24,
    libre: false,
    texte:
      "Installer un plugin depuis une marketplace, lire ce qu'il contient avant de l'activer, et comprendre les mods, apparus le 1er octobre 2026, qui exécutent du code à l'intérieur de Claude Code.",
  },
];

const profils = [
  {
    titre: "Vous développez, seul ou en équipe",
    texte:
      "Vous avez déjà essayé Claude Code et vous sentez qu'il vous échappe : contexte saturé, résultats irréguliers, relectures interminables. Le parcours vous donne la structure qui manque : CLAUDE.md, skills, hooks, et la discipline de vérification.",
  },
  {
    titre: "Vous automatisez sans être développeur",
    texte:
      "Vous êtes à l'aise avec un terminal, ou prêt à l'apprendre, et vous voulez qu'un agent exécute des tâches répétitives sur vos fichiers et vos outils. Les leçons 1, 2 et 5 suffisent pour un premier agent utile ; le reste vient quand le besoin arrive.",
  },
  {
    titre: "Vous décidez pour une équipe",
    texte:
      "Vous devez savoir ce que Claude Code change dans une organisation, ce qu'il coûte, et où mettre les garde-fous. La leçon 1 est en accès libre : lisez-la avant de décider quoi que ce soit.",
  },
];

const faq = [
  {
    q: "Faut-il savoir coder pour suivre cette formation Claude Code ?",
    a: "Pas au sens d'écrire un programme de A à Z. Il faut être à l'aise avec un terminal, c'est-à-dire ouvrir une invite de commandes, se déplacer dans un dossier et lancer une commande. Les leçons expliquent chaque commande qu'elles utilisent. En revanche, si vous n'avez jamais ouvert un terminal, commencez par le parcours « Bien démarrer avec Claude », inclus dans le même Pass Starter.",
  },
  {
    q: "Claude Code est-il gratuit ?",
    a: "L'outil lui-même est gratuit à installer, mais il consomme votre abonnement Claude. Il est inclus dans les plans payants de claude.ai (Pro, Max) ou se facture à l'usage par clé d'API. Le plan gratuit de Claude ne donne pas accès à Claude Code. La leçon 1 détaille ce que coûte une session typique et comment plafonner la dépense.",
  },
  {
    q: "Sur quel système fonctionne Claude Code ?",
    a: "Sur macOS, Linux et Windows, dans le terminal, et aussi dans l'application de bureau Claude et dans les extensions pour VS Code et les éditeurs JetBrains. Le parcours travaille dans le terminal parce que c'est là que toutes les fonctions sont disponibles ; ce que vous y apprenez vaut partout ailleurs.",
  },
  {
    q: "Est-ce une formation officielle d'Anthropic ?",
    a: "Non. ClaudeAI Academy est indépendante d'Anthropic. Anthropic publie ses propres cours, gratuits et en anglais, sur academy.claude.com. Cette formation est en français, construite autour d'exercices à cocher et d'un Mentor IA (dans le Pass Mastery), et elle est vérifiée contre la documentation officielle à chaque passe de veille.",
  },
  {
    q: "Délivre-t-elle une certification Claude Code ?",
    a: "Il n'existe pas de certification officielle Claude Code. ClaudeAI Academy délivre un certificat de réussite nominatif, après avoir terminé le programme et réussi un examen final de 20 questions avec 80 % de bonnes réponses, vérifiable en ligne par son code. C'est un certificat d'organisme privé : ni un titre reconnu par l'État, ni un document d'Anthropic.",
  },
  {
    q: "Que contient le Pass Starter à 47 € ?",
    a: "Les trois parcours de base : « Bien démarrer avec Claude », « Prompt Engineering pro » et « Claude Code et l'IA agentique », avec leurs exercices. Paiement unique, accès à vie, garantie 14 jours satisfait ou remboursé. Le Pass Mastery à 497 € ajoute les six autres parcours, dont « Construire ton agent IA avec Claude », et le Mentor IA.",
  },
  {
    q: "La formation est-elle à jour de la dernière version de Claude Code ?",
    a: "Les huit leçons ont été vérifiées sur Claude Code 2.1.295 le 9 octobre 2026, avec Opus 5.5 comme modèle par défaut. Claude Code publie plusieurs versions par semaine : la veille du site relit les changelogs officiels et chaque leçon porte une note datée quand un point a changé. Le prix comprend ces mises à jour.",
  },
  {
    q: "Peut-on lire une leçon avant de payer ?",
    a: "Oui. La leçon 1, « Ce qui change vraiment avec Claude Code », est en accès libre, sans compte. Elle suffit pour savoir si l'outil et la pédagogie vous conviennent.",
  },
];

const dureeTotale = lecons.reduce((somme, l) => somme + l.duree, 0);

export default function FormationClaudeCodePage() {
  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${SITE_URL}/formation-claude-code#course`,
    name: "Formation Claude Code et IA agentique",
    description: metadata.description,
    url: `${SITE_URL}/formation-claude-code`,
    inLanguage: "fr-FR",
    provider: { "@id": ORG_ID },
    educationalLevel: "Intermédiaire",
    teaches: [
      "Configurer un projet Claude Code avec un CLAUDE.md",
      "Créer des skills et des boucles de vérification",
      "Automatiser des règles avec des hooks",
      "Connecter des outils et des données par MCP",
      "Déléguer à des sous-agents",
      "Étendre Claude Code avec des plugins et des mods",
      "Sortir du terminal avec l'Agent SDK",
    ],
    numberOfCredits: 0,
    timeRequired: `PT${dureeTotale}M`,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `PT${dureeTotale}M`,
    },
    offers: {
      "@type": "Offer",
      price: "47",
      priceCurrency: "EUR",
      category: "Pass Starter",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/tarifs#starter`,
    },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    dateModified: "2026-10-04",
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
        dangerouslySetInnerHTML={jsonLdScript(courseJsonLd)}
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
            { name: "Formation Claude Code", path: "/formation-claude-code" },
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
            <Link
              href="/formation-intelligence-artificielle"
              className="transition-colors hover:text-coral"
            >
              Formation IA
            </Link>
            <span className="mx-2 text-line">/</span>
            <span>Formation Claude Code</span>
          </nav>

          <Eyebrow>Formation Claude Code · En français · Pass Starter</Eyebrow>

          <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.025em] text-ink">
            La formation Claude Code qui part du terminal et finit sur un agent
            qui <span className="accent-serif">tourne sans vous</span>.
          </h1>

          <div className="mt-8 rounded-[18px] border-l-[3px] border-coral bg-cream-soft p-7">
            <p className="text-lg leading-relaxed text-ink">
              <strong>Claude Code, en une phrase :</strong> l’agent de
              programmation d’Anthropic qui vit dans votre terminal. Il lit un
              dépôt entier, modifie des fichiers, lance des commandes et vérifie
              son résultat, sous vos permissions. Le chat répond ; Claude Code{" "}
              <strong>agit</strong>. Cette formation apprend à le cadrer pour
              qu’il agisse bien, puis à le faire tourner sans vous.
            </p>
          </div>

          <p className="mt-8 text-lg leading-relaxed text-muted">
            Huit leçons, {dureeTotale} minutes, un exercice à cocher par leçon.
            Vérifiées sur Claude Code 2.1.295 le 9 octobre 2026. La première
            leçon est en accès libre, sans compte.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              href="/courses/claude-code-ia-agentic"
              variant="primary"
              size="lg"
            >
              Lire la première leçon
            </Button>
            <Button href="/kit?src=guide-claude-code" variant="ghost" size="lg">
              Le kit gratuit, 15 prompts
            </Button>
          </div>
        </Container>
      </section>

      {/* Pour qui */}
      <section className="border-y border-line bg-cream-soft py-16 md:py-20">
        <Container size="narrow">
          <Eyebrow>Pour qui</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Trois situations où ce parcours est le bon.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {profils.map((p) => (
              <div key={p.titre} className="rounded-[18px] border border-line bg-white p-7">
                <h3 className="font-serif text-xl font-medium leading-snug text-ink">
                  {p.titre}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{p.texte}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[15px] leading-relaxed text-muted">
            Ce parcours n’est pas fait pour vous si vous n’avez jamais ouvert
            un terminal et ne comptez pas le faire : commencez alors par{" "}
            <Link
              href="/courses/bien-demarrer-avec-claude"
              className="font-semibold text-coral hover:text-coral-dark"
            >
              Bien démarrer avec Claude
            </Link>
            , inclus dans le même Pass.
          </p>
        </Container>
      </section>

      {/* Programme */}
      <section className="py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Programme</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Huit leçons, dans l’ordre où le besoin apparaît.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Chaque leçon se termine par un exercice sur votre propre projet, pas
            sur un exemple jouet. Les durées sont celles de la lecture ; comptez
            le double avec l’exercice.
          </p>

          <ol className="mt-12 divide-y divide-line border-y border-line">
            {lecons.map((l, i) => (
              <li key={l.slug} className="py-7">
                <div className="flex gap-5">
                  <span className="font-serif text-3xl font-medium leading-none text-coral">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-serif text-xl font-medium leading-snug text-ink">
                        {l.libre ? (
                          <Link
                            href={`/courses/claude-code-ia-agentic/${l.slug}`}
                            className="transition-colors hover:text-coral"
                          >
                            {l.titre}
                          </Link>
                        ) : (
                          l.titre
                        )}
                      </h3>
                      <span className="text-[13px] text-muted">{l.duree} min</span>
                      {l.libre ? (
                        <span className="rounded-full border border-coral px-2.5 py-0.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-coral">
                          Accès libre
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 leading-relaxed text-muted">{l.texte}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-[18px] border border-line bg-white p-7">
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
                Ce que vous saurez faire
              </span>
              <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-ink-soft">
                <li>Écrire un CLAUDE.md qui tient en 30 lignes et reste vrai.</li>
                <li>Figer vos consignes répétées en skills, avec une boucle de vérification.</li>
                <li>Poser des hooks qui bloquent ce qui ne doit jamais passer.</li>
                <li>Connecter vos données par MCP sans donner plus de droits que nécessaire.</li>
                <li>Déléguer à des sous-agents en gardant la main sur le coût.</li>
                <li>Choisir entre Agent SDK et agents gérés pour sortir du terminal.</li>
              </ul>
            </div>
            <div className="rounded-[18px] border-[1.5px] border-coral bg-white p-7">
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-coral">
                Ce que la formation n’est pas
              </span>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                Ni un cours d’Anthropic, ni une certification officielle, ni une
                formation CPF. Pas de vidéos de trois heures : du texte dense,
                des commandes copiables, un exercice par leçon. Et pas de
                promesse de « coder sans savoir coder » : l’agent exécute, vous
                décidez, et le parcours vous apprend à décider.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Prix */}
      <section className="border-y border-line bg-cream-soft py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Prix</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Inclus dans le Pass Starter : 47 €, une fois, à vie.
          </h2>
          <p className="mt-5 max-w-[620px] text-lg leading-relaxed text-muted">
            Le Pass Starter réunit ce parcours, « Bien démarrer avec Claude » et
            « Prompt Engineering pro ».
            Paiement unique par carte, accès immédiat, garantie 14 jours
            satisfait ou remboursé. Sans dossier CPF, sans devis, sans
            abonnement.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CheckoutButton tier="starter" variant="primary" size="lg">
              Prendre le Pass Starter, 47 €
            </CheckoutButton>
            <Button href="/tarifs" variant="ghost" size="lg">
              Comparer avec le Pass Mastery
            </Button>
          </div>
          <p className="mt-6 text-[15px] leading-relaxed text-muted">
            Vous visez un agent qui tourne seul, avec OpenClaw, n8n ou l’Agent
            SDK ? Le parcours{" "}
            <Link
              href="/creer-un-agent-ia"
              className="font-semibold text-coral hover:text-coral-dark"
            >
              Construire ton agent IA avec Claude
            </Link>{" "}
            prend le relais, dans le Pass Mastery.
          </p>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Questions fréquentes</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Formation Claude Code : ce qu’on nous demande avant d’acheter.
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
            <Link
              href="/claude-code-skills"
              className="font-semibold text-coral hover:text-coral-dark"
            >
              créer un skill Claude Code
            </Link>{" "}
            ·{" "}
            <Link
              href="/creer-un-agent-ia"
              className="font-semibold text-coral hover:text-coral-dark"
            >
              comment créer un agent IA
            </Link>{" "}
            ·{" "}
            <Link
              href="/claude-vs-chatgpt"
              className="font-semibold text-coral hover:text-coral-dark"
            >
              Claude ou ChatGPT
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
