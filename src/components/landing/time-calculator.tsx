"use client";

import { useId, useState } from "react";
import { TAUX_HORAIRE_EXEMPLE, duree, type Mesure } from "@/lib/offre/mesures";

// Même hypothèse que le calcul statique qu'il remplace : 4 semaines par mois.
const SEMAINES_PAR_MOIS = 4;
const MAX_PAR_SEMAINE = 20;

/**
 * Le calcul « si » de la section des temps mesurés, rendu réglable : le
 * visiteur met son taux horaire et ses fréquences, les temps restent ceux
 * chronométrés par le fondateur (lib/offre/mesures.ts). Valeurs initiales =
 * l'ancien texte fixe (1 de chaque par semaine, 50 €/h), donc le rendu
 * serveur et le premier affichage disent exactement la même chose.
 *
 * `prix` (Pass Mastery du jour) vient du parent serveur (lib/offre/prix.ts) :
 * calculé ici, le serveur et le navigateur pourraient ne pas lire le même
 * instant autour du 01/11 et l'hydratation échouerait.
 */
export function TimeCalculator({ taches, prix }: { taches: Mesure[]; prix: number }) {
  const baseId = useId();
  const [taux, setTaux] = useState<number>(TAUX_HORAIRE_EXEMPLE);
  const [freq, setFreq] = useState<number[]>(() => taches.map(() => 1));

  const moisSans =
    taches.reduce((s, m, i) => s + m.sans * (freq[i] ?? 0), 0) * SEMAINES_PAR_MOIS;
  const moisAvec =
    taches.reduce((s, m, i) => s + m.avec * (freq[i] ?? 0), 0) * SEMAINES_PAR_MOIS;
  const gainMin = moisSans - moisAvec;
  const gainEur = Math.round((gainMin / 60) * taux);
  // Au-delà de deux ans, « remboursé en 30 mois » n'aide personne à décider.
  const brut = gainEur > 0 ? prix / ((gainMin / 60) * taux) : null;
  const moisRemb = brut !== null && brut <= 24 ? brut : null;
  const remb =
    moisRemb === null
      ? null
      : moisRemb <= 1
        ? "dès le premier mois"
        : Number.isInteger(moisRemb)
          ? `en ${moisRemb} mois`
          : `en moins de ${Math.ceil(moisRemb)} mois`;

  function setFreqAt(i: number, v: number) {
    const n = Number.isFinite(v) ? Math.min(MAX_PAR_SEMAINE, Math.max(0, Math.round(v))) : 0;
    setFreq((f) => f.map((x, j) => (j === i ? n : x)));
  }

  const inputCls =
    "w-20 rounded-[10px] border border-line bg-white px-3 py-2 text-right text-[15px] font-semibold text-ink focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20";

  return (
    <div className="mt-8 rounded-[22px] border border-coral/40 bg-coral-soft/40 p-6 md:p-8">
      <h3 className="font-serif text-xl md:text-2xl font-medium text-ink">
        Faites le calcul pour vous.
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-muted">
        Combien de fois par semaine faites-vous ces tâches, et combien vaut
        une heure de votre temps ?
      </p>

      <div className="mt-5 space-y-3">
        {taches.map((m, i) => (
          <div key={m.id} className="flex items-center justify-between gap-4">
            <label htmlFor={`${baseId}-${m.id}`} className="text-[15px] text-ink-soft leading-snug">
              {m.tache}
            </label>
            <span className="flex items-center gap-2 shrink-0">
              <input
                id={`${baseId}-${m.id}`}
                type="number"
                inputMode="numeric"
                min={0}
                max={MAX_PAR_SEMAINE}
                value={freq[i]}
                onChange={(e) => setFreqAt(i, e.target.valueAsNumber)}
                className={inputCls}
              />
              <span className="text-[13px] text-muted w-14">/ sem.</span>
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-coral/30">
          <label htmlFor={`${baseId}-taux`} className="text-[15px] font-semibold text-ink">
            Votre heure vaut
          </label>
          <span className="flex items-center gap-2 shrink-0">
            <input
              id={`${baseId}-taux`}
              type="number"
              inputMode="numeric"
              min={0}
              max={1000}
              value={taux}
              onChange={(e) => {
                const v = e.target.valueAsNumber;
                setTaux(Number.isFinite(v) ? Math.min(1000, Math.max(0, Math.round(v))) : 0);
              }}
              className={inputCls}
            />
            <span className="text-[13px] text-muted w-14">€ / h</span>
          </span>
        </div>
      </div>

      <p aria-live="polite" className="mt-6 text-[16px] leading-relaxed text-ink-soft">
        {gainMin > 0 ? (
          <>
            {duree(moisSans)} par mois à la main, {duree(moisAvec)} avec Claude.{" "}
            <strong className="text-ink">
              {duree(gainMin)} gagnées, soit {gainEur} € par mois
            </strong>
            {remb ? <> : le Pass Mastery ({prix} €) est remboursé {remb}.</> : "."}
          </>
        ) : (
          <>Indiquez au moins une tâche par semaine pour voir le calcul.</>
        )}
      </p>
      <p className="mt-2 text-[12px] leading-relaxed text-muted">
        {/* {" "} explicite : Next 16 avale l'espace après une expression
            quand la ligne contient une entité HTML. */}
        Calcul sur {SEMAINES_PAR_MOIS}{" "}semaines par mois, avec mes temps
        mesurés. C&apos;est une estimation pour vous, pas une promesse.
      </p>
    </div>
  );
}
