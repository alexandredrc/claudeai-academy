import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { SITE_URL, ORG_ID, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo/jsonld";

// Satellite du pilier /formation-intelligence-artificielle, côté agents.
// Requêtes visées : « comment créer un agent ia », « créer un agent ia »,
// « agent ia », « formation agent ia ». Keyword Planner, France, septembre 2025
// à août 2026 (lu le 4 octobre 2026) : « agent ia » 8 100 recherches par mois,
// « comment créer un agent ia » 590 (+321 % sur un an), « formation agent ia »
// 480 (+129 %), « openclaw » 40 500, « hermes agent » 12 100.
//
// Page-guide : elle donne la méthode de décision (workflow ou agent), les six
// façons de construire avec Claude, et la fiche d'une page. Le parcours vend
// la pratique guidée ; la première leçon est en accès libre.

export const metadata: Metadata = {
  title: "Comment créer un agent IA : la méthode, les 6 options, les pièges",
  description:
    "Créer un agent IA en 2026 : la différence entre workflow et agent selon Anthropic, les six façons de construire avec Claude (agent personnel OpenClaw ou Hermes, Claude Code planifié, n8n, Agent SDK, agents gérés), ce que ça coûte, et la fiche d'une page à écrire avant le code.",
  alternates: { canonical: "/creer-un-agent-ia" },
  keywords: [
    "comment créer un agent ia",
    "créer un agent ia",
    "agent ia",
    "formation agent ia",
    "agent ia claude",
    "openclaw",
    "hermes agent",
    "agent sdk claude",
  ],
  openGraph: {
    title: "Comment créer un agent IA : la méthode, les 6 options, les pièges",
    description:
      "Workflow ou agent, les six façons de construire avec Claude, ce que ça coûte, et la fiche d'une page à écrire avant le code.",
    url: "/creer-un-agent-ia",
    type: "article",
  },
};

const options = [
  {
    nom: "Un agent personnel sur votre machine",
    outil: "OpenClaw, Hermes Agent (open source, licence MIT)",
    pour: "Un assistant qui vous répond sur Telegram, WhatsApp ou Slack, lit vos fichiers et lance des tâches. Il tourne chez vous, sur une clé API Claude.",
    piege: "Il réunit données privées, messages de tiers et canal de sortie : sans appairage, règles de refus et bac à sable, c'est une porte ouverte.",
  },
  {
    nom: "Claude Code en tâche planifiée",
    outil: "Tâches planifiées Desktop, routines cloud, sessions cloud",
    pour: "Automatiser ce que vous faites déjà dans Claude Code : relecture nocturne, veille de dépôt, réaction à une pull request ou à un appel d'API.",
    piege: "Une routine tourne sans sélecteur de permission. Son prompt et le périmètre de son environnement sont les seuls garde-fous.",
  },
  {
    nom: "Claude dans n8n",
    outil: "Nœuds Anthropic Chat Model et AI Agent, Structured Output Parser, MCP Client Tool",
    pour: "Relier des logiciels SaaS avec une étape de modèle entre deux, et garder un humain dans la boucle sur certaines sorties.",
    piege: "La plupart des « agents n8n » sont des workflows, et c'est très bien. Mettre un nœud agent partout coûte plus cher et se débogue mal.",
  },
  {
    nom: "Le Claude Agent SDK",
    outil: "@anthropic-ai/claude-agent-sdk (TypeScript), claude-agent-sdk (Python)",
    pour: "Un agent sur mesure dans votre application : la boucle de Claude Code en bibliothèque, avec outils, permissions, hooks, sous-agents, sortie structurée.",
    piege: "Sans nombre de tours ni budget, la boucle ne s'arrête pas d'elle-même sur une consigne ouverte. Poser un budget est le défaut recommandé.",
  },
  {
    nom: "Les agents gérés (Managed Agents)",
    outil: "API de la plateforme Claude, CLI ant, en bêta",
    pour: "Un agent de production sans serveur à tenir : sessions dans un bac à sable, budget en dollars, déploiement planifié, identifiants en coffre.",
    piege: "Un environnement créé par l'API sans champ réseau est ouvert. Écrivez toujours la liste des hôtes autorisés.",
  },
  {
    nom: "L'API Messages et vos propres outils",
    outil: "SDK Anthropic de votre langage",
    pour: "Le contrôle total, quand vous avez une raison précise de réécrire le harnais.",
    piege: "Vous réécrivez ce que le SDK fournit : gestion du contexte, cache, exécution des outils, permissions, budget.",
  },
];

const fiche = [
  "L'objectif en une phrase, avec un critère de réussite observable : quoi, où, quand.",
  "Le périmètre : ce que l'agent lit, ce qu'il écrit, à qui il parle. Tout ce qui n'est pas listé est interdit.",
  "Les limites dures : ce qu'il ne doit jamais faire, même si un message ou un fichier le lui demande.",
  "Les cas où il s'arrête et demande au lieu de deviner, avec un seuil précis pour chacun.",
  "Le budget par exécution et la cadence, et ce qui se passe quand le budget est atteint.",
  "La preuve : ce que vous relirez, et ce qui doit être journalisé.",
];

const faq = [
  {
    q: "Qu'est-ce qu'un agent IA, exactement ?",
    a: "Selon la définition qu'Anthropic utilise depuis son guide « Building effective agents » (décembre 2024), un agent est un système où le modèle dirige lui-même son processus et son usage des outils. Dans un workflow, au contraire, les modèles et les outils suivent des chemins de code que vous avez écrits. La différence, c'est qui décide de l'étape suivante : votre code, ou le modèle.",
  },
  {
    q: "Faut-il savoir coder pour créer un agent IA ?",
    a: "Pas pour les deux premières options. Un agent personnel comme OpenClaw ou Hermes s'installe en une commande et se configure en langage courant. Une tâche planifiée Claude Code ou une routine se crée dans l'interface. n8n demande de l'aisance avec un outil visuel. Le SDK et les agents gérés demandent de programmer, en TypeScript ou en Python, mais la boucle, les outils et les permissions sont fournis.",
  },
  {
    q: "Combien coûte un agent IA ?",
    a: "Trois lignes : les tokens, le temps de machine, les outils facturés à l'usage. Au 4 octobre 2026, Sonnet 5.5 coûte 2 $ par million de tokens en entrée et 10 $ en sortie, Haiku 4.5 1 $ et 5 $, Opus 5.5 4 $ et 20 $. Un agent géré ajoute 0,08 $ par heure de session en cours. La documentation d'Anthropic précise que les tokens dominent le coût de l'infrastructure d'un ordre de grandeur. La cadence est un paramètre de coût : un agent à 0,30 $ par exécution toutes les heures coûte 216 $ par mois, une fois par nuit 9 $.",
  },
  {
    q: "Quelle est la différence entre OpenClaw et Hermes Agent ?",
    a: "Les deux sont des agents personnels open source sous licence MIT, qui tournent sur votre machine, se branchent sur Claude par clé API et parlent à vos messageries. Hermes Agent, publié par Nous Research, ajoute une boucle d'apprentissage (il crée et améliore ses propres skills), un planificateur cron intégré et sept backends d'exécution dont Docker. OpenClaw met en avant sa Gateway locale, ses applications natives et un annuaire de plugins. Dans les deux cas, trois réglages comptent avant tout : l'appairage des contacts, les règles de refus et le bac à sable.",
  },
  {
    q: "Un agent peut-il être piraté ?",
    a: "Oui, par ce qu'il lit. Un fichier, une page web ou un message peut contenir des instructions qu'un agent incorpore à ses actions : c'est l'injection de prompt. La documentation d'Anthropic recommande la défense en profondeur : secrets hors de l'agent (proxy ou coffre), réseau limité à des hôtes listés, système de fichiers en lecture seule là où c'est possible, approbation humaine sur les gestes irréversibles. Le comportement du modèle, aussi bon soit-il, n'est pas un contrôle de sécurité.",
  },
  {
    q: "Que dit la loi si je déploie un agent dans mon entreprise ?",
    a: "Vous êtes déployeur au sens de l'AI Act. L'article 4 (littératie IA) s'applique depuis le 2 février 2025 et vous demande de prendre des mesures pour former les personnes qui utilisent et supervisent l'agent. L'article 50 (transparence) s'applique depuis le 2 août 2026 si l'agent interagit avec des humains. Le RGPD s'applique comme à tout traitement : minimisation, base légale, information des personnes.",
  },
];

export default function CreerUnAgentIaPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "Article"],
    "@id": `${SITE_URL}/creer-un-agent-ia#page`,
    headline: "Comment créer un agent IA : la méthode, les six options, les pièges",
    description: metadata.description,
    url: `${SITE_URL}/creer-un-agent-ia`,
    inLanguage: "fr-FR",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": ORG_ID },
    author: {
      "@type": "Person",
      name: "Alexandre Dos Reis Caetano",
      url: `${SITE_URL}/a-propos`,
    },
    dateModified: "2026-10-04",
    about: [
      { "@type": "Thing", name: "Agents IA" },
      { "@type": "Thing", name: "Claude (Anthropic)" },
    ],
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cadrer un agent IA avant de l'écrire",
    description:
      "La fiche d'une page qui répond à six questions avant la première ligne de code.",
    inLanguage: "fr-FR",
    totalTime: "PT20M",
    step: fiche.map((texte, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: `Question ${i + 1}`,
      text: texte,
      url: `${SITE_URL}/creer-un-agent-ia#fiche-${i + 1}`,
    })),
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
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(howToJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqJsonLd)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            {
              name: "Formation intelligence artificielle",
              path: "/formation-intelligence-artificielle",
            },
            { name: "Créer un agent IA", path: "/creer-un-agent-ia" },
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
            <span>Créer un agent IA</span>
          </nav>

          <Eyebrow>Guide · Agents IA</Eyebrow>

          <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.025em] text-ink">
            Créer un agent IA commence par une question :{" "}
            <span className="accent-serif">en avez-vous besoin</span> ?
          </h1>

          <div className="mt-8 rounded-[18px] border-l-[3px] border-coral bg-cream-soft p-7">
            <p className="text-lg leading-relaxed text-ink">
              <strong>Définition courte :</strong> un agent est un système où le
              modèle décide lui-même de ses étapes et de ses outils. Un
              workflow, c’est vous qui décidez du chemin et le modèle qui
              remplit les cases. Si vous pouvez dessiner le chemin sur une
              feuille, c’est un workflow : moins cher, plus prévisible, plus
              facile à déboguer. Vous ne passez à l’agent que quand le chemin
              dépend de ce que le modèle découvre en route.
            </p>
          </div>

          <p className="mt-8 text-lg leading-relaxed text-muted">
            C’est la définition qu’Anthropic utilise depuis son guide « Building
            effective agents » de décembre 2024, et celle que toute la
            documentation de Claude reprend. Elle évite le premier piège : payer
            un agent pour ce qu’un enchaînement de trois appels aurait fait.
          </p>
        </Container>
      </section>

      <section className="border-y border-line bg-cream-soft py-16 md:py-20">
        <Container size="narrow">
          <Eyebrow>Six façons de construire avec Claude</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Deux questions les séparent : qui fournit le harnais, qui fournit la machine.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Le harnais, c’est la boucle qui appelle le modèle, exécute les
            outils et gère le contexte. La machine, c’est là où ça tourne.
            Chaque option répond différemment, et chaque option a son piège.
          </p>

          <div className="mt-10 flex flex-col gap-5">
            {options.map((o, i) => (
              <article key={o.nom} className="rounded-[18px] border border-line bg-white p-7">
                <div className="flex gap-4">
                  <span className="font-serif text-2xl font-medium leading-none text-coral">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-serif text-xl font-semibold text-ink">{o.nom}</h3>
                    <p className="mt-1 text-[13px] font-mono text-muted">{o.outil}</p>
                    <p className="mt-3 leading-relaxed text-ink-soft">{o.pour}</p>
                    <p className="mt-3 border-l-2 border-coral-soft bg-cream-soft py-2 pl-4 pr-3 text-[15px] leading-relaxed text-ink">
                      <span className="font-semibold">Le piège : </span>
                      {o.piege}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Avant le code</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            La fiche d’une page. Un agent sans fiche est un agent dont on ne sait pas s’il a réussi.
          </h2>
          <ol className="mt-10 space-y-5">
            {fiche.map((texte, i) => (
              <li key={texte} id={`fiche-${i + 1}`} className="flex gap-4 scroll-mt-24">
                <span className="font-serif text-2xl font-medium leading-none text-coral">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="leading-relaxed text-ink-soft">{texte}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-[18px] border border-line bg-white p-7">
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
                Ce que ça coûte, au 4 octobre 2026
              </span>
              <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-ink-soft">
                <li>Sonnet 5.5 : 2 $ le million de tokens en entrée, 10 $ en sortie. Haiku 4.5 : 1 $ et 5 $. Opus 5.5 : 4 $ et 20 $.</li>
                <li>Agent géré : 0,08 $ par heure de session en cours, l’attente ne compte pas.</li>
                <li>Recherche web côté serveur : 10 $ pour 1 000 recherches.</li>
                <li>Les tokens dominent l’infrastructure d’un ordre de grandeur : négociez votre contexte, pas votre hébergeur.</li>
              </ul>
            </div>
            <div className="rounded-[18px] border-[1.5px] border-coral bg-white p-7">
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-coral">
                Ce qui protège vraiment
              </span>
              <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-ink-soft">
                <li>Les secrets hors de l’agent : proxy d’injection, ou coffre des agents gérés.</li>
                <li>Le réseau limité à une liste d’hôtes, relue à chaque nouvel outil.</li>
                <li>Un outil retiré plutôt qu’un outil interdit par le prompt.</li>
                <li>Une approbation humaine sur chaque geste irréversible, et un budget qui arrête la session.</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-cream-soft py-16 md:py-24">
        <Container size="narrow">
          <h2 className="font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Le parcours « Construire ton agent IA avec Claude » : sept leçons, la première en accès libre.
          </h2>
          <p className="mt-5 max-w-[620px] text-lg leading-relaxed text-muted">
            De l’agent personnel sur votre machine (OpenClaw, Hermes) à l’agent
            de production planifié et budgété (Agent SDK, agents gérés), en
            passant par Claude Code en tâche planifiée et n8n. Sourcé sur la
            documentation officielle relevée le 4 octobre 2026, avec un défi
            cochable par leçon et le modèle de menace en dernière leçon.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/courses/construire-ton-agent-ia" variant="primary" size="lg">
              Lire la première leçon
            </Button>
            <Button href="/kit?src=guide-agent-ia" variant="ghost" size="lg">
              Le kit gratuit, 15 prompts
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Questions fréquentes</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Créer un agent IA : ce qu’on nous demande.
          </h2>
          <dl className="mt-10 divide-y divide-line border-y border-line">
            {faq.map((item) => (
              <div key={item.q} className="py-7">
                <dt className="font-serif text-xl font-medium leading-snug text-ink">{item.q}</dt>
                <dd className="mt-3 leading-relaxed text-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-[15px] text-muted">
            À lire ensuite :{" "}
            <Link href="/claude-code-skills" className="font-semibold text-coral hover:text-coral-dark">
              les skills, plugins et mods de Claude Code
            </Link>{" "}
            ·{" "}
            <Link href="/prompt-engineering" className="font-semibold text-coral hover:text-coral-dark">
              le prompt engineering
            </Link>{" "}
            ·{" "}
            <Link href="/formation-ia-obligatoire-ai-act" className="font-semibold text-coral hover:text-coral-dark">
              l’obligation de formation de l’AI Act
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
