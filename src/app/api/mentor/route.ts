import { NextResponse, type NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  getAnthropic,
  MENTOR_MODEL,
  MENTOR_DAILY_LIMIT,
} from "@/lib/anthropic/client";
import {
  buildKnowledgeBase,
  MENTOR_SYSTEM_INSTRUCTIONS,
} from "@/lib/mentor/knowledge";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { userHasTier } from "@/lib/courses/access";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type ClientMessage = { role: "user" | "assistant"; content: string };

const MAX_HISTORY = 20; // borne la conversation renvoyée (coût + latence)
const MAX_CHARS = 4000; // borne la taille d'un message utilisateur

export async function POST(req: NextRequest) {
  // 1. Auth
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  // 2. Gate Mastery (le Mentor est une fonctionnalité du Pass Mastery)
  const hasMastery = await userHasTier(supabase, "mastery");
  if (!hasMastery) {
    return NextResponse.json(
      { error: "Le Mentor IA est réservé au Pass Mastery." },
      { status: 403 },
    );
  }

  // 3. Parse + valide le corps
  let body: { messages?: ClientMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }
  const history = Array.isArray(body.messages) ? body.messages : [];
  const cleaned = history
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (cleaned.length === 0 || cleaned[cleaned.length - 1].role !== "user") {
    return NextResponse.json(
      { error: "Le dernier message doit venir de l'utilisateur." },
      { status: 400 },
    );
  }

  // 4. Rate-limit atomique (coût API)
  const { data: rl, error: rlErr } = await supabaseAdmin.rpc(
    "increment_mentor_usage",
    { p_user_id: user.id, p_daily_limit: MENTOR_DAILY_LIMIT },
  );
  if (rlErr) {
    console.error("[mentor] rate-limit RPC failed:", rlErr.message);
    return NextResponse.json(
      { error: "Erreur interne (quota)." },
      { status: 500 },
    );
  }
  const rlRow = Array.isArray(rl) ? rl[0] : rl;
  if (!rlRow?.allowed) {
    return NextResponse.json(
      {
        error: `Tu as atteint la limite de ${MENTOR_DAILY_LIMIT} questions par jour. Reviens demain.`,
      },
      { status: 429 },
    );
  }

  // 5. Base de connaissance (contenu réel, via service_role)
  let knowledgeBase: string;
  try {
    knowledgeBase = await buildKnowledgeBase();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[mentor] KB build failed:", msg);
    return NextResponse.json(
      { error: "Erreur interne (base de connaissance)." },
      { status: 500 },
    );
  }

  // 6. Appel Claude en streaming.
  //    Prompt caching : instructions + base de connaissance dans `system`,
  //    breakpoint sur le dernier bloc (stable pour tous les users Mastery).
  //    La conversation (volatile) est dans `messages`, après le cache.
  //    Thinking off (Q&A ancré, latence chat) + effort medium.
  const stream = getAnthropic().messages.stream({
    model: MENTOR_MODEL,
    max_tokens: 4096,
    output_config: { effort: "medium" },
    system: [
      { type: "text", text: MENTOR_SYSTEM_INSTRUCTIONS },
      {
        type: "text",
        text: `Voici l'intégralité du contenu de la formation. C'est ta seule source de vérité.\n\n${knowledgeBase}`,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: cleaned.map((m) => ({ role: m.role, content: m.content })),
  });

  const encoder = new TextEncoder();
  const sse = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );
      };
      try {
        stream.on("text", (delta) => send("delta", { text: delta }));
        const final = await stream.finalMessage();
        const u = final.usage;
        const cacheRead = u.cache_read_input_tokens ?? 0;
        const cacheWrite = u.cache_creation_input_tokens ?? 0;
        console.log(
          `[mentor] usage user=${user.id} input=${u.input_tokens} output=${u.output_tokens} ` +
            `cache_read=${cacheRead} cache_write=${cacheWrite} ` +
            `hit=${cacheRead > 0 ? "yes" : "no"}`,
        );
        send("done", {
          stop_reason: final.stop_reason,
          usage: {
            input: final.usage.input_tokens,
            output: final.usage.output_tokens,
            cache_read: final.usage.cache_read_input_tokens ?? 0,
            cache_write: final.usage.cache_creation_input_tokens ?? 0,
          },
        });
      } catch (err) {
        let message = "Erreur du Mentor.";
        if (err instanceof Anthropic.RateLimitError) {
          message = "Le service est saturé, réessaie dans un instant.";
        } else if (err instanceof Anthropic.APIError) {
          message = `Erreur API (${err.status}).`;
          console.error("[mentor] Anthropic APIError:", err.status, err.message);
        } else {
          console.error("[mentor] stream error:", err);
        }
        send("error", { message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(sse, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
