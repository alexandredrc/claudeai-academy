import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";

export const metadata: Metadata = {
  title: "Done. Your kit is waiting.",
  description: "Your kit of 15 Claude prompts is on its way. Here is how to get the most out of it.",
  robots: { index: false, follow: false },
};

export default function EnglishThanksPage() {
  return (
    <section lang="en" className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36">
      <div
        aria-hidden="true"
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[520px] h-[420px] rounded-full opacity-40 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(242,213,199,0.9), transparent 70%)",
        }}
      />
      <Container size="narrow">
        <div className="relative text-center">
          <Eyebrow>You are in</Eyebrow>
          <h1 className="mt-5 font-serif text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.08] tracking-tight text-ink">
            Done. <span className="accent-serif">Your kit is waiting.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted max-w-[560px] mx-auto">
            We just sent you an email with your access. You can also open it
            right now, below. Check your spam folder if nothing shows up
            within two minutes.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button href="/en/kit/resources" variant="primary" size="lg">
              Open the kit now
            </Button>
          </div>

          <p className="mt-12 text-[14px] leading-relaxed text-muted max-w-[480px] mx-auto">
            One tip: do not skim all 15 prompts. Pick{" "}
            <span className="text-ink-soft">one</span> today, the one that
            matches a task you will do tonight. That is how it becomes a habit.
          </p>
        </div>
      </Container>
    </section>
  );
}
