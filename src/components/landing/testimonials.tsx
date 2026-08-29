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
    name: "Sofia",
    age: 33,
    role: "Ingénieure développement",
    quote:
      "Si vous voulez vraiment exploiter tout le potentiel de Claude IA, cette formation est incontournable. Je recommande à 100 %.",
  },
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

/**
 * Le seul avis d'un acheteur, et il est traité à part.
 *
 * Onze personnes disaient du bien d'une formation qu'aucune n'avait payée :
 * face à une objection de prix, cet argument-là ne pèse rien. Julien a réglé
 * le Pass Starter le 4 août 2026 et validé huit leçons dans la journée — son
 * retour est le premier qui engage quelqu'un qui a sorti sa carte, et il
 * occupe pour cette raison la place d'honneur.
 *
 * Texte corrigé à l'orthographe et à la ponctuation, rien d'autre. Le
 * « j'ai jamais autant appris » reste tel quel : c'est ce qui fait entendre
 * une vraie voix plutôt qu'un texte de vendeur.
 */
const clientReview = {
  name: "Julien",
  proof: "Client vérifié · Pass Starter, août 2026",
  quote:
    "C'est le meilleur investissement que j'ai pu faire, et je vais acheter le Pass Mastery. J'ai jamais autant appris, et aussi facilement. J'avais pourtant cherché sur YouTube, etc., mais j'avais tout et n'importe quoi : ici, tout est regroupé et mis à jour régulièrement.",
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
  role?: string;
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
        {role ? (
          <span
            className={`block text-muted ${big ? "text-[14px]" : "text-[13px]"}`}
          >
            {role}
          </span>
        ) : null}
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
            <span className="accent-serif">celles et ceux qui l&apos;ont suivie.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Le premier retour ci-dessous vient d&apos;un membre qui a payé sa
            formation. Les suivants viennent de personnes à qui l&apos;accès a
            été offert en échange de leur avis — c&apos;est indiqué, parce que
            ça change ce que vaut un avis. Et vous pouvez vérifier par
            vous-même : le programme complet est public, et la première leçon
            de chaque parcours est en accès libre.
          </p>
        </div>

        <figure className="rounded-[22px] border border-line bg-white p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Stars />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-soft px-3 py-1 text-[12px] font-semibold text-green">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-green" />
              {clientReview.proof}
            </span>
          </div>
          <blockquote className="mt-5 font-serif text-xl md:text-2xl font-medium leading-snug text-ink">
            &laquo;&nbsp;{clientReview.quote}&nbsp;&raquo;
          </blockquote>
          <Attribution name={clientReview.name} size="lg" />
        </figure>

        <div className="mt-16 mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-line pt-8">
          <h3 className="font-serif text-xl font-medium text-ink">
            Les autres retours
          </h3>
          <p className="text-[14px] text-muted">
            Accès offert en contrepartie d&apos;un avis
          </p>
        </div>

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
          Le premier émane d&apos;un membre dont l&apos;achat du Pass Starter est
          enregistré au 4 août 2026. Les autres émanent de personnes disposant
          d&apos;un accès nominatif qui leur a été offert — accès fondateur ou
          accès anticipé — en contrepartie d&apos;un retour d&apos;expérience ;
          elles n&apos;ont pas acheté la formation. Aucun avis n&apos;est écarté
          en raison de son caractère négatif. Vous faites partie des{" "}
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
