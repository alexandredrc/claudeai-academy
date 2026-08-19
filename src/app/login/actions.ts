"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/auth/access-link";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? ""), "/account");

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

/**
 * Renvoie vers la page dédiée /acces, qui gère l'envoi du lien magique et
 * explique les cas d'échec (lien déjà ouvert par un antivirus de messagerie).
 * Indispensable aux comptes créés par le webhook pay-first : ils n'ont aucun
 * mot de passe, le lien est leur seule porte d'entrée.
 */
export async function sendLoginLinkAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = safeNext(String(formData.get("next") ?? ""), "/courses");

  const params = new URLSearchParams({ next });
  if (email) params.set("email", email);
  redirect(`/acces?${params.toString()}`);
}
