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

  // Compacte sur mobile : à 375 px, l'ancienne version couvrait le tiers bas
  // de l'écran et cachait le bouton d'achat de la page de vente (audit Ads du
  // 10/10/2026). Les deux boutons ont le même poids visuel : c'est ce que
  // demande la CNIL, et le corail reste réservé au bouton d'achat.
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-6">
      <div className="mx-auto flex max-w-[720px] flex-col gap-3 rounded-[14px] border border-line bg-white px-4 py-3 shadow-[0_8px_30px_rgba(26,22,18,0.12)] sm:flex-row sm:items-center sm:gap-4 sm:p-5">
        <p className="flex-1 text-[12px] leading-snug text-ink-soft sm:text-[13px] sm:leading-relaxed">
          Un cookie de mesure publicitaire (Google), pour savoir quelles
          campagnes amènent de vrais élèves, rien d&apos;autre.
          <span className="hidden sm:inline">
            {" "}Vous pouvez refuser : le site fonctionne exactement pareil.
          </span>{" "}
          <a href="/confidentialite" className="underline hover:text-ink">
            En savoir plus
          </a>
        </p>
        <div className="flex shrink-0 gap-2 sm:gap-3">
          <button
            onClick={() => choose(false)}
            className="flex-1 rounded-[10px] border border-ink/30 bg-white px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:border-ink sm:flex-none"
          >
            Refuser
          </button>
          <button
            onClick={() => choose(true)}
            className="flex-1 rounded-[10px] border border-ink/30 bg-white px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:border-ink sm:flex-none"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
