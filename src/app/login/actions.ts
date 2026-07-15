"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/email/send";
import { sendLoginLinkEmail } from "@/lib/email/login-link";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/account");

  if (!email || !password) {
    redirect(
      `/login?error=${encodeURIComponent("Email et mot de passe requis.")}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(
      `/login?error=${encodeURIComponent("Email ou mot de passe incorrect.")}`,
    );
  }

  redirect(next);
}

// Throttle par email (mémoire d'instance : best-effort en serverless,
// suffisant pour freiner les rafales sur une lambda chaude).
const lastLinkRequest = new Map<string, number>();
const LINK_THROTTLE_MS = 60_000;

/**
 * Envoie un lien de connexion magique par email. Indispensable aux comptes
 * créés par le webhook pay-first (aucun mot de passe) qui ont perdu l'email
 * de bienvenue. Réponse volontairement identique que le compte existe ou non
 * (pas d'énumération d'emails).
 */
export async function sendLoginLinkAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = String(formData.get("next") ?? "/courses");

  if (!email || !email.includes("@")) {
    redirect(`/login?error=${encodeURIComponent("Entre un email valide.")}`);
  }

  const now = Date.now();
  const last = lastLinkRequest.get(email) ?? 0;
  if (now - last > LINK_THROTTLE_MS) {
    lastLinkRequest.set(email, now);
    try {
      // Import dynamique : si la config admin manque, seul ce flux échoue
      // (silencieusement), jamais le login par mot de passe.
      const { supabaseAdmin } = await import("@/lib/supabase/admin");
      const { data, error } = await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email,
      });
      const hashedToken = data?.properties?.hashed_token;
      if (!error && hashedToken) {
        const safeNext =
          next.startsWith("/") && !next.startsWith("//") ? next : "/courses";
        const accessLink = `${SITE_URL}/auth/confirm?token_hash=${hashedToken}&type=magiclink&next=${encodeURIComponent(safeNext)}`;
        await sendLoginLinkEmail({ to: email, accessLink });
      }
      // Compte inconnu (error) : on ne fait rien, même redirection qu'en succès.
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[login-link] envoi échoué:", message);
    }
  }

  redirect(`/login?sent=1${next ? `&next=${encodeURIComponent(next)}` : ""}`);
}
