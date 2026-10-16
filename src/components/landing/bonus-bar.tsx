import { BONUS_AUDIT_PLACES, placesBonusRestantes } from "@/lib/offre/bonus-audit";
import {
  MASTERY_DERNIER_JOUR_LIBELLE,
  MASTERY_HAUSSE_LIBELLE,
  PRIX_MASTERY_APRES,
  hausseMasteryAppliquee,
  maintenant,
  prixMastery,
} from "@/lib/offre/prix";

/** Espace insécable : « 497 € » et « 7 places » ne se coupent jamais. */
const NB = " ";

/**
 * Bandeau des échéances du 31 octobre, en tête de l'accueil et de /tarifs.
 * Avant le 16/10/2026, la seule offre limitée réelle n'apparaissait que dans
 * la carte Mastery, au 11ᵉ écran : le visiteur pressé ne la voyait jamais.
 *
 * Il regroupe les deux échéances réelles, qui tombent au même instant
 * (01/11/2026 00:00, heure de Paris) : la hausse du Pass Mastery (497 € puis
 * 697 €, lib/offre/prix.ts) et la fin du bonus audit (compteur lu en base,
 * lib/offre/bonus-audit.ts). Il disparaît seul à cet instant. Si le bonus
 * n'est plus affichable avant (10 places prises, compteur illisible), la
 * hausse reste annoncée seule : elle est vraie quoi qu'il arrive.
 *
 * Tout le texte passe par des chaînes JavaScript : Next 16 avale l'espace
 * après une expression quand la ligne contient une entité HTML.
 *
 * Pas collant : sur mobile, la barre de prix du bas et la bannière cookies
 * occupent déjà l'écran.
 */
export async function BonusBar({ href = "#tarifs" }: { href?: string }) {
  const at = maintenant();
  if (hausseMasteryAppliquee(at)) return null;
  const prix = prixMastery(at);
  const places = await placesBonusRestantes();
  const libellePlaces =
    places !== null ? `${places}${NB}place${places > 1 ? "s" : ""}` : "";

  return (
    <div className="bg-ink text-cream">
      <p className="mx-auto max-w-[1140px] px-4 py-2.5 text-center text-[13px] md:text-[14px] leading-snug">
        <strong className="font-semibold text-coral-soft">
          {`Jusqu'au ${MASTERY_DERNIER_JOUR_LIBELLE} :`}
        </strong>{" "}
        {places !== null ? (
          <>
            {/* Version courte sur mobile : 2 lignes à 375 px (mesuré au
                navigateur sans tête le 16/10/2026, Inter 13 px), le bouton
                d'achat du hero reste haut dans le premier écran. */}
            <span className="md:hidden">
              {`Mastery à ${prix}${NB}€ (${PRIX_MASTERY_APRES}${NB}€ ensuite) et audit vidéo offert, encore ${libellePlaces}.`}
            </span>
            <span className="hidden md:inline">
              {`le Pass Mastery est à ${prix}${NB}€ (${PRIX_MASTERY_APRES}${NB}€ ensuite), avec en bonus une vidéo de 15 minutes où Alexandre audite vos propres prompts. Encore ${libellePlaces} sur ${BONUS_AUDIT_PLACES}.`}
            </span>
          </>
        ) : (
          <span>
            {`le Pass Mastery est à ${prix}${NB}€, puis ${PRIX_MASTERY_APRES}${NB}€ à partir du ${MASTERY_HAUSSE_LIBELLE}.`}
          </span>
        )}{" "}
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
