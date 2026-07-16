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

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: plan.priceId, quantity: 1 }],
    ...(user?.email ? { customer_email: user.email } : {}),
    ...(user?.id ? { client_reference_id: user.id } : {}),
    metadata,
    payment_intent_data: { metadata },
    locale: "fr",
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout/cancel?plan=${plan.tier}`,
    billing_address_collection: "auto",
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
