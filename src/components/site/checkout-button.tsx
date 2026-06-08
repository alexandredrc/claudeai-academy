import type { ReactNode } from "react";
import { startCheckoutAction } from "@/app/checkout/actions";
import { Button } from "./button";

type CheckoutButtonProps = {
  tier: "starter" | "mastery";
  children: ReactNode;
  variant?: "primary" | "ghost" | "ghost-light";
  size?: "md" | "lg";
  className?: string;
};

/**
 * Bouton d'achat de la vitrine. Soumet `plan` au server action
 * startCheckoutAction, qui : redirige vers /signup?plan=... si non connecté,
 * sinon crée la session Stripe Checkout et redirige vers le paiement.
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
    <form action={startCheckoutAction} className="contents">
      <input type="hidden" name="plan" value={tier} />
      <Button type="submit" variant={variant} size={size} className={className}>
        {children}
      </Button>
    </form>
  );
}
