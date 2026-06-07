"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { Button } from "./button";

const navItems = [
  { href: "/courses", label: "Parcours" },
  { href: "/tarifs", label: "Tarifs" },
];

export function Header({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md transition-shadow duration-200 ${
        scrolled
          ? "bg-cream/85 shadow-[0_2px_12px_rgba(31,31,30,0.04)] border-b border-line"
          : "bg-cream/70 border-b border-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-[72px]">
        <Logo />

        <nav className="hidden md:block" aria-label="Navigation principale">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex items-center px-4 py-2.5 rounded-[10px] text-[15px] font-medium text-ink-soft hover:bg-cream-dark hover:text-ink transition-colors duration-200"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Button href="/account" variant="ghost" size="md" className="!px-5 !py-2.5 !text-[14px]">
              Mon espace
            </Button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[14px] font-medium text-ink-soft hover:text-coral px-3 py-2 transition-colors"
              >
                Se connecter
              </Link>
              <Button href="/signup" size="md" className="!px-5 !py-2.5 !text-[14px]">
                Commencer
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8"
        >
          <span
            className={`block w-6 h-[2px] bg-ink rounded-sm transition-transform duration-200 ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-ink rounded-sm transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-ink rounded-sm transition-transform duration-200 ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-cream">
          <ul className="flex flex-col p-4 gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-[10px] text-[15px] font-medium text-ink-soft hover:bg-cream-dark"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 mt-2 border-t border-line flex flex-col gap-2">
              {isLoggedIn ? (
                <Button href="/account" variant="ghost" size="md" className="w-full">
                  Mon espace
                </Button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-[10px] text-[15px] font-medium text-ink-soft hover:bg-cream-dark"
                  >
                    Se connecter
                  </Link>
                  <Button href="/signup" size="md" className="w-full">
                    Commencer
                  </Button>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
