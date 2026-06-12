import Link from "next/link";
import { Logo } from "./logo";

const parcoursLinks = [
  { href: "/courses/prompt-engineering-pro", label: "Prompt Engineering pro" },
  { href: "/courses/claude-code-ia-agentic", label: "Claude Code et IA agentic" },
  { href: "/courses/claude-data-sql", label: "Claude pour data et SQL" },
  { href: "/courses/contenu-et-marketing", label: "Contenu et marketing" },
  { href: "/courses/strategie-conduite-ia", label: "Stratégie et conduite IA" },
  { href: "/courses/trading-claude-code", label: "Trading + Claude Code" },
  { href: "/courses/prompts-skills-github-securite", label: "Prompts & Skills : sécurité" },
];

const tarifsLinks = [
  { href: "/tarifs#starter", label: "Pass Starter, 47 €" },
  { href: "/tarifs#mastery", label: "Pass Mastery, 497 €" },
  { href: "/faq", label: "FAQ et objections" },
];

const academieLinks = [
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Mon espace" },
];

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/cgv", label: "CGV" },
];

export function Footer() {
  return (
    <footer className="bg-ink text-cream/70 pt-20 pb-6 mt-auto">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 pb-12 border-b border-cream/10">
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
          </div>

          <FooterColumn title="Parcours" links={parcoursLinks} />
          <FooterColumn title="Tarifs" links={tarifsLinks} />
          <FooterColumn title="L'académie" links={academieLinks} />
        </div>

        <div className="pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[13px] text-cream/55">
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
      <h4 className="text-cream text-[13px] font-semibold uppercase tracking-[0.08em] mb-4">
        {title}
      </h4>
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
