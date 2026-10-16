import {
  BONUS_AUDIT_FIN_LIBELLE,
  BONUS_AUDIT_PLACES,
  placesBonusRestantes,
} from "@/lib/offre/bonus-audit";

/**
 * Bandeau du bonus audit, en tête de l'accueil et de /tarifs. Avant le
 * 16/10/2026, la seule offre limitée réelle n'apparaissait que dans la carte
 * Mastery, au 11ᵉ écran : le visiteur pressé ne la voyait jamais.
 *
 * Même source que la carte (compteur lu en base, lib/offre/bonus-audit.ts) :
 * il disparaît seul le 01/11 ou à la 10ᵉ place prise, et ne s'affiche pas si
 * le compteur est illisible. Pas collant : sur mobile, la barre de prix du
 * bas et la bannière cookies occupent déjà l'écran.
 */
export async function BonusBar({ href = "#tarifs" }: { href?: string }) {
  const places = await placesBonusRestantes();
  if (places === null) return null;

  return (
    <div className="bg-ink text-cream">
      <p className="mx-auto max-w-[1140px] px-4 py-2.5 text-center text-[13px] md:text-[14px] leading-snug">
        <strong className="font-semibold text-coral-soft">
          Jusqu&apos;au {BONUS_AUDIT_FIN_LIBELLE} :
        </strong>{" "}
        {/* Version courte sur mobile : 2 lignes au lieu de 3, le bouton
            d'achat du hero reste haut dans le premier écran. */}
        <span className="md:hidden">
          audit vidéo de vos prompts offert avec le Pass Mastery, encore{" "}
          {places}{" "}{places > 1 ? "places" : "place"}.
        </span>
        <span className="hidden md:inline">
          avec le Pass Mastery, Alexandre enregistre une vidéo de 15 minutes
          sur vos propres prompts. Encore {places}{" "}
          {places > 1 ? "places" : "place"} sur {BONUS_AUDIT_PLACES}.
        </span>{" "}
        <a
          href={href}
          className="font-semibold underline underline-offset-4 decoration-cream/40 hover:text-coral-soft transition-colors whitespace-nowrap"
        >
          Voir l&apos;offre
        </a>
      </p>
    </div>
  );
}
