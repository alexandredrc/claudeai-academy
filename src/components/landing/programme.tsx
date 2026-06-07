import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import Link from "next/link";

type Parcours = {
  slug: string;
  emoji: string;
  title: string;
  meta: string;
  role: string;
  description: string;
  skills: string[];
  featured?: boolean;
};

const parcours: Parcours[] = [
  {
    slug: "claude-code",
    emoji: "⌨️",
    title: "Claude Code",
    meta: "8 leçons · 4 h",
    role: "Pour les développeurs qui veulent passer en mode 10×",
    description:
      "L'agent de coding qui s'exécute dans votre terminal. Installation, slash commands, hooks, MCP : faites-en votre nouvel environnement de travail.",
    skills: [
      "Installation, premier projet, fichier CLAUDE.md",
      "Slash commands et skills réutilisables",
      "Hooks pour automatiser les invariants",
      "MCP pour connecter vos outils internes",
      "Patterns de productivité au quotidien",
    ],
    featured: true,
  },
  {
    slug: "prompt-engineering",
    emoji: "💬",
    title: "Prompt Engineering",
    meta: "10 leçons · 5 h",
    role: "Le socle, indispensable pour le reste",
    description:
      "Maîtrisez les fondamentaux du prompting, la structuration XML, le few-shot, le multi-turn, et la sécurité face aux injections.",
    skills: [
      "Les 6 ingrédients d'un prompt qui marche",
      "Structurer avec XML et balises typées",
      "Few-shot, chain-of-thought, multi-turn",
      "Architecture d'agents et tool use",
      "Sécurité : injection, jailbreak, fuite",
    ],
  },
  {
    slug: "ia-business",
    emoji: "📊",
    title: "IA & Business",
    meta: "3 leçons · 1 h 30",
    role: "Pour les managers qui pilotent la transformation IA",
    description:
      "Identifier les cas d'usage à fort ROI, conduire l'adoption, installer la gouvernance. Sans bullshit ni POC orphelin.",
    skills: [
      "Grille de scoring des cas d'usage",
      "Conduite du changement et adoption",
      "RGPD, IA Act, comité IA",
      "Choisir ses fournisseurs",
      "Mesurer l'impact réel",
    ],
  },
  {
    slug: "ia-marketing",
    emoji: "🚀",
    title: "IA & Marketing",
    meta: "3 leçons · 1 h 30",
    role: "Pour les marketers qui veulent industrialiser",
    description:
      "Brief IA, charte de voix, garde-fous éditoriaux, SEO post-AIO, automation CRM. La méthode complète, sans la pensée magique.",
    skills: [
      "Industrialiser la production de contenus",
      "Recherche d'angles et clusters thématiques",
      "Optimisation pour les résumés IA",
      "Qualification des leads automatique",
      "Personnalisation à grande échelle",
    ],
  },
  {
    slug: "data-ia",
    emoji: "📈",
    title: "Data & IA",
    meta: "3 leçons · 1 h 30",
    role: "Pour les analystes qui veulent gagner un facteur 5 à 10",
    description:
      "Profilage rapide, détection d'anomalies, SQL généré et optimisé, storytelling exécutif. L'IA comme bras droit, pas comme remplaçant.",
    skills: [
      "Analyse exploratoire augmentée",
      "SQL : génération, debug, optimisation",
      "Synthèse exécutive en 3 temps",
      "Dashboards qui parlent",
      "Anticiper les questions du décideur",
    ],
  },
];

export function Programme() {
  const featured = parcours.find((p) => p.featured)!;
  const others = parcours.filter((p) => !p.featured);

  return (
    <section id="programme" className="bg-cream py-24 md:py-32">
      <Container>
        <div className="text-center mb-14">
          <Eyebrow align="center">Le programme</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium leading-[1.1] tracking-tight text-ink">
            5 parcours pour <span className="accent-serif">tout couvrir</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted max-w-[640px] mx-auto">
            Du prompt fondamental à l&apos;agent autonome, en passant par le code,
            le business, le marketing et la data. Chaque parcours est
            indépendant, vous les suivez dans l&apos;ordre qui vous arrange.
          </p>
        </div>

        {/* Featured card en pleine largeur (Claude Code) */}
        <FeaturedParcoursCard p={featured} />

        {/* 4 autres en grille 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {others.map((p) => (
            <ParcoursCard key={p.slug} p={p} />
          ))}
        </div>

        {/* Bonus toolkit */}
        <BonusBlock />
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
            href={`/programme/${p.slug}`}
            className="inline-flex items-center gap-1.5 mt-7 text-coral-soft font-semibold hover:text-coral transition-colors"
          >
            Voir le détail
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <ul className="space-y-3 self-center">
          {p.skills.map((s) => (
            <li key={s} className="flex items-start gap-3 text-cream/85 text-[15px]">
              <span aria-hidden="true" className="mt-[10px] block w-3 h-[2px] bg-coral shrink-0" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
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
      <ul className="mt-5 space-y-2.5 flex-1">
        {p.skills.map((s) => (
          <li key={s} className="flex items-start gap-3 text-ink-soft text-[14px]">
            <span aria-hidden="true" className="mt-[9px] block w-3 h-[2px] bg-coral shrink-0" />
            <span>{s}</span>
          </li>
        ))}
      </ul>
      <Link
        href={`/programme/${p.slug}`}
        className="inline-flex items-center gap-1.5 mt-6 text-coral font-semibold hover:text-coral-dark transition-colors self-start"
      >
        Voir le détail
        <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

function BonusBlock() {
  const bonus = [
    "120+ prompts prêts à l'emploi",
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
        En plus des 5 parcours, votre Pass Mastery donne accès à une bibliothèque
        opérationnelle disponible dès le jour 1.
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
