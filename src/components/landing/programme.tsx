import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCatalogStats } from "@/lib/courses/stats";

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
    role: "Pour les devs qui veulent passer en mode 10×",
    skills: [
      "Ce qui change vraiment avec un agent dans le terminal",
      "Hooks, MCP et sub-agents",
      "Architecturer un workflow agentic qui tient la route",
    ],
    featured: true,
  },
  "claude-data-sql": {
    emoji: "📊",
    role: "Pour les analystes qui veulent un facteur 5 à 10",
    skills: [
      "Pourquoi Claude marche si bien pour le SQL",
      "Prompts pour requêtes analytiques",
      "Vérifier (et ne pas faire confiance aveuglément à) une requête générée",
    ],
  },
  "contenu-et-marketing": {
    emoji: "🚀",
    role: "Pour les marketers qui veulent industrialiser",
    skills: [
      "Pourquoi Claude est souvent médiocre en marketing (et comment corriger)",
      "Construire un brief de voix réutilisable",
      "Industrialiser sans perdre votre voix de marque",
    ],
  },
  "strategie-conduite-ia": {
    emoji: "🧭",
    role: "Pour les décideurs qui pilotent l'IA",
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
};

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
  const stats = await getCatalogStats();

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
    };
  });

  if (parcours.length === 0) return null;

  const featured = parcours.find((p) => p.featured) ?? parcours[0];
  const others = parcours.filter((p) => p.slug !== featured.slug);

  return (
    <section id="programme" className="bg-cream py-24 md:py-32">
      <Container>
        <div className="text-center mb-14">
          <Eyebrow align="center">Le programme</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium leading-[1.1] tracking-tight text-ink">
            {stats.courseCount} parcours pour <span className="accent-serif">tout couvrir</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted max-w-[640px] mx-auto">
            Du prompt fondamental à l&apos;agent autonome, en passant par le code,
            la data, le marketing, le trading et la sécurité. Chaque parcours est
            indépendant, vous les suivez dans l&apos;ordre qui vous arrange.
          </p>
        </div>

        <FeaturedParcoursCard p={featured} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {others.map((p) => (
            <ParcoursCard key={p.slug} p={p} />
          ))}
        </div>

        <BonusBlock courseCount={stats.courseCount} />
      </Container>
    </section>
  );
}

function FeaturedParcoursCard({ p }: { p: Parcours }) {
  return (
    <article className="relative bg-gradient-to-br from-ink to-[#2D2A26] text-cream rounded-[22px] p-9 md:p-12 border border-ink overflow-hidden">
      <span className="absolute top-7 right-7 inline-flex items-center gap-1.5 bg-coral text-cream text-[12px] font-semibold px-3 py-1.5 rounded-full">
        ★ Le préféré
      </span>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16">
        <div>
          <div className="inline-flex items-center gap-2 bg-coral/20 text-coral-soft px-3 py-1.5 rounded-full text-[12px] font-semibold tracking-wider">
            {p.meta}
          </div>
          <h3 className="mt-5 font-serif text-3xl md:text-4xl font-semibold leading-tight">
            <span className="mr-2 align-middle">{p.emoji}</span>
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
      <div className="inline-flex self-start items-center gap-1.5 bg-cream-dark text-ink-soft px-3 py-1.5 rounded-full text-[12px] font-semibold tracking-wider">
        {p.meta}
      </div>
      <h3 className="mt-5 font-serif text-2xl font-semibold text-ink leading-tight">
        <span className="mr-2 align-middle">{p.emoji}</span>
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

function BonusBlock({ courseCount }: { courseCount: number }) {
  const bonus = [
    "Bibliothèque de prompts prêts à l'emploi",
    "Templates de skills Claude Code",
    "Cheat sheets et mémos PDF",
    "Mentor IA Claude 24/7",
  ];

  return (
    <div className="mt-14 max-w-[880px] mx-auto bg-cream-soft border border-dashed border-coral rounded-[22px] p-8 md:p-10 text-center">
      <Eyebrow align="center">Bonus inclus dans Mastery</Eyebrow>
      <h3 className="mt-3 font-serif text-2xl font-semibold text-ink">
        📚 Bibliothèque et toolkit complets
      </h3>
      <p className="mt-3 text-ink-soft max-w-[560px] mx-auto leading-relaxed">
        En plus des {courseCount} parcours, votre Pass Mastery donne accès à une
        bibliothèque opérationnelle disponible dès le jour 1.
      </p>
      <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 max-w-[520px] mx-auto text-left">
        {bonus.map((b) => (
          <li key={b} className="relative pl-6 text-[14px] text-ink-soft">
            <span className="absolute left-0 top-0 text-coral font-bold">✓</span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
