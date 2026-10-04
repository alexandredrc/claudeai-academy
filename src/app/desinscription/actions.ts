"use server";

import { redirect } from "next/navigation";
import { desinscrireLead, jetonValide } from "@/lib/email/desinscription";

export async function confirmerDesinscriptionAction(formData: FormData) {
  const l = formData.get("l");
  const t = formData.get("t");
  if (!jetonValide(l, t)) redirect("/desinscription?etat=invalide");
  const ok = await desinscrireLead(l);
  redirect(`/desinscription?etat=${ok ? "fait" : "erreur"}`);
}
