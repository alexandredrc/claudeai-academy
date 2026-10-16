import Link from "next/link";
import { redirect } from "next/navigation";
import { getStripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import { PurchaseConversion } from "@/components/site/purchase-conversion";
import { CheckoutButton } from "@/components/site/checkout-button";
import {
  MASTERY_DERNIER_JOUR_LIBELLE,
  annonceHausseMastery,
  maintenant,
  mensualiteKlarna3x,
  prixMastery,
} from "@/lib/offre/prix";

type SearchParams = Promise<{ session_id?: string }>;

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { session_id } = await searchParams;
  if (!session_id) redirect("/account");

  // Récupère la session Stripe pour afficher le bon plan / montant / email.
  // Pas critique si ça échoue (le webhook reste la source de vérité).
  let tierName = "Pass";
  let amountFormatted = "";
  let buyerEmail: string | null = null;
  let conversionValue = 0;
  let conversionCurrency = "EUR";
  let boughtStarter = false;
  // Ni le badge « Paiement confirmé » ni la conversion Google Ads ne partent
  // sans un paiement réellement encaissé : une URL forgée avec un identifiant
  // quelconque, ou un paiement différé pas encore arrivé, ne compte pas.
  let paid = false;
  let pending = false;
  try {
    const session = await getStripe().checkout.sessions.retrieve(session_id);
    paid =
      session.payment_status === "paid" ||
      session.payment_status === "no_payment_required";
    pending = !paid && session.status === "complete";
    const tier = session.metadata?.tier;
    const planCode = session.metadata?.plan_code;
    boughtStarter = tier === "starter";
    tierName =
      planCode === "elite"
        ? "Pass Accompagnement"
        : tier === "mastery"
          ? "Pass Mastery"
          : tier === "starter"
            ? "Pass Starter"
            : "votre pass";
    conversionValue = (session.amount_total ?? 0) / 100;
    conversionCurrency = (session.currency ?? "eur").toUpperCase();
    amountFormatted = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: conversionCurrency,
      minimumFractionDigits: 0,
    }).format(conversionValue);
    buyerEmail = session.customer_details?.email ?? session.customer_email ?? null;
  } catch {
    // Affichage générique si l'API Stripe répond mal.
  }

  // Achat connecté → accès direct à l'espace. Achat « pay-first » anonyme → le
  // compte est créé par le webhook et le lien d'accès part par email : on NE
  // force PAS la connexion (le membre n'a pas encore de mot de passe).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const loggedIn = Boolean(user);

  return (
    <section className="bg-cream-soft">
      {paid && (
        <PurchaseConversion
          value={conversionValue}
          currency={conversionCurrency}
          transactionId={session_id}
        />
      )}
      <div className="mx-auto flex min-h-[calc(100vh-81px-145px)] max-w-[640px] flex-col justify-center px-6 py-16 text-center">
        <span className="inline-flex items-center justify-center gap-2 self-center rounded-full bg-green-soft px-4 py-2 text-[13px] font-semibold text-green">
          <span className="h-1.5 w-1.5 rounded-full bg-green" />
          {paid
            ? "Paiement confirmé"
            : pending
              ? "Paiement en cours de confirmation"
              : "Commande reçue"}
        </span>
        <h1 className="mt-6 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
          Bienvenue dans{" "}
          <span className="font-serif font-medium italic text-coral">
            ClaudeAI Academy
          </span>
          .
        </h1>

        {!paid ? (
          // Paiement différé pas encore arrivé, ou Stripe momentanément
          // injoignable : on ne promet pas un accès qui n'existe pas encore.
          <p className="mx-auto mt-6 max-w-[500px] text-[15px] leading-relaxed text-ink-soft">
            Ta commande est bien reçue. Dès que le paiement est confirmé, tu
            reçois un email avec ton lien d&apos;accès et ta facture. Pas
            d&apos;email sous 15 minutes ? Écris-nous, on vérifie tout de suite.
          </p>
        ) : loggedIn ? (
          <>
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
          </>
        ) : (
          <>
            <p className="mx-auto mt-6 max-w-[500px] text-[15px] leading-relaxed text-ink-soft">
              Ton {tierName}
              {amountFormatted ? ` (${amountFormatted})` : ""} est activé. On
              vient de créer ton compte
              {buyerEmail ? (
                <>
                  {" "}
                  (<strong className="text-ink">{buyerEmail}</strong>)
                </>
              ) : null}
              {" "}: tu reçois à l&apos;instant un email avec ton{" "}
              <strong className="text-ink">lien d&apos;accès en un clic</strong>{" "}
              et ta facture. Clique-le pour entrer dans ton espace.
            </p>
            <p className="mx-auto mt-4 max-w-[460px] text-[13px] leading-relaxed text-muted">
              L&apos;email n&apos;arrive pas sous 2-3 minutes ? Pense à vérifier
              tes spams, ou écris-nous et on t&apos;ouvre l&apos;accès à la main.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href={
                  buyerEmail
                    ? `/acces?email=${encodeURIComponent(buyerEmail)}`
                    : "/acces"
                }
                className="rounded-[14px] bg-coral px-8 py-4 text-base font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_8px_20px_rgba(217,119,87,0.35)]"
              >
                Renvoyer mon lien d&apos;accès
              </Link>
              <Link
                href="/login"
                className="rounded-[14px] border border-line bg-white px-8 py-4 text-base font-semibold text-ink transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-coral"
              >
                J&apos;ai déjà un mot de passe
              </Link>
            </div>
          </>
        )}

        {paid && boughtStarter ? <StarterUpgrade /> : null}

        <p className="mt-10 text-[13px] text-muted">
          Un souci ?{" "}
          <a
            href="mailto:contact@claudeai-academy.com"
            className="underline hover:text-ink"
          >
            contact@claudeai-academy.com
          </a>
        </p>
      </div>
    </section>
  );
}

/**
 * Montée en gamme après un achat Starter.
 *
 * Le moment qui suit immédiatement un paiement est le seul où la carte est
 * encore sortie — et la page de confirmation n'en faisait rien : elle
 * renvoyait vers l'espace membre, point final. Le Starter donne 3 parcours
 * sur 8 ; les 5 autres n'étaient jamais proposés ailleurs que dans un email
 * envoyé deux semaines plus tard.
 *
 * Les 47 € déjà payés sont déduits automatiquement (coupon starter-credit-47,
 * checkout/actions.ts) à condition d'être connecté au moment de payer.
 *
 * Prix du jour calculé au rendu (497 € puis 697 € dès le 01/11/2026), avec
 * l'annonce de la hausse tant qu'elle est à venir (lib/offre/prix.ts).
 */
function StarterUpgrade() {
  const at = maintenant();
  const prix = prixMastery(at);
  const annonce = annonceHausseMastery(at);
  return (
    <aside className="mx-auto mt-14 max-w-[520px] border-t border-line pt-10 text-left">
      <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-coral">
        Pendant qu&apos;on y est
      </p>
      <h2 className="mt-3 font-serif text-2xl font-medium leading-snug tracking-tight text-ink">
        Il te reste 6 parcours à ouvrir
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
        Le Starter couvre les 3 parcours fondateurs. Les 6 autres (data,
        marketing, stratégie, trading, sécurité GitHub, agents IA) et les 34
        leçons qui vont avec sont dans le Pass Mastery, avec la bibliothèque
        complète de prompts et le Mentor IA.
      </p>
      <div className="mt-6">
        <CheckoutButton tier="mastery" prixAffiche={prix} variant="primary" size="md">
          {`Passer au Mastery · ${prix} €`}
        </CheckoutButton>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-muted">
        {`ou 3 × ${mensualiteKlarna3x(prix)} € sans frais avec Klarna.`}{" "}
        Les 47 € que tu viens de payer sont déduits automatiquement si tu es
        connecté à ton compte au moment de payer.
      </p>
      {annonce ? (
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          {`${prix} € jusqu'au ${MASTERY_DERNIER_JOUR_LIBELLE} inclus. ${annonce}.`}
        </p>
      ) : null}
    </aside>
  );
}
