import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * Vérifie un lien d'accès magique (token hash) généré côté serveur — typiquement
 * le lien envoyé dans l'email de bienvenue après un achat « pay-first ».
 *
 * Contrairement à /auth/callback (flux PKCE `exchangeCodeForSession`, qui exige
 * un code_verifier déposé dans le navigateur au moment où le flux est lancé),
 * `verifyOtp` se contente du token hash. Il fonctionne donc pour un lien créé
 * par le webhook Stripe, hors de toute session navigateur.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = (searchParams.get("type") ?? "magiclink") as EmailOtpType;

  // Garde anti-open-redirect : on n'accepte qu'un chemin interne.
  const rawNext = searchParams.get("next");
  const next =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : "/account";

  if (tokenHash) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent(
      "Lien d'accès invalide ou expiré. Connecte-toi avec ton email ou demande un nouveau lien.",
    )}`,
  );
}
