import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Container } from "@/components/site/container";
import { PROVENANCE_COOKIE, decoderProvenance } from "@/lib/attribution";
import { Eyebrow } from "@/components/site/eyebrow";
import { LeadCaptureForm } from "@/components/landing/lead-capture-form";

/**
 * English landing for the free kit. Smoke test, October 2026.
 *
 * Purpose: measure whether English speakers want this before anything is
 * translated beyond the kit. Every lead captured here carries a source that
 * starts with "en-", which keeps it out of the French email sequence and
 * makes the count a one-line SQL query. The paid course is in French today
 * and the page says so: a sale here would be a refund.
 */
export const metadata: Metadata = {
  title: "How to use Claude AI: the free starter kit (15 prompts)",
  description:
    "15 ready-to-use Claude prompts for restaurant owners, freelancers, developers, data analysts, marketers and managers, plus what Claude Code does in a real workday. Free, no card.",
  alternates: {
    canonical: "/en/kit",
    languages: { fr: "/kit", en: "/en/kit" },
  },
  openGraph: {
    title: "How to use Claude AI: the free starter kit (15 prompts)",
    description:
      "15 ready-to-use Claude prompts sorted by work situation, and what Claude Code does in a real workday.",
    url: "/en/kit",
    locale: "en_US",
    type: "website",
  },
};

const benefits = [
  "15 prompts ready to copy, sorted by situation: restaurants and shops, freelancers, job search, developers, data, marketing, management.",
  "What I do with Claude Code every day while running a restaurant: the menu, food cost, pricing, group menus, email.",
  "The line between a prompt and a real system, the one most people never cross.",
];

function resolveSource(raw: string | string[] | undefined): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const clean = (value ?? "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 36);
  // Every English lead is tagged "en-": the French sequence skips them.
  return clean ? `en-${clean.replace(/^en-/, "")}` : "en-kit";
}

export default async function EnglishKitPage({
  searchParams,
}: {
  searchParams: Promise<{ src?: string | string[]; utm_source?: string | string[] }>;
}) {
  const sp = await searchParams;
  const provenance = decoderProvenance((await cookies()).get(PROVENANCE_COOKIE)?.value);
  const source = resolveSource(
    sp.src ??
      sp.utm_source ??
      (provenance && provenance.source !== "direct" ? provenance.campaign : undefined),
  );
  return (
    <section lang="en" className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full opacity-50 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(242,213,199,0.9), transparent 70%)",
        }}
      />
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center relative">
          <div>
            <Eyebrow>Free kit · 15 prompts</Eyebrow>
            <h1 className="mt-5 font-serif text-[clamp(2.25rem,5vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.025em] text-ink">
              The <span className="accent-serif">80%</span> of Claude AI
              <br />
              you are not using yet.
            </h1>
            <p className="mt-7 text-lg leading-relaxed text-muted max-w-[520px]">
              You already use Claude or ChatGPT. You are probably getting a
              fraction of what it can do. Get 15 working prompts, ready to
              copy, and see what Claude does in a real workday, mine, running
              a restaurant. From &ldquo;I tried it&rdquo; to &ldquo;it saves me
              time every day&rdquo;.
            </p>

            <ul className="mt-8 flex flex-col gap-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink-soft">
                  <span aria-hidden="true" className="mt-[6px] h-[7px] w-[7px] flex-shrink-0 rounded-full bg-coral" />
                  {b}
                </li>
              ))}
            </ul>

            <p className="mt-8 text-[14px] leading-relaxed text-muted max-w-[520px]">
              Written by a restaurant director in Switzerland who is not a
              developer. The full course is in French today. This kit is in
              English, and your reply decides whether the rest follows.
            </p>
          </div>

          <div className="lg:pl-6">
            <div className="rounded-[22px] border border-line bg-cream-soft p-7 md:p-9 shadow-[0_4px_8px_rgba(31,31,30,0.05),0_24px_48px_rgba(31,31,30,0.08)]">
              <p className="font-serif text-xl text-ink mb-1.5">Get the kit</p>
              <p className="text-[14px] text-muted mb-6">Instant access by email. Free, no card required.</p>
              <LeadCaptureForm
                source={source}
                redirectTo="/en/kit/thanks"
                labels={{
                  firstName: "First name (optional)",
                  email: "you@example.com",
                  submit: "Send me the kit",
                  sending: "Sending…",
                  errorGeneric: "Something went wrong. Please try again.",
                  errorNetwork: "Connection failed. Try again in a moment.",
                  footnote: "No spam. One email with the kit, unsubscribe in one click.",
                }}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
