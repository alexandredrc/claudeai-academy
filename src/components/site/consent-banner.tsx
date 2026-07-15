"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cai-consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function applyConsent(granted: boolean) {
  window.gtag?.("consent", "update", {
    ad_storage: granted ? "granted" : "denied",
    ad_user_data: granted ? "granted" : "denied",
    ad_personalization: granted ? "granted" : "denied",
    analytics_storage: granted ? "granted" : "denied",
  });
}

// Bannière de consentement (RGPD / Consent Mode v2). Ne s'affiche que si le
// tag Google est actif (le layout ne la monte pas sinon) et qu'aucun choix
// n'a encore été fait. Le refus est aussi simple que l'acceptation (CNIL).
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "granted") applyConsent(true);
    else if (stored !== "denied") setVisible(true);
  }, []);

  if (!visible) return null;

  const choose = (granted: boolean) => {
    window.localStorage.setItem(STORAGE_KEY, granted ? "granted" : "denied");
    applyConsent(granted);
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <div className="mx-auto flex max-w-[720px] flex-col gap-4 rounded-[16px] border border-line bg-white p-5 shadow-[0_8px_30px_rgba(26,22,18,0.12)] sm:flex-row sm:items-center">
        <p className="flex-1 text-[13px] leading-relaxed text-ink-soft">
          On utilise un cookie de mesure publicitaire (Google) pour savoir
          quelles campagnes amènent de vrais élèves — rien d&apos;autre. Vous
          pouvez refuser : le site fonctionne exactement pareil.{" "}
          <a href="/confidentialite" className="underline hover:text-ink">
            En savoir plus
          </a>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={() => choose(false)}
            className="rounded-[12px] border border-line bg-white px-4 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-coral"
          >
            Refuser
          </button>
          <button
            onClick={() => choose(true)}
            className="rounded-[12px] bg-coral px-4 py-2.5 text-[13px] font-semibold text-cream transition-colors hover:bg-coral-dark"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
