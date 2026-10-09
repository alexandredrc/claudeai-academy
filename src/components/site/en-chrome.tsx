import Link from "next/link";
import { Logo } from "./logo";

/**
 * En-tête et pied de page des pages anglaises (/en/…), test anglophone
 * d'octobre 2026. Volontairement minimaux : la navigation française du site
 * (tarifs en euros, parcours en français) n'a rien à faire sur une page qui
 * mesure l'intérêt d'un public anglophone. Un seul lien de sortie, honnête :
 * la formation complète est en français.
 */
export function EnHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between px-6">
        <Logo href="/en/kit" />
        <Link href="/" lang="fr" className="text-[14px] text-muted transition-colors hover:text-coral">
          Site en français
        </Link>
      </div>
    </header>
  );
}

export function EnFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-cream-soft py-10 text-[13px] text-muted">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-6 md:flex-row md:items-center md:justify-between">
        <p>
          ClaudeAI Academy · an independent training company. Not affiliated with Anthropic.
          The full course is in French: <Link href="/" lang="fr" className="underline underline-offset-4 hover:text-coral">claudeai-academy.com</Link>.
        </p>
        <p className="flex flex-wrap gap-x-4 gap-y-1">
          <a href="mailto:contact@claudeai-academy.com" className="hover:text-coral">contact@claudeai-academy.com</a>
          <Link href="/confidentialite" lang="fr" className="hover:text-coral">Privacy (FR)</Link>
          <Link href="/mentions-legales" lang="fr" className="hover:text-coral">Legal notice (FR)</Link>
        </p>
      </div>
    </footer>
  );
}
