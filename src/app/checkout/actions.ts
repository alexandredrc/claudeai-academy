"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/server";
import { getPlan, isValidTier } from "@/lib/stripe/plans";

/**
 * Démarre un Checkout Stripe pour le tier choisi.
 * - Si non connecté → redirige vers /signup?plan=<tier>
 * - Sinon → crée une session Checkout et redirige vers Stripe
 */
export async function startCheckoutAction(formData: FormData) {
  const planRaw = String(formData.get("plan") ?? "");
  if (!isValidTier(planRaw)) {
    redirect("/#tarifs");
  }
  const plan = getPlan(planRaw);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/signup?plan=${plan.tier}`);
  }

  const origin =
    process.env.NEXT_PUBLIC_APP_URL ?? (await getOriginFromHeaders());

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: plan.priceId, quantity: 1 }],
    customer_email: user.email,
    client_reference_id: user.id,
    metadata: {
      user_id: user.id,
      tier: plan.tier,
    },
    payment_intent_data: {
      metadata: {
        user_id: user.id,
        tier: plan.tier,
      },
    },
    locale: "fr",
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout/cancel?plan=${plan.tier}`,
    billing_address_collection: "auto",
    allow_promotion_codes: true,
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
