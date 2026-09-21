import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { SITE_URL, ORG_ID, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo/jsonld";

// Page « certification » — requêtes « certification claude », « certification
// anthropic », « formation certifiante claude ai », « claude ai certification ».
//
// Pourquoi cette page existe : sur la campagne Google Ads d'août-septembre 2026,
// 28 % des clics identifiés venaient de requêtes contenant « certification ».
// Aucun n'a acheté — et c'était normal : ces gens cherchaient un diplôme, et le
// site leur répondait par une grille tarifaire. La demande est donc mesurée,
// et personne n'y répond honnêtement en français.
//
// Règle absolue sur cette page : ne JAMAIS laisser entendre qu'une
// reconnaissance officielle est délivrée. « Certification » est un mot encadré
// en France (RNCP, France Compétences). On explique ce qui existe, on dit ce
// qu'on ne délivre pas, et on propose ce qui a réellement de la valeur.

export const metadata: Metadata = {
  title: "Certification Claude AI : ce qui existe vraiment en 2026",
  description:
    "Existe-t-il une certification Claude AI ou Anthropic ? Réponse honnête : pas de titre reconnu par l'État sur un outil, des cours gratuits en anglais chez Anthropic, et des attestations privées qui ne prouvent rien. Ce qu'un recruteur regarde à la place.",
  alternates: { canonical: "/certification-claude-ai" },
  keywords: [
    "certification claude",
    "certification claude ai",
    "certification anthropic",
    "formation certifiante claude ai",
    "claude ai certification",
    "anthropic academy français",
    "diplôme intelligence artificielle",
  ],
  openGraph: {
    title: "Certification Claude AI : ce qui existe vraiment en 2026",
    description:
      "Pas de titre d'État sur un outil, des cours gratuits en anglais chez Anthropic, des attestations privées sans valeur de preuve. Ce qui compte vraiment, et comment l'acquérir.",
    url: "/certification-claude-ai",
    type: "article",
  },
};

type Option = {
  nom: string;
  quoi: string;
  valeur: string;
  prix: string;
  verdict: "oui" | "non" | "nuance";
};

const options: Option[] = [
  {
    nom: "Un titre reconnu par l'État (RNCP, CPF)",
    quoi: "Le Répertoire national des certifications professionnelles enregistre des titres liés à des métiers et à des blocs de compétences — « développeur », « chargé de communication ». Il n'enregistre pas de logiciels.",
    valeur:
      "Réelle, mais sur un métier entier. Aucun titre de ce type ne porte sur un assistant IA en particulier.",
    prix: "Plusieurs milliers d'euros, plusieurs mois, dossier de financement.",
    verdict: "non",
  },
  {
    nom: "Les cours officiels d'Anthropic",
    quoi: "Anthropic publie Claude Academy sur academy.claude.com : des parcours structurés avec quiz, produits par son équipe éducation.",
    valeur:
      "Le contenu est bon et vient de la source. Mais ce sont des cours, pas un diplôme — et ils sont en anglais.",
    prix: "Gratuit.",
    verdict: "oui",
  },
  {
    nom: "Une « attestation » d'organisme privé",
    quoi: "N'importe quel organisme peut imprimer un certificat à son nom, avec un sceau et un numéro. Rien ne l'en empêche, et rien ne le valide.",
    valeur:
      "Elle atteste que vous avez suivi quelque chose. Elle ne prouve pas que vous savez faire. Un recruteur qui connaît le sujet le sait.",
    prix: "Souvent le prix de la formation, parfois un supplément.",
    verdict: "nuance",
  },
];

const faq = [
  {
    q: "Existe-t-il une certification officielle Claude AI ?",
    a: "Non, pas au sens d'un titre reconnu par l'État français. Le RNCP enregistre des certifications professionnelles rattachées à des métiers et à des blocs de compétences, pas à des outils logiciels — il n'existe pas plus de titre d'État « Claude » qu'il n'en existe un pour Excel ou Photoshop. Anthropic, de son côté, publie des cours gratuits sur academy.claude.com, mais ce sont des cours, pas une certification.",
  },
  {
    q: "La formation Claude d'Anthropic est-elle gratuite ?",
    a: "Oui. Claude Academy, publiée par Anthropic sur academy.claude.com, est gratuite et accessible sans carte bancaire. Les parcours sont structurés, avec des quiz. La limite principale pour un public francophone est la langue : les contenus sont en anglais.",
  },
  {
    q: "Une attestation de formation a-t-elle de la valeur sur un CV ?",
    a: "Une valeur faible et décroissante. Depuis que des milliers d'organismes en délivrent, un recruteur averti sait qu'une attestation prouve une présence, pas une compétence. Ce qui pèse à sa place : une réalisation concrète que vous pouvez montrer et expliquer — un processus que vous avez automatisé, un document de travail que vous produisez en un quart du temps, une bibliothèque de consignes qui tourne dans votre équipe.",
  },
  {
    q: "Que délivrez-vous à la fin de vos parcours ?",
    a: "Nous ne délivrons pas de certification, et nous ne vous en vendrons pas une. Ce que vous gardez, c'est l'accès à vie aux parcours et aux mises à jour, et une bibliothèque de 170 consignes prêtes à l'emploi que vous adaptez à votre métier. Notre position est que le livrable utile est ce que vous savez produire, pas un document imprimé.",
  },
  {
    q: "Puis-je financer une formation Claude avec mon CPF ?",
    a: "Non, et il faut s'en méfier quand on vous l'affirme : le financement CPF est réservé aux formations dont la certification est enregistrée au RNCP ou au Répertoire spécifique. Une formation à un outil ne peut donc pas y prétendre. L'avantage de payer directement est qu'il n'y a ni dossier, ni délai d'instruction, ni organisme à convaincre.",
  },
  {
    q: "Comment prouver qu'on sait utiliser l'IA, alors ?",
    a: "En le montrant. Gardez trois exemples avant/après tirés de votre propre travail : la tâche, le temps qu'elle prenait, la consigne que vous avez écrite, le résultat obtenu. Ce format tient en une page, il se raconte en deux minutes en entretien, et il est infalsifiable — contrairement à une attestation.",
  },
];

export default function CertificationPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "Article"],
    "@id": `${SITE_URL}/certification-claude-ai#page`,
    headline: "Certification Claude AI : ce qui existe vraiment en 2026",
    description: metadata.description,
    url: `${SITE_URL}/certification-claude-ai`,
    inLanguage: "fr-FR",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": ORG_ID },
    author: {
      "@type": "Person",
      name: "Alexandre Dos Reis Caetano",
      url: `${SITE_URL}/a-propos`,
    },
    dateModified: new Date().toISOString().slice(0, 10),
    about: [
      { "@type": "Thing", name: "Certification professionnelle" },
      { "@type": "Thing", name: "Claude (Anthropic)" },
      { "@type": "Thing", name: "Formation à l'intelligence artificielle" },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(articleJsonLd)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(faqJsonLd)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Certification Claude AI", path: "/certification-claude-ai" },
          ]),
        )}
      />

      <section className="relative overflow-hidden pt-16 pb-14 md:pt-24 md:pb-16">
        <div
          aria-hidden="true"
          className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(242,213,199,0.9), transparent 70%)",
          }}
        />
        <Container size="narrow">
          <nav className="mb-5 text-[13px] text-muted" aria-label="Fil d’Ariane">
            <Link href="/" className="transition-colors hover:text-coral">
              Accueil
            </Link>
            <span className="mx-2 text-line">/</span>
            <span>Certification Claude AI</span>
          </nav>

          <Eyebrow>Mise au point · 2026</Eyebrow>

          <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.025em] text-ink">
            Certification Claude AI :{" "}
            <span className="accent-serif">ce qui existe vraiment</span>
          </h1>

          {/* Réponse directe : c'est ce bloc que les moteurs génératifs
              extraient. Il doit se suffire à lui-même. */}
          <div className="mt-8 rounded-[18px] border-l-[3px] border-coral bg-cream-soft p-7">
            <p className="text-lg leading-relaxed text-ink">
              <strong>Réponse courte :</strong> il n’existe{" "}
              <strong>aucune certification Claude reconnue par l’État</strong> —
              le RNCP enregistre des titres rattachés à des métiers, pas à des
              logiciels. Anthropic publie ses propres cours, gratuitement, sur
              academy.claude.com : ce sont des cours, en anglais, pas un diplôme.
              Tout le reste relève de l’attestation d’organisme privé, que
              n’importe qui peut imprimer et qui ne prouve rien d’autre que votre
              présence.
            </p>
          </div>

          <p className="mt-8 text-lg leading-relaxed text-muted">
            Nous sommes une académie qui vend une formation payante sur Claude.
            Nous vous disons quand même qu’il existe une ressource gratuite et
            officielle, et nous ne vous vendrons pas de certificat. La suite
            explique pourquoi ce n’est pas de l’altruisme, mais le seul calcul
            qui tienne sur la durée.
          </p>
        </Container>
      </section>

      {/* Les trois choses qu'on appelle « certification » */}
      <section className="border-y border-line bg-cream-soft py-16 md:py-20">
        <Container size="narrow">
          <h2 className="font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Trois choses différentes portent le même mot.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            La confusion est entretenue, parce qu’elle est rentable. Voici les
            trois, séparées.
          </p>

          <div className="mt-10 flex flex-col gap-5">
            {options.map((o) => (
              <article
                key={o.nom}
                className="rounded-[18px] border border-line bg-white p-7"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-serif text-xl font-semibold text-ink">
                    {o.nom}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-1 text-[12px] font-bold ${
                      o.verdict === "oui"
                        ? "bg-green-soft text-green"
                        : o.verdict === "non"
                          ? "bg-coral-soft text-coral-dark"
                          : "bg-cream text-muted"
                    }`}
                  >
                    {o.verdict === "oui"
                      ? "Existe, et c’est gratuit"
                      : o.verdict === "non"
                        ? "N’existe pas sur un outil"
                        : "Existe, mais ne prouve rien"}
                  </span>
                </div>
                <p className="mt-4 leading-relaxed text-ink-soft">{o.quoi}</p>
                <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-line pt-5 sm:grid-cols-2">
                  <div>
                    <dt className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">
                      Ce que ça vaut
                    </dt>
                    <dd className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                      {o.valeur}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">
                      Ce que ça coûte
                    </dt>
                    <dd className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                      {o.prix}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Le reframe : ce qu'un recruteur regarde */}
      <section className="py-16 md:py-20">
        <Container size="narrow">
          <h2 className="font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Ce qu’un recruteur regarde à la place.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Posez-vous la question dans l’autre sens : pourquoi voulez-vous une
            certification ? Presque toujours pour la même raison — avoir quelque
            chose à montrer qui prouve que vous ne bluffez pas. C’est un besoin
            légitime. Simplement, le document n’est pas ce qui le satisfait le
            mieux.
          </p>

          <div className="mt-10 rounded-[18px] border border-line bg-white p-8">
            <h3 className="font-serif text-xl font-semibold text-ink">
              La page qui remplace le certificat
            </h3>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Trois exemples tirés de votre propre travail, sur une seule page.
              Pour chacun : la tâche, le temps qu’elle prenait avant, la consigne
              exacte que vous avez écrite, et le résultat obtenu. Ça se lit en
              une minute, ça se raconte en deux en entretien, et c’est
              infalsifiable — personne ne peut vous acheter votre avant/après.
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Un candidat qui pose ça sur la table passe devant un candidat qui
              tend une attestation. La différence n’est pas le prestige : c’est
              que l’un raconte ce qu’il a fait, et l’autre ce qu’il a suivi.
            </p>
          </div>

          <div className="mt-10 rounded-[18px] border-l-[3px] border-ink bg-cream-soft p-7">
            <h3 className="font-serif text-xl font-semibold text-ink">
              Ce que nous délivrons, et ce que nous ne délivrons pas
            </h3>
            <p className="mt-4 leading-relaxed text-ink-soft">
              <strong>Nous ne délivrons aucune certification</strong>, et nous
              n’en vendrons pas. Ce que vous gardez à vie : les parcours et
              leurs mises à jour, une bibliothèque de 170 consignes prêtes à
              l’emploi, et un mentor IA qui corrige les vôtres pendant que vous
              apprenez. Le livrable, c’est ce que vous savez produire le
              vendredi soir — pas un PDF avec un sceau.
            </p>
          </div>
        </Container>
      </section>

      {/* Et si vous cherchiez simplement les cours d'Anthropic */}
      <section className="border-y border-line bg-cream-soft py-16 md:py-20">
        <Container size="narrow">
          <h2 className="font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Vous cherchiez peut-être simplement les cours d’Anthropic.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Beaucoup de gens qui tapent « certification Anthropic » ou « Claude
            Academy » cherchent en réalité la ressource officielle. Elle existe,
            elle s’appelle Claude Academy, elle est publiée par l’équipe
            éducation d’Anthropic, et elle est gratuite. Si votre anglais est
            confortable et que vous avez le temps de vous auto-organiser,
            commencez par là — c’est la source.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Ce que nous ajoutons est précis, et c’est tout ce que nous
            revendiquons : le <strong>français</strong>, un ordre de progression
            imposé plutôt qu’un catalogue à trier, des cas tirés de métiers
            francophones, et des consignes déjà écrites que vous copiez au lieu
            de les inventer. Si ces quatre choses ne vous manquent pas, la
            ressource gratuite suffira, et c’est très bien.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/tarifs" variant="primary" size="lg">
              Voir les parcours — à partir de 47 €
            </Button>
            <Button href="/kit" variant="ghost" size="lg">
              Essayer d’abord le kit gratuit
            </Button>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20">
        <Container size="narrow">
          <h2 className="font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Questions fréquentes
          </h2>
          <div className="mt-10 flex flex-col gap-6">
            {faq.map((item) => (
              <div key={item.q} className="border-b border-line pb-6">
                <h3 className="font-semibold text-ink">{item.q}</h3>
                <p className="mt-2.5 leading-relaxed text-muted">{item.a}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-[15px] leading-relaxed text-muted">
            Pour aller plus loin :{" "}
            <Link href="/formation-intelligence-artificielle" className="text-coral underline underline-offset-4">
              la formation à l’intelligence artificielle
            </Link>
            ,{" "}
            <Link href="/claude-vs-chatgpt" className="text-coral underline underline-offset-4">
              Claude ou ChatGPT
            </Link>{" "}
            et{" "}
            <Link href="/prompt-engineering" className="text-coral underline underline-offset-4">
              le prompt engineering
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
