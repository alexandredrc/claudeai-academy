import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import Link from "next/link";

// Retours de personnes ayant reçu un accès offert à la formation — accès
// fondateur ou accès anticipé — en contrepartie d'un retour d'expérience.
// Aucune n'a acheté la formation, et c'est dit noir sur blanc en bas de
// section : la directive Omnibus impose d'indiquer comment les avis sont
// recueillis, et un avis dont l'origine est annoncée vaut mieux qu'un avis
// flatteur dont on doute.
//
// Pas de schema Review/aggregateRating : les avis auto-collectés sur sa
// propre page produit sont exclus des rich results Google — les baliser
// n'apporterait rien et exposerait à une action manuelle.
//
// Prénom, âge et métier fournis par le fondateur (24/08 pour les sept
// premiers, 29/08 pour les cinq suivants). Ils comptent autant pour la
// conversion que pour l'E-E-A-T : un avis anonyme ne prouve rien, ni à un
// lecteur ni à Google. L'âge n'est renseigné que là où il est connu.
type Review = {
  name: string;
  role: string;
  age?: number;
  quote: string;
};

const reviews: Review[] = [
  {
    name: "Andréa",
    age: 22,
    role: "Auto-entrepreneuse, institut de beauté",
    quote:
      "Enfin une formation qui va droit au but. J'ai gagné un temps fou avec Claude IA dès la première semaine.",
  },
  {
    name: "Nicolas",
    age: 37,
    role: "Carrossier",
    quote:
      "Très claire, très concrète. Les méthodes sont faciles à appliquer et les résultats sont rapides.",
  },
  {
    name: "Chloé",
    age: 26,
    role: "Restauratrice",
    quote:
      "Le meilleur investissement que j'ai fait cette année. Claude est devenu mon assistant de travail au quotidien.",
  },
  {
    name: "Ahmed",
    age: 47,
    role: "Créateur de contenu",
    quote:
      "Formation ultra complète, sans blabla. J'ai découvert des fonctionnalités que je ne connaissais même pas.",
  },
  {
    name: "Mathilde",
    age: 33,
    role: "Community manager",
    quote:
      "En quelques heures seulement, j'ai automatisé plusieurs tâches qui me prenaient des heures chaque semaine.",
  },
  {
    name: "César",
    age: 21,
    role: "Vidéo maker",
    quote:
      "Le formateur maîtrise parfaitement Claude IA. Les explications sont simples, efficaces et orientées résultats.",
  },
  {
    name: "Thomas",
    role: "Entrepreneur",
    quote:
      "Je connaissais déjà Claude, mais je l'utilisais finalement à 10 % de ses capacités. La formation m'a permis de comprendre comment construire de vrais prompts et surtout comment intégrer Claude dans mon quotidien professionnel. Aujourd'hui, certaines tâches qui me prenaient plusieurs heures sont faites en quelques dizaines de minutes.",
  },
  {
    // Dernière phrase retirée (« la formation a rapidement été rentabilisée ») :
    // elle sous-entend un achat, or l'accès a été offert. Le gain de temps
    // annoncé porte déjà la valeur, sans rien affirmer de faux.
    name: "Sarah",
    role: "E-commerce",
    quote:
      "Ce que j'ai apprécié avec ClaudeAI Academy, c'est qu'on ne reste pas dans la théorie. Chaque module donne des méthodes directement applicables. J'ai notamment mis en place plusieurs automatisations qui me font gagner plusieurs heures chaque semaine.",
  },
  {
    name: "Julien",
    role: "Consultant",
    quote:
      "J'utilisais ChatGPT et Claude depuis plusieurs mois et je pensais plutôt bien maîtriser l'IA. Je me suis rendu compte en suivant la formation que je passais complètement à côté de certaines fonctionnalités et méthodes de travail. Le changement le plus important pour moi est la façon dont je structure désormais mes demandes à Claude.",
  },
  {
    // « J'ai acheté » → « J'ai commencé » : même phrase, moins l'affirmation
    // que les enregistrements de paiement ne soutiennent pas.
    name: "Nicolas",
    role: "Dirigeant",
    quote:
      "J'ai commencé la formation avec l'objectif de gagner du temps et d'utiliser davantage l'IA dans mon activité. Les résultats ont dépassé mes attentes. Claude m'aide maintenant pour la rédaction, l'analyse de données, la création de documents et une partie de mes tâches répétitives. C'est devenu un véritable assistant dans mon business.",
  },
  {
    name: "Camille",
    role: "Indépendante",
    quote:
      "J'avais peur que la formation soit trop technique pour moi. Finalement, tout est expliqué étape par étape et je n'avais pas besoin de connaissances particulières. J'ai pu appliquer les méthodes immédiatement et surtout comprendre comment réfléchir lorsque je veux demander quelque chose à Claude. C'est probablement ce qui m'a le plus servi.",
  },
];

const featuredReview = {
  name: "Sofia",
  age: 33,
  role: "Ingénieure développement",
  quote:
    "Si vous voulez vraiment exploiter tout le potentiel de Claude IA, cette formation est incontournable. Je recommande à 100 %.",
};

/** Signature d'un avis : initiale, prénom, âge, métier. */
function Attribution({
  name,
  age,
  role,
  size = "sm",
}: {
  name: string;
  age?: number;
  role: string;
  size?: "sm" | "lg";
}) {
  const big = size === "lg";
  return (
    <figcaption
      className={`flex items-center gap-3 ${big ? "mt-7" : "mt-5 border-t border-line pt-5"}`}
    >
      <span
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center rounded-full bg-coral-soft font-serif font-medium text-coral-dark ${
          big ? "h-12 w-12 text-lg" : "h-10 w-10 text-[15px]"
        }`}
      >
        {name.charAt(0)}
      </span>
      <span className="min-w-0">
        <span
          className={`block font-semibold text-ink ${big ? "text-[16px]" : "text-[14px]"}`}
        >
          {age ? `${name}, ${age} ans` : name}
        </span>
        <span
          className={`block text-muted ${big ? "text-[14px]" : "text-[13px]"}`}
        >
          {role}
        </span>
      </span>
    </figcaption>
  );
}

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

// `pricingHref` : la home pointe vers /tarifs ; la landing pub pointe vers
// son propre bloc tarifs (#tarifs) pour ne pas faire sortir le trafic payé.
export function Testimonials({ pricingHref = "/tarifs" }: { pricingHref?: string } = {}) {
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
            premières personnes à avoir parcouru la formation, à qui
            l&apos;accès a été offert en échange de leur avis. Et vous pouvez
            vérifier par vous-même — le programme complet est public, et la
            première leçon de chaque parcours est en accès libre.
          </p>
        </div>

        <figure className="mb-6 rounded-[22px] border border-line bg-white p-8 md:p-10">
          <Stars />
          <blockquote className="mt-5 font-serif text-xl md:text-2xl font-medium leading-snug text-ink">
            &laquo;&nbsp;{featuredReview.quote}&nbsp;&raquo;
          </blockquote>
          <Attribution
            name={featuredReview.name}
            age={featuredReview.age}
            role={featuredReview.role}
            size="lg"
          />
        </figure>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <figure
              key={`${r.name}-${r.role}`}
              className="flex flex-col rounded-[22px] border border-line bg-white p-8"
            >
              <Stars />
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-soft">
                &laquo;&nbsp;{r.quote}&nbsp;&raquo;
              </blockquote>
              <Attribution name={r.name} age={r.age} role={r.role} />
            </figure>
          ))}
        </div>

        <p className="mt-10 max-w-[680px] text-[14px] leading-relaxed text-muted">
          <strong className="text-ink">Comment ces avis sont recueillis.</strong>{" "}
          Ils proviennent de personnes disposant d&apos;un accès nominatif à la
          formation, à qui cet accès a été offert — accès fondateur ou accès
          anticipé — en contrepartie d&apos;un retour d&apos;expérience. Aucune
          n&apos;a acheté la formation, et aucun avis n&apos;est écarté en raison
          de son caractère négatif. Vous faites partie des{" "}
          <strong className="text-ink">premiers membres</strong> : votre retour
          comptera vraiment, et c&apos;est ici qu&apos;il sera mis en avant.{" "}
          <Link
            href={pricingHref}
            className="text-coral font-semibold hover:text-coral-dark transition-colors"
          >
            Voir les formules →
          </Link>
        </p>
      </Container>
    </section>
  );
}
