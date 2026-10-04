import { NextResponse, type NextRequest } from "next/server";
import { desinscrireLead, jetonValide } from "@/lib/email/desinscription";

export const dynamic = "force-dynamic";

/**
 * Désinscription « un clic » des messageries (RFC 8058) : Gmail ou Apple Mail
 * envoient ici un POST `List-Unsubscribe=One-Click` quand la personne touche
 * « Se désabonner » à côté de l'expéditeur. Aucune page, aucune confirmation :
 * c'est la messagerie qui a déjà demandé confirmation.
 */
export async function POST(req: NextRequest) {
  const l = req.nextUrl.searchParams.get("l");
  const t = req.nextUrl.searchParams.get("t");
  if (!jetonValide(l, t)) {
    return new NextResponse("Lien invalide", { status: 400 });
  }
  const ok = await desinscrireLead(l);
  return new NextResponse(ok ? "Désinscription enregistrée" : "Erreur", { status: ok ? 200 : 500 });
}

/**
 * Une messagerie sans POST ouvre l'adresse dans un navigateur : on renvoie
 * vers la page qui demande confirmation, on ne désinscrit jamais sur un GET.
 */
export async function GET(req: NextRequest) {
  const l = req.nextUrl.searchParams.get("l") ?? "";
  const t = req.nextUrl.searchParams.get("t") ?? "";
  const url = new URL("/desinscription", req.nextUrl.origin);
  url.searchParams.set("l", l);
  url.searchParams.set("t", t);
  return NextResponse.redirect(url, 303);
}
