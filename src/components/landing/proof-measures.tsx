import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { TimeCalculator } from "@/components/landing/time-calculator";
import {
  MESURES,
  MESURES_DATE,
  MESURES_SEMAINE,
  MESURES_VITRINE,
  duree,
  mesure,
  type Mesure,
} from "@/lib/offre/mesures";

// Preuve (Hormozi, principe 2), coût du problème (5) et valeur face au prix
// (1), avec les temps mesurés par le fondateur. Tous les chiffres sont
// calculés depuis lib/offre/mesures.ts : rien n'est écrit en dur ici. Le
// calcul « si » est réglable par le visiteur depuis le 16/10/2026.
export function ProofMeasures({ pricingHref = "#tarifs" }: { pricingHref?: string }) {
  const vitrine = MESURES_VITRINE.map(mesure).filter((m): m is Mesure => Boolean(m));
  const semaine = MESURES_SEMAINE.map(mesure).filter((m): m is Mesure => Boolean(m));
  if (vitrine.length === 0) return null;

  const totalSans = MESURES.reduce((s, m) => s + m.sans, 0);
  const totalAvec = MESURES.reduce((s, m) => s + m.avec, 0);

  return (
    <section className="bg-white py-24 md:py-32">
      <Container size="narrow">
        <div className="text-center mb-12">
          <Eyebrow align="center">Mesuré, pas promis</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium leading-[1.15] tracking-tight text-ink">
            Mes temps,{" "}
            <span className="accent-serif">avant et après Claude.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted max-w-[620px] mx-auto">
            Ces tâches, je les faisais à la main et je les avais chronométrées.
            Le {MESURES_DATE}, je les ai refaites avec Claude, dans une
            conversation vierge, en écrivant la demande et en relisant le
            résultat.
          </p>
        </div>

        <div className="rounded-[22px] border border-line bg-cream-soft p-6 md:p-9">
          <div className="hidden md:grid grid-cols-[1fr_120px_120px] gap-4 pb-3 border-b border-line text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">
            <span>Tâche</span>
            <span className="text-right">À la main</span>
            <span className="text-right">Avec Claude</span>
          </div>
          <dl className="divide-y divide-line">
            {vitrine.map((m) => (
              <div
                key={m.id}
                className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_120px_120px] gap-x-4 gap-y-1 py-4"
              >
                <dt className="col-span-2 md:col-span-1 text-[15px] font-semibold text-ink">
                  {m.tache}
                </dt>
                <dd className="whitespace-nowrap text-[15px] text-muted md:text-right">
                  <span className="md:hidden">À la main : </span>
                  <span className="line-through decoration-muted/60">{duree(m.sans)}</span>
                </dd>
                <dd className="whitespace-nowrap text-right text-[15px] font-semibold text-coral-dark">
                  <span className="md:hidden font-normal text-muted">avec Claude : </span>
                  {duree(m.avec)}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 pt-5 border-t-2 border-ink font-serif text-lg md:text-xl font-medium text-ink">
            Sur les {MESURES.length} tâches mesurées : {duree(totalSans)} à la
            main, {duree(totalAvec)} avec Claude.
          </p>
        </div>

        <TimeCalculator taches={semaine} />

        <p className="mt-6 text-[13px] leading-relaxed text-muted">
          Ce sont mes temps, après des mois d&apos;usage quotidien. Les vôtres
          dépendront de votre pratique : sur des tâches de rédaction, une étude
          publiée dans Science mesure en moyenne 40 % de temps en moins avec
          l&apos;IA (
          <a
            href="https://doi.org/10.1126/science.adh2586"
            className="underline underline-offset-2 hover:text-coral"
            target="_blank"
            rel="noopener noreferrer"
          >
            Noy et Zhang, 2023
          </a>
          ).
        </p>

        <div className="mt-10 text-center">
          <Button href={pricingHref} variant="primary">
            Voir les tarifs, dès 47 €
          </Button>
        </div>
      </Container>
    </section>
  );
}
