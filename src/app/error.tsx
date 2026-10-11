"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Filet de sécurité de tout le site. Sans lui, une erreur serveur affichait
 * l'écran brut « Application error » de Next, y compris sur le chemin d'achat.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[page-erreur]", error.digest ?? error.message);
  }, [error]);

  return (
    <section className="bg-cream-soft">
      <div className="mx-auto flex min-h-[60vh] max-w-[640px] flex-col justify-center px-6 py-16 text-center">
        <h1 className="font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
          Petit{" "}
          <span className="font-serif font-medium italic text-coral">
            contretemps
          </span>
          .
        </h1>
        <p className="mx-auto mt-6 max-w-[480px] text-[15px] leading-relaxed text-ink-soft">
          Cette page n&apos;a pas pu s&apos;afficher. Réessaie dans un instant,
          ou écris à contact@claudeai-academy.com si ça recommence. Si tu
          venais de payer, ton paiement est bien enregistré et ton accès
          arrive par email.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="rounded-[14px] bg-coral px-8 py-4 text-base font-semibold text-cream transition-colors duration-200 hover:bg-coral-dark"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="rounded-[14px] border-[1.5px] border-ink px-8 py-4 text-base font-semibold text-ink transition-colors duration-200 hover:bg-ink hover:text-cream"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </section>
  );
}
