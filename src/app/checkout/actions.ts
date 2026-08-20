"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/server";
import { getPlan, isValidTier } from "@/lib/stripe/plans";

/**
 * Crédit d'ascension Starter → Mastery : un client qui a déjà payé le Pass
 * Starter (47 €) le voit déduit automatiquement du Mastery au checkout.
 * Le coupon est créé à la volée au premier usage (idempotent par ID fixe),
 * ce qui le rend disponible aussi bien en mode test qu'en live.
 */
const STARTER_CREDIT_COUPON_ID = "starter-credit-47";

async function getStarterCreditCouponId(): Promise<string | null> {
  const stripe = getStripe();
  try {
    await stripe.coupons.retrieve(STARTER_CREDIT_COUPON_ID);
    return STARTER_CREDIT_COUPON_ID;
  } catch {
    try {
      await stripe.coupons.create({
        id: STARTER_CREDIT_COUPON_ID,
        amount_off: 4700,
        currency: "eur",
        duration: "once",
        name: "Crédit Pass Starter déduit",
      });
      return STARTER_CREDIT_COUPON_ID;
    } catch (err) {
      // Un crédit qui échoue ne doit JAMAIS bloquer une vente : on continue sans.
      console.error("[checkout] création coupon crédit Starter impossible:", err);
      return null;
    }
  }
}

/**
 * Démarre un Checkout Stripe pour le tier choisi — SANS mur d'inscription.
 * Le visiteur paie en une seule page (Stripe collecte son email). Le compte
 * est créé APRÈS le paiement par le webhook `checkout.session.completed`, qui
 * envoie un email de bienvenue avec un lien d'accès magique.
 * Si l'utilisateur est déjà connecté, l'achat est directement rattaché à son
 * compte (email pré-rempli, pas de magic link nécessaire).
 */
export async function startCheckoutAction(formData: FormData) {
  const planRaw = String(formData.get("plan") ?? "");
  if (!isValidTier(planRaw)) {
    redirect("/#tarifs");
  }
  const plan = getPlan(planRaw);

  // Connexion FACULTATIVE : on récupère l'utilisateur s'il en a un, mais on
  // ne bloque jamais l'achat. Stripe collectera l'email des visiteurs anonymes.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const origin =
    process.env.NEXT_PUBLIC_APP_URL ?? (await getOriginFromHeaders());

  // `tier` voyage toujours ; `user_id` seulement si l'acheteur est connecté.
  const metadata: Record<string, string> = { tier: plan.tier };
  if (user?.id) metadata.user_id = user.id;

  // Ascension : un client Starter connecté qui prend le Mastery a son Starter
  // déduit (−47 €). Stripe interdit de cumuler `discounts` et
  // `allow_promotion_codes` — l'upgradeur reçoit donc le crédit à la place
  // du champ code promo (le crédit est systématiquement plus avantageux).
  let upgradeCoupon: string | null = null;
  if (user?.id && plan.tier === "mastery") {
    const { data: starterPurchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("tier", "starter")
      .eq("status", "paid")
      .limit(1)
      .maybeSingle();
    if (starterPurchase) {
      upgradeCoupon = await getStarterCreditCouponId();
    }
  }

  // Fiche client Stripe. En mode `payment`, Stripe n'en crée AUCUNE par
  // défaut : les achats restaient anonymes, introuvables dans l'onglet
  // Clients, et `stripe_customer_id` valait littéralement "unknown".
  // On réutilise la fiche existante quand on la connaît (un client qui monte
  // de Starter à Mastery ne doit pas se dédoubler), sinon on en fait créer une.
  let existingCustomerId: string | null = null;
  if (user?.id) {
    const { data: previous } = await supabase
      .from("purchases")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .like("stripe_customer_id", "cus_%")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    existingCustomerId = previous?.stripe_customer_id ?? null;
  }

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: plan.priceId, quantity: 1 }],
    ...(existingCustomerId
      ? {
          customer: existingCustomerId,
          // Autorise Checkout à compléter la fiche existante (nom, adresse).
          customer_update: { name: "auto", address: "auto" },
        }
      : {
          customer_creation: "always",
          ...(user?.email ? { customer_email: user.email } : {}),
        }),
    ...(user?.id ? { client_reference_id: user.id } : {}),
    metadata,
    payment_intent_data: { metadata },
    locale: "fr",
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout/cancel?plan=${plan.tier}`,
    // « required » impose le bloc nom + adresse de facturation. En « auto »,
    // Stripe le sautait : aucun nom n'était collecté, d'où des paiements
    // impossibles à retrouver autrement que par email, et des emails de
    // bienvenue qui disaient « Bonjour, » au lieu du prénom.
    billing_address_collection: "required",
    // Facture Stripe pour chaque achat : obligation comptable, et le client
    // peut la récupérer seul au lieu de l'écrire au support.
    invoice_creation: { enabled: true },
    // Rattrapage des paniers abandonnés. Le 19/08, un Pass Mastery à 497 €
    // a échoué sur une authentification 3DS et la session a expiré en
    // silence : ni relance, ni alerte, la vente s'est simplement évaporée.
    // Stripe fabrique désormais une URL de reprise, que le webhook
    // `checkout.session.expired` envoie au client.
    after_expiration: {
      recovery: {
        enabled: true,
        // Cumuler une reprise avec un coupon d'ascension est refusé par
        // Stripe : on ne rouvre le champ code promo que hors ascension.
        allow_promotion_codes: !upgradeCoupon,
      },
    },
    ...(upgradeCoupon
      ? { discounts: [{ coupon: upgradeCoupon }] }
      : { allow_promotion_codes: true }),
  });

  if (!session.url) {
    throw new Error("Stripe Checkout: pas d'URL de session retournée.");
  }

  redirect(session.url);
}

async function getOriginFromHeaders(): Promise<string> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}
