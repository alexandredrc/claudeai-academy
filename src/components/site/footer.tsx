import Link from "next/link";
import { Logo } from "./logo";
import { InstagramIcon, INSTAGRAM_URL, INSTAGRAM_HANDLE } from "./instagram";

const parcoursLinks = [
  { href: "/courses/bien-demarrer-avec-claude", label: "Bien démarrer avec Claude" },
  { href: "/courses/prompt-engineering-pro", label: "Prompt Engineering pro" },
  { href: "/courses/claude-code-ia-agentic", label: "Claude Code et l'IA agentique" },
  { href: "/courses/claude-data-sql", label: "Claude pour data et SQL" },
  { href: "/courses/contenu-et-marketing", label: "Contenu et marketing" },
  { href: "/courses/strategie-conduite-ia", label: "Stratégie et conduite IA" },
  { href: "/courses/trading-claude-code", label: "Trading + Claude Code" },
  { href: "/courses/prompts-skills-github-securite", label: "Prompts & Skills : sécurité" },
  { href: "/courses/construire-ton-agent-ia", label: "Construire ton agent IA" },
];

// Pages piliers organiques : elles ont besoin d'un lien depuis chaque page du
// site pour recevoir de l'autorité interne. C'est ce qui les fait remonter.
// Audit SEO du 15/10/2026 : cinq pages indexables n'avaient aucun lien entrant
// crawlable (certification, Excel, gratuit, télécharger, Cowork). Elles sont
// réparties ici en deux colonnes pour rester lisibles : les guides de
// formation, puis les guides d'usage de Claude.
const guidesLinks = [
  { href: "/formation-intelligence-artificielle", label: "Formation intelligence artificielle" },
  { href: "/formation-ia-independants-tpe", label: "IA pour indépendants et TPE" },
  { href: "/formation-claude-code", label: "Formation Claude Code" },
  { href: "/prompt-engineering", label: "Le prompt engineering" },
  { href: "/creer-un-agent-ia", label: "Créer un agent IA" },
  { href: "/certification-claude-ai", label: "Certification Claude AI" },
  { href: "/formation-ia-obligatoire-ai-act", label: "Formation IA et AI Act" },
];

const pratiqueLinks = [
  { href: "/claude-vs-chatgpt", label: "Claude ou ChatGPT ?" },
  { href: "/claude-ai-gratuit", label: "Claude AI gratuit ou Pro" },
  { href: "/telecharger-claude", label: "Télécharger Claude" },
  { href: "/claude-excel-powerpoint", label: "Claude dans Excel et PowerPoint" },
  { href: "/claude-cowork", label: "Claude Cowork" },
  { href: "/claude-code-skills", label: "Claude Code : skills, plugins, mods" },
  { href: "/prompts", label: "Bibliothèque de prompts" },
  { href: "/kit", label: "Kit gratuit, 15 prompts" },
];

// Pas de prix Mastery dans le pied de page : il change le 01/11/2026
// (lib/offre/prix.ts) et le layout racine n'est pas re-rendu lors d'une
// navigation interne, le montant y resterait périmé jusqu'au rechargement.
function academieLinks() {
  return [
    { href: "/tarifs#starter", label: "Pass Starter, 47 €" },
    { href: "/tarifs#mastery", label: "Pass Mastery, le programme complet" },
    { href: "/faq", label: "FAQ et objections" },
    { href: "/changelog", label: "Journal des mises à jour" },
    { href: "/a-propos", label: "À propos" },
    { href: "/contact", label: "Contact" },
    { href: "/login", label: "Mon espace" },
  ];
}

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/cgv", label: "CGV" },
];

export function Footer() {
  return (
    <footer className="bg-ink text-cream/70 pt-20 pb-6 mt-auto">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 gap-10 pb-12 border-b border-cream/10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          <div>
            <Logo variant="light" />
            <p className="mt-4 text-[14px] leading-relaxed max-w-[280px] text-cream/65">
              La référence francophone pour maîtriser Claude et l&apos;IA générative en pratique.
            </p>
            <p className="mt-4 text-[13px] text-cream/50">
              <a
                href="mailto:contact@claudeai-academy.com"
                className="hover:text-coral transition-colors"
              >
                contact@claudeai-academy.com
              </a>
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-[13px] text-cream/50 hover:text-coral transition-colors"
            >
              <InstagramIcon className="w-[18px] h-[18px]" />
              <span>{INSTAGRAM_HANDLE} : posez vos questions en DM</span>
            </a>
          </div>

          <FooterColumn title="Parcours" links={parcoursLinks} />
          <FooterColumn title="Guides" links={guidesLinks} />
          <FooterColumn title="Claude en pratique" links={pratiqueLinks} />
          <FooterColumn title="L'académie" links={academieLinks()} />
        </div>

        {/* Désambiguïsation de la marque : le nom est proche de « Claude
            Academy », la plateforme d'Anthropic. La même mention existe déjà
            sur le pied anglais et les pages certification. */}
        <p className="pt-6 text-[12px] leading-relaxed text-cream/45">
          ClaudeAI Academy est un organisme de formation indépendant, non
          affilié à Anthropic. Claude est une marque d&apos;Anthropic PBC.
        </p>

        <div className="pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[13px] text-cream/55">
          <p>
            © {new Date().getFullYear()} ClaudeAI Academy. Édité par ADRC Group, RCS Nanterre 892 303 082.
          </p>
          <ul className="flex flex-wrap gap-5">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-coral transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      {/* Un paragraphe, pas un h4 : le pied suit des h2 sur toutes les pages,
          un h4 créait un saut de niveau dans la hiérarchie des titres. */}
      <p className="text-cream text-[13px] font-semibold uppercase tracking-[0.08em] mb-4">
        {title}
      </p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-[14px] text-cream/70 hover:text-coral transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
