"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { buildAccessLink, safeNext, sendAccessLink } from "@/lib/auth/access-link";
import { sendSignupConfirmationEmail } from "@/lib/email/confirm-signup";

/**
 * Inscription.
 *
 * On n'utilise plus `supabase.auth.signUp`, qui délègue l'email à Supabase :
 * son template pointait sur `/auth/v1/verify`, un GET qui consomme le jeton à
 * usage unique — les antivirus de messagerie l'ouvraient avant le
 * destinataire, et 60 % des inscriptions en adresse professionnelle
 * n'aboutissaient jamais. Ici Supabase ne sert qu'à fabriquer le jeton :
 * l'email part par Resend, comme tous les autres, et le lien passe par
 * /auth/confirm qui n'active le jeton qu'après un clic humain.
 */
export async function signupAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const plan = String(formData.get("plan") ?? "").trim();

  const planSuffix = plan ? `&plan=${encodeURIComponent(plan)}` : "";
  const fail = (message: string) =>
    redirect(`/signup?error=${encodeURIComponent(message)}${planSuffix}`);

  if (!email || !password || !firstName || !lastName) {
    fail("Tous les champs sont requis.");
  }
  if (!email.includes("@")) {
    fail("Entre une adresse email valide.");
  }
  if (password.length < 8) {
    fail("Le mot de passe doit faire au moins 8 caractères.");
  }

  // Le plan choisi survit à la confirmation : après /auth/confirm, on atterrit
  // sur /account avec le bandeau « Finaliser ton achat ».
  const next = safeNext(
    plan
      ? `/account?plan=${encodeURIComponent(plan)}&welcome=1`
      : "/account?welcome=1",
    "/account?welcome=1",
  );

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: { data: { first_name: firstName, last_name: lastName } },
  });

  const tokenHash = data?.properties?.hashed_token;

  if (error || !tokenHash) {
    // Cas principal : l'adresse a déjà un compte. On n'en dit rien (pas
    // d'énumération d'emails) et on rend service — un lien de connexion part
    // vers la boîte, ce qui est exactement ce dont la personne a besoin.
    await sendAccessLink({ email, next: "/account" });
    redirect(`/signup?sent=1${planSuffix}`);
  }

  await sendSignupConfirmationEmail({
    to: email,
    confirmLink: buildAccessLink({ tokenHash, email, next, type: "signup" }),
    firstName: firstName || null,
  });

  redirect(`/signup?sent=1${planSuffix}`);
}
