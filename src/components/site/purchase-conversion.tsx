"use client";

import { useEffect } from "react";

// Événement de conversion Google Ads sur /checkout/success.
// No-op tant que NEXT_PUBLIC_GADS_ID + NEXT_PUBLIC_GADS_CONVERSION_LABEL ne
// sont pas définis. transaction_id = session Stripe → Google déduplique les
// rechargements de page côté Ads.
const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;
const CONVERSION_LABEL = process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL;

export function PurchaseConversion({
  value,
  currency,
  transactionId,
}: {
  value: number;
  currency: string;
  transactionId: string;
}) {
  useEffect(() => {
    if (!GADS_ID || !CONVERSION_LABEL) return;
    // Si l'appel Stripe a échoué côté serveur, `value` vaut 0. Envoyer 0 €
    // enregistrerait la vente à zéro dans Ads (ROAS faussé, et une stratégie
    // « maximiser la valeur » apprendrait sur du faux). On omet alors la
    // valeur : Google applique celle par défaut de l'action de conversion.
    const montantConnu = Number.isFinite(value) && value > 0;
    window.gtag?.("event", "conversion", {
      send_to: `${GADS_ID}/${CONVERSION_LABEL}`,
      ...(montantConnu ? { value, currency } : {}),
      transaction_id: transactionId,
    });
  }, [value, currency, transactionId]);

  return null;
}
