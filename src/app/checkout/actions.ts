"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/server";
import { getPlan, isValidPlanCode, ELITE_ENABLED } from "@/lib/stripe/plans";
import {
  PRIX_MASTERY_APRES,
  PRIX_MASTERY_AVANT,
  PRIX_STARTER,
} from "@/lib/offre/prix";
import {
  PROVENANCE_COOKIE,
  decoderProvenance,
  provenanceVersMetadata,
} from "@/lib/attribution";

/**
 * Crédit d'ascension : ce qu'un client a déjà payé est déduit du palier
 * supérieur. Un acheteur Starter (47 €) qui prend le Mastery ne repaie pas ses
 * 47 € ; un acheteur Mastery qui prend l'Accompagnement ne repaie pas son
 * Mastery, au prix où il l'a payé : 497 € avant le 01/11/2026, 697 € ensuite
 * (src/lib/offre/prix.ts). Sans ça, l'échelle de prix punirait ceux qui ont
 * commencé petit, c'est-à-dire exactement les clients qu'on veut faire monter.
 *
 * Les coupons sont créés à la volée au premier usage et identifiés par un ID
 * fixe, ce qui les rend idempotents et disponibles en mode test comme en live.
 * Les ID suivent la convention déjà en place (montant en euros) : le coupon
 * « mastery-credit-497 » existant est réutilisé tel quel, « mastery-credit-697 »
 * est créé au premier Accompagnement acheté par un client Mastery à 697 €.
 */
type Credit = { id: string; cents: number; name: string };

const CREDIT_STARTER: Credit = {
  id: "starter-credit-47",
  cents: PRIX_STARTER * 100,
  name: "Crédit Pass Starter déduit",
};

function creditMastery(prixEur: number): Credit {
  return {
    id: `mastery-credit-${prixEur}`,
    cents: prixEur * 100,
    name: "Crédit Pass Mastery déduit",
  };
}

/** Code d'erreur Stripe (`resource_missing`, `resource_already_exists`…). */
function codeStripe(err: unknown): string | undefined {
  return typeof err === "object" && err !== null && "code" in err
    ? String((err as { code: unknown }).code)
    : undefined;
}

// Les trois coupons existent en test et en live depuis le 16/10/2026 (créés
// d'avance, scratchpad stripe_coupons_credit.mjs) : la création à la volée
// n'est plus qu'un filet. Avant, une simple erreur réseau sur `retrieve`
// menait à un `create` refusé (« existe déjà ») et le client payait plein tarif.
async function getCreditCouponId(credit: Credit): Promise<string | null> {
  const stripe = getStripe();
  try {
    await stripe.coupons.retrieve(credit.id);
    return credit.id;
  } catch (err) {
    if (codeStripe(err) !== "resource_missing") {
      // Erreur passagère (réseau, limite de débit) : le coupon existe sans
      // doute, Stripe refusera la session s'il n'existe pas et le visiteur
      // retombe sur la page « réessayer », jamais sur un plein tarif muet.
      console.error(`[checkout] lecture coupon ${credit.id} incertaine:`, err);
      return credit.id;
    }
    try {
      await stripe.coupons.create({
        id: credit.id,
        amount_off: credit.cents,
        currency: "eur",
        duration: "once",
        name: credit.name,
      });
      return credit.id;
    } catch (createErr) {
      if (codeStripe(createErr) === "resource_already_exists") return credit.id;
      // Un crédit qui échoue ne doit JAMAIS bloquer une vente : on continue sans.
      console.error(`[checkout] création coupon ${credit.id} impossible:`, createErr);
      return null;
    }
  }
}

/** A-t-il déjà un achat payé de ce niveau d'accès ? */
async function hasPaidTier(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  tier: "starter" | "mastery",
): Promise<boolean> {
  const { data } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", userId)
    .eq("tier", tier)
    .eq("status", "paid")
    .limit(1)
    .maybeSingle();
  return Boolean(data);
}

/**
 * Prix du Mastery qu'il a payé (497 ou 697, en euros), ou `null` s'il n'a
 * aucun achat payé de niveau mastery.
 *
 * On lit `purchases.amount_total` (centimes, écrit par le webhook depuis
 * `session.amount_total`) et on prend le plus élevé des achats payés : un achat
 * remboursé passe en `status = 'refunded'` et sort donc du filtre. Les achats
 * Accompagnement (`plan_code = 'elite'`) partagent le niveau mastery mais ne
 * sont pas un Mastery : ils sont écartés du montant.
 *
 * Le montant encaissé n'est pas toujours le prix catalogue : un acheteur
 * Starter qui monte au Mastery paie 450 € (ou 650 €) après son crédit de 47 €,
 * un code promo peut le baisser. D'où la règle : au-delà de 497 €, seul le
 * tarif à 697 € peut l'expliquer (697 €, ou 650 € + 47 € de Starter) ; sinon,
 * et quand le montant est illisible, crédit de 497 €, comme avant la hausse.
 * Un crédit ne dépasse donc jamais le prix catalogue payé.
 */
async function prixMasteryPaye(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<number | null> {
  const { data, error } = await supabase
    .from("purchases")
    .select("amount_total, plan_code")
    .eq("user_id", userId)
    .eq("tier", "mastery")
    .eq("status", "paid");
  if (error) {
    // Lecture impossible : on ne prive pas le client de son crédit, on
    // retombe sur l'ancien comportement (présence d'un achat → 497 €).
    console.error("[checkout] lecture des achats Mastery impossible:", error.message);
    return (await hasPaidTier(supabase, userId, "mastery")) ? PRIX_MASTERY_AVANT : null;
  }
  const lignes = (data ?? []) as { amount_total: unknown; plan_code: unknown }[];
  if (lignes.length === 0) return null;

  const montants = lignes
    .filter((l) => l.plan_code !== "elite")
    .map((l) => Number(l.amount_total))
    .filter((c) => Number.isFinite(c) && c >= 0);
  const plusEleve = montants.length > 0 ? Math.max(...montants) : null;

  return plusEleve !== null && plusEleve > PRIX_MASTERY_AVANT * 100
    ? PRIX_MASTERY_APRES
    : PRIX_MASTERY_AVANT;
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
  if (!isValidPlanCode(planRaw)) {
    redirect("/#tarifs");
  }
  // L'Accompagnement engage des créneaux réels : tant qu'il n'est pas ouvert,
  // un POST forgé ne doit pas pouvoir le vendre.
  if (planRaw === "elite" && !ELITE_ENABLED) {
    redirect("/#tarifs");
  }
  const plan = getPlan(planRaw);

  // Page chargée avant la hausse, clic après (onglet resté ouvert la nuit du
  // 31/10) : le visiteur a lu « 497 € » et Stripe lui afficherait 697 € sans
  // explication. On le renvoie sur /tarifs, qui lui dit pourquoi le prix a
  // changé. `prix_affiche` est posé par CheckoutButton au rendu de la page.
  const prixAffiche = Number(formData.get("prix_affiche"));
  if (
    plan.code === "mastery" &&
    Number.isFinite(prixAffiche) &&
    prixAffiche > 0 &&
    prixAffiche !== plan.amountEur
  ) {
    redirect("/tarifs?prix=maj");
  }

  // Connexion FACULTATIVE : on récupère l'utilisateur s'il en a un, mais on
  // ne bloque jamais l'achat. Stripe collectera l'email des visiteurs anonymes.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const origin =
    process.env.NEXT_PUBLIC_APP_URL ?? (await getOriginFromHeaders());

  // `tier` (niveau d'accès) voyage toujours, c'est lui que le webhook écrit en
  // base. `plan_code` dit quelle offre a été vendue — deux offres peuvent
  // donner le même accès. `user_id` seulement si l'acheteur est connecté.
  // La provenance (canal qui a amené le visiteur, posée en cookie par le
  // proxy) voyage aussi : c'est la seule façon pour le webhook, qui ne voit
  // jamais le navigateur, d'écrire dans `purchases` d'où vient la vente.
  const provenance = decoderProvenance(
    (await cookies()).get(PROVENANCE_COOKIE)?.value,
  );
  const metadata: Record<string, string> = {
    ...provenanceVersMetadata(provenance),
    tier: plan.tier,
    plan_code: plan.code,
  };
  if (user?.id) metadata.user_id = user.id;

  // Ascension. Stripe interdit de cumuler `discounts` et
  // `allow_promotion_codes` — l'upgradeur reçoit donc le crédit à la place du
  // champ code promo (le crédit est systématiquement plus avantageux).
  // On applique le crédit le plus élevé auquel il a droit, jamais les deux.
  let upgradeCoupon: string | null = null;
  if (user?.id) {
    if (plan.code === "elite") {
      const prixMastery = await prixMasteryPaye(supabase, user.id);
      if (prixMastery !== null) {
        upgradeCoupon = await getCreditCouponId(creditMastery(prixMastery));
      } else if (await hasPaidTier(supabase, user.id, "starter")) {
        upgradeCoupon = await getCreditCouponId(CREDIT_STARTER);
      }
    } else if (plan.code === "mastery") {
      if (await hasPaidTier(supabase, user.id, "starter")) {
        upgradeCoupon = await getCreditCouponId(CREDIT_STARTER);
      }
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

  // Stripe injoignable ou refus (prix inconnu, coupon invalide…) : le visiteur
  // retombe sur une page qui lui propose de réessayer, au lieu de l'écran
  // générique « Application error ».
  let session: Awaited<ReturnType<ReturnType<typeof getStripe>["checkout"]["sessions"]["create"]>>;
  try {
    session = await getStripe().checkout.sessions.create({
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
      cancel_url: `${origin}/checkout/cancel?plan=${plan.code}`,
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
  } catch (err) {
    console.error(
      "[checkout] création de session Stripe échouée:",
      err instanceof Error ? err.message : String(err),
    );
    redirect(`/checkout/cancel?plan=${plan.code}&err=1`);
  }

  if (!session.url) {
    redirect(`/checkout/cancel?plan=${plan.code}&err=1`);
  }

  redirect(session.url);
}

async function getOriginFromHeaders(): Promise<string> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}
