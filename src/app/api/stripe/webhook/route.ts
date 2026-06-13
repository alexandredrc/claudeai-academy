import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isValidTier } from "@/lib/stripe/plans";
import { sendPurchaseWelcomeEmail } from "@/lib/email/welcome";

// Stripe doit recevoir le body brut pour valider la signature.
// On désactive l'optimisation statique au cas où.
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig) {
    return new NextResponse("Missing stripe-signature header", { status: 400 });
  }
  if (!secret) {
    console.error(
      "[stripe-webhook] STRIPE_WEBHOOK_SECRET non défini. Configure-le via Stripe CLI (`stripe listen --forward-to localhost:3000/api/stripe/webhook`) ou via Dashboard → Webhooks.",
    );
    return new NextResponse("Webhook secret not configured", { status: 500 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[stripe-webhook] Signature invalide:", message);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;

      case "charge.refunded":
        await handleChargeRefunded(event.data.object);
        break;

      default:
        // Évènements non gérés explicitement : on accuse réception.
        break;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[stripe-webhook] ${event.type} handler error:`, message);
    return new NextResponse(`Handler error: ${message}`, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
): Promise<void> {
  if (session.mode !== "payment") return;
  if (session.payment_status !== "paid") return;

  const userId = session.metadata?.user_id ?? session.client_reference_id;
  const tier = session.metadata?.tier;

  if (!userId) {
    throw new Error(
      `checkout.session.completed sans user_id (session=${session.id})`,
    );
  }
  if (!tier || !isValidTier(tier)) {
    throw new Error(
      `checkout.session.completed avec tier invalide: ${tier} (session=${session.id})`,
    );
  }

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : (session.customer?.id ?? null);

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent?.id ?? null);

  // Stripe rejoue les webhooks : on note si l'achat est déjà enregistré
  // pour n'envoyer l'email de bienvenue qu'au premier passage.
  const { data: existingPurchase } = await supabaseAdmin
    .from("purchases")
    .select("id")
    .eq("stripe_session_id", session.id)
    .maybeSingle();

  // Upsert sur stripe_session_id (UNIQUE en DB) : idempotent.
  const { error } = await supabaseAdmin
    .from("purchases")
    .upsert(
      {
        user_id: userId,
        tier,
        stripe_customer_id: customerId ?? "unknown",
        stripe_session_id: session.id,
        stripe_payment_intent_id: paymentIntentId,
        amount_total: session.amount_total ?? 0,
        currency: session.currency ?? "eur",
        status: "paid",
        paid_at: new Date().toISOString(),
      },
      {
        onConflict: "stripe_session_id",
      },
    );

  if (error) {
    throw new Error(`Supabase upsert purchases failed: ${error.message}`);
  }

  // Email de bienvenue : best effort, jamais bloquant pour le webhook
  // (l'accès est déjà débloqué par la ligne purchases ci-dessus).
  if (!existingPurchase) {
    const to = session.customer_details?.email ?? session.customer_email;
    if (to) {
      try {
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("first_name")
          .eq("id", userId)
          .maybeSingle();
        await sendPurchaseWelcomeEmail({
          to,
          tier,
          firstName: profile?.first_name ?? null,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[stripe-webhook] welcome email failed:", message);
      }
    }
  }
}

async function handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
  if (!charge.payment_intent) return;
  const pi =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent.id;

  const { error } = await supabaseAdmin
    .from("purchases")
    .update({
      status: "refunded",
      refunded_at: new Date().toISOString(),
    })
    .eq("stripe_payment_intent_id", pi);

  if (error) {
    throw new Error(`Supabase update refund failed: ${error.message}`);
  }
}
