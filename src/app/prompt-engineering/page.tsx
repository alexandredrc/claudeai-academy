import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { PROMPT_COUNT } from "@/lib/prompts/library";
import { SITE_URL, ORG_ID, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo/jsonld";

// Satellite du pilier /formation-intelligence-artificielle.
// Requêtes visées : « prompt engineering », « prompt engineering c'est quoi »,
// « comment écrire un bon prompt », « techniques de prompt ».
//
// Page-guide : elle enseigne réellement la méthode, avec un avant/après
// vérifiable. Une page qui se contente de vendre la formation sur cette
// requête ne serait citée par personne — ici le contenu doit tenir seul.

export const metadata: Metadata = {
  title:
    "Prompt engineering : la méthode en 5 points pour des résultats reproductibles",
  description:
    "Le prompt engineering expliqué simplement : ce que c'est, pourquoi vos prompts donnent des résultats irréguliers, et la méthode en 5 points qui transforme un coup de chance en résultat reproductible. Avec un avant/après commenté.",
  alternates: { canonical: "/prompt-engineering" },
  keywords: [
    "prompt engineering",
    "prompt engineering c'est quoi",
    "comment écrire un bon prompt",
    "techniques de prompt",
    "prompt engineering français",
    "formation prompt engineering",
    "améliorer ses prompts IA",
  ],
  openGraph: {
    title: "Prompt engineering : la méthode en 5 points",
    description:
      "Pourquoi vos prompts donnent des résultats irréguliers, et la méthode qui transforme un coup de chance en résultat reproductible.",
    url: "/prompt-engineering",
    type: "article",
  },
};

const methode = [
  {
    titre: "Donnez le contexte au lieu de le supposer connu",
    texte:
      "Le modèle ne sait rien de votre entreprise, de votre destinataire, ni de ce qui a été décidé la semaine dernière. C’est la cause numéro un des réponses génériques. Dites qui vous êtes, à qui vous parlez, et ce qui a déjà été tenté.",
    exemple:
      "« Je suis responsable RH dans une PME de 40 personnes. J’écris à un salarié qui a refusé deux fois une formation obligatoire. On a déjà eu un échange oral, mal passé. »",
  },
  {
    titre: "Dites le format attendu",
    texte:
      "Un modèle non contraint produit toujours la même chose : trois paragraphes tièdes et une liste à puces. Si vous voulez un tableau, un e-mail de huit lignes ou du JSON, dites-le. Le format est la contrainte la moins coûteuse et la plus efficace.",
    exemple:
      "« Un e-mail de 10 lignes maximum, ton ferme mais non accusatoire, pas de liste à puces, et une seule question fermée à la fin. »",
  },
  {
    titre: "Découpez au lieu de tout demander d’un coup",
    texte:
      "Une consigne qui demande d’analyser, de synthétiser et de rédiger produit trois travaux médiocres. Demandez l’analyse, corrigez-la, puis demandez la rédaction sur la base validée. La qualité vient du découpage, pas de la longueur du prompt.",
    exemple:
      "« Étape 1 : liste-moi les trois arguments les plus solides, sans rien rédiger. Je te dirai lequel garder. »",
  },
  {
    titre: "Exigez que le modèle signale ce dont il n’est pas sûr",
    texte:
      "C’est la consigne que presque personne n’écrit, et celle qui change le plus de choses. Un modèle répond avec la même assurance qu’il ait raison ou tort. Lui demander explicitement de marquer ses incertitudes transforme une réponse à vérifier entièrement en une réponse à vérifier par endroits.",
    exemple:
      "« Marque entre crochets tout ce que tu supposes sans en être certain, et dis-moi ce qui te manque pour trancher. »",
  },
  {
    titre: "Donnez un exemple de ce que vous voulez",
    texte:
      "Un exemple vaut trois paragraphes de description. Collez un texte que vous jugez réussi et demandez d’en reproduire le registre. C’est la technique la plus rentable du lot, et la plus sous-utilisée.",
    exemple:
      "« Voici un e-mail que j’ai écrit l’an dernier et qui a bien fonctionné. Reprends ce ton exactement. »",
  },
];

const faq = [
  {
    q: "Qu'est-ce que le prompt engineering ?",
    a: "Le prompt engineering est la discipline qui consiste à formuler des consignes à un modèle de langage de façon à obtenir un résultat fiable et reproductible, plutôt qu'un résultat correct une fois sur trois. Ce n'est ni une astuce ni une liste de formules magiques : c'est une manière d'expliciter le contexte, le format attendu et les critères de réussite — exactement ce qu'on ferait en confiant une tâche à un stagiaire compétent mais qui ne connaît rien à votre dossier.",
  },
  {
    q: "Faut-il savoir coder pour faire du prompt engineering ?",
    a: "Non. Écrire un prompt, c'est écrire en français. La compétence relève de la clarté d'expression et de la décomposition de problème, pas de la programmation. Les profils qui progressent le plus vite sont souvent ceux qui ont l'habitude de rédiger des consignes pour d'autres humains : chefs de projet, juristes, journalistes, managers.",
  },
  {
    q: "Pourquoi mes prompts marchent une fois sur deux ?",
    a: "Parce qu'un prompt qui « marche » par hasard repose sur des informations que le modèle a devinées correctement cette fois-là. Le jour où il devine autrement, le résultat change. La reproductibilité vient de ce que vous avez explicité : contexte, format, critères. Tout ce qui reste implicite est laissé au hasard.",
  },
  {
    q: "Les prompts sont-ils transférables d'un modèle à l'autre ?",
    a: "Largement oui. La structure d'un bon prompt fonctionne à l'identique sur Claude, ChatGPT et Gemini. Les différences portent sur des détails de style de réponse et sur les fonctionnalités disponibles, pas sur la méthode. Un prompt bien construit sur un modèle reste bon sur les autres ; un prompt vague reste mauvais partout.",
  },
  {
    q: "Faut-il des prompts très longs ?",
    a: "Non, et c'est un contresens répandu. Ce qui compte est la densité d'information utile, pas le nombre de mots. Un prompt de six lignes qui précise le contexte, le format et un exemple bat systématiquement un prompt d'une page qui empile les consignes redondantes. Au-delà d'un certain point, les instructions contradictoires se neutralisent.",
  },
  {
    q: "Où trouver des prompts déjà écrits ?",
    a: `Nous en publions ${PROMPT_COUNT} en accès libre, en français, classés par métier — développement, data, marketing, gestion, sécurité. Ils servent autant de point de départ que d'exemples de structure : en les lisant, on voit la méthode appliquée plutôt que décrite.`,
  },
];

export default function PromptEngineeringPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "Article"],
    "@id": `${SITE_URL}/prompt-engineering#page`,
    headline:
      "Prompt engineering : la méthode en 5 points pour des résultats reproductibles",
    description: metadata.description,
    url: `${SITE_URL}/prompt-engineering`,
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
      { "@type": "Thing", name: "Prompt engineering" },
      { "@type": "Thing", name: "Intelligence artificielle générative" },
    ],
  };

  // `HowTo` : c'est le format que Google et les moteurs génératifs restituent
  // en étapes numérotées quand la question est « comment écrire un prompt ».
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Écrire un prompt qui donne un résultat reproductible",
    description:
      "Cinq points à expliciter dans une consigne adressée à un modèle de langage pour obtenir un résultat fiable plutôt qu'un coup de chance.",
    inLanguage: "fr-FR",
    totalTime: "PT10M",
    step: methode.map((m, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: m.titre,
      text: m.texte,
      url: `${SITE_URL}/prompt-engineering#etape-${i + 1}`,
    })),
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
        dangerouslySetInnerHTML={jsonLdScript(howToJsonLd)}
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
            {
              name: "Formation intelligence artificielle",
              path: "/formation-intelligence-artificielle",
            },
            { name: "Prompt engineering", path: "/prompt-engineering" },
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
            <Link
              href="/formation-intelligence-artificielle"
              className="transition-colors hover:text-coral"
            >
              Formation IA
            </Link>
            <span className="mx-2 text-line">/</span>
            <span>Prompt engineering</span>
          </nav>

          <Eyebrow>Guide · Compétence centrale</Eyebrow>

          <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.025em] text-ink">
            Le prompt engineering, c’est{" "}
            <span className="accent-serif">expliciter</span> ce que vous
            supposiez évident.
          </h1>

          <div className="mt-8 rounded-[18px] border-l-[3px] border-coral bg-cream-soft p-7">
            <p className="text-lg leading-relaxed text-ink">
              <strong>Définition courte :</strong> le prompt engineering consiste
              à formuler une consigne de façon à obtenir un résultat{" "}
              <strong>reproductible</strong> plutôt que correct une fois sur
              trois. Ce n’est pas une collection de formules magiques : c’est le
              fait de rendre explicite ce que le modèle ne peut pas deviner — le
              contexte, le format attendu, les critères de réussite. Tout ce que
              vous laissez implicite est laissé au hasard.
            </p>
          </div>

          <p className="mt-8 text-lg leading-relaxed text-muted">
            Si vos résultats sont irréguliers, ce n’est presque jamais le modèle
            qui est en cause. C’est qu’un prompt qui « a marché » reposait sur
            des informations que le modèle avait devinées juste ce jour-là.
          </p>
        </Container>
      </section>

      {/* Avant / après */}
      <section className="border-y border-line bg-cream-soft py-16 md:py-20">
        <Container size="narrow">
          <Eyebrow>Le même besoin, deux consignes</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            La différence tient en quatre phrases ajoutées.
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-[18px] border border-line bg-white p-7">
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
                Ce que la plupart écrivent
              </span>
              <p className="mt-4 font-mono text-[14px] leading-relaxed text-ink">
                « Écris-moi un e-mail pour relancer un client qui ne répond
                pas. »
              </p>
              <p className="mt-5 text-[15px] leading-relaxed text-muted">
                Le modèle invente un secteur, un ton, un historique et une
                relation. Vous recevez un e-mail générique qu’il faut réécrire
                entièrement — donc vous n’avez rien gagné.
              </p>
            </div>

            <div className="rounded-[18px] border-[1.5px] border-coral bg-white p-7">
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-coral">
                Ce qui produit un résultat utilisable
              </span>
              <p className="mt-4 font-mono text-[14px] leading-relaxed text-ink">
                « Je suis consultant indépendant. J’ai envoyé un devis de
                12 000 € il y a trois semaines à une directrice marketing qui
                était enthousiaste en rendez-vous. Deux relances sans réponse.
                Écris un e-mail de 8 lignes maximum, ton confiant sans être
                insistant, qui lui offre une porte de sortie honorable si le
                projet est reporté. Pas de liste à puces. Marque entre crochets
                ce que tu supposes. »
              </p>
              <p className="mt-5 text-[15px] leading-relaxed text-muted">
                Contexte, format, longueur, ton, intention, et signalement des
                hypothèses. Le résultat est directement envoyable, ou à deux
                mots près.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* La méthode */}
      <section className="py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>La méthode</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Cinq points. Ils fonctionnent sur Claude, ChatGPT et Gemini.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Aucun n’est propre à un modèle : ce sont des manières d’enlever de
            l’ambiguïté, et l’ambiguïté coûte cher partout.
          </p>

          <ol className="mt-12 space-y-12">
            {methode.map((m, i) => (
              <li key={m.titre} id={`etape-${i + 1}`} className="scroll-mt-24">
                <div className="flex gap-5">
                  <span className="font-serif text-3xl font-medium leading-none text-coral">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-serif text-2xl font-medium leading-snug text-ink">
                      {m.titre}
                    </h3>
                    <p className="mt-3 leading-relaxed text-muted">{m.texte}</p>
                    <p className="mt-5 border-l-2 border-coral-soft bg-cream-soft py-3 pl-5 pr-4 font-mono text-[13.5px] leading-relaxed text-ink">
                      {m.exemple}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-14 rounded-[18px] border border-line bg-white p-8">
            <h3 className="font-serif text-xl font-medium text-ink">
              Le sixième point, celui qu’on oublie
            </h3>
            <p className="mt-3 leading-relaxed text-muted">
              Relire. Un modèle qui se trompe le fait avec exactement la même
              assurance que lorsqu’il a raison — il n’existe aucun signal dans le
              texte qui vous prévienne. Décidez à l’avance de ce que vous
              vérifierez systématiquement : les chiffres, les noms propres, les
              citations, les références. Le reste peut passer.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-cream-soft py-16 md:py-24">
        <Container size="narrow">
          <h2 className="font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            {PROMPT_COUNT} prompts déjà écrits, en accès libre.
          </h2>
          <p className="mt-5 max-w-[620px] text-lg leading-relaxed text-muted">
            Classés par métier. Ils servent autant de point de départ que
            d’exemples de structure : on y voit la méthode appliquée plutôt que
            décrite.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/prompts" variant="primary" size="lg">
              Voir la bibliothèque
            </Button>
            <Button href="/courses/prompt-engineering-pro" variant="ghost" size="lg">
              Le parcours complet
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Questions fréquentes</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Prompt engineering : ce qu’on nous demande.
          </h2>

          <dl className="mt-10 divide-y divide-line border-y border-line">
            {faq.map((item) => (
              <div key={item.q} className="py-7">
                <dt className="font-serif text-xl font-medium leading-snug text-ink">
                  {item.q}
                </dt>
                <dd className="mt-3 leading-relaxed text-muted">{item.a}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 text-[15px] text-muted">
            À lire ensuite :{" "}
            <Link
              href="/formation-intelligence-artificielle"
              className="font-semibold text-coral hover:text-coral-dark"
            >
              choisir une formation à l’IA
            </Link>{" "}
            ·{" "}
            <Link
              href="/claude-vs-chatgpt"
              className="font-semibold text-coral hover:text-coral-dark"
            >
              Claude ou ChatGPT
            </Link>{" "}
            ·{" "}
            <Link
              href="/formation-ia-obligatoire-ai-act"
              className="font-semibold text-coral hover:text-coral-dark"
            >
              l’obligation de formation de l’AI Act
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
