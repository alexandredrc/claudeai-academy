import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { CheckoutButton } from "@/components/site/checkout-button";
import { getCatalogStats } from "@/lib/courses/stats";
import { PROMPT_COUNT } from "@/lib/prompts/library";
import {
  BONUS_AUDIT_FIN_LIBELLE,
  BONUS_AUDIT_PLACES,
  placesBonusRestantes,
} from "@/lib/offre/bonus-audit";
import { TAUX_HORAIRE_EXEMPLE } from "@/lib/offre/mesures";
import {
  annonceHausseMastery,
  maintenant,
  mensualiteKlarna3x,
  prixMastery,
} from "@/lib/offre/prix";

// Avant le 15/10/2026, ce bloc additionnait des « valeurs » par parcours
// (197 €, 147 €) jamais pratiquées, affichées barrées face à 497 €. Un prix
// barré se lit comme une réduction, et une réduction doit se référer à un
// prix réellement pratiqué (art. L112-1-1 du Code de la consommation) :
// retiré. À la place, chaque élément dit quel obstacle il lève (Hormozi,
// « empiler la valeur »), et le prix est ramené à des heures de travail,
// ce qui est un calcul et non une promesse. Le taux est partagé avec la
// section des temps mesurés (lib/offre/mesures.ts), le prix est celui du
// jour (lib/offre/prix.ts : 497 € puis 697 € dès le 01/11/2026).

/**
 * Le prix ramené à des heures au taux d'exemple : 497 / 50 = 9,94 donne
 * « moins de 10 heures », 697 / 50 = 13,94 « moins de 14 heures ». Si la
 * division tombe juste, « moins de » serait faux : on écrit le nombre exact.
 */
function heuresDeTravail(prix: number): string {
  const h = prix / TAUX_HORAIRE_EXEMPLE;
  if (Number.isInteger(h)) return `${h} heure${h > 1 ? "s" : ""}`;
  return `moins de ${Math.ceil(h)} heures`;
}

type Row = { item: string; obstacle: string };

export async function ValueStack() {
  const [stats, placesBonus] = await Promise.all([
    getCatalogStats(),
    placesBonusRestantes(),
  ]);

  // Prix daté, lu à chaque rendu sur un seul instant (jamais en constante de
  // module : une instance réutilisée peut franchir minuit le 31/10).
  const at = maintenant();
  const prix = prixMastery(at);
  const annonce = annonceHausseMastery(at);

  // Bonus réel à places comptées : la ligne n'existe que tant qu'il reste
  // des places et que la date n'est pas passée (lib/offre/bonus-audit).
  const bonus: Row[] =
    placesBonus !== null
      ? [
          {
            item: `Bonus jusqu'au ${BONUS_AUDIT_FIN_LIBELLE} : l'audit vidéo de vos prompts par Alexandre (15 min)`,
            obstacle: `Vous savez quoi corriger, sur vos propres demandes. Réservé aux ${BONUS_AUDIT_PLACES} premiers : encore ${placesBonus} place${placesBonus > 1 ? "s" : ""}.`,
          },
        ]
      : [];

  const rows: Row[] = [
    ...bonus,
    {
      item: `Les ${stats.courseCount} parcours, ${stats.lessonCount} leçons en français`,
      obstacle:
        "Vous arrêtez de chercher sur YouTube : tout est au même endroit, et daté.",
    },
    {
      item: `La bibliothèque de ${PROMPT_COUNT} prompts prêts à copier`,
      obstacle: "Vous ne partez jamais d'une page blanche.",
    },
    {
      item: "Le Mentor IA Claude, qui corrige vos exercices",
      obstacle: "Votre cas ne ressemble pas à l'exemple : vous lui soumettez le vôtre.",
    },
    {
      item: "L'examen de certification et son certificat vérifiable",
      obstacle: "Vous pouvez montrer ce que vous savez faire.",
    },
    {
      item: "Les mises à jour, à vie",
      obstacle: "Claude évolue sans arrêt, la formation suit sans que vous repayiez.",
    },
    {
      item: "La garantie 14 jours satisfait ou remboursé",
      obstacle: "Si ce n'est pas pour vous, vous écrivez et vous êtes remboursé.",
    },
  ];

  return (
    <section className="bg-white py-24 md:py-32">
      <Container size="narrow">
        <div className="text-center">
          <Eyebrow align="center">Détail de la valeur</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium leading-[1.15] tracking-tight text-ink">
            Ce que contient <span className="accent-serif">le Pass Mastery</span>
          </h2>
        </div>

        <div className="mt-12 bg-cream-soft border border-line rounded-[22px] p-8 md:p-10">
          <dl className="divide-y divide-line">
            {rows.map((r) => (
              <div key={r.item} className="py-4 first:pt-0">
                <dt className="text-[15px] font-semibold text-ink">{r.item}</dt>
                <dd className="mt-1 text-[14px] leading-relaxed text-muted">
                  {r.obstacle}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 border-t-2 border-ink pt-6">
            <p className="text-[15px] leading-relaxed text-ink-soft">
              {`Si votre heure de travail vaut ${TAUX_HORAIRE_EXEMPLE} €, le Pass Mastery représente ${heuresDeTravail(prix)} de votre temps. Payé une fois, gardé à vie.`}
            </p>
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <span className="font-bold font-serif text-xl text-ink">Votre prix</span>
              <span className="font-bold font-serif text-2xl text-coral">
                {`${prix} €`}
              </span>
            </div>
            {/* Hausse annoncée près du prix, sans prix barré (décision du
                16/10/2026). Disparaît seule le 01/11. */}
            {annonce ? (
              <p className="mt-1 text-right text-[14px] font-semibold text-coral-dark">
                {annonce}
              </p>
            ) : null}
          </div>

          <div className="mt-7 text-center">
            <CheckoutButton tier="mastery" prixAffiche={prix} variant="primary" size="lg">
              {`Rejoindre Mastery, ${prix} €`}
            </CheckoutButton>
            <p className="mt-3 text-[13px] text-muted">
              {`ou 3 × ${mensualiteKlarna3x(prix)} € sans frais avec Klarna · Garantie 14 jours`}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
