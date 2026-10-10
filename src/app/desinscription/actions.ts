"use server";

import { redirect } from "next/navigation";
import { desinscrireLead, jetonValide } from "@/lib/email/desinscription";

export async function confirmerDesinscriptionAction(formData: FormData) {
  const l = formData.get("l");
  const t = formData.get("t");
  // La langue de la page est conservée d'un écran à l'autre (leads anglophones).
  const suffixe = formData.get("lang") === "en" ? "&lang=en" : "";
  if (!jetonValide(l, t)) redirect(`/desinscription?etat=invalide${suffixe}`);
  const ok = await desinscrireLead(l);
  redirect(`/desinscription?etat=${ok ? "fait" : "erreur"}${suffixe}`);
}
