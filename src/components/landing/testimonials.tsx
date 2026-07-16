import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import Link from "next/link";

// Retours des premiers lecteurs de la formation (fournis par le fondateur,
// personnes ayant eu accès au contenu avant/à l'ouverture). Cadrage honnête :
// on les présente comme « premiers lecteurs », pas comme des acheteurs
// vérifiés. Pas de schema Review/aggregateRating : les avis auto-collectés
// sur sa propre page produit sont exclus des rich results Google.
// TODO : ajouter prénom + métier pour chaque retour (fournis par le fondateur).
const reviews = [
  {
    quote:
      "Enfin une formation qui va droit au but. J'ai gagné un temps fou avec Claude IA dès la première semaine.",
  },
  {
    quote:
      "Très claire, très concrète. Les méthodes sont faciles à appliquer et les résultats sont rapides.",
  },
  {
    quote:
      "Le meilleur investissement que j'ai fait cette année. Claude est devenu mon assistant de travail au quotidien.",
  },
  {
    quote:
      "Formation ultra complète, sans blabla. J'ai découvert des fonctionnalités que je ne connaissais même pas.",
  },
  {
    quote:
      "En quelques heures seulement, j'ai automatisé plusieurs tâches qui me prenaient des heures chaque semaine.",
  },
  {
    quote:
      "Le formateur maîtrise parfaitement Claude IA. Les explications sont simples, efficaces et orientées résultats.",
  },
];

const featuredReview = {
  quote:
    "Si vous voulez vraiment exploiter tout le potentiel de Claude IA, cette formation est incontournable. Je recommande à 100 %.",
};

function Stars() {
  return (
    <div className="flex gap-0.5 text-coral" aria-label="5 étoiles sur 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.3 3.98a1 1 0 0 0 .95.7h4.18c.97 0 1.37 1.24.59 1.81l-3.39 2.46a1 1 0 0 0-.36 1.12l1.3 3.98c.3.92-.76 1.69-1.54 1.12l-3.39-2.46a1 1 0 0 0-1.18 0l-3.39 2.46c-.78.57-1.84-.2-1.54-1.12l1.3-3.98a1 1 0 0 0-.36-1.12L2.03 9.42c-.78-.57-.38-1.81.59-1.81H6.8a1 1 0 0 0 .95-.7l1.3-3.98Z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="bg-cream-soft py-24 md:py-32">
      <Container>
        <div className="mb-14 max-w-[680px]">
          <Eyebrow>Premiers retours</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium leading-[1.15] tracking-tight text-ink">
            Ce qu&apos;en disent{" "}
            <span className="accent-serif">les premiers lecteurs.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            L&apos;académie vient d&apos;ouvrir : voici les retours des
            premières personnes à avoir parcouru la formation. Et vous pouvez
            vérifier par vous-même — le programme complet est public, et la
            première leçon de chaque parcours est en accès libre.
          </p>
        </div>

        <figure className="mb-6 rounded-[22px] border border-line bg-white p-8 md:p-10">
          <Stars />
          <blockquote className="mt-5 font-serif text-xl md:text-2xl font-medium leading-snug text-ink">
            &laquo;&nbsp;{featuredReview.quote}&nbsp;&raquo;
          </blockquote>
        </figure>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <figure
              key={r.quote}
              className="flex flex-col rounded-[22px] border border-line bg-white p-8"
            >
              <Stars />
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-soft">
                &laquo;&nbsp;{r.quote}&nbsp;&raquo;
              </blockquote>
            </figure>
          ))}
        </div>

        <p className="mt-10 max-w-[680px] text-[14px] leading-relaxed text-muted">
          Retours recueillis auprès des premiers lecteurs de la formation.
          Vous faites partie des{" "}
          <strong className="text-ink">premiers membres</strong> : votre retour
          comptera vraiment, et c&apos;est ici qu&apos;il sera mis en avant.{" "}
          <Link
            href="/tarifs"
            className="text-coral font-semibold hover:text-coral-dark transition-colors"
          >
            Voir les formules →
          </Link>
        </p>
      </Container>
    </section>
  );
}
