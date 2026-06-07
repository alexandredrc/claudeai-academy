import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { userHasTier } from "@/lib/courses/access";
import { startCheckoutAction } from "@/app/checkout/actions";
import { MENTOR_DAILY_LIMIT } from "@/lib/anthropic/client";
import { MentorChat } from "./Chat";

export const dynamic = "force-dynamic";

export default async function MentorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/mentor");

  const hasMastery = await userHasTier(supabase, "mastery");

  if (!hasMastery) {
    return (
      <section className="bg-cream-soft">
        <div className="mx-auto flex min-h-[calc(100vh-81px-145px)] max-w-[640px] flex-col justify-center px-6 py-16 text-center">
          <span className="inline-block text-[12px] font-semibold uppercase tracking-[0.12em] text-coral">
            Réservé au Pass Mastery
          </span>
          <h1 className="mt-3 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
            Le{" "}
            <span className="font-serif font-medium italic text-coral">
              Mentor IA
            </span>{" "}
            t&apos;attend.
          </h1>
          <p className="mx-auto mt-6 max-w-[480px] text-[15px] leading-relaxed text-ink-soft">
            Un assistant entraîné sur l&apos;intégralité de la formation, pour
            répondre à tes questions précises et appliquer les leçons à ta
            situation. Inclus dans le Pass Mastery.
          </p>
          <form action={startCheckoutAction} className="mt-8">
            <input type="hidden" name="plan" value="mastery" />
            <button
              type="submit"
              className="rounded-[14px] bg-coral px-8 py-4 text-base font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_8px_20px_rgba(217,119,87,0.35)]"
            >
              Débloquer avec le Pass Mastery · 497 €
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cream-soft">
      <div className="mx-auto flex min-h-[calc(100vh-81px-145px)] max-w-[820px] flex-col px-6 py-10 md:py-14">
        <header className="mb-6">
          <span className="inline-block text-[13px] font-semibold uppercase tracking-[0.12em] text-coral">
            Mentor IA
          </span>
          <h1 className="mt-3 font-serif text-3xl font-medium leading-[1.1] tracking-tight text-ink md:text-4xl">
            Pose ta question sur la{" "}
            <span className="font-serif font-medium italic text-coral">
              formation
            </span>
            .
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-muted">
            Le Mentor répond uniquement à partir du contenu de la formation et
            cite les leçons. {MENTOR_DAILY_LIMIT} questions par jour.
          </p>
        </header>
        <MentorChat />
      </div>
    </section>
  );
}
