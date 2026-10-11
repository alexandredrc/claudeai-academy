"use client";

import type { ReactNode } from "react";
import { startCheckoutAction } from "@/app/checkout/actions";
import type { PlanCode } from "@/lib/stripe/plans";
import { Button } from "./button";

type CheckoutButtonProps = {
  tier: PlanCode;
  children: ReactNode;
  variant?: "primary" | "ghost" | "ghost-light";
  size?: "md" | "lg";
  className?: string;
};

// Prix affichés, pour la valeur de l'événement `begin_checkout` seulement :
// le prix facturé reste fixé côté serveur (lib/stripe/plans.ts).
const PRIX: Record<PlanCode, number> = { starter: 47, mastery: 497, elite: 1497 };

/**
 * Bouton d'achat de la vitrine. Soumet `plan` au server action
 * startCheckoutAction, qui crée la session Stripe Checkout (connexion
 * facultative) et redirige vers le paiement.
 * Le clic est compté dans GA4 (`begin_checkout`) : c'est ce qui permet de
 * savoir si un visiteur part sur la page ou dans Stripe.
 * Le <form> est en display:contents pour ne pas perturber le layout parent.
 */
export function CheckoutButton({
  tier,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: CheckoutButtonProps) {
  return (
    <form
      action={startCheckoutAction}
      className="contents"
      onSubmit={() =>
        window.gtag?.("event", "begin_checkout", {
          currency: "EUR",
          value: PRIX[tier],
          items: [{ item_id: tier, price: PRIX[tier], quantity: 1 }],
        })
      }
    >
      <input type="hidden" name="plan" value={tier} />
      <Button type="submit" variant={variant} size={size} className={className}>
        {children}
      </Button>
    </form>
  );
}
