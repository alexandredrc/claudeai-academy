import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

/**
 * Réception des événements Resend (envoi, remise, ouverture, clic, rejet).
 *
 * Sans ce point d'entrée, les séquences email partent dans le noir : on sait
 * combien d'emails on a envoyés, jamais combien sont arrivés ni combien ont
 * été ouverts. Les événements atterrissent dans `email_events`, indexés par
 * le tag d'envoi (`kind`), ce qui donne un taux d'ouverture et de clic par
 * étape de séquence.
 *
 * Mise en service côté Resend (deux réglages, une seule fois) :
 *   1. Domains → claudeai-academy.com → activer « Open tracking » et
 *      « Click tracking ». Sans ça, aucun événement d'ouverture n'existe.
 *   2. Webhooks → Add endpoint → https://www.claudeai-academy.com/api/resend/webhook
 *      → cocher les événements email.* → copier le « Signing Secret »
 *      (whsec_…) dans la variable d'environnement RESEND_WEBHOOK_SECRET.
 */

// Tolérance d'horloge sur l'horodatage signé : au-delà, on rejette (rejeu).
const TIMESTAMP_TOLERANCE_S = 5 * 60;

/**
 * Vérification de signature Svix (le transporteur de webhooks de Resend).
 *
 * Le contenu signé est `id.timestamp.corps_brut`, la clé est la partie
 * base64 du secret après « whsec_ », et l'en-tête peut porter plusieurs
 * signatures séparées par des espaces (rotation de secret) — il suffit qu'une
 * seule corresponde.
 */
function verifySvix(params: {
  secret: string;
  id: string;
  timestamp: string;
  signatureHeader: string;
  body: string;
}): boolean {
  const ts = Number(params.timestamp);
  if (!Number.isFinite(ts)) return false;
  if (Math.abs(Date.now() / 1000 - ts) > TIMESTAMP_TOLERANCE_S) return false;

  const secret = params.secret.startsWith("whsec_")
    ? params.secret.slice("whsec_".length)
    : params.secret;

  let key: Buffer;
  try {
    key = Buffer.from(secret, "base64");
  } catch {
    return false;
  }
  if (key.length === 0) return false;

  const expected = crypto
    .createHmac("sha256", key)
    .update(`${params.id}.${params.timestamp}.${params.body}`)
    .digest("base64");
  const expectedBuf = Buffer.from(expected, "utf8");

  // Comparaison à temps constant, sur chaque signature proposée.
  for (const part of params.signatureHeader.split(" ")) {
    const sig = part.includes(",") ? part.slice(part.indexOf(",") + 1) : part;
    const sigBuf = Buffer.from(sig, "utf8");
    if (sigBuf.length !== expectedBuf.length) continue;
    if (crypto.timingSafeEqual(sigBuf, expectedBuf)) return true;
  }
  return false;
}

/**
 * Le tag d'étape posé à l'envoi. Resend renvoie `tags` tantôt comme un objet
 * ({ kind: "nurture_d1" }), tantôt comme la liste d'origine
 * ([{ name: "kind", value: "nurture_d1" }]) : on lit les deux formes plutôt
 * que de perdre l'information sur un changement de format.
 */
function readKind(tags: unknown): string | null {
  if (!tags) return null;
  if (Array.isArray(tags)) {
    for (const t of tags) {
      const tag = t as { name?: unknown; value?: unknown };
      if (tag?.name === "kind" && typeof tag.value === "string") return tag.value;
    }
    return null;
  }
  if (typeof tags === "object") {
    const value = (tags as Record<string, unknown>).kind;
    return typeof value === "string" ? value : null;
  }
  return null;
}

function firstRecipient(to: unknown): string | null {
  if (typeof to === "string") return to;
  if (Array.isArray(to) && typeof to[0] === "string") return to[0];
  return null;
}

export async function POST(req: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[resend-webhook] RESEND_WEBHOOK_SECRET non défini — refus (fail closed).");
    return new NextResponse("Webhook secret not configured", { status: 500 });
  }

  const id = req.headers.get("svix-id");
  const timestamp = req.headers.get("svix-timestamp");
  const signature = req.headers.get("svix-signature");
  if (!id || !timestamp || !signature) {
    return new NextResponse("Missing signature headers", { status: 400 });
  }

  // Corps brut obligatoire : la signature porte sur les octets reçus, pas sur
  // un JSON re-sérialisé.
  const raw = await req.text();
  if (!verifySvix({ secret, id, timestamp, signatureHeader: signature, body: raw })) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const eventType = typeof payload.type === "string" ? payload.type : null;
  if (!eventType) {
    return new NextResponse("Missing event type", { status: 400 });
  }

  const data = (payload.data ?? {}) as Record<string, unknown>;
  const click = (data.click ?? {}) as Record<string, unknown>;

  const occurredAt =
    typeof payload.created_at === "string"
      ? payload.created_at
      : typeof data.created_at === "string"
        ? data.created_at
        : new Date().toISOString();

  const { error } = await supabaseAdmin.from("email_events").upsert(
    {
      resend_id: typeof data.email_id === "string" ? data.email_id : null,
      event_type: eventType,
      email: firstRecipient(data.to),
      kind: readKind(data.tags),
      link: typeof click.link === "string" ? click.link : null,
      occurred_at: occurredAt,
    },
    { onConflict: "resend_id,event_type,occurred_at", ignoreDuplicates: true },
  );

  if (error) {
    console.error("[resend-webhook] insert failed:", error.message);
    // 500 : Resend rejouera, et l'index d'unicité empêche le doublon.
    return new NextResponse(`DB error: ${error.message}`, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
