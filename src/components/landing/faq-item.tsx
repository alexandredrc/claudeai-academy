"use client";

import { useId, useState } from "react";
import Link from "next/link";

export type FaqEntry = {
  q: string;
  a: string;
  /** Lien affiché à la fin de la réponse. */
  lien?: { href: string; label: string };
};

export function FAQItem({ item, defaultOpen = false }: { item: FaqEntry; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  // Motif « disclosure » WAI-ARIA : le bouton annonce le panneau qu'il
  // commande, et la réponse repliée est retirée de l'arbre d'accessibilité
  // (sinon un lecteur d'écran lit toutes les réponses, ouvertes ou non).
  const panelId = useId();

  return (
    <li
      className={`bg-white border rounded-[18px] overflow-hidden transition-colors duration-200 ${
        open ? "border-coral shadow-[0_1px_2px_rgba(31,31,30,0.04),0_8px_24px_rgba(31,31,30,0.06)]" : "border-line hover:border-coral-soft"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-[16px] font-semibold text-ink leading-snug">
          {item.q}
        </span>
        <span
          aria-hidden="true"
          className={`shrink-0 w-7 h-7 rounded-full inline-flex items-center justify-center text-lg transition-transform duration-200 ${
            open ? "bg-coral text-cream rotate-45" : "bg-cream text-coral"
          }`}
        >
          +
        </span>
      </button>
      <div
        id={panelId}
        aria-hidden={open ? undefined : true}
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-[15px] leading-[1.7] text-muted">
            {item.a}
            {item.lien && (
              <>
                {" "}
                {/* Hors tabulation tant que la réponse est repliée : un lien
                    focalisable dans un panneau caché piège le clavier. */}
                <Link
                  href={item.lien.href}
                  tabIndex={open ? undefined : -1}
                  className="font-semibold text-coral underline underline-offset-4 hover:text-coral-dark transition-colors"
                >
                  {item.lien.label}
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </li>
  );
}
