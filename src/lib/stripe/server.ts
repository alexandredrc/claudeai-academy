import "server-only";
import Stripe from "stripe";

let cached: Stripe | null = null;

/**
 * Init paresseuse : la clé n'est validée qu'au premier appel (pas au
 * chargement du module), sinon `next build` plante en collectant les routes
 * (webhook, checkout) alors qu'aucune requête n'est servie. Même pattern que
 * getAnthropic().
 */
export function getStripe(): Stripe {
  if (cached) return cached;
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local (Stripe Dashboard → Developers → API keys).",
    );
  }
  cached = new Stripe(apiKey, { typescript: true });
  return cached;
}
