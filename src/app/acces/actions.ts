"use server";

import { redirect } from "next/navigation";
import { sendAccessLink, safeNext } from "@/lib/auth/access-link";

// Anti-rafale par email (mémoire d'instance : best-effort en serverless).
const lastRequest = new Map<string, number>();
const THROTTLE_MS = 20_000;
const MAX_TRACKED = 500;

export async function requestAccessLinkAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = safeNext(String(formData.get("next") ?? ""), "/courses");

  if (!email || !email.includes("@")) {
    redirect(`/acces?erreur=${encodeURIComponent("Entre une adresse email valide.")}`);
  }

  const now = Date.now();
  if (now - (lastRequest.get(email) ?? 0) > THROTTLE_MS) {
    // Purge grossière : la Map ne doit pas grossir indéfiniment sur une lambda chaude.
    if (lastRequest.size > MAX_TRACKED) lastRequest.clear();
    lastRequest.set(email, now);
    await sendAccessLink({ email, next });
  }

  // Réponse identique que le compte existe ou non (pas d'énumération d'emails).
  redirect(
    `/acces?renvoye=1&email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`,
  );
}
