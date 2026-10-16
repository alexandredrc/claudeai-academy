import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCatalogStats } from "@/lib/courses/stats";
import { dateFr, getDerniereMajParParcours } from "@/lib/content/changelog";

// Présentation marketing par parcours (emoji, public cible, compétences).
// Clé = slug RÉEL en base. Le reste (titre, description, nb de leçons, durée)
// vient de la base — la section reflète donc toujours le vrai catalogue.
type Presentation = {
  emoji: string;
  role: string;
  skills: string[];
  featured?: boolean;
};

const PRESENTATION: Record<string, Presentation> = {
  "bien-demarrer-avec-claude": {
    emoji: "🚦",
    role: "Le point de départ, même sans aucune base",
    // Parcours mis en avant depuis le 15/10/2026 : le public visé est non
    // technique, il commence ici (avant : Claude Code, « pour les devs »).
    featured: true,
    skills: [
      "Installer Claude partout : web, ordinateur, mobile",
      "Choisir son plan et le bon modèle sans se tromper",
      "Paramétrer les réglages qui comptent (mémoire, capacités)",
      "Personnaliser Claude : qui vous êtes, comment il doit répondre",
      "Mémoire, projets et les 10 réflexes de la première semaine",
    ],
  },
  "prompt-engineering-pro": {
    emoji: "💬",
    role: "Le socle, indispensable pour tout le reste",
    skills: [
      "Être clair et directif (la règle d'or d'Anthropic)",
      "Donner le contexte et le pourquoi",
      "Piloter par l'exemple (few-shot)",
      "Structurer avec des balises XML et le contexte long",
      "Faire raisonner, chaîner et auto-corriger",
    ],
  },
  "claude-code-ia-agentic": {
    emoji: "⌨️",
    role: "Pour que Claude agisse sur vos fichiers, pas seulement qu'il réponde",
    skills: [
      "Ce qui change vraiment avec un agent dans le terminal",
      "Hooks, MCP et sub-agents",
      "Architecturer un workflow agentic qui tient la route",
    ],
  },
  "claude-data-sql": {
    emoji: "📊",
    role: "Pour ceux qui interrogent des bases de données en SQL",
    skills: [
      "Pourquoi Claude marche si bien pour le SQL",
      "Prompts pour requêtes analytiques",
      "Vérifier (et ne pas faire confiance aveuglément à) une requête générée",
    ],
  },
  "contenu-et-marketing": {
    emoji: "🚀",
    role: "Pour vos publications, emails et pages, sans texte générique",
    skills: [
      "Pourquoi Claude est souvent médiocre en marketing (et comment corriger)",
      "Construire un brief de voix réutilisable",
      "Industrialiser sans perdre votre voix de marque",
    ],
  },
  "strategie-conduite-ia": {
    emoji: "🧭",
    role: "Pour décider où l'IA vaut le coup dans votre entreprise",
    skills: [
      "Identifier un bon cas d'usage (et écarter les faux)",
      "Prioriser un portefeuille de cas d'usage",
      "Le vrai coût d'un projet IA",
    ],
  },
  "trading-claude-code": {
    emoji: "📈",
    role: "Pour bâtir son arsenal quant (outillage, pas conseil financier)",
    skills: [
      "Claude Code comme pair-programmeur, pas comme oracle",
      "Backtester une idée sans se mentir",
      "Coder le risque : sizing et stops",
      "Automatiser la recherche, avec garde-fous",
    ],
  },
  "prompts-skills-github-securite": {
    emoji: "🛡️",
    role: "Pour adopter l'open-source sans se faire pirater",
    skills: [
      "Trouver et évaluer prompts, skills et serveurs MCP",
      "Ce qu'une installation accorde vraiment",
      "Modèle de menace : injection, exfiltration, supply chain",
      "La checklist de vetting + le sandbox",
    ],
  },
  "construire-ton-agent-ia": {
    emoji: "🤖",
    role: "Pour construire un agent qui travaille seul, et le cadrer",
    skills: [
      "Workflow ou agent : décider avant d'écrire une ligne",
      "Un agent personnel sur ta machine (OpenClaw, Hermes) sans porte ouverte",
      "Claude Code en tâche planifiée, Claude dans n8n",
      "Agent SDK : bornes, hooks, sortie structurée, sous-agents",
      "Agents gérés : budget en dollars, planning, secrets en coffre",
      "Modèle de menace et obligations du déployeur (AI Act, RGPD)",
    ],
  },
};

// Parcours sans prérequis technique, montrés juste après « Bien démarrer »
// (16/10/2026) : sur 9 parcours, 5 visent des profils techniques, et le
// public choisi le 15/10 (indépendants, TPE) les lisait avant les siens.
const PARCOURS_QUOTIDIEN = [
  "prompt-engineering-pro",
  "contenu-et-marketing",
  "strategie-conduite-ia",
];

const DEFAULT_PRESENTATION: Presentation = {
  emoji: "📚",
  role: "Parcours du programme",
  skills: [],
};

type CourseRow = {
  slug: string;
  title: string;
  description: string | null;
  total_lessons: number;
  estimated_duration_min: number | null;
};

type Parcours = Presentation & {
  slug: string;
  title: string;
  description: string;
  meta: string;
  /** Date (AAAA-MM-JJ) de la note `:::maj` la plus récente du parcours, s'il en a une. */
  majIso: string | null;
};

function formatDuration(min: number | null): string | null {
  if (!min) return null;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${String(m).padStart(2, "0")}`;
}

export async function Programme() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("slug, title, description, total_lessons, estimated_duration_min")
    .order("display_order");
  const [stats, derniereMaj] = await Promise.all([
    getCatalogStats(),
    getDerniereMajParParcours(),
  ]);

  const rows = (data ?? []) as CourseRow[];
  const parcours: Parcours[] = rows.map((c) => {
    const pres = PRESENTATION[c.slug] ?? DEFAULT_PRESENTATION;
    const duration = formatDuration(c.estimated_duration_min);
    return {
      ...pres,
      slug: c.slug,
      title: c.title,
      description: c.description ?? "",
      meta: duration ? `${c.total_lessons} leçons · ${duration}` : `${c.total_lessons} leçons`,
      majIso: derniereMaj[c.slug] ?? null,
    };
  });

  if (parcours.length === 0) return null;

  const featured = parcours.find((p) => p.featured) ?? parcours[0];
  const others = parcours.filter((p) => p.slug !== featured.slug);
  // Un parcours absent des deux listes (nouveau slug en base) tombe dans
  // « pour aller plus loin » plutôt que de disparaître.
  const quotidien = others.filter((p) => PARCOURS_QUOTIDIEN.includes(p.slug));
  const avances = others.filter((p) => !PARCOURS_QUOTIDIEN.includes(p.slug));

  return (
    <section id="programme" className="scroll-mt-24 bg-cream py-24 md:py-32">
      <Container>
        <div className="text-center mb-14">
          <Eyebrow align="center">Le programme</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium leading-[1.1] tracking-tight text-ink">
            {stats.courseCount} parcours :{" "}
            <span className="accent-serif">
              {quotidien.length + 1} pour votre quotidien
            </span>
            , {avances.length} pour aller plus loin
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted max-w-[640px] mx-auto">
            Les {quotidien.length + 1} premiers servent à tout le monde, sans
            une ligne de code : emails, devis, comptes rendus, publications,
            décisions. Les {avances.length} autres sont optionnels, pour ceux
            qui veulent aller vers le code, la data ou les agents.
          </p>
        </div>

        <FeaturedParcoursCard p={featured} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {quotidien.map((p) => (
            <ParcoursCard key={p.slug} p={p} />
          ))}
        </div>

        {avances.length > 0 && (
          <>
            <div className="mt-16 mb-8 text-center">
              <h3 className="font-serif text-2xl md:text-3xl font-medium text-ink">
                Pour aller plus loin, si vous le voulez
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted max-w-[580px] mx-auto">
                Optionnels. Des bases de programmation aident, chaque parcours
                démarre par l&apos;essentiel.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {avances.map((p) => (
                <ParcoursCard key={p.slug} p={p} />
              ))}
            </div>
          </>
        )}

        <BonusBlock courseCount={stats.courseCount} />
      </Container>
    </section>
  );
}

function FeaturedParcoursCard({ p }: { p: Parcours }) {
  return (
    <article className="relative bg-gradient-to-br from-ink to-[#2D2A26] text-cream rounded-[22px] p-9 md:p-12 border border-ink overflow-hidden">
      <span className="absolute top-7 right-7 inline-flex items-center gap-1.5 bg-coral text-cream text-[12px] font-semibold px-3 py-1.5 rounded-full">
        <span>
          <span aria-hidden="true">★</span>{" "}
          Commencez ici
        </span>
      </span>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16">
        <div>
          {/* Empilées sous lg : le badge « Commencez ici », en position
              absolue à droite, recouvrirait une seconde pastille posée sur la
              même ligne entre ~450 et ~580 px de large. */}
          <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center">
            <div className="inline-flex items-center gap-2 bg-coral/20 text-coral-soft px-3 py-1.5 rounded-full text-[12px] font-semibold tracking-wider">
              {p.meta}
            </div>
            <PastilleMaj p={p} sombre />
          </div>
          <h3 className="mt-5 font-serif text-3xl md:text-4xl font-semibold leading-tight">
            <span aria-hidden="true" className="mr-2 align-middle">{p.emoji}</span>
            {p.title}
          </h3>
          <p className="mt-2 text-coral font-medium text-[15px]">{p.role}</p>
          <p className="mt-5 text-cream/75 leading-relaxed max-w-[520px]">
            {p.description}
          </p>
          <Link
            href={`/courses/${p.slug}`}
            className="inline-flex items-center gap-1.5 mt-7 text-coral-soft font-semibold hover:text-coral transition-colors"
          >
            Voir le détail
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {p.skills.length > 0 && (
          <ul className="space-y-3 self-center">
            {p.skills.map((s) => (
              <li key={s} className="flex items-start gap-3 text-cream/85 text-[15px]">
                <span aria-hidden="true" className="mt-[10px] block w-3 h-[2px] bg-coral shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

function ParcoursCard({ p }: { p: Parcours }) {
  return (
    <article className="bg-white border border-line rounded-[22px] p-9 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_4px_8px_rgba(31,31,30,0.05),0_24px_48px_rgba(31,31,30,0.10)] hover:border-coral">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-1.5 bg-cream-dark text-ink-soft px-3 py-1.5 rounded-full text-[12px] font-semibold tracking-wider">
          {p.meta}
        </div>
        <PastilleMaj p={p} />
      </div>
      <h3 className="mt-5 font-serif text-2xl font-semibold text-ink leading-tight">
        <span aria-hidden="true" className="mr-2 align-middle">{p.emoji}</span>
        {p.title}
      </h3>
      <p className="mt-1.5 text-coral font-medium text-[14px]">{p.role}</p>
      <p className="mt-4 text-muted leading-relaxed text-[15px]">{p.description}</p>
      {p.skills.length > 0 && (
        <ul className="mt-5 space-y-2.5 flex-1">
          {p.skills.map((s) => (
            <li key={s} className="flex items-start gap-3 text-ink-soft text-[14px]">
              <span aria-hidden="true" className="mt-[9px] block w-3 h-[2px] bg-coral shrink-0" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}
      <Link
        href={`/courses/${p.slug}`}
        className="inline-flex items-center gap-1.5 mt-6 text-coral font-semibold hover:text-coral-dark transition-colors self-start"
      >
        Voir le détail
        <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

/**
 * « Mis à jour le … » : date de la dernière note datée du parcours, lue dans
 * les leçons (jamais la date du jour). Mène au journal filtré sur ce parcours.
 * Sans note, rien ne s'affiche.
 */
function PastilleMaj({ p, sombre = false }: { p: Parcours; sombre?: boolean }) {
  if (!p.majIso) return null;
  const date = dateFr(p.majIso);
  return (
    <Link
      href={`/changelog?parcours=${p.slug}`}
      aria-label={`Mis à jour le ${date} : voir les notes du parcours ${p.title}`}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
        sombre
          ? "border-cream/20 text-cream/80 hover:border-cream/50 hover:text-cream"
          : "border-line text-ink-soft hover:border-coral hover:text-coral"
      }`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
      Mis à jour le {date}
    </Link>
  );
}

function BonusBlock({ courseCount }: { courseCount: number }) {
  const bonus = [
    // Audit du 10/10/2026 : seulement ce qui existe dans l'app.
    "Bibliothèque de prompts prêts à l'emploi",
    "QCM d'auto-évaluation à chaque leçon",
    "Examen de certification et certificat vérifiable",
    "Mentor IA Claude 24/7",
  ];

  return (
    <div className="mt-14 max-w-[880px] mx-auto bg-cream-soft border border-dashed border-coral rounded-[22px] p-8 md:p-10 text-center">
      <Eyebrow align="center">Bonus inclus dans Mastery</Eyebrow>
      <h3 className="mt-3 font-serif text-2xl font-semibold text-ink">
        <span aria-hidden="true">📚</span>{" "}
        Bibliothèque et toolkit complets
      </h3>
      <p className="mt-3 text-ink-soft max-w-[560px] mx-auto leading-relaxed">
        En plus des {courseCount} parcours, votre Pass Mastery donne accès à une
        bibliothèque opérationnelle disponible dès le jour 1.
      </p>
      <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 max-w-[520px] mx-auto text-left">
        {bonus.map((b) => (
          <li key={b} className="relative pl-6 text-[14px] text-ink-soft">
            <span aria-hidden="true" className="absolute left-0 top-0 text-coral font-bold">✓</span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
