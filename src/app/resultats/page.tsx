import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { MESURES, MESURES_DATE, duree } from "@/lib/offre/mesures";
import {
  CATEGORIES,
  LIBELLE_STATUT,
  RESULTATS_MEMBRES,
  RESULTATS_MIS_A_JOUR,
  SEUIL_FILTRES,
  type Categorie,
  type ResultatMembre,
} from "@/lib/resultats/membres";

export const metadata: Metadata = pageMetadata({
  path: "/resultats",
  title: "Résultats mesurés avec Claude AI | ClaudeAI Academy",
  description:
    "Temps avant et après Claude, mesurés et datés : les mesures du fondateur et, dès qu'ils sont vérifiés, les résultats des membres, avec leur statut.",
});

const LECON_LIBRE_HREF =
  "/courses/bien-demarrer-avec-claude/claude-dans-excel-powerpoint-word-et-chrome";

// Pas de balisage schema.org Review : les avis recueillis sur sa propre page
// sont exclus des extraits enrichis de Google (même règle que testimonials.tsx).
// Filtres par lien (?metier=…) plutôt qu'en JavaScript : ils marchent sans
// script et chaque vue filtrée a son URL.

function CarteResultat({ r }: { r: ResultatMembre }) {
  const qui = [r.prenom, r.metier, r.ville].filter(Boolean).join(", ");
  return (
    <article className="flex flex-col rounded-[22px] border border-line bg-white p-6 md:p-8 shadow-card">
      <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-cream-soft px-3 py-1 text-[12px] font-semibold text-ink-soft">
        {LIBELLE_STATUT[r.statut]}
      </p>
      <h3 className="mt-4 font-serif text-xl font-medium text-ink">{r.tache}</h3>
      <p className="mt-2 text-[15px] text-ink">
        <span className="line-through decoration-muted/60 text-muted">{duree(r.minutesAvant)}</span>
        {" → "}
        <strong className="text-coral-dark">{duree(r.minutesApres)}</strong>
        <span className="text-muted">, mesuré par {r.prenom ?? "la personne"}</span>
      </p>
      <dl className="mt-5 space-y-3 text-[15px] leading-relaxed">
        <div>
          <dt className="font-semibold text-ink">Situation de départ</dt>
          <dd className="text-muted">{r.situation}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">Ce qui a été appris</dt>
          <dd className="text-muted">{r.apprentissage}</dd>
        </div>
      </dl>
      <blockquote className="mt-5 border-l-2 border-coral pl-4 font-serif text-lg leading-snug text-ink">
        &laquo;&nbsp;{r.citation}&nbsp;&raquo;
      </blockquote>
      <p className="mt-4 text-[14px] text-muted">
        {qui} · {r.mois}
      </p>
    </article>
  );
}

export default async function ResultatsPage({
  searchParams,
}: {
  searchParams: Promise<{ metier?: string }>;
}) {
  const { metier } = await searchParams;
  const filtre = CATEGORIES.find((c) => c.id === metier)?.id as Categorie | undefined;
  const avecFiltres = RESULTATS_MEMBRES.length >= SEUIL_FILTRES;
  const affiches = filtre && avecFiltres
    ? RESULTATS_MEMBRES.filter((r) => r.categorie === filtre)
    : RESULTATS_MEMBRES;

  const totalSans = MESURES.reduce((s, m) => s + m.sans, 0);
  const totalAvec = MESURES.reduce((s, m) => s + m.avec, 0);

  return (
    <>
      <section className="pt-16 pb-16 md:pt-20 md:pb-20">
        <Container size="narrow">
          <nav className="text-[13px] text-muted mb-5" aria-label="Fil d’Ariane">
            <Link href="/" className="hover:text-coral transition-colors">
              Accueil
            </Link>
            <span aria-hidden="true" className="mx-2 opacity-50">
              /
            </span>
            <span className="text-ink-soft">Résultats</span>
          </nav>

          <Eyebrow>Mis à jour le {RESULTATS_MIS_A_JOUR}</Eyebrow>
          <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.05] tracking-tight text-ink">
            Résultats mesurés, <span className="accent-serif">pas promis.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted max-w-[640px]">
            Ici, chaque chiffre dit qui l&apos;a mesuré, quand et comment.
            Chaque retour de membre porte son statut : acheteur, kit gratuit ou
            accès offert.
          </p>

          <div className="mt-8 rounded-[18px] border border-line bg-cream-soft p-5 md:p-6 text-[15px] leading-relaxed text-ink-soft">
            <strong className="text-ink">Cette page se remplit au fur et à mesure des retours.</strong>{" "}
            La collecte auprès des membres et des lecteurs du kit a commencé le
            16 octobre 2026. Un résultat n&apos;est publié qu&apos;avec une
            mesure et l&apos;accord écrit de son auteur. Tant qu&apos;il n&apos;y
            en a pas, cette section reste vide : nous préférons une page vide à
            une page fausse.
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 md:py-20" aria-labelledby="membres">
        <Container>
          <h2 id="membres" className="font-serif text-3xl md:text-4xl font-medium text-ink">
            Résultats des membres
          </h2>

          {avecFiltres && (
            <nav aria-label="Filtrer par métier" className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/resultats"
                aria-current={!filtre ? "page" : undefined}
                className={`rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors ${!filtre ? "border-ink bg-ink text-cream" : "border-line text-ink hover:border-ink"}`}
              >
                Tous
              </Link>
              {CATEGORIES.map((c) => (
                <Link
                  key={c.id}
                  href={`/resultats?metier=${c.id}`}
                  aria-current={filtre === c.id ? "page" : undefined}
                  className={`rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors ${filtre === c.id ? "border-ink bg-ink text-cream" : "border-line text-ink hover:border-ink"}`}
                >
                  {c.label}
                </Link>
              ))}
            </nav>
          )}

          {affiches.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {affiches.map((r, i) => (
                <CarteResultat key={`${r.metier}-${i}`} r={r} />
              ))}
            </div>
          ) : (
            <div className="mt-8 max-w-[680px] rounded-[22px] border border-dashed border-line p-8">
              <p className="font-serif text-xl text-ink">
                {RESULTATS_MEMBRES.length === 0
                  ? "En cours de collecte : aucun résultat de membre publié pour l'instant."
                  : "Aucun résultat publié pour ce métier pour l'instant."}
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                Vous avez suivi la formation ou utilisé le kit ? Votre retour
                compte, y compris s&apos;il est négatif.{" "}
                <Link href="/temoignage?src=resultats" className="text-coral font-medium hover:text-coral-dark">
                  Donner mon retour en 3 minutes
                </Link>
              </p>
            </div>
          )}
        </Container>
      </section>

      <section className="py-16 md:py-20" aria-labelledby="fondateur">
        <Container size="narrow">
          <h2 id="fondateur" className="font-serif text-3xl md:text-4xl font-medium text-ink">
            Les mesures du fondateur
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Ce ne sont pas des résultats de membres. Alexandre a chronométré ces
            tâches à la main, puis les a refaites avec Claude le {MESURES_DATE},
            dans une conversation vierge, demande et relecture comprises. À lire
            comme un ordre de grandeur, pas comme une moyenne.
          </p>
          <div className="mt-8 rounded-[22px] border border-line bg-white p-6 md:p-8">
            <div className="hidden md:grid grid-cols-[1fr_110px_110px] gap-4 pb-3 border-b border-line text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">
              <span>Tâche</span>
              <span className="text-right">À la main</span>
              <span className="text-right">Avec Claude</span>
            </div>
            <dl className="divide-y divide-line">
              {MESURES.map((m) => (
                <div key={m.id} className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_110px_110px] gap-x-4 gap-y-1 py-3.5">
                  <dt className="col-span-2 md:col-span-1 text-[15px] font-semibold text-ink">{m.tache}</dt>
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
            <p className="mt-4 pt-4 border-t-2 border-ink font-serif text-lg font-medium text-ink">
              Sur les {MESURES.length} tâches : {duree(totalSans)} à la main,{" "}
              {duree(totalAvec)} avec Claude.
            </p>
          </div>

          <h2 className="mt-14 font-serif text-2xl md:text-3xl font-medium text-ink">
            Ce que vous ne trouverez pas ici
          </h2>
          <ul className="mt-5 space-y-2.5 text-[16px] leading-relaxed text-ink-soft list-disc pl-5">
            <li>Aucun chiffre de revenu promis.</li>
            <li>Aucun témoignage inventé, ni sans statut.</li>
            <li>Aucun retour écarté parce qu&apos;il est négatif.</li>
          </ul>

          <div className="mt-14 rounded-[22px] bg-ink p-8 md:p-10 text-cream">
            <p className="font-serif text-2xl md:text-3xl font-medium leading-snug">
              Mesurez votre propre gain plutôt que de croire le nôtre.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-cream/75">
              La première leçon de chaque parcours est gratuite. Garantie 14
              jours sur tous les pass.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Button href="/tarifs" variant="primary">
                Voir les tarifs, dès 47 €
              </Button>
              <Button href={LECON_LIBRE_HREF} variant="ghost-light">
                Lire une leçon gratuite
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
