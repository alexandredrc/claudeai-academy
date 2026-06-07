import Link from "next/link";
import { redirect } from "next/navigation";
import { getStripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

type SearchParams = Promise<{ session_id?: string }>;

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { session_id } = await searchParams;
  if (!session_id) redirect("/account");

  // Récupère la session Stripe pour afficher le bon plan / montant.
  // Pas critique si ça échoue (le webhook reste la source de vérité).
  let tierName = "Pass";
  let amountFormatted = "";
  try {
    const session = await getStripe().checkout.sessions.retrieve(session_id);
    const tier = session.metadata?.tier;
    tierName =
      tier === "mastery"
        ? "Pass Mastery"
        : tier === "starter"
          ? "Pass Starter"
          : "votre pass";
    amountFormatted = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: (session.currency ?? "eur").toUpperCase(),
      minimumFractionDigits: 0,
    }).format((session.amount_total ?? 0) / 100);
  } catch {
    // Affichage générique si l'API Stripe répond mal.
  }

  // S'assure que le user est bien authentifié (sinon redirige vers login).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?next=/checkout/success?session_id=${session_id}`);
  }

  return (
    <section className="bg-cream-soft">
      <div className="mx-auto flex min-h-[calc(100vh-81px-145px)] max-w-[640px] flex-col justify-center px-6 py-16 text-center">
        <span className="inline-flex items-center justify-center gap-2 self-center rounded-full bg-green-soft px-4 py-2 text-[13px] font-semibold text-green">
          <span className="h-1.5 w-1.5 rounded-full bg-green" />
          Paiement confirmé
        </span>
        <h1 className="mt-6 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
          Bienvenue dans{" "}
          <span className="font-serif font-medium italic text-coral">
            ClaudeAI Academy
          </span>
          .
        </h1>
        <p className="mx-auto mt-6 max-w-[480px] text-[15px] leading-relaxed text-ink-soft">
          Ton {tierName}
          {amountFormatted ? ` (${amountFormatted})` : ""} est activé. Tu vas
          recevoir un email de confirmation avec ta facture dans quelques
          minutes.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/account"
            className="rounded-[14px] bg-coral px-8 py-4 text-base font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_8px_20px_rgba(217,119,87,0.35)]"
          >
            Accéder à mon espace
          </Link>
        </div>
        <p className="mt-10 text-[13px] text-muted">
          Un souci ?{" "}
          <a
            href="mailto:hello@claudeai-academy.com"
            className="underline hover:text-ink"
          >
            hello@claudeai-academy.com
          </a>
        </p>
      </div>
    </section>
  );
}
