import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/auth/safe-next";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // `next=@evil.com` donnait `https://www.claudeai-academy.com@evil.com`, donc
  // evil.com (audit du 16/10/2026) : même garde que le reste du tunnel d'auth.
  const next = safeNext(searchParams.get("next"), "/account");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Lien de confirmation grillé (expiré, ou déjà ouvert par un antivirus de
  // messagerie) : on envoie vers la page de récupération, pas vers un mur.
  return NextResponse.redirect(`${origin}/acces?raison=expire`);
}
