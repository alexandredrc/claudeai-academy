"use server";

import { redirect } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { sendAccessLink, safeNext } from "@/lib/auth/access-link";

/**
 * Consomme le token du lien d'accès. Déclenchée par un clic humain (POST),
 * jamais par le simple chargement de la page : les antivirus de messagerie
 * pré-ouvrent les liens en GET et brûlaient le token à usage unique avant que
 * le destinataire n'arrive — c'était la cause n°1 des « lien expiré ».
 */
export async function confirmAccessAction(formData: FormData) {
  const tokenHash = String(formData.get("token_hash") ?? "");
  const type = (String(formData.get("type") ?? "magiclink") ||
    "magiclink") as EmailOtpType;
  const next = safeNext(String(formData.get("next") ?? ""), "/account");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  const supabase = await createClient();

  let ok = false;
  if (tokenHash) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    ok = !error;
  }

  // Lien périmé mais session déjà ouverte (le membre a cliqué un vieil email
  // depuis un navigateur où il est connecté) : on le laisse passer.
  if (!ok) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    ok = Boolean(user);
  }

  if (ok) redirect(next);

  // Token expiré ou déjà consommé : on renvoie immédiatement un lien frais
  // plutôt que de renvoyer le membre vers un formulaire à re-remplir.
  const resent = email ? await sendAccessLink({ email, next }) : false;

  const params = new URLSearchParams({ raison: "expire" });
  if (email) params.set("email", email);
  if (resent) params.set("renvoye", "1");
  if (next) params.set("next", next);
  redirect(`/acces?${params.toString()}`);
}
