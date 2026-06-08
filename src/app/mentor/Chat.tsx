"use client";

import { useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Comment structurer un prompt prod-ready en pratique ?",
  "Quelle est la différence entre adaptive thinking et effort ?",
  "Donne-moi un exemple de few-shot bien construit pour de la classif.",
];

export function MentorChat({ initialInput = "" }: { initialInput?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialInput);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  async function send(question: string) {
    const q = question.trim();
    if (!q || streaming) return;
    setError(null);
    setInput("");

    const next: Message[] = [
      ...messages,
      { role: "user", content: q },
      { role: "assistant", content: "" },
    ];
    setMessages(next);
    setStreaming(true);
    scrollToBottom();

    try {
      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next
            .slice(0, -1)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Erreur du Mentor.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() ?? "";
        for (const chunk of chunks) {
          const evLine = chunk.match(/^event: (.+)$/m)?.[1];
          const dataLine = chunk.match(/^data: (.+)$/m)?.[1];
          if (!evLine || !dataLine) continue;
          const data = JSON.parse(dataLine);
          if (evLine === "delta") {
            setMessages((prev) => {
              const copy = prev.slice();
              copy[copy.length - 1] = {
                role: "assistant",
                content: copy[copy.length - 1].content + data.text,
              };
              return copy;
            });
            scrollToBottom();
          } else if (evLine === "error") {
            throw new Error(data.message ?? "Erreur du Mentor.");
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur du Mentor.";
      setError(msg);
      // Retire la bulle assistant vide en cas d'échec
      setMessages((prev) => {
        const copy = prev.slice();
        if (
          copy.length &&
          copy[copy.length - 1].role === "assistant" &&
          copy[copy.length - 1].content === ""
        ) {
          copy.pop();
        }
        return copy;
      });
    } finally {
      setStreaming(false);
      scrollToBottom();
    }
  }

  const empty = messages.length === 0;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div
        ref={scrollRef}
        className="flex-1 space-y-5 overflow-y-auto rounded-[22px] border border-line bg-white p-6 md:p-8"
        style={{ minHeight: "min(50vh, 420px)" }}
      >
        {empty ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="max-w-[420px] text-[15px] leading-relaxed text-muted">
              Pose une question sur le contenu de la formation. Le Mentor cite
              les leçons et reste dans le périmètre du programme.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-[10px] border border-line bg-cream-soft px-4 py-2.5 text-[14px] text-ink-soft transition-colors hover:border-coral-soft hover:text-ink"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user" ? "flex justify-end" : "flex justify-start"
              }
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-[14px] rounded-br-sm bg-ink px-4 py-3 text-[15px] leading-relaxed text-cream"
                    : "max-w-[90%] whitespace-pre-wrap rounded-[14px] rounded-bl-sm bg-cream-soft px-4 py-3 text-[15px] leading-[1.7] text-ink-soft"
                }
              >
                {m.content ||
                  (m.role === "assistant" && streaming ? (
                    <span className="text-muted">Le Mentor réfléchit…</span>
                  ) : (
                    ""
                  ))}
              </div>
            </div>
          ))
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-[14px] border border-coral-dark/30 bg-coral-soft/40 px-4 py-3 text-[14px] text-ink"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-end gap-3"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          rows={2}
          placeholder="Ta question sur la formation…"
          disabled={streaming}
          className="flex-1 resize-none rounded-[14px] border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/20 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={streaming || input.trim().length === 0}
          className="rounded-[14px] bg-coral px-6 py-3.5 text-sm font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_8px_20px_rgba(217,119,87,0.35)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {streaming ? "…" : "Envoyer"}
        </button>
      </form>
    </div>
  );
}
