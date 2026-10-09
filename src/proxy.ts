import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import {
  PROVENANCE_COOKIE,
  PROVENANCE_MAX_AGE,
  decoderProvenance,
  encoderProvenance,
  provenanceDepuisRequete,
  utmDepuisSrc,
} from "@/lib/attribution";

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

/** Date du jour à Paris, `2026-10-02`. */
function aujourdHuiParis(): string {
  return new Intl.DateTimeFormat("fr-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Cookie de provenance. Posé à la première page vue, relu quand le visiteur
 * ouvre le paiement : c'est ce qui permet d'écrire, dans `purchases`, le canal
 * qui a amené la vente. Sans lui, la vente est enregistrée par un webhook
 * Stripe qui ne sait rien du navigateur, et le rapport du matin ne peut pas
 * dire si la com rapporte.
 *
 * Règles :
 *  - seulement les navigations de page (pas les requêtes RSC ni les prefetch,
 *    qui porteraient un faux « landing ») ;
 *  - une marque de campagne explicite (utm, src, gclid) écrase toujours : le
 *    dernier clic sur un lien de com est le plus informatif ;
 *  - un référent ou une arrivée directe ne font que remplir un cookie absent.
 */
function poserProvenance(request: NextRequest, response: NextResponse) {
  if (request.method !== "GET") return;
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/api") || pathname.startsWith("/auth")) return;
  const dest = request.headers.get("sec-fetch-dest");
  if (dest && dest !== "document") return;
  // Requêtes internes de Next (navigation client, préchargement) : jamais une
  // « première page vue ». Plusieurs marqueurs, parce que Next n'en garantit
  // aucun depuis le proxy.
  if (
    request.headers.get("rsc") ||
    request.headers.get("next-router-prefetch") ||
    request.headers.get("next-url") ||
    request.headers.get("next-router-state-tree") ||
    request.nextUrl.searchParams.has("_rsc")
  ) {
    return;
  }

  const existante = decoderProvenance(request.cookies.get(PROVENANCE_COOKIE)?.value);
  const { provenance, explicite } = provenanceDepuisRequete(
    request.nextUrl,
    request.headers.get("referer"),
    aujourdHuiParis(),
  );
  if (existante && !explicite) return;
  // Même campagne qu'avant : rien à réécrire, on garde la date d'origine.
  if (
    existante &&
    existante.source === provenance.source &&
    existante.medium === provenance.medium &&
    existante.campaign === provenance.campaign
  ) {
    return;
  }

  response.cookies.set(PROVENANCE_COOKIE, encoderProvenance(provenance), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PROVENANCE_MAX_AGE,
  });
}

export async function proxy(request: NextRequest) {
  const attribution = redirectionAttribution(request);
  if (attribution) return attribution;
  // Le layout racine ne connaît pas le chemin demandé ; il lui faut ce
  // repère pour servir l'habillage anglais des pages /en/… (lang, en-tête,
  // pied de page). `updateSession` renvoie les en-têtes de requête tels quels.
  request.headers.set("x-pathname", request.nextUrl.pathname);
  const response = await updateSession(request);
  poserProvenance(request, response);
  return response;
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
