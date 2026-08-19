"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Définit (ou remplace) le mot de passe du membre connecté.
 *
 * Les comptes ouverts après un achat « pay-first » sont créés par le webhook
 * Stripe sans mot de passe utilisable : leur seule porte d'entrée est le lien
 * magique, qui expire. Ce formulaire leur donne un accès permanent.
 */
export async function setPasswordAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("password_confirm") ?? "");

  const fail = (message: string) =>
    redirect(`/account?mdp_erreur=${encodeURIComponent(message)}`);

  if (password.length < 8) {
    fail("Le mot de passe doit faire au moins 8 caractères.");
  }
  if (password !== confirm) {
    fail("Les deux mots de passe ne correspondent pas.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  const { error } = await supabase.auth.updateUser({ password });
  if (error) fail(error.message);

  redirect("/account?mdp=ok");
}
