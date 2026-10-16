"use client";

import type { ReactNode } from "react";
import { startCheckoutAction } from "@/app/checkout/actions";
import type { PlanCode } from "@/lib/stripe/plans";
import { PRIX_STARTER, prixMastery } from "@/lib/offre/prix";
import { Button } from "./button";

type CheckoutButtonProps = {
  tier: PlanCode;
  children: ReactNode;
  variant?: "primary" | "ghost" | "ghost-light";
  size?: "md" | "lg";
  className?: string;
  /**
   * Prix écrit sur la page, calculé par le composant SERVEUR parent (jamais
   * avec l'horloge du navigateur : une horloge fausse renverrait le visiteur
   * en boucle). Le checkout compare : s'il diffère du prix du moment (page
   * chargée avant la hausse du 01/11, clic après), il renvoie sur /tarifs
   * avec une explication au lieu d'ouvrir Stripe à un autre prix.
   */
  prixAffiche?: number;
};

// Prix, pour la valeur de l'événement `begin_checkout` seulement : le prix
// facturé reste fixé côté serveur (lib/stripe/plans.ts). Calculé au clic et
// jamais affiché : le Mastery passe de 497 € à 697 € le 01/11/2026
// (lib/offre/prix.ts), une constante de module resterait sur l'ancien prix.
function prixDuPlan(tier: PlanCode): number {
  switch (tier) {
    case "starter":
      return PRIX_STARTER;
    case "mastery":
      return prixMastery();
    case "elite":
      return 1497;
  }
}

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
  prixAffiche,
}: CheckoutButtonProps) {
  return (
    <form
      action={startCheckoutAction}
      className="contents"
      onSubmit={() => {
        const prix = prixDuPlan(tier);
        window.gtag?.("event", "begin_checkout", {
          currency: "EUR",
          value: prix,
          items: [{ item_id: tier, price: prix, quantity: 1 }],
        });
      }}
    >
      <input type="hidden" name="plan" value={tier} />
      {prixAffiche ? (
        <input type="hidden" name="prix_affiche" value={prixAffiche} />
      ) : null}
      <Button type="submit" variant={variant} size={size} className={className}>
        {children}
      </Button>
    </form>
  );
}
