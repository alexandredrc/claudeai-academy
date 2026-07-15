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
    window.gtag?.("event", "conversion", {
      send_to: `${GADS_ID}/${CONVERSION_LABEL}`,
      value,
      currency,
      transaction_id: transactionId,
    });
  }, [value, currency, transactionId]);

  return null;
}
