import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { getCatalogStats } from "@/lib/courses/stats";
import { SITE_URL, ORG_ID, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo/jsonld";

// Satellite du pilier /formation-intelligence-artificielle.
// Requêtes visées : « formation ia obligatoire », « ai act article 4
// formation », « obligation former salariés ia », « ai literacy entreprise ».
//
// Angle B2B, forte intention : toute entreprise dont un salarié utilise
// ChatGPT est concernée, et la plupart l'ignorent. Contenu juridique : on
// reste factuel, on cite le texte, et on dit clairement que ce n'est pas un
// conseil juridique — une page commerciale qui joue au cabinet d'avocats
// perdrait exactement la confiance qu'elle cherche à gagner.

export const metadata: Metadata = {
  title:
    "Formation IA obligatoire en entreprise : ce qu'exige l'article 4 de l'AI Act",
  description:
    "L'article 4 de l'AI Act impose depuis le 2 février 2025 un niveau suffisant de « maîtrise de l'IA » aux salariés qui utilisent l'IA. Aucun seuil d'effectif, aucune certification exigée. Ce que dit le texte, qui est concerné, et comment documenter la conformité.",
  alternates: { canonical: "/formation-ia-obligatoire-ai-act" },
  keywords: [
    "formation IA obligatoire",
    "AI Act article 4 formation",
    "obligation former salariés IA",
    "maîtrise de l'IA AI Act",
    "AI literacy entreprise",
    "formation IA entreprise obligatoire",
    "conformité AI Act PME",
  ],
  openGraph: {
    title: "Formation IA obligatoire : ce qu'exige l'article 4 de l'AI Act",
    description:
      "Depuis le 2 février 2025, tout employeur dont les équipes utilisent l'IA doit garantir leur « maîtrise de l'IA ». Sans seuil d'effectif. Ce que ça implique concrètement.",
    url: "/formation-ia-obligatoire-ai-act",
    type: "article",
  },
};

const faq = [
  {
    q: "La formation à l'IA est-elle vraiment obligatoire en entreprise ?",
    a: "Oui, dans les faits. L'article 4 du règlement européen sur l'intelligence artificielle (règlement (UE) 2024/1689, dit « AI Act ») est applicable depuis le 2 février 2025. Il impose à tout fournisseur et à tout déployeur d'un système d'IA de prendre les mesures nécessaires pour garantir « un niveau suffisant de maîtrise de l'IA » chez les personnes qui l'utilisent pour leur compte. Le texte n'emploie pas le mot « formation », mais la formation est le moyen le plus direct et le plus documentable de satisfaire cette obligation.",
  },
  {
    q: "Quelles entreprises sont concernées ?",
    a: "Toutes celles qui déploient un système d'IA dans le cadre de leur activité professionnelle. L'article 4 ne prévoit ni seuil d'effectif, ni seuil de chiffre d'affaires, ni restriction sectorielle. Une entreprise de cinq personnes dont un salarié rédige ses e-mails avec ChatGPT est un déployeur au sens du règlement, au même titre qu'un grand groupe. L'usage à titre purement personnel, hors activité professionnelle, n'est en revanche pas visé.",
  },
  {
    q: "Faut-il une certification ou un organisme agréé ?",
    a: "Non. La Commission européenne a précisé qu'aucun certificat n'est requis. Les employeurs peuvent démontrer leur conformité en tenant un registre des formations et des actions de sensibilisation menées. C'est la traçabilité qui compte, pas le label de l'organisme : une formation interne documentée peut suffire, une formation certifiante non suivie ne prouve rien.",
  },
  {
    q: "Que risque-t-on si on ne fait rien ?",
    a: "L'article 4 n'est pas assorti d'une amende administrative qui lui soit propre. Le risque est ailleurs, et il est réel : le régime de surveillance et de sanctions de l'AI Act est entré en application le 2 août 2025, et l'absence de formation devient un élément défavorable en cas de dommage causé par un usage mal maîtrisé de l'IA — fuite de données, décision erronée, contenu diffamatoire ou contrefaisant. En pratique, le registre de formation sert autant à se défendre qu'à se conformer.",
  },
  {
    q: "Que doit couvrir la formation pour être « suffisante » ?",
    a: "Le règlement définit la maîtrise de l'IA comme les compétences et connaissances permettant un déploiement éclairé, en ayant conscience des opportunités, des risques et des préjudices possibles. Concrètement, cela suppose au minimum : savoir ce que l'outil peut et ne peut pas faire, savoir qu'un modèle peut se tromper avec assurance et comment le vérifier, savoir quelles données ne doivent jamais y être saisies, et connaître les règles internes de l'entreprise sur le sujet. Le niveau attendu est proportionné au rôle de chacun et à la criticité de l'usage.",
  },
  {
    q: "Une formation en ligne suffit-elle ?",
    a: "Rien dans le texte n'impose un format présentiel ou synchrone. Ce qui compte est que les personnes concernées acquièrent effectivement les compétences, et que l'employeur puisse en attester. Une formation en ligne suivie et tracée répond à cette exigence ; une demi-journée en salle sans suite ne la remplit pas mieux.",
  },
  {
    q: "ClaudeAI Academy délivre-t-elle une attestation ?",
    a: "Nous ne sommes pas un organisme certifié Qualiopi et la formation n'est pas éligible au CPF. En revanche, la progression de chaque compte est enregistrée : vous savez qui a suivi quoi et quand, ce qui est exactement la matière d'un registre de formation. Pour un besoin de conformité formalisé avec certification, il faut vous tourner vers un organisme certifié — nous préférons le dire que le laisser croire.",
  },
];

const etapes = [
  {
    titre: "Recensez les usages réels, pas les usages autorisés",
    texte:
      "La première surprise est presque toujours la même : l'IA est déjà utilisée, sans que personne l'ait décidé. Commencez par demander qui s'en sert et pour quoi. C'est ce recensement qui définit le périmètre de l'obligation, pas votre politique interne.",
  },
  {
    titre: "Distinguez les niveaux de criticité",
    texte:
      "Un salarié qui reformule des e-mails et un salarié qui prépare des analyses servant à décider n'ont pas le même besoin. Le règlement demande un niveau « suffisant », donc proportionné : une sensibilisation courte pour les usages simples, une formation complète pour les usages engageants.",
  },
  {
    titre: "Formez sur la vérification autant que sur la production",
    texte:
      "C'est le point que les formations survolent et que le règlement vise explicitement : avoir conscience des risques. Un modèle qui se trompe avec assurance est plus dangereux qu'un modèle lent. Savoir repérer et corriger une réponse fausse est la compétence centrale.",
  },
  {
    titre: "Écrivez les règles internes noir sur blanc",
    texte:
      "Quelles données ne vont jamais dans un outil d'IA, quels usages sont interdits, qui valide quoi. Une charte d'une page vaut mieux qu'un règlement de trente que personne ne lit.",
  },
  {
    titre: "Tenez le registre, dès le premier jour",
    texte:
      "Qui a été formé, à quoi, quand, sur quel support. C'est la seule pièce qui vaudra quelque chose le jour où on vous le demandera. Un tableur suffit — l'absence de registre, non.",
  },
];

export default async function AiActPage() {
  const stats = await getCatalogStats();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "Article"],
    "@id": `${SITE_URL}/formation-ia-obligatoire-ai-act#page`,
    headline:
      "Formation IA obligatoire en entreprise : ce qu'exige l'article 4 de l'AI Act",
    description: metadata.description,
    url: `${SITE_URL}/formation-ia-obligatoire-ai-act`,
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
      { "@type": "Thing", name: "Règlement européen sur l'intelligence artificielle" },
      { "@type": "Thing", name: "Maîtrise de l'IA" },
      { "@type": "Thing", name: "Formation professionnelle" },
    ],
    citation: [
      {
        "@type": "Legislation",
        name: "Règlement (UE) 2024/1689 du Parlement européen et du Conseil, article 4 — Maîtrise de l'IA",
        url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=OJ:L_202401689",
      },
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
            {
              name: "Formation intelligence artificielle",
              path: "/formation-intelligence-artificielle",
            },
            {
              name: "Formation IA obligatoire (AI Act)",
              path: "/formation-ia-obligatoire-ai-act",
            },
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
            <span>Obligation AI Act</span>
          </nav>

          <Eyebrow>Conformité · Règlement (UE) 2024/1689</Eyebrow>

          <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.025em] text-ink">
            La formation à l’IA est{" "}
            <span className="accent-serif">déjà obligatoire</span>. Depuis
            février 2025.
          </h1>

          <div className="mt-8 rounded-[18px] border-l-[3px] border-coral bg-cream-soft p-7">
            <p className="text-lg leading-relaxed text-ink">
              <strong>En une phrase :</strong> l’article 4 de l’AI Act,
              applicable depuis le <strong>2 février 2025</strong>, impose à tout
              employeur dont les équipes utilisent un système d’IA de garantir
              chez elles un « niveau suffisant de maîtrise de l’IA ». Il n’y a{" "}
              <strong>ni seuil d’effectif, ni seuil de chiffre d’affaires</strong>{" "}
              — une entreprise de cinq personnes dont un salarié utilise ChatGPT
              est concernée. Aucune certification n’est exigée : un registre des
              actions de formation suffit à documenter la conformité.
            </p>
          </div>

          <p className="mt-8 text-lg leading-relaxed text-muted">
            La plupart des dirigeants découvrent cette obligation avec dix-huit
            mois de retard, et pour une raison simple : elle n’est arrivée par
            aucun courrier. Elle est entrée en vigueur pendant que l’IA
            s’installait dans les usages sans que personne ne l’ait formellement
            décidé.
          </p>
        </Container>
      </section>

      <section className="border-y border-line bg-cream-soft py-16 md:py-20">
        <Container size="narrow">
          <Eyebrow>Ce que dit le texte</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Trois lignes de règlement, et une obligation qui vous concerne
            probablement.
          </h2>

          <div className="prose-lesson mt-8">
            <p>
              L’article 4 demande aux fournisseurs et aux déployeurs de systèmes
              d’IA de prendre des mesures pour assurer, « dans la mesure du
              possible », un niveau suffisant de maîtrise de l’IA chez leur
              personnel et chez les personnes qui utilisent ces systèmes pour
              leur compte. Le règlement définit cette maîtrise comme les
              compétences et connaissances permettant un déploiement éclairé, en
              ayant conscience des opportunités, des risques et des préjudices
              possibles.
            </p>
            <p>
              Deux mots méritent l’attention. <strong>« Déployeur »</strong> :
              vous n’avez pas besoin de développer une IA pour être concerné, il
              suffit d’en utiliser une dans un cadre professionnel.{" "}
              <strong>« Suffisant »</strong> : le niveau attendu est proportionné
              au rôle et à la criticité de l’usage, pas uniforme.
            </p>
            <p>
              L’article 4 n’est pas assorti d’une amende propre. Le régime de
              surveillance et de sanctions de l’AI Act est entré en application
              le 2 août 2025, et l’enjeu pratique se joue surtout en cas de
              dommage : fuite de données confidentielles saisies dans un outil
              grand public, décision prise sur une réponse fausse, contenu
              diffusé sans vérification. Le registre de formation sert alors
              autant à se défendre qu’à se conformer.
            </p>
            <p className="text-[14px] text-muted">
              Source :{" "}
              <a
                href="https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=OJ:L_202401689"
                target="_blank"
                rel="noopener noreferrer"
              >
                Règlement (UE) 2024/1689, article 4 (EUR-Lex)
              </a>
              . Cette page présente le texte applicable et son interprétation
              courante ; elle ne constitue pas un conseil juridique. Pour une
              analyse de votre situation, consultez un avocat.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Se mettre en conformité</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Cinq étapes, dont aucune ne demande un budget de grand groupe.
          </h2>

          <ol className="mt-10 space-y-8">
            {etapes.map((e, i) => (
              <li key={e.titre} className="flex gap-5">
                <span className="font-serif text-3xl font-medium leading-none text-coral">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-serif text-xl font-medium text-ink">
                    {e.titre}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted">{e.texte}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-y border-line bg-cream-soft py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Ce que nous pouvons faire</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Et ce que nous ne pouvons pas.
          </h2>

          <div className="prose-lesson mt-8">
            <p>
              ClaudeAI Academy couvre la partie compétences : {stats.courseCount}{" "}
              parcours et {stats.lessonCount} leçons qui apprennent à utiliser
              l’IA générative de façon fiable, à repérer une réponse fausse, à
              savoir ce qui ne doit jamais être saisi dans un outil, et à
              encadrer l’usage dans une équipe. La progression de chaque compte
              est enregistrée : vous savez qui a suivi quoi et quand — la matière
              exacte d’un registre de formation.
            </p>
            <p>
              Ce que nous ne faisons pas :{" "}
              <strong>
                nous ne sommes pas certifiés Qualiopi, la formation n’est pas
                éligible au CPF et nous ne délivrons pas de certification
                reconnue par l’État
              </strong>
              . Si votre besoin de conformité exige une certification formelle,
              orientez-vous vers un organisme certifié. Nous préférons vous le
              dire ici plutôt que vous laisser le découvrir après l’achat.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/courses/strategie-conduite-ia" variant="primary" size="lg">
              Voir le parcours Stratégie &amp; conduite IA
            </Button>
            <Button href="/tarifs" variant="ghost" size="lg">
              Les formules
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Questions fréquentes</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Formation IA obligatoire : les questions des dirigeants.
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
              comment choisir une formation à l’IA
            </Link>{" "}
            ·{" "}
            <Link
              href="/prompt-engineering"
              className="font-semibold text-coral hover:text-coral-dark"
            >
              le prompt engineering expliqué
            </Link>{" "}
            ·{" "}
            <Link
              href="/claude-vs-chatgpt"
              className="font-semibold text-coral hover:text-coral-dark"
            >
              Claude ou ChatGPT
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
