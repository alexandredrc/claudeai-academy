import "server-only";
import { SITE_URL } from "@/lib/email/send";
import { sendLoginLinkEmail } from "@/lib/email/login-link";

/** N'accepte qu'un chemin interne — garde anti-open-redirect. */
export function safeNext(raw: string | null | undefined, fallback = "/courses"): string {
  if (!raw) return fallback;
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : fallback;
}

/**
 * Construit le lien d'accès magique pointant vers notre page /auth/confirm.
 *
 * L'email est transporté en clair dans l'URL : il n'ouvre aucun accès à lui
 * seul (seul le token_hash fait foi) et il permet de renvoyer automatiquement
 * un lien frais si celui-ci a expiré ou a déjà été consommé — le cas le plus
 * fréquent en messagerie d'entreprise, où un antivirus ouvre les liens avant
 * le destinataire.
 */
export function buildAccessLink(params: {
  tokenHash: string;
  email: string;
  next?: string;
}): string {
  const next = encodeURIComponent(safeNext(params.next));
  const email = encodeURIComponent(params.email);
  return `${SITE_URL}/auth/confirm?token_hash=${params.tokenHash}&type=magiclink&next=${next}&email=${email}`;
}

/**
 * Génère puis envoie un lien de connexion magique.
 *
 * Best effort : renvoie `false` si le compte n'existe pas ou si l'envoi
 * échoue, sans jamais lever — l'appelant ne doit pas révéler la différence
 * (pas d'énumération d'emails).
 */
export async function sendAccessLink(params: {
  email: string;
  next?: string;
}): Promise<boolean> {
  const email = params.email.trim().toLowerCase();
  if (!email.includes("@")) return false;

  try {
    // Import dynamique : si la config admin manque, seul ce flux échoue,
    // jamais le login par mot de passe.
    const { supabaseAdmin } = await import("@/lib/supabase/admin");
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    const tokenHash = data?.properties?.hashed_token;
    if (error || !tokenHash) return false;

    // `false` si Resend n'est pas configuré : on ne prétend pas avoir envoyé.
    return await sendLoginLinkEmail({
      to: email,
      accessLink: buildAccessLink({ tokenHash, email, next: params.next }),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[access-link] envoi échoué:", message);
    return false;
  }
}
