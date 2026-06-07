"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function signupAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const plan = String(formData.get("plan") ?? "").trim();

  if (!email || !password || !firstName || !lastName) {
    redirect(
      `/signup?error=${encodeURIComponent("Tous les champs sont requis.")}${plan ? `&plan=${plan}` : ""}`,
    );
  }

  if (password.length < 8) {
    redirect(
      `/signup?error=${encodeURIComponent("Le mot de passe doit faire au moins 8 caractères.")}${plan ? `&plan=${plan}` : ""}`,
    );
  }

  const supabase = await createClient();
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ?? (await getOriginFromHeaders());

  // Propage le plan choisi à travers la confirmation email :
  // après /auth/callback, on atterrit sur /account avec ?plan= et un bandeau
  // "Finaliser ton achat" qui POST sur /checkout.
  const accountTarget = plan
    ? `/account?plan=${encodeURIComponent(plan)}&welcome=1`
    : "/account?welcome=1";
  const emailRedirect = `${origin}/auth/callback?next=${encodeURIComponent(accountTarget)}`;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: emailRedirect,
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    redirect(
      `/signup?error=${encodeURIComponent(error.message)}${plan ? `&plan=${plan}` : ""}`,
    );
  }

  redirect(`/signup?sent=1${plan ? `&plan=${plan}` : ""}`);
}

async function getOriginFromHeaders() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}
