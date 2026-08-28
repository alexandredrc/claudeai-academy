import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import { utmDepuisSrc } from "@/lib/attribution";

/**
 * Un lien `?src=instagram-bio` est redirigé une fois vers le même lien enrichi
 * des `utm_*` correspondants, que GA4 sait lire. Le `src` est conservé : la
 * page /kit s'en sert encore pour renseigner `leads.source`.
 *
 * Garde-fou anti-boucle : on ne redirige que si `utm_source` est absent, donc
 * la deuxième requête passe à côté. Les appels d'API et le tunnel d'auth sont
 * exclus : y ajouter un paramètre n'apporte rien et pourrait casser une
 * signature d'URL.
 */
function redirectionAttribution(request: NextRequest) {
  if (request.method !== "GET") return null;

  const { pathname, searchParams } = request.nextUrl;
  if (pathname.startsWith("/api") || pathname.startsWith("/auth")) return null;

  const src = searchParams.get("src");
  if (!src || searchParams.get("utm_source")) return null;

  const utm = utmDepuisSrc(src);
  if (!utm) return null;

  const url = request.nextUrl.clone();
  url.searchParams.set("utm_source", utm.source);
  url.searchParams.set("utm_medium", utm.medium);
  url.searchParams.set("utm_campaign", utm.campaign);
  return NextResponse.redirect(url, 307);
}

export async function proxy(request: NextRequest) {
  const attribution = redirectionAttribution(request);
  if (attribution) return attribution;
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - svg, png, jpg, jpeg, gif, webp (image files)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
