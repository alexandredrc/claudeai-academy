export type PlanTier = "starter" | "mastery";

export type Plan = {
  tier: PlanTier;
  name: string;
  priceId: string;
  amountEur: number;
};

function priceIdOrThrow(envKey: string): string {
  const id = process.env[envKey];
  if (!id) {
    throw new Error(
      `${envKey} is not set. Add it to .env.local (Stripe Dashboard → product page → Pricing).`,
    );
  }
  return id;
}

export function getPlan(tier: PlanTier): Plan {
  switch (tier) {
    case "starter":
      return {
        tier: "starter",
        name: "Pass Starter",
        priceId: priceIdOrThrow("STRIPE_PRICE_STARTER"),
        amountEur: 47,
      };
    case "mastery":
      return {
        tier: "mastery",
        name: "Pass Mastery",
        priceId: priceIdOrThrow("STRIPE_PRICE_MASTERY"),
        amountEur: 497,
      };
  }
}

export function isValidTier(value: unknown): value is PlanTier {
  return value === "starter" || value === "mastery";
}
