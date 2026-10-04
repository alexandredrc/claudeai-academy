import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Compteur Google Ads → `app_state`.
 *
 * Le script Google Ads (pipeline/google-ads-script.js, exécuté chez Google
 * tous les matins) n'a aucun moyen d'écrire dans notre base : pas de clé, et
 * il ne doit pas en avoir. Il dépose donc ses chiffres ici, et le rapport de
 * 8 h les lit dans `app_state` avec le reste. Avant cette route, les clics
 * vivaient dans un message Telegram de 7 h et les ventes dans celui de 8 h :
 * deux messages pour une seule décision, et personne ne faisait l'addition.
 *
 * Auth : `Authorization: Bearer $CRON_SECRET`, comme les crons. Fail closed.
 * Le corps est stocké tel quel (JSON), plafonné à 8 Ko : c'est le rapport qui
 * interprète, pas la route.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CLE = "ads_compteur";
const TAILLE_MAX = 8 * 1024;

export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[ads-compteur] CRON_SECRET non défini — refus (fail closed).");
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const brut = await req.text();
  if (!brut || brut.length > TAILLE_MAX) {
    return NextResponse.json({ ok: false, erreur: "corps vide ou trop long" }, { status: 400 });
  }
  let corps: Record<string, unknown>;
  try {
    corps = JSON.parse(brut) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, erreur: "JSON invalide" }, { status: 400 });
  }
  if (typeof corps !== "object" || corps === null || Array.isArray(corps)) {
    return NextResponse.json({ ok: false, erreur: "objet attendu" }, { status: 400 });
  }

  const recuLe = new Date().toISOString();
  const { error } = await supabaseAdmin
    .from("app_state")
    .upsert(
      { cle: CLE, valeur: JSON.stringify({ ...corps, recuLe }), updated_at: recuLe },
      { onConflict: "cle" },
    );
  if (error) {
    console.error("[ads-compteur] écriture app_state :", error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true, recuLe });
}
