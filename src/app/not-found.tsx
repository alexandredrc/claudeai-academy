import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";

// Page 404 du site. Next renvoie déjà le code 404 et un `noindex` : rien à
// ajouter ici côté robots. Avant cette page, un lien cassé affichait la page
// anglaise par défaut de Next (« This page could not be found ») sans aucun
// lien vers le site (audit SEO du 15/10/2026, point 22).
export const metadata: Metadata = {
  title: "Page introuvable | ClaudeAI Academy",
};

const liens = [
  {
    href: "/kit",
    label: "Le kit de démarrage gratuit",
    detail: "15 prompts prêts à copier, sans achat",
  },
  {
    href: "/prompts",
    label: "La bibliothèque de prompts",
    detail: "Des prompts en français, classés par métier",
  },
  {
    href: "/tarifs",
    label: "Les tarifs",
    detail: "Pass Starter 47 €, Pass Mastery 497 €, garantie 14 jours",
  },
];

export default function NotFound() {
  return (
    <section className="pt-16 pb-24 md:pt-24 md:pb-32">
      <Container size="narrow">
        <Eyebrow>Erreur 404</Eyebrow>
        <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.75rem)] font-medium leading-[1.05] tracking-tight text-ink">
          Page introuvable
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted max-w-[560px]">
          L&apos;adresse que vous avez suivie n&apos;existe pas ou a changé.
          Les pages ci-dessous mènent à l&apos;essentiel.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/" variant="primary">
            Retour à l&apos;accueil
          </Button>
          <Button href="/courses" variant="ghost">
            Voir les parcours
          </Button>
        </div>

        <ul className="mt-12 divide-y divide-line rounded-[22px] border border-line bg-white">
          {liens.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="flex items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-cream-soft"
              >
                <span>
                  <span className="block text-[16px] font-semibold text-ink">
                    {l.label}
                  </span>
                  <span className="mt-1 block text-[14px] text-muted">
                    {l.detail}
                  </span>
                </span>
                <span aria-hidden="true" className="text-coral font-semibold">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-[14px] text-muted">
          Vous êtes arrivé ici depuis une de nos pages ? Signalez-le-nous :{" "}
          <a
            href="mailto:contact@claudeai-academy.com"
            className="text-coral hover:text-coral-dark transition-colors"
          >
            contact@claudeai-academy.com
          </a>
          .
        </p>
      </Container>
    </section>
  );
}
