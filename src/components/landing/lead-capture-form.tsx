"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LeadCaptureForm({ source = "kit-15-prompts" }: { source?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          first_name: firstName || null,
          company, // honeypot
          source,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data.error ?? "Une erreur est survenue. Réessaie.");
        return;
      }
      router.push("/kit/merci");
    } catch {
      setStatus("error");
      setError("Connexion impossible. Réessaie dans un instant.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-[440px]">
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Ton prénom (optionnel)"
          autoComplete="given-name"
          className="w-full rounded-[12px] border border-line bg-white px-4 py-3.5 text-[15px] text-ink placeholder:text-muted focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-colors"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@email.com"
          autoComplete="email"
          className="w-full rounded-[12px] border border-line bg-white px-4 py-3.5 text-[15px] text-ink placeholder:text-muted focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-colors"
        />

        {/* Honeypot : caché aux humains, rempli par les bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Société
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-coral px-8 py-4 text-base font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 hover:bg-coral-dark hover:-translate-y-[2px] hover:shadow-[0_10px_24px_rgba(217,119,87,0.35)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {status === "loading" ? "Envoi…" : "Recevoir le Kit gratuitement"}
        </button>
      </div>

      {status === "error" && (
        <p className="mt-3 text-[14px] text-[#C0392B]">{error}</p>
      )}

      <p className="mt-3 text-[13px] leading-relaxed text-muted">
        Zéro spam. Un usage concret de Claude par semaine, désinscription en un clic.
      </p>
    </form>
  );
}
