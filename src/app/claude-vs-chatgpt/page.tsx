import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { SITE_URL, ORG_ID, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo/jsonld";

// Page de comparaison — requêtes « claude vs chatgpt », « claude ou chatgpt »,
// « différence claude chatgpt », « quel est le meilleur ia ».
//
// C'est la page la plus citable du site pour les moteurs génératifs : une
// comparaison honnête, structurée en tableau, avec une recommandation claire
// par cas d'usage. Elle est volontairement dépourvue de numéros de version et
// de scores de benchmark : ces valeurs changent tous les trimestres et
// rendraient la page fausse en quelques semaines. On compare ce qui est
// structurel, pas ce qui est conjoncturel.

export const metadata: Metadata = {
  title: "Claude ou ChatGPT : lequel choisir en 2026 ? Comparaison honnête",
  description:
    "Claude vs ChatGPT : les vraies différences en 2026 — style de rédaction, code, documents longs, écosystème, prix, confidentialité. Un tableau comparatif et une recommandation par cas d'usage, sans parti pris marketing.",
  alternates: { canonical: "/claude-vs-chatgpt" },
  keywords: [
    "claude vs chatgpt",
    "claude ou chatgpt",
    "différence claude chatgpt",
    "comparaison claude chatgpt",
    "meilleure IA générative 2026",
    "claude ai avis",
    "quel assistant IA choisir",
  ],
  openGraph: {
    title: "Claude ou ChatGPT : lequel choisir en 2026 ?",
    description:
      "Les vraies différences entre Claude et ChatGPT : rédaction, code, documents longs, écosystème, prix. Comparatif honnête et recommandation par cas d'usage.",
    url: "/claude-vs-chatgpt",
    type: "article",
  },
};

type Row = {
  critere: string;
  claude: string;
  chatgpt: string;
  verdict: "claude" | "chatgpt" | "egalite";
};

const comparaison: Row[] = [
  {
    critere: "Qualité de rédaction en français",
    claude:
      "Prose plus sobre, moins de tournures grandiloquentes. Suit les consignes de ton avec plus de constance.",
    chatgpt:
      "Très compétent, mais tendance marquée aux formules enthousiastes et aux listes à puces non demandées.",
    verdict: "claude",
  },
  {
    critere: "Écosystème et fonctionnalités",
    claude:
      "Périmètre plus resserré, centré sur le texte, le code et l'analyse de documents.",
    chatgpt:
      "Le plus large : génération d'images, voix, agents personnalisés, très nombreuses intégrations tierces.",
    verdict: "chatgpt",
  },
  {
    critere: "Documents longs et analyse de dossiers",
    claude:
      "Point fort historique : garde le fil sur des documents volumineux et cite précisément les passages.",
    chatgpt:
      "Bon, mais résume plus volontiers au lieu de traiter l'intégralité quand le document est long.",
    verdict: "claude",
  },
  {
    critere: "Programmation et développement",
    claude:
      "Référence sur les tâches de code sur base existante ; Claude Code s'exécute dans le terminal et modifie réellement les fichiers.",
    chatgpt:
      "Excellent également, avec Codex et un environnement d'exécution intégré très accessible.",
    verdict: "egalite",
  },
  {
    critere: "Suivi strict des consignes",
    claude:
      "Plus littéral : si la consigne est floue, le résultat est visiblement moyen — ce qui vous force à préciser.",
    chatgpt:
      "Plus complaisant : comble les trous de la consigne, ce qui masque les instructions mal écrites.",
    verdict: "claude",
  },
  {
    critere: "Notoriété et ressources d'apprentissage",
    claude:
      "Moins de contenus francophones disponibles, ce qui rend l'auto-apprentissage plus lent.",
    chatgpt:
      "Corpus de tutoriels, de modèles et de communautés incomparablement plus fourni.",
    verdict: "chatgpt",
  },
  {
    critere: "Confidentialité par défaut",
    claude:
      "Anthropic n'entraîne pas ses modèles sur les conversations des offres professionnelles ; les paramètres grand public doivent être vérifiés au cas par cas.",
    chatgpt:
      "Position équivalente sur les offres entreprise ; les réglages grand public méritent la même vérification.",
    verdict: "egalite",
  },
  {
    critere: "Prix d'entrée",
    claude:
      "Version gratuite utilisable, offre payante individuelle dans la même gamme que la concurrence.",
    chatgpt:
      "Version gratuite plus généreuse en fonctionnalités annexes, offre payante à tarif comparable.",
    verdict: "chatgpt",
  },
];

const recommandations = [
  {
    profil: "Vous rédigez pour être lu",
    outil: "Claude",
    pourquoi:
      "Rapports, notes, e-mails délicats, contenus éditoriaux : la sobriété par défaut demande moins de réécriture derrière.",
  },
  {
    profil: "Vous voulez un couteau suisse",
    outil: "ChatGPT",
    pourquoi:
      "Images, voix, agents, intégrations : si l'objectif est de tout faire depuis une seule interface, l'écosystème gagne.",
  },
  {
    profil: "Vous travaillez sur du code existant",
    outil: "Claude",
    pourquoi:
      "Sur une base de code réelle — comprendre, modifier, déboguer — Claude Code opère directement dans le dépôt.",
  },
  {
    profil: "Vous dépouillez des documents",
    outil: "Claude",
    pourquoi:
      "Contrats, appels d'offres, comptes rendus : le traitement intégral d'un long document reste son terrain.",
  },
  {
    profil: "Vous débutez complètement",
    outil: "L'un ou l'autre",
    pourquoi:
      "À ce stade, ce n'est pas l'outil qui limite le résultat, c'est la façon d'écrire la consigne. Choisissez celui dont vous trouverez le plus vite de l'aide en français.",
  },
];

const faq = [
  {
    q: "Claude est-il meilleur que ChatGPT ?",
    a: "Non, pas dans l'absolu — et se poser la question dans ces termes mène à une mauvaise décision. Claude est plus régulier en rédaction française et sur les documents longs ; ChatGPT dispose d'un écosystème bien plus large (images, voix, agents, intégrations). Sur le code, les deux sont au même niveau. En 2026, l'écart entre les deux modèles est plus faible que l'écart entre un utilisateur qui sait formuler une consigne et un utilisateur qui n'a jamais appris à le faire.",
  },
  {
    q: "Quelle est la principale différence entre Claude et ChatGPT ?",
    a: "Le rapport à la consigne. ChatGPT comble les trous d'une instruction incomplète et rend une réponse plaisante ; Claude suit plus littéralement ce qui est écrit et rend un résultat visiblement moyen quand la consigne est floue. C'est moins confortable, mais cela révèle immédiatement les instructions mal écrites — ce qui en fait un meilleur terrain d'apprentissage.",
  },
  {
    q: "Claude est-il gratuit ?",
    a: "Oui, il existe une version gratuite de Claude, utilisable sans carte bancaire, avec une limite d'usage quotidienne. Elle suffit largement pour suivre une formation et pour la plupart des usages professionnels ponctuels. Les offres payantes lèvent les limites et donnent accès aux modèles les plus capables.",
  },
  {
    q: "Peut-on utiliser les deux ?",
    a: "C'est ce que font la plupart des utilisateurs avancés, et c'est raisonnable : les abonnements individuels coûtent quelques dizaines d'euros par mois. En pratique, on garde ChatGPT pour la polyvalence et Claude pour l'écrit exigeant et les dossiers volumineux. Les compétences acquises sur l'un servent intégralement sur l'autre.",
  },
  {
    q: "Si j'apprends sur Claude, mes compétences servent-elles sur ChatGPT ?",
    a: "Oui, presque intégralement. Ce qui s'apprend — structurer une consigne, fournir le bon contexte, découper une tâche complexe, repérer une réponse fausse, automatiser ce qui se répète — est indépendant du modèle. Ce qui change d'un outil à l'autre relève de l'interface et s'apprend en quelques minutes.",
  },
  {
    q: "Ce comparatif est-il à jour ?",
    a: "Il porte volontairement sur des différences structurelles, pas sur des numéros de version ni sur des scores de benchmark : ces valeurs changent tous les trimestres et rendraient la page fausse en quelques semaines. Les écarts décrits ici — style de rédaction, rapport à la consigne, largeur de l'écosystème, traitement des documents longs — sont stables depuis plusieurs générations de modèles chez les deux éditeurs.",
  },
];

export default function ClaudeVsChatGPTPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "Article"],
    "@id": `${SITE_URL}/claude-vs-chatgpt#page`,
    headline: "Claude ou ChatGPT : lequel choisir en 2026 ?",
    description: metadata.description,
    url: `${SITE_URL}/claude-vs-chatgpt`,
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
      { "@type": "Thing", name: "Claude (Anthropic)" },
      { "@type": "Thing", name: "ChatGPT (OpenAI)" },
      { "@type": "Thing", name: "Intelligence artificielle générative" },
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
            { name: "Claude ou ChatGPT", path: "/claude-vs-chatgpt" },
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
            <span>Claude ou ChatGPT</span>
          </nav>

          <Eyebrow>Comparatif · Mis à jour en 2026</Eyebrow>

          <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.025em] text-ink">
            Claude ou ChatGPT :{" "}
            <span className="accent-serif">lequel choisir</span> ?
          </h1>

          {/* Réponse directe : c'est ce bloc que les moteurs génératifs
              extraient pour répondre à la question. Il doit se suffire. */}
          <div className="mt-8 rounded-[18px] border-l-[3px] border-coral bg-cream-soft p-7">
            <p className="text-lg leading-relaxed text-ink">
              <strong>Réponse courte :</strong> prenez <strong>Claude</strong> si
              votre travail consiste surtout à écrire, à analyser des documents
              longs ou à intervenir sur du code existant. Prenez{" "}
              <strong>ChatGPT</strong> s’il vous faut un outil polyvalent —
              images, voix, agents, intégrations. Sur le fond, les deux sont
              excellents : en 2026, l’écart entre les deux modèles est plus
              faible que l’écart entre quelqu’un qui sait formuler une consigne
              et quelqu’un qui ne l’a jamais appris.
            </p>
          </div>

          <p className="mt-8 text-lg leading-relaxed text-muted">
            Ce comparatif est publié par une académie qui forme sur Claude. Nous
            le disons d’emblée, et nous avons choisi d’écrire une comparaison
            qui reste utile même si vous concluez que ChatGPT vous convient
            mieux — c’est la seule façon qu’elle ait une valeur.
          </p>
        </Container>
      </section>

      {/* Tableau comparatif */}
      <section className="border-y border-line bg-cream-soft py-16 md:py-20">
        <Container size="narrow">
          <h2 className="font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Huit critères, un verdict par ligne.
          </h2>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b-2 border-ink">
                  <th className="py-3 pr-4 font-semibold text-ink">Critère</th>
                  <th className="py-3 pr-4 font-semibold text-ink">Claude</th>
                  <th className="py-3 pr-4 font-semibold text-ink">ChatGPT</th>
                  <th className="py-3 font-semibold text-ink">Avantage</th>
                </tr>
              </thead>
              <tbody>
                {comparaison.map((row) => (
                  <tr key={row.critere} className="border-b border-line align-top">
                    <td className="py-4 pr-4 font-semibold text-ink">
                      {row.critere}
                    </td>
                    <td className="py-4 pr-4 text-muted">{row.claude}</td>
                    <td className="py-4 pr-4 text-muted">{row.chatgpt}</td>
                    <td className="py-4 whitespace-nowrap">
                      <Verdict value={row.verdict} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-[14px] text-muted">
            Comparaison portant sur les caractéristiques structurelles des deux
            produits, observées de façon stable sur plusieurs générations de
            modèles. Volontairement sans numéros de version ni scores de
            benchmark : ces valeurs changent trop vite pour être fiables sur une
            page de référence.
          </p>
        </Container>
      </section>

      {/* Recommandation par profil */}
      <section className="py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Par cas d’usage</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            La bonne question n’est pas « lequel est le meilleur », mais « pour
            quoi faire ».
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {recommandations.map((r) => (
              <div
                key={r.profil}
                className="rounded-[18px] border border-line bg-white p-7"
              >
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-coral">
                  {r.outil}
                </span>
                <h3 className="mt-2 font-serif text-xl font-medium leading-snug text-ink">
                  {r.profil}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  {r.pourquoi}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Le pivot : ce n'est pas l'outil, c'est la compétence */}
      <section className="border-y border-line bg-cream-soft py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Ce qui compte vraiment</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Changer d’outil ne change presque rien. Changer de méthode change
            tout.
          </h2>

          <div className="prose-lesson mt-8">
            <p>
              Les deux modèles progressent en parallèle, se dépassent
              alternativement, et l’écart se referme à chaque génération. Passer
              de l’un à l’autre pour gagner quelques pourcents de qualité est un
              mauvais calcul quand la même consigne mal écrite produit un
              résultat médiocre des deux côtés.
            </p>
            <p>
              Ce qui fait la différence tient dans cinq gestes : donner le
              contexte plutôt que le supposer connu, dire le format attendu,
              découper une tâche complexe au lieu de la poser en bloc, exiger que
              le modèle signale ce dont il n’est pas sûr, et vérifier ce qui
              compte avant de l’envoyer. Ces cinq gestes fonctionnent à
              l’identique sur Claude, ChatGPT et Gemini.
            </p>
            <p>
              C’est pour ça que nous formons sur Claude sans former{" "}
              <em>à</em> Claude : il sert de terrain d’entraînement, parce qu’il
              est le plus intransigeant sur la qualité de la consigne. Ce qui
              passe sur Claude passe partout.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/formation-intelligence-artificielle" variant="primary" size="lg">
              Voir la formation
            </Button>
            <Button href="/kit" variant="ghost" size="lg">
              Tester avec 15 prompts gratuits
            </Button>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Questions fréquentes</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Claude vs ChatGPT : les questions qui reviennent.
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
            Pour aller plus loin :{" "}
            <Link
              href="/formation-intelligence-artificielle"
              className="font-semibold text-coral hover:text-coral-dark"
            >
              comment choisir une formation à l’IA
            </Link>{" "}
            ·{" "}
            <Link
              href="/prompts"
              className="font-semibold text-coral hover:text-coral-dark"
            >
              la bibliothèque de prompts
            </Link>{" "}
            ·{" "}
            <Link
              href="/faq"
              className="font-semibold text-coral hover:text-coral-dark"
            >
              la FAQ complète
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}

function Verdict({ value }: { value: Row["verdict"] }) {
  const label =
    value === "claude" ? "Claude" : value === "chatgpt" ? "ChatGPT" : "Égalité";
  const tone =
    value === "egalite"
      ? "border-line text-muted"
      : "border-coral bg-coral-soft/40 text-coral-dark";
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-[13px] font-semibold ${tone}`}
    >
      {label}
    </span>
  );
}
