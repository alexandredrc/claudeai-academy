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

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Method />
      <Programme />
      <PromptTeaser />
      <Profiles />
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
