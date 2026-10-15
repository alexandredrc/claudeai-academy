import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { Problem } from "@/components/landing/problem";
import { Method } from "@/components/landing/method";
import { Programme } from "@/components/landing/programme";
import { PromptTeaser } from "@/components/landing/prompt-teaser";
import { Profiles } from "@/components/landing/profiles";
import { Founder } from "@/components/landing/founder";
import { Testimonials } from "@/components/landing/testimonials";
import { PricingTeaser } from "@/components/landing/pricing-teaser";
import { ValueStack } from "@/components/landing/value-stack";
import { Guarantee } from "@/components/landing/guarantee";
import { FAQ } from "@/components/landing/faq";
import { FinalCTA } from "@/components/landing/final-cta";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      {/* Le public est nommé tout de suite (indépendants et TPE, décision du
          15/10/2026) : un artisan qui lit d'abord quatre sections pensées
          pour des profils techniques ne se reconnaît pas. */}
      <Profiles />
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
