"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/server";
import { getPlan, isValidTier } from "@/lib/stripe/plans";

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
