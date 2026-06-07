import "server-only";
import Stripe from "stripe";

const apiKey = process.env.STRIPE_SECRET_KEY;
if (!apiKey) {
  throw new Error(
    "STRIPE_SECRET_KEY is not set. Add it to .env.local (Stripe Dashboard → Developers → API keys).",
  );
}

export const stripe = new Stripe(apiKey, {
  typescript: true,
});
