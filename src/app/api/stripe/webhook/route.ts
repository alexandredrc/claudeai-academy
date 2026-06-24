import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isValidTier } from "@/lib/stripe/plans";
import { sendPurchaseWelcomeEmail } from "@/lib/email/welcome";
import { SITE_URL } from "@/lib/email/send";

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

  const tier = session.metadata?.tier;
  if (!tier || !isValidTier(tier)) {
    throw new Error(
      `checkout.session.completed avec tier invalide: ${tier} (session=${session.id})`,
    );
  }

  const email = (
    session.customer_details?.email ??
    session.customer_email ??
    ""
  )
    .trim()
    .toLowerCase();

  // Résolution de l'utilisateur. Deux cas :
  // - achat connecté → `user_id` est dans la metadata (rattachement direct).
  // - achat « pay-first » anonyme → on retrouve OU on crée le compte à partir
  //   de l'email collecté par Stripe (le paiement vaut vérification d'email).
  let userId: string | null =
    session.metadata?.user_id ??
    (typeof session.client_reference_id === "string"
      ? session.client_reference_id
      : null);
  let isNewAccount = false;

  if (!userId) {
    if (!email) {
      throw new Error(
        `checkout.session.completed sans user_id ni email (session=${session.id})`,
      );
    }
    const resolved = await resolveUserByEmailOrCreate(
      email,
      session.customer_details?.name ?? null,
    );
    userId = resolved.userId;
    isNewAccount = resolved.isNew;
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
  const { error } = await supabaseAdmin.from("purchases").upsert(
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
  if (!existingPurchase && email) {
    try {
      // Compte créé après paiement (pay-first) → on joint un lien d'accès
      // magique pour une connexion en un clic, sans mot de passe.
      const accessLink = isNewAccount ? await generateAccessLink(email) : null;
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("first_name")
        .eq("id", userId)
        .maybeSingle();
      await sendPurchaseWelcomeEmail({
        to: email,
        tier,
        firstName: profile?.first_name ?? null,
        accessLink,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[stripe-webhook] welcome email failed:", message);
    }
  }
}

/**
 * Retrouve l'utilisateur par email (table `profiles`) ou le crée via l'API
 * admin. Le compte est marqué email confirmé : l'achat Stripe fait foi.
 */
async function resolveUserByEmailOrCreate(
  email: string,
  name: string | null,
): Promise<{ userId: string; isNew: boolean }> {
  const existing = await findProfileIdByEmail(email);
  if (existing) return { userId: existing, isNew: false };

  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? null;
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : null;

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { first_name: firstName, last_name: lastName },
  });

  if (error || !data?.user) {
    // Course possible (deux webhooks quasi simultanés) : le compte a pu être
    // créé entre-temps. On retente le lookup avant d'abandonner.
    const retry = await findProfileIdByEmail(email);
    if (retry) return { userId: retry, isNew: false };
    throw new Error(
      `Création du compte échouée pour ${email}: ${error?.message ?? "user manquant"}`,
    );
  }

  return { userId: data.user.id, isNew: true };
}

async function findProfileIdByEmail(email: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  return data?.id ?? null;
}

/**
 * Génère un lien de connexion magique. Le token hash est vérifié côté serveur
 * par /auth/confirm via `verifyOtp` (pas de PKCE → valable depuis un email).
 */
async function generateAccessLink(email: string): Promise<string | null> {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    const hashedToken = data?.properties?.hashed_token;
    if (error || !hashedToken) return null;
    const next = encodeURIComponent("/courses");
    return `${SITE_URL}/auth/confirm?token_hash=${hashedToken}&type=magiclink&next=${next}`;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[stripe-webhook] generateAccessLink failed:", message);
    return null;
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
