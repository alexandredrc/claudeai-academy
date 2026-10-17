import "server-only";
import crypto from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Contrôle `Authorization: Bearer <secret>` des routes appelées par une
 * machine : crons Vercel, script Google Ads, relevé de la boîte support.
 *
 * Règle : un secret par appelant. Le script Google Ads vit chez Google, le
 * relevé de mail sera déclenché par un service extérieur ; si l'un d'eux fuit
 * son secret, seule sa route s'ouvre — jamais les crons, ni les liens de
 * désinscription signés avec `CRON_SECRET`. Seule exception assumée : les
 * crons Vercel partagent `CRON_SECRET`, la plateforme n'envoie que celui-là.
 *
 * Fail closed : variable absente → 503, rien ne s'exécute. La comparaison
 * porte sur les empreintes SHA-256 (même longueur par construction), en temps
 * constant, pour ne rien laisser deviner du secret par la durée de réponse.
 *
 * Renvoie `null` si l'appel est autorisé, sinon la réponse à renvoyer telle quelle.
 */
export type SecretAppelant =
  | "CRON_SECRET"
  | "ADS_COMPTEUR_SECRET"
  | "MAIL_RELEVE_SECRET";

export function refuserSansSecret(
  req: NextRequest,
  variable: SecretAppelant,
  etiquette: string,
): NextResponse | null {
  const secret = process.env[variable];
  if (!secret) {
    console.error(`[${etiquette}] ${variable} non défini — refus (fail closed).`);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  const recu = crypto
    .createHash("sha256")
    .update(req.headers.get("authorization") ?? "")
    .digest();
  const attendu = crypto.createHash("sha256").update(`Bearer ${secret}`).digest();
  if (!crypto.timingSafeEqual(recu, attendu)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return null;
}
