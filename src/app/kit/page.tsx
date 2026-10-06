import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Container } from "@/components/site/container";
import { PROVENANCE_COOKIE, decoderProvenance } from "@/lib/attribution";
import { Eyebrow } from "@/components/site/eyebrow";
import { LeadCaptureForm } from "@/components/landing/lead-capture-form";

export const metadata: Metadata = {
  title: "Comment utiliser Claude AI : le kit de démarrage gratuit (15 prompts)",
  description:
    "Apprends comment utiliser Claude AI à son plein potentiel : 15 prompts gratuits prêts à l'emploi, en français, pour restaurateurs, indépendants, développeurs, data analysts, marketers et managers. Les 80 % que tu n'exploites pas encore.",
  alternates: { canonical: "/kit" },
};

const benefits = [
  "15 prompts prêts à copier, classés par situation : restauration et commerce, indépendants, recherche d'emploi, dev, data, marketing, management.",
  "Ce que je fais avec Claude Code tous les jours en dirigeant un restaurant : carte, food cost, prix, menus, emails.",
  "La frontière entre un prompt et un vrai système, et un usage concret de Claude par semaine ensuite, dans ta boîte mail.",
];

// Attribution : on lit ?src= (ou ?utm_source=) pour savoir quel canal a amené
// le lead (linkedin, instagram-bio, etc.). Stocké dans leads.source.
function resolveSource(raw: string | string[] | undefined): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return "kit-direct";
  const clean = value.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40);
  return clean || "kit-direct";
}

export default async function KitPage({
  searchParams,
}: {
  searchParams: Promise<{ src?: string | string[]; utm_source?: string | string[] }>;
}) {
  const sp = await searchParams;
  // Sans paramètre dans l'URL, on relit le cookie de provenance posé à la
  // première visite : un visiteur venu de LinkedIn il y a trois jours et qui
  // revient taper /kit à la main n'est pas « direct ». Au 02/10/2026, 73 leads
  // sur 81 étaient en « kit-direct », autant dire sans origine.
  const provenance = decoderProvenance(
    (await cookies()).get(PROVENANCE_COOKIE)?.value,
  );
  const source = resolveSource(
    sp.src ??
      sp.utm_source ??
      (provenance && provenance.source !== "direct" ? provenance.campaign : undefined),
  );
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(242,213,199,0.9), transparent 70%)",
        }}
      />
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center relative">
          <div>
            <Eyebrow>Kit gratuit · 15 prompts</Eyebrow>
            <h1 className="mt-5 font-serif text-[clamp(2.25rem,5vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.025em] text-ink">
              Les <span className="accent-serif">80 %</span> de Claude AI
              <br />
              que tu n&apos;exploites pas.
            </h1>
            <p className="mt-7 text-lg leading-relaxed text-muted max-w-[520px]">
              Tu utilises déjà Claude ou ChatGPT. Mais tu en tires sûrement une
              fraction du potentiel. Récupère 15 prompts opérationnels, prêts à
              copier, et vois ce que Claude fait dans une vraie journée de
              travail, la mienne, pour passer de &laquo; je teste &raquo; à
              &laquo; je gagne du temps tous les jours &raquo;.
            </p>

            <ul className="mt-8 flex flex-col gap-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink-soft">
                  <span
                    aria-hidden="true"
                    className="mt-[6px] h-[7px] w-[7px] flex-shrink-0 rounded-full bg-coral"
                  />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:pl-6">
            <div className="rounded-[22px] border border-line bg-cream-soft p-7 md:p-9 shadow-[0_4px_8px_rgba(31,31,30,0.05),0_24px_48px_rgba(31,31,30,0.08)]">
              <p className="font-serif text-xl text-ink mb-1.5">Reçois ton Kit</p>
              <p className="text-[14px] text-muted mb-6">
                Accès immédiat par email. Gratuit, sans carte bancaire.
              </p>
              <LeadCaptureForm source={source} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
