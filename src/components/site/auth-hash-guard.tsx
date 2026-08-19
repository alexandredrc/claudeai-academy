"use client";

import { useEffect } from "react";

/**
 * Rattrape les échecs de lien renvoyés par Supabase.
 *
 * Quand un lien email est expiré ou déjà consommé, GoTrue redirige vers la
 * racine du site avec l'erreur dans le fragment d'URL
 * (`#error=access_denied&error_code=otp_expired`). Le fragment n'est jamais
 * transmis au serveur : sans ce garde-fou, le membre atterrit sur la page
 * d'accueil sans la moindre explication et croit le site cassé.
 */
export function AuthHashGuard() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.includes("error")) return;

    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const code = params.get("error_code");
    const error = params.get("error");
    if (!code && !error) return;

    // On nettoie le fragment pour ne pas reboucler sur un retour arrière.
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    window.location.replace(`/acces?raison=expire`);
  }, []);

  return null;
}
