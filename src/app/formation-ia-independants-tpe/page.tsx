import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { Profiles } from "@/components/landing/profiles";
import { Founder } from "@/components/landing/founder";
import { Guarantee } from "@/components/landing/guarantee";
import { getCatalogStats } from "@/lib/courses/stats";
import { PROMPT_COUNT } from "@/lib/prompts/library";
import { ELITE_ENABLED } from "@/lib/stripe/plans";
import { CONTENU_A_JOUR_AU } from "@/lib/content/fraicheur";
import { MESURES, MESURES_DATE, duree, mesure, type Mesure } from "@/lib/offre/mesures";
import { SITE_URL, ORG_ID, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo/jsonld";

// Page métier du pilier /formation-intelligence-artificielle, pour le public
// fixé le 15/10/2026 : indépendants et TPE non techniques. Requêtes visées :
// « formation IA pour indépendants », « formation IA artisans », « IA pour
// TPE », « Claude pour les indépendants ». Audit SEO du 15/10/2026, point 3 :
// aucune page du site ne visait un métier ni « TPE ».
//
// Règle de contenu : rien d'inventé. Les temps viennent de lib/offre/mesures.ts,
// les profils et le chemin « 3 leçons, 60 minutes » du composant Profiles (qui
// lit la base), les prompts de lib/prompts/categories/*.json, les titres de
// leçons de la base (relevés le 15/10/2026), la date de fraîcheur de
// lib/content/fraicheur.ts. Les dates ci-dessous sont fixes : pas de
// `new Date()` dans le JSON-LD (audit, point 8).

const PATH = "/formation-ia-independants-tpe";
const DATE_MAJ = "15 octobre 2026";
const DATE_ISO = "2026-10-15";

const LECON_EXCEL =
  "/courses/bien-demarrer-avec-claude/claude-dans-excel-powerpoint-word-et-chrome";
const PARCOURS_STRATEGIE = "/courses/strategie-conduite-ia";

// Les 3 parcours fondateurs du Pass Starter (même constante que
// components/landing/pricing-teaser.tsx : 9 + 7 + 8 leçons en base).
const STARTER_LESSON_COUNT = 24;

export const metadata: Metadata = {
  title: "Formation IA pour indépendants et TPE : Claude, sans technique",
  description:
    "Formation IA en français pour indépendants, artisans et TPE : emails, relances, comptes rendus avec Claude, sans coder. Dès 47 €, garantie 14 jours.",
  alternates: { canonical: PATH },
  keywords: [
    "formation IA pour indépendants",
    "formation IA artisans",
    "IA pour TPE",
    "Claude pour les indépendants",
    "formation IA auto-entrepreneur",
    "IA pour petite entreprise",
    "formation IA commerçants",
    "formation IA restaurateurs",
    "formation Claude sans technique",
  ],
  openGraph: {
    title: "Formation IA pour indépendants et TPE : Claude, sans technique",
    description:
      "Répondre à un client mécontent, relancer une facture, rédiger un compte rendu ou une fiche de poste avec Claude, sans coder. Temps mesurés, dès 47 €.",
    url: PATH,
    type: "article",
    images: ["/og.png"],
  },
};

// Ce qui enseigne chaque tâche mesurée : une leçon (titre réel en base) ou un
// prompt de la bibliothèque (titre et `tier` réels dans categories/*.json).
type Enseigne = {
  kind: "lecon" | "prompt";
  titre: string;
  gratuit: boolean;
  href?: string;
};

const ENSEIGNE: Record<string, Enseigne> = {
  T2: { kind: "prompt", titre: "Email difficile à rédiger", gratuit: true, href: "/prompts#business" },
  T1: { kind: "prompt", titre: "Séquence de relance commerciale", gratuit: false, href: "/prompts#business" },
  T4: { kind: "prompt", titre: "Compte rendu de réunion structuré", gratuit: true, href: "/prompts#business" },
  // Publication Instagram d'un produit : le prompt le plus proche dans la
  // bibliothèque est celui des angles et accroches (aucun prompt de post
  // organique n'existe ; « Script vidéo courte » décrit un Reel, pas une
  // publication).
  T3: {
    kind: "prompt",
    titre: "Générateur d'angles et d'accroches",
    gratuit: false,
    href: "/prompts#marketing",
  },
  T5: { kind: "prompt", titre: "Rédaction de fiche de poste", gratuit: false, href: "/prompts#business" },
  T6: { kind: "prompt", titre: "Procédure opérationnelle (SOP)", gratuit: false, href: "/prompts#business" },
  R3: { kind: "lecon", titre: "Personnaliser Claude : dis-lui qui tu es", gratuit: false },
  R4: { kind: "lecon", titre: "Personnaliser Claude : dis-lui qui tu es", gratuit: false },
  R1: {
    kind: "lecon",
    titre: "Claude là où tu travailles déjà : Excel, PowerPoint, Word, Outlook et Chrome",
    gratuit: true,
    href: LECON_EXCEL,
  },
  R2: {
    kind: "lecon",
    titre: "Claude là où tu travailles déjà : Excel, PowerPoint, Word, Outlook et Chrome",
    gratuit: true,
    href: LECON_EXCEL,
  },
};

// Ordre d'affichage : les tâches de toute petite entreprise d'abord, la
// restauration (métier du fondateur) ensuite.
const ORDRE = ["T2", "T1", "T4", "T3", "T5", "T6", "R3", "R4", "R1", "R2"];

const neFaitPas = [
  {
    titre: "Elle ne vous apprend pas à coder, et ne le demande pas",
    texte:
      "Les parcours Bien démarrer avec Claude, Prompt Engineering pro, Contenu et marketing et Stratégie et conduite IA ne demandent d'écrire aucune ligne de code : ce sont ceux qui servent à une petite entreprise. Les parcours Claude Code, Data et SQL, Trading, Prompts, skills, MCP et GitHub, et Construire ton agent IA sont techniques, signalés comme tels, et facultatifs.",
  },
  {
    titre: "Elle n'est pas finançable par le CPF ni par un OPCO",
    texte:
      "ClaudeAI Academy n'est pas un organisme certifié Qualiopi. Vous payez une fois, vous commencez dans la minute, vous recevez une facture professionnelle. TVA non applicable, article 293 B du CGI : le prix affiché est le prix facturé.",
  },
  {
    titre: "Elle ne délivre pas de certification reconnue par l'État",
    texte:
      "L'examen du Pass Mastery donne un certificat vérifiable en ligne, délivré par ClaudeAI Academy, organisme indépendant sans lien avec Anthropic. Il atteste de ce que vous savez faire avec Claude, rien de plus.",
  },
  {
    titre: "Elle ne promet pas vos résultats",
    texte:
      "Les temps du tableau ci-dessus sont ceux du fondateur après des mois d'usage quotidien. Les vôtres dépendront de votre pratique et de la qualité de ce que vous donnez à Claude comme contexte.",
  },
  {
    titre: "Elle ne remplace pas votre jugement",
    texte:
      "Chaque texte produit se relit avant d'être envoyé. Les décisions (un prix, un recrutement, la réponse à un litige) restent les vôtres : Claude prépare la première version, vous tranchez.",
  },
];

type FaqItem = { q: string; a: string; lien?: { href: string; label: string } };

const faq: FaqItem[] = [
  {
    q: "Claude ou ChatGPT pour une TPE ?",
    a: `Les deux savent rédiger un email ou un compte rendu. Nous formons sur Claude parce que la méthode enseignée (décrire son activité, donner le contexte, relire) s'y applique avec le plus de rigueur, et qu'elle se transfère ensuite à ChatGPT ou Gemini sans réapprendre. Pour une petite entreprise équipée de Microsoft 365, Claude s'utilise aussi directement dans Excel, Word et PowerPoint, et dans Outlook en bêta, avec un plan Claude payant et sans licence supplémentaire (vérifié le ${CONTENU_A_JOUR_AU}). La comparaison critère par critère est sur notre page dédiée.`,
    lien: { href: "/claude-vs-chatgpt", label: "Lire la comparaison Claude ou ChatGPT" },
  },
  {
    q: "Faut-il savoir coder ?",
    a: "Non. Écrire une demande à Claude, c'est écrire en français. Les parcours Bien démarrer avec Claude, Prompt Engineering pro, Contenu et marketing et Stratégie et conduite IA ne demandent d'écrire aucune ligne de code, et ce sont ceux qui servent à un indépendant ou à une TPE. Les parcours Claude Code, Data et SQL, Trading, Prompts, skills, MCP et GitHub, et Construire ton agent IA supposent une culture technique : ils sont signalés comme tels et vous pouvez les laisser de côté.",
  },
  {
    q: "Mes données clients sont-elles en sécurité ?",
    a: "Cela dépend de ce que vous collez dans Claude et des réglages de votre compte, et la formation traite les deux. La leçon « Paramétrer Claude : les réglages qui comptent » (parcours Bien démarrer avec Claude, 16 minutes) fait le tour des paramètres : mémoire, connecteurs, données, et le choix conscient de contribuer ou non à l'amélioration des modèles. Le parcours Stratégie et conduite IA en entreprise consacre une leçon à la gouvernance (RGPD et AI Act) et une autre à la sécurité, avec une règle simple : ne jamais envoyer dans un prompt ce que vous n'accepteriez pas de voir conservé. Aucune formation ne peut garantir la sécurité à votre place : vous restez responsable du traitement des données de vos clients.",
    lien: { href: PARCOURS_STRATEGIE, label: "Voir le parcours Stratégie et conduite IA" },
  },
  {
    q: "Combien de temps avant un premier résultat utile ?",
    a: "Une heure. Les trois leçons conseillées (Personnaliser Claude, Être clair et direct, Claude là où tu travailles déjà) totalisent 60 minutes et vous laissent avec un profil rempli, une méthode de demande et la marche à suivre pour vous en servir dans Word, Excel ou Outlook. Pour tout le programme : les 58 leçons des 9 parcours se lisent en une dizaine d'heures (8 à 15 minutes par leçon) et demandent environ 22 heures avec la mise en pratique. Rien ne vous oblige à tout suivre : l'accès est à vie.",
  },
  {
    q: "La formation est-elle éligible au CPF ?",
    a: "Non. ClaudeAI Academy n'est pas certifiée Qualiopi et la formation n'est éligible ni au CPF ni à un financement OPCO. En contrepartie : pas de dossier, pas de délai, pas de session à date fixe. Vous payez une fois (47 € ou 497 €), vous recevez une facture professionnelle, TVA non applicable au titre de l'article 293 B du CGI, et vous gardez l'accès à vie. Si le financement CPF est indispensable pour vous, un organisme certifié sera plus adapté.",
  },
];

export default async function FormationIAIndependantsTPEPage() {
  const stats = await getCatalogStats();

  const lignes = ORDRE.map(mesure).filter((m): m is Mesure => Boolean(m));
  const totalSans = MESURES.reduce((s, m) => s + m.sans, 0);
  const totalAvec = MESURES.reduce((s, m) => s + m.avec, 0);

  const passes = [
    {
      nom: "Pass Starter",
      prix: "47 € une fois",
      contenu: `3 parcours fondateurs (Bien démarrer avec Claude, Prompt Engineering pro, Claude Code), soit ${STARTER_LESSON_COUNT} leçons, les prompts essentiels, les QCM, accès permanent et mises à jour.`,
      href: "/tarifs#starter",
    },
    {
      nom: "Pass Mastery",
      prix: "497 € une fois, ou 3 × 165,67 € sans frais avec Klarna",
      contenu: `Les ${stats.courseCount} parcours (${stats.lessonCount} leçons), les ${PROMPT_COUNT} prompts, le Mentor IA qui répond à vos questions et corrige vos exercices, l'examen et le certificat vérifiable, accès à vie. Vos 47 € de Starter sont déduits si vous commencez petit.`,
      href: "/tarifs#mastery",
    },
    ...(ELITE_ENABLED
      ? [
          {
            nom: "Pass Accompagnement",
            prix: "1 497 € une fois, ou 3 × 499 € sans frais avec Klarna",
            contenu:
              "Tout le Pass Mastery, 3 séances individuelles d'une heure en visio, un audit de vos consignes et un accès direct par email pendant 90 jours. Places limitées chaque mois.",
            href: "/tarifs#accompagnement",
          },
        ]
      : []),
  ];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "Article"],
    "@id": `${SITE_URL}${PATH}#page`,
    headline: "Formation IA pour indépendants et TPE : Claude, sans technique",
    description: metadata.description,
    url: `${SITE_URL}${PATH}`,
    inLanguage: "fr-FR",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": ORG_ID },
    author: {
      "@type": "Person",
      name: "Alexandre Dos Reis Caetano",
      url: `${SITE_URL}/a-propos`,
    },
    image: `${SITE_URL}/og.png`,
    datePublished: DATE_ISO,
    dateModified: DATE_ISO,
    audience: {
      "@type": "Audience",
      audienceType: "Indépendants, artisans, commerçants et dirigeants de TPE",
    },
    about: [
      { "@type": "Thing", name: "Formation à l'intelligence artificielle" },
      { "@type": "Thing", name: "Très petites entreprises" },
      { "@type": "Thing", name: "Travailleurs indépendants" },
      { "@type": "Thing", name: "Claude (Anthropic)" },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(articleJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqJsonLd)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            // Mêmes libellés que le fil d'Ariane visible : Google attend le
            // texte affiché dans `name`.
            { name: "Accueil", path: "/" },
            { name: "Formation IA", path: "/formation-intelligence-artificielle" },
            { name: "Indépendants et TPE", path: PATH },
          ]),
        )}
      />

      {/* ---------------------------------------------------------------- */}
      {/* Hero : la réponse courte en tête, citable seule.                  */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden pt-16 pb-14 md:pt-24 md:pb-16">
        <div
          aria-hidden="true"
          className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(242,213,199,0.9), transparent 70%)" }}
        />
        <Container size="narrow">
          <nav className="mb-5 text-[13px] text-muted" aria-label="Fil d’Ariane">
            <Link href="/" className="transition-colors hover:text-coral">
              Accueil
            </Link>
            <span className="mx-2 text-line">/</span>
            <Link href="/formation-intelligence-artificielle" className="transition-colors hover:text-coral">
              Formation IA
            </Link>
            <span className="mx-2 text-line">/</span>
            <span>Indépendants et TPE</span>
          </nav>

          <Eyebrow>Formation IA · Indépendants et TPE · Mis à jour le {DATE_MAJ}</Eyebrow>

          <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.025em] text-ink">
            Formation IA pour indépendants et TPE :{" "}
            <span className="accent-serif">Claude, sans technique</span>.
          </h1>

          <div className="mt-8 rounded-[18px] border-l-[3px] border-coral bg-cream-soft p-7">
            <p className="text-lg leading-relaxed text-ink">
              <strong>
                ClaudeAI Academy est une formation en ligne, en français, qui apprend aux
                indépendants et aux petites entreprises à confier à Claude les écrits du
                quotidien : réponse à un client mécontent, relance de facture, compte rendu,
                fiche de poste, procédure.
              </strong>{" "}
              Aucune ligne de code : vous décrivez votre activité, vous formulez la demande,
              vous relisez avant d’envoyer. Paiement unique dès 47 €, accès à vie, garantie
              14 jours.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/tarifs" variant="primary" size="lg">
              Voir les formules, dès 47 €
            </Button>
            <Button href={LECON_EXCEL} variant="ghost" size="lg">
              Lire la leçon libre Excel
            </Button>
          </div>

          <p className="mt-6 text-[14px] text-muted">
            {stats.courseCount} parcours, {stats.lessonCount} leçons, {PROMPT_COUNT} prompts prêts à
            copier. Contenu vérifié au {CONTENU_A_JOUR_AU}, mises à jour incluses.
          </p>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Pour qui : les 4 profils et le chemin « 3 leçons, 60 minutes »,    */}
      {/* lus depuis le même composant que l'accueil (titres en base).      */}
      {/* ---------------------------------------------------------------- */}
      <Profiles />

      {/* ---------------------------------------------------------------- */}
      {/* Tableau citable : tâche, temps à la main, temps avec Claude, et   */}
      {/* la leçon ou le prompt qui l'enseigne. Tout vient de mesures.ts.    */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-white py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Tâches du quotidien</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Dix tâches d’une petite entreprise, à la main puis avec Claude, et où chacune
            s’apprend.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Les temps « avec Claude » comprennent l’écriture de la demande et la relecture du
            résultat, dans une conversation vierge. Chaque ligne renvoie à la leçon ou au prompt
            de la formation qui couvre cette tâche.
          </p>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b-2 border-ink">
                  <th className="py-3 pr-4 font-semibold text-ink">Tâche</th>
                  <th className="py-3 pr-4 font-semibold text-ink whitespace-nowrap">À la main</th>
                  <th className="py-3 pr-4 font-semibold text-ink whitespace-nowrap">Avec Claude</th>
                  <th className="py-3 font-semibold text-ink">Leçon ou prompt</th>
                </tr>
              </thead>
              <tbody>
                {lignes.map((m) => {
                  const e = ENSEIGNE[m.id];
                  return (
                    <tr key={m.id} className="border-b border-line align-top">
                      <td className="py-4 pr-4 font-semibold text-ink">{m.tache}</td>
                      <td className="py-4 pr-4 whitespace-nowrap text-muted">
                        <span className="line-through decoration-muted/60">{duree(m.sans)}</span>
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap font-semibold text-coral-dark">
                        {duree(m.avec)}
                      </td>
                      <td className="py-4 text-muted">
                        {e ? <EnseigneCell e={e} /> : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-6 border-t-2 border-ink pt-5 font-serif text-lg font-medium text-ink md:text-xl">
            Sur les {MESURES.length} tâches mesurées : {duree(totalSans)} à la main,{" "}
            {duree(totalAvec)} avec Claude.
          </p>

          <p className="mt-5 text-[14px] leading-relaxed text-muted">
            Source : temps mesurés par le fondateur le {MESURES_DATE} ; temps à la main
            chronométrés auparavant. Ce sont les temps d’un utilisateur quotidien depuis des
            mois ; les vôtres dépendront de votre pratique. Sur des tâches de rédaction, une
            étude publiée dans Science mesure en moyenne 40 % de temps en moins avec l’IA (
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

          <div className="mt-10 rounded-[18px] border border-line bg-cream-soft p-7">
            <h3 className="font-serif text-xl font-medium text-ink">Si vous tenez un restaurant</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              Le fondateur dirige un restaurant : les quatre dernières lignes du tableau viennent
              de là. La fiche technique chiffrée d’un plat et les prix de la carte après une hausse
              fournisseur se font dans Excel, avec Claude qui lit le classeur et recalcule sans
              casser les formules : c’est l’objet du guide{" "}
              <Link href="/claude-excel-powerpoint" className="font-semibold text-coral hover:text-coral-dark">
                Claude dans Excel, PowerPoint, Word et Chrome
              </Link>{" "}
              et de sa leçon en accès libre. La réponse à un avis Google et les descriptions de plats s’écrivent dans le ton de
              la maison une fois que Claude le connaît : c’est ce qu’apprend la leçon{" "}
              <span className="font-semibold text-ink">Personnaliser Claude</span>, dès le Pass
              Starter.
            </p>
          </div>
        </Container>
      </section>

      <Founder />

      {/* ---------------------------------------------------------------- */}
      {/* Ce que la formation ne fait pas : le périmètre annoncé est le      */}
      {/* premier indicateur de sérieux.                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-line bg-cream-soft py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Périmètre</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Ce que la formation ne fait pas.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Autant le dire avant que vous payiez.
          </p>

          <ol className="mt-10 space-y-8">
            {neFaitPas.map((c, i) => (
              <li key={c.titre} className="flex gap-5">
                <span className="font-serif text-3xl font-medium leading-none text-coral">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-serif text-xl font-medium text-ink">{c.titre}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{c.texte}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Combien ça coûte : deux pass, un paiement, pas d'abonnement.       */}
      {/* ---------------------------------------------------------------- */}
      <section className="py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Combien ça coûte</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Un paiement, pas d’abonnement, et 14 jours pour changer d’avis.
          </h2>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b-2 border-ink">
                  <th className="py-3 pr-4 font-semibold text-ink">Pass</th>
                  <th className="py-3 pr-4 font-semibold text-ink">Prix</th>
                  <th className="py-3 font-semibold text-ink">Ce que vous avez</th>
                </tr>
              </thead>
              <tbody>
                {passes.map((p) => (
                  <tr key={p.nom} className="border-b border-line align-top">
                    <td className="py-4 pr-4 font-semibold text-ink whitespace-nowrap">
                      <Link href={p.href} className="hover:text-coral">
                        {p.nom}
                      </Link>
                    </td>
                    <td className="py-4 pr-4 text-ink">{p.prix}</td>
                    <td className="py-4 text-muted">{p.contenu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-[14px] leading-relaxed text-muted">
            Garantie 14 jours satisfait ou remboursé sur chaque pass. TVA non applicable,
            article 293 B du CGI. Facture professionnelle générée automatiquement. Pas de CPF ni
            d’OPCO. Paiement par carte, Apple Pay, Google Pay ou Klarna via Stripe.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/tarifs" variant="primary" size="lg">
              Voir le détail des formules
            </Button>
            <Button href="/kit?src=page-tpe" variant="ghost" size="lg">
              Le kit gratuit, 15 prompts
            </Button>
          </div>
        </Container>
      </section>

      <Guarantee />

      {/* ---------------------------------------------------------------- */}
      {/* FAQ : miroir exact du schema FAQPage ci-dessus.                    */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-line py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Questions fréquentes</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Formation IA pour une TPE : ce qu’on nous demande.
          </h2>

          <dl className="mt-10 divide-y divide-line border-y border-line">
            {faq.map((item) => (
              <div key={item.q} className="py-7">
                <dt className="font-serif text-xl font-medium leading-snug text-ink">{item.q}</dt>
                <dd className="mt-3 leading-relaxed text-muted">
                  {item.a}
                  {item.lien ? (
                    <>
                      {" "}
                      <Link
                        href={item.lien.href}
                        className="font-semibold text-coral hover:text-coral-dark"
                      >
                        {item.lien.label}
                      </Link>
                      .
                    </>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 text-[15px] text-muted">
            Pour aller plus loin :{" "}
            <Link
              href="/formation-intelligence-artificielle"
              className="font-semibold text-coral hover:text-coral-dark"
            >
              choisir une formation en intelligence artificielle
            </Link>{" "}
            ·{" "}
            <Link href="/claude-vs-chatgpt" className="font-semibold text-coral hover:text-coral-dark">
              Claude ou ChatGPT
            </Link>{" "}
            ·{" "}
            <Link
              href="/claude-excel-powerpoint"
              className="font-semibold text-coral hover:text-coral-dark"
            >
              Claude dans Excel, PowerPoint, Word et Chrome
            </Link>
            .
          </p>

          <p className="mt-4 text-[15px] text-muted">
            D’autres questions ? La{" "}
            <Link href="/faq" className="font-semibold text-coral hover:text-coral-dark">
              FAQ complète
            </Link>{" "}
            couvre l’accès, la facturation et le remboursement, et vous pouvez toujours{" "}
            <Link href="/contact" className="font-semibold text-coral hover:text-coral-dark">
              nous écrire
            </Link>
            .
          </p>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section className="bg-ink py-16 text-cream md:py-24">
        <Container size="narrow">
          <h2 className="font-serif text-3xl font-medium leading-[1.2] tracking-tight md:text-[2.5rem]">
            Commencez par la leçon en accès libre. Décidez ensuite.
          </h2>
          <p className="mt-5 max-w-[620px] text-lg leading-relaxed text-cream/70">
            La leçon « Claude là où tu travailles déjà » se lit en 22 minutes, sans carte
            bancaire. Si la méthode vous convient, le Pass Starter coûte 47 €, le Pass Mastery
            497 €, et vous avez 14 jours pour changer d’avis.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/tarifs" variant="primary" size="lg">
              Voir les formules, dès 47 €
            </Button>
            <Button href={LECON_EXCEL} variant="ghost-light" size="lg">
              Lire la leçon libre Excel
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

function EnseigneCell({ e }: { e: Enseigne }) {
  const nature = e.kind === "lecon" ? "leçon" : "prompt";
  const acces =
    e.kind === "lecon"
      ? e.gratuit
        ? "en accès libre"
        : "dès le Pass Starter"
      : e.gratuit
        ? "gratuit"
        : "Pass Mastery";
  return (
    <>
      {e.href ? (
        <Link href={e.href} className="font-semibold text-ink hover:text-coral">
          {e.titre}
        </Link>
      ) : (
        <span className="font-semibold text-ink">{e.titre}</span>
      )}
      <span className="mt-1 block text-[13px] text-muted">
        {nature}, {acces}
      </span>
    </>
  );
}
