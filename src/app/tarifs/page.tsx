import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { PricingTeaser } from "@/components/landing/pricing-teaser";
import { ValueStack } from "@/components/landing/value-stack";
import { Guarantee } from "@/components/landing/guarantee";
import { FAQ } from "@/components/landing/faq";
import { FinalCTA } from "@/components/landing/final-cta";

export const metadata: Metadata = {
  title: "Tarifs ClaudeAI Academy, Pass Starter 47 € ou Mastery 497 €",
  description:
    "Pass Starter à 47 € pour découvrir, Pass Mastery à 497 € (ou 3×179 €) pour tous les parcours complets. Garantie 14 jours satisfait ou remboursé.",
  alternates: { canonical: "/tarifs" },
};

const offersJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Formation ClaudeAI Academy",
  description:
    "Formation en ligne francophone pour maîtriser Claude AI : 7 parcours, 40 leçons, 170 prompts, mentor IA. Paiement unique, accès à vie, garantie 14 jours.",
  url: "https://www.claudeai-academy.com/tarifs",
  image: "https://www.claudeai-academy.com/og.png",
  brand: { "@type": "Organization", name: "ClaudeAI Academy" },
  offers: [
    {
      "@type": "Offer",
      name: "Pass Starter",
      price: "47",
      priceCurrency: "EUR",
      url: "https://www.claudeai-academy.com/tarifs#starter",
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "Offer",
      name: "Pass Mastery",
      price: "497",
      priceCurrency: "EUR",
      url: "https://www.claudeai-academy.com/tarifs#mastery",
      availability: "https://schema.org/InStock",
    },
  ],
};

export default function TarifsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersJsonLd) }}
      />
      <PricingHero />
      <PricingTeaser />
      <ValueStack />
      <Guarantee />
      <FAQ />
      <FinalCTA />
    </>
  );
}

function PricingHero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-12 md:pt-24 md:pb-16">
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-32 w-[460px] h-[460px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(242,213,199,0.9), transparent 70%)",
        }}
      />
      <Container size="narrow">
        <nav className="text-[13px] text-muted mb-5" aria-label="Fil d'Ariane">
          <a href="/" className="hover:text-coral transition-colors">
            Accueil
          </a>
          <span aria-hidden="true" className="mx-2 opacity-50">
            /
          </span>
          <span className="text-ink-soft">Tarifs</span>
        </nav>

        <Eyebrow>Investissement et accès</Eyebrow>
        <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.75rem)] font-medium leading-[1.05] tracking-tight text-ink">
          Deux formules, <span className="accent-serif">une seule promesse</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted max-w-[640px]">
          Vous payez une fois, vous gardez l&apos;accès à vie, et vous testez
          14 jours sans risque. Pas d&apos;abonnement, pas d&apos;engagement,
          pas de frais cachés.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="#mastery" variant="primary">
            Voir le Pass Mastery
          </Button>
          <Button href="#starter" variant="ghost">
            Commencer avec Starter
          </Button>
        </div>
      </Container>
    </section>
  );
}
