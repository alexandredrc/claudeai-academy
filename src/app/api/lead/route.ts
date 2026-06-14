import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendLeadEmail } from "@/lib/email/lead-magnet";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Validation email simple et robuste (pas de regex exotique).
function isValidEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const email = value.trim();
  if (email.length < 5 || email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clean(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (!v) return null;
  return v.slice(0, max);
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;

  // Honeypot anti-bot : champ caché qui doit rester vide.
  if (clean(data.company, 100)) {
    // On répond OK pour ne pas renseigner le bot, sans rien faire.
    return NextResponse.json({ ok: true });
  }

  if (!isValidEmail(data.email)) {
    return NextResponse.json({ ok: false, error: "Adresse email invalide." }, { status: 400 });
  }

  const email = (data.email as string).trim().toLowerCase();
  const firstName = clean(data.first_name, 80);
  const source = clean(data.source, 60) ?? "kit-15-prompts";

  // Upsert du lead (idempotent sur lower(email) via l'index unique).
  const { data: lead, error: upsertErr } = await supabaseAdmin
    .from("leads")
    .upsert(
      { email, first_name: firstName, source },
      { onConflict: "email", ignoreDuplicates: false },
    )
    .select("id, email")
    .single();

  if (upsertErr || !lead) {
    // Cas de course possible sur l'index lower(email) : on relit le lead existant.
    const { data: existing } = await supabaseAdmin
      .from("leads")
      .select("id, email")
      .eq("email", email)
      .maybeSingle();
    if (!existing) {
      console.error("[api/lead] upsert failed:", upsertErr?.message);
      return NextResponse.json(
        { ok: false, error: "Une erreur est survenue. Réessaie dans un instant." },
        { status: 500 },
      );
    }
    return await deliverMagnet(existing.id, existing.email, firstName);
  }

  return await deliverMagnet(lead.id, lead.email, firstName);
}

// Envoie le magnet une seule fois par lead (idempotence via lead_email_log).
async function deliverMagnet(leadId: string, email: string, firstName: string | null) {
  const { data: already } = await supabaseAdmin
    .from("lead_email_log")
    .select("id")
    .eq("lead_id", leadId)
    .eq("kind", "lead_magnet")
    .maybeSingle();

  if (already) {
    // Déjà livré : on renvoie OK (l'utilisateur s'est réinscrit), pas de doublon.
    return NextResponse.json({ ok: true, alreadySent: true });
  }

  try {
    const sent = await sendLeadEmail({ kind: "lead_magnet", to: email, firstName });
    if (sent) {
      await supabaseAdmin
        .from("lead_email_log")
        .upsert(
          { lead_id: leadId, email, kind: "lead_magnet" },
          { onConflict: "lead_id,kind", ignoreDuplicates: true },
        );
    }
    // Que l'email parte ou non (Resend non configuré en local), la capture a réussi.
    return NextResponse.json({ ok: true, emailSent: sent });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[api/lead] send magnet failed:", message);
    // Le lead est enregistré : on ne bloque pas l'UX sur l'email.
    return NextResponse.json({ ok: true, emailSent: false });
  }
}
