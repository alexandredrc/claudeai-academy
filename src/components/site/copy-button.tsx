"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copier" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard indisponible : on ne casse rien (l'utilisateur peut sélectionner le texte)
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-[10px] border border-line bg-cream-soft px-3 py-1.5 text-[13px] font-semibold text-ink-soft transition-colors hover:border-coral hover:text-coral"
    >
      {copied ? "✓ Copié" : label}
    </button>
  );
}
