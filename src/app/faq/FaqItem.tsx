"use client";

import { useState } from "react";
import Link from "next/link";

export type Item = {
  q: string;
  a: string;
  /** Lien affiché à la fin de la réponse (hors JSON-LD, qui ne lit que `a`). */
  lien?: { href: string; label: string };
};

export function FaqItem({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  return (
    <li
      className={`overflow-hidden rounded-[18px] border bg-white transition-colors duration-200 ${
        open
          ? "border-coral shadow-[0_1px_2px_rgba(31,31,30,0.04),0_8px_24px_rgba(31,31,30,0.06)]"
          : "border-line hover:border-coral-soft"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-[16px] font-semibold leading-snug text-ink">
          {item.q}
        </span>
        <span
          aria-hidden="true"
          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-lg transition-transform duration-200 ${
            open ? "rotate-45 bg-coral text-cream" : "bg-cream text-coral"
          }`}
        >
          +
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-[15px] leading-[1.7] text-muted">
            {item.a}
            {item.lien && (
              <>
                {" "}
                {/* Hors tabulation tant que la réponse est repliée. */}
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
