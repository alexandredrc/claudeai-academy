import Link from "next/link";
import { startCheckoutAction } from "../actions";
import { isValidTier } from "@/lib/stripe/plans";

type SearchParams = Promise<{ plan?: string }>;

export default async function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { plan } = await searchParams;
  const tier = isValidTier(plan) ? plan : null;
  const planLabel =
    tier === "mastery"
      ? "Pass Mastery — 497 €"
      : tier === "starter"
        ? "Pass Starter — 47 €"
        : null;

  return (
    <section className="bg-cream-soft">
      <div className="mx-auto flex min-h-[calc(100vh-81px-145px)] max-w-[640px] flex-col justify-center px-6 py-16 text-center">
        <h1 className="font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
          Achat{" "}
          <span className="font-serif font-medium italic text-coral">
            interrompu
          </span>
          .
        </h1>
        <p className="mx-auto mt-6 max-w-[480px] text-[15px] leading-relaxed text-ink-soft">
          Aucun montant n&apos;a été débité. Tu peux reprendre quand tu veux,
          la page Stripe n&apos;est qu&apos;à un clic.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          {tier && (
            <form action={startCheckoutAction}>
              <input type="hidden" name="plan" value={tier} />
              <button
                type="submit"
                className="rounded-[14px] bg-coral px-8 py-4 text-base font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_8px_20px_rgba(217,119,87,0.35)]"
              >
                Reprendre {planLabel ?? "l'achat"}
              </button>
            </form>
          )}
          <Link
            href="/account"
            className="rounded-[14px] border-[1.5px] border-ink px-8 py-4 text-base font-semibold text-ink transition-all duration-200 ease-out hover:bg-ink hover:text-cream"
          >
            Retour à mon espace
          </Link>
        </div>
      </div>
    </section>
  );
}
