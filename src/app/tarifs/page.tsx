import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { BonusBar } from "@/components/landing/bonus-bar";
import { PricingTeaser } from "@/components/landing/pricing-teaser";
import { ProofMeasures } from "@/components/landing/proof-measures";
import { ValueStack } from "@/components/landing/value-stack";
import { Guarantee } from "@/components/landing/guarantee";
import { FAQ } from "@/components/landing/faq";
import { FinalCTA } from "@/components/landing/final-cta";
import { ELITE_ENABLED } from "@/lib/stripe/plans";
import { pageMetadata } from "@/lib/seo/page-metadata";

// Le titre et le balisage doivent suivre le catalogue RÉELLEMENT ouvert :
// ouvrir ou fermer le Pass Accompagnement sans les mettre à jour laisserait une
// page qui annonce des prix qu'elle n'affiche plus — et un balisage que Google
// reprend tel quel dans ses résultats.
export const metadata: Metadata = pageMetadata({
  path: "/tarifs",
  title: ELITE_ENABLED
    ? "Prix de la formation Claude AI : 47 €, 497 € ou 1 497 €"
    : "Prix de la formation Claude AI : 47 € ou 497 €, sans CPF ni devis",
  description: ELITE_ENABLED
    ? "Starter 47 €, Mastery 497 € (ou 3 × 165,67 € sans frais) et Accompagnement 1 497 € : paiement unique, accès à vie, sans CPF. Garantie 14 jours."
    : "Pass Starter 47 €, Pass Mastery 497 € (ou 3 × 165,67 € sans frais) : paiement unique, accès à vie, sans CPF ni devis. Garantie 14 jours.",
});

// Produit numérique : aucune livraison physique (accès en ligne immédiat) et
// garantie « satisfait ou remboursé » 14 jours. On déclare malgré tout
// shippingDetails (à 0 €, 0 jour) et hasMerchantReturnPolicy pour satisfaire
// les exigences des fiches de marchand Google et lever les avertissements.
const shippingDetails = {
  "@type": "OfferShippingDetails",
  shippingRate: {
    "@type": "MonetaryAmount",
    value: "0",
    currency: "EUR",
  },
  shippingDestination: {
    "@type": "DefinedRegion",
    addressCountry: "FR",
  },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    handlingTime: {
      "@type": "QuantitativeValue",
      minValue: 0,
      maxValue: 0,
      unitCode: "DAY",
    },
    transitTime: {
      "@type": "QuantitativeValue",
      minValue: 0,
      maxValue: 0,
      unitCode: "DAY",
    },
  },
};

// Pas de `returnMethod` : un accès en ligne ne se renvoie pas par la poste
// (la valeur « retour par courrier » déclarée avant le 15/10/2026 était fausse).
// Le champ est recommandé par Google, pas obligatoire.
const hasMerchantReturnPolicy = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "FR",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 14,
  returnFees: "https://schema.org/FreeReturn",
};

const offersJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Formation ClaudeAI Academy",
  description:
    "Formation en ligne francophone pour maîtriser Claude AI : 9 parcours, 58 leçons, 170 prompts, mentor IA. Paiement unique, accès à vie, garantie 14 jours.",
  url: "https://www.claudeai-academy.com/tarifs",
  image: "https://www.claudeai-academy.com/og.png",
  brand: { "@type": "Brand", name: "ClaudeAI Academy" },
  offers: [
    {
      "@type": "Offer",
      name: "Pass Starter",
      price: "47",
      priceCurrency: "EUR",
      url: "https://www.claudeai-academy.com/tarifs#starter",
      availability: "https://schema.org/InStock",
      shippingDetails,
      hasMerchantReturnPolicy,
    },
    {
      "@type": "Offer",
      name: "Pass Mastery",
      price: "497",
      priceCurrency: "EUR",
      url: "https://www.claudeai-academy.com/tarifs#mastery",
      availability: "https://schema.org/InStock",
      shippingDetails,
      hasMerchantReturnPolicy,
    },
    ...(ELITE_ENABLED
      ? [
          {
            "@type": "Offer",
            name: "Pass Accompagnement",
            price: "1497",
            priceCurrency: "EUR",
            url: "https://www.claudeai-academy.com/tarifs#accompagnement",
            availability: "https://schema.org/InStock",
            shippingDetails,
            hasMerchantReturnPolicy,
          },
        ]
      : []),
  ],
};

export default function TarifsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersJsonLd) }}
      />
      <BonusBar />
      <PricingHero />
      {/* Le coût du problème avant le prix (Hormozi, principe 5) : les temps
          mesurés du fondateur et le calcul « si », juste avant les cartes. */}
      <ProofMeasures />
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
          <Link href="/" className="hover:text-coral transition-colors">
            Accueil
          </Link>
          <span aria-hidden="true" className="mx-2 opacity-50">
            /
          </span>
          <span className="text-ink-soft">Tarifs</span>
        </nav>

        <Eyebrow>Investissement et accès</Eyebrow>
        <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.75rem)] font-medium leading-[1.05] tracking-tight text-ink">
          Formation Claude AI :{" "}
          <span className="accent-serif">vous payez une fois, vous gardez l&apos;accès à vie</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted max-w-[640px]">
          Pas d&apos;abonnement, pas d&apos;engagement, pas de frais cachés,
          et pas de dossier CPF ni de devis à attendre : vous commencez dans
          les 5 minutes. Vous testez 14 jours, et si le programme ne vous va
          pas, vous êtes remboursé sans avoir à vous justifier.
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
