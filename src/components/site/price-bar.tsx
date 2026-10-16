"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MASTERY_HAUSSE_LE, PRIX_MASTERY_APRES } from "@/lib/offre/prix";

/**
 * Barre de prix collée en bas de l'écran.
 *
 * Pourquoi une barre et pas une fenêtre surgissante : un encart qui s'ouvre
 * par-dessus la page dès l'arrivée interrompt avant d'avoir rien donné, et
 * Google dégrade le classement mobile des sites qui posent un interstitiel sur
 * le contenu. Une barre obtient le même résultat — le prix visible, un clic
 * vers la grille — sans rien masquer et sans rien coûter au référencement.
 *
 * Elle n'apparaît qu'après un début de lecture : quelqu'un qui vient d'arriver
 * n'a pas encore de raison de regarder un prix.
 *
 * Le prix du Pass Mastery et l'annonce de sa hausse (497 € puis 697 € le
 * 01/11/2026, lib/offre/prix.ts) arrivent en props depuis le layout, rendu
 * côté serveur : calculés ici, serveur et navigateur pourraient lire deux
 * instants différents et l'hydratation échouerait.
 */

/** Hauteur de défilement à partir de laquelle la barre se montre. */
const SEUIL_PX = 700;

/** Une fois fermée, on ne la remontre pas de la session. */
const CLE_FERMEE = "cai_barre_prix_fermee";

/** Pages où elle n'a rien à faire : tunnel, espace membre, examen. */
const CHEMINS_EXCLUS = [
  // Pages anglaises du test d'octobre 2026 : pas de barre de prix en euros.
  "/en",
  "/tarifs",
  "/checkout",
  "/courses",
  "/account",
  "/login",
  "/signup",
  "/acces",
  "/auth",
  "/certification/",
  "/mentor",
];

export function PriceBar({
  prixMastery,
  annonce,
}: {
  /** Prix du Pass Mastery du jour, en euros. */
  prixMastery: number;
  /** « Puis 697 € à partir du 1er novembre », ou null une fois la hausse faite. */
  annonce: string | null;
}) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  // Le layout racine n'est pas re-rendu lors d'une navigation interne : un
  // onglet ouvert le 31/10 au soir garderait « 497 € » et l'annonce après
  // minuit. L'horloge du navigateur ne peut que FAIRE passer à 697 € (jamais
  // revenir à 497 € si le serveur dit 697 €), et elle n'est lue qu'une fois
  // la barre visible : le rendu serveur (null) reste identique.
  const [hausseVueParLeNavigateur, setHausseVueParLeNavigateur] = useState(false);
  // Lecture du choix précédent dès le premier rendu. sessionStorage peut lever
  // (navigation privée, données de site bloquées, rendu serveur où il n'existe
  // pas) : la barre doit rester fonctionnelle sans. Pas d'écart d'hydratation :
  // tant que `visible` est faux, serveur et navigateur rendent tous deux null.
  const [fermee, setFermee] = useState(() => {
    try {
      return sessionStorage.getItem(CLE_FERMEE) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SEUIL_PX);
      setHausseVueParLeNavigateur(Date.now() >= MASTERY_HAUSSE_LE.getTime());
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const exclue = CHEMINS_EXCLUS.some(
    (c) => pathname === c || pathname.startsWith(c),
  );
  if (exclue || fermee || !visible) return null;

  const hausseFaite = prixMastery === PRIX_MASTERY_APRES || hausseVueParLeNavigateur;
  const prix = hausseFaite ? PRIX_MASTERY_APRES : prixMastery;
  const annonceVisible = hausseFaite ? null : annonce;

  // Sur l'accueil, la grille est plus bas dans la page : on y glisse. Ailleurs,
  // on va sur /tarifs.
  const surAccueil = pathname === "/";

  function allerAuxTarifs(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!surAccueil) return;
    const cible = document.getElementById("tarifs");
    if (!cible) return; // pas de section ici : on laisse le lien faire son travail
    e.preventDefault();
    const doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cible.scrollIntoView({ behavior: doux ? "smooth" : "auto", block: "start" });
  }

  function fermer() {
    setFermee(true);
    try {
      sessionStorage.setItem(CLE_FERMEE, "1");
    } catch {
      /* stockage indisponible : la barre reviendra au rechargement, tant pis */
    }
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream-soft/95 backdrop-blur-sm"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      role="region"
      aria-label="Tarifs"
    >
      <div className="mx-auto flex max-w-[1140px] items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] leading-tight text-ink sm:text-[15px]">
            <strong className="font-semibold">Accès à vie dès 47 €</strong>
            <span className="text-muted">{` · Pass complet ${prix} €`}</span>
          </p>
          <p className="mt-0.5 truncate text-[12px] leading-tight text-muted">
            {/* Annonce de la hausse à partir de 640 px seulement : mesuré le
                16/10/2026 à 375 px, la colonne de texte fait 148 px, la
                première ligne y est déjà tronquée avant le prix Mastery, et
                l'annonce en demande 212. Placée en tête de ligne, elle reste
                visible même quand la suite est tronquée. */}
            {annonceVisible ? (
              <span className="hidden sm:inline font-semibold text-coral-dark">
                {`${annonceVisible} · `}
              </span>
            ) : null}
            Sans dossier CPF ni devis · garantie 14 jours
          </p>
        </div>

        <a
          href={surAccueil ? "#tarifs" : "/tarifs"}
          onClick={allerAuxTarifs}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-coral px-4 py-2.5 text-[14px] font-semibold text-cream transition-opacity hover:opacity-90 sm:px-6 sm:text-[15px]"
        >
          Voir les tarifs
          <span aria-hidden="true" className="text-[15px] leading-none">
            ↓
          </span>
        </a>

        <button
          type="button"
          onClick={fermer}
          aria-label="Masquer les tarifs"
          className="shrink-0 rounded-full p-2 text-[18px] leading-none text-muted transition-colors hover:text-ink"
        >
          ×
        </button>
      </div>
    </div>
  );
}
