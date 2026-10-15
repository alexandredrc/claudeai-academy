import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { Problem } from "@/components/landing/problem";
import { Method } from "@/components/landing/method";
import { Programme } from "@/components/landing/programme";
import { PromptTeaser } from "@/components/landing/prompt-teaser";
import { Profiles } from "@/components/landing/profiles";
import { ProofMeasures } from "@/components/landing/proof-measures";
import { Founder } from "@/components/landing/founder";
import { Testimonials } from "@/components/landing/testimonials";
import { PricingTeaser } from "@/components/landing/pricing-teaser";
import { ValueStack } from "@/components/landing/value-stack";
import { Guarantee } from "@/components/landing/guarantee";
import { FAQ } from "@/components/landing/faq";
import { FinalCTA } from "@/components/landing/final-cta";
import { pageMetadata } from "@/lib/seo/page-metadata";

// Title identique à celui du layout (voir le commentaire qui y justifie l'ordre
// des mots) ; description raccourcie à moins de 155 caractères, chiffres du
// catalogue en prod (9 parcours, 58 leçons, 170 prompts). Les `keywords` du
// layout sont hérités.
export const metadata: Metadata = pageMetadata({
  path: "/",
  title: "Formation Claude AI en français, dès 47 € | ClaudeAI Academy",
  description:
    "La formation Claude AI en français, à votre rythme : 9 parcours, 58 leçons, 170 prompts prêts à copier. Accès à vie dès 47 €, sans CPF, garantie 14 jours.",
  ogTitle: "Formation Claude AI en ligne, en français, dès 47 €",
  ogDescription:
    "La formation francophone pour maîtriser Claude AI en pratique : prompt engineering, Claude Code, data, marketing, stratégie. Mentor IA inclus. À votre rythme, dès 47 €.",
});

export default function Home() {
  return (
    <>
      <Hero />
      {/* Le public est nommé tout de suite (indépendants et TPE, décision du
          15/10/2026) : un artisan qui lit d'abord quatre sections pensées
          pour des profils techniques ne se reconnaît pas. */}
      <Profiles />
      {/* Preuve chiffrée du fondateur (temps mesurés, lib/offre/mesures.ts). */}
      <ProofMeasures />
      <Problem />
      <Method />
      <Programme />
      <PromptTeaser />
      <Founder />
      <Testimonials />
      <PricingTeaser />
      <ValueStack />
      <Guarantee />
      <FAQ />
      <FinalCTA />
    </>
  );
}
