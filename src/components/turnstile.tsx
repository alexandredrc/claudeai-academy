"use client";

import { useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_ID = "cf-turnstile-script";

type TurnstileApi = {
  render: (
    el: HTMLElement,
    options: {
      sitekey: string;
      callback?: (jeton: string) => void;
      "expired-callback"?: () => void;
    },
  ) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

function chargerScript(): Promise<TurnstileApi> {
  return new Promise((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", () =>
      window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile absent")),
    );
    script.addEventListener("error", () => reject(new Error("turnstile injoignable")));
  });
}

/**
 * Captcha invisible Cloudflare Turnstile. Sans `NEXT_PUBLIC_TURNSTILE_SITE_KEY`,
 * ne rend rien : le formulaire marche comme avant et seul le quota serveur
 * protège (voir `src/lib/auth/quota-email.ts`).
 *
 * Dans un <form>, le widget ajoute lui-même le champ caché
 * `cf-turnstile-response` que lit l'action serveur. `onJeton` sert aux
 * formulaires envoyés en fetch.
 */
export function Turnstile({ onJeton }: { onJeton?: (jeton: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const onJetonRef = useRef(onJeton);

  useEffect(() => {
    onJetonRef.current = onJeton;
  }, [onJeton]);

  useEffect(() => {
    if (!SITE_KEY || !ref.current) return;
    const el = ref.current;
    let widgetId: string | null = null;
    let annule = false;
    chargerScript()
      .then((api) => {
        if (annule) return;
        widgetId = api.render(el, {
          sitekey: SITE_KEY,
          callback: (jeton) => onJetonRef.current?.(jeton),
          "expired-callback": () => onJetonRef.current?.(""),
        });
      })
      .catch(() => {
        // Script bloqué (extension, réseau) : aucun jeton, le serveur
        // refusera l'envoi. Limite connue du captcha, rien à faire ici.
      });
    return () => {
      annule = true;
      if (widgetId) window.turnstile?.remove(widgetId);
    };
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={ref} />;
}
