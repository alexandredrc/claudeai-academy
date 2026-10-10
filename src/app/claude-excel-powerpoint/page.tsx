import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { SITE_URL, ORG_ID, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo/jsonld";

// Satellite du pilier /formation-intelligence-artificielle, côté usage au
// bureau. Requêtes visées : « claude excel », « claude pour excel », « claude
// dans excel », « claude powerpoint », « claude word », « claude outlook »,
// « claude in chrome », « extension chrome claude ». Au 9 octobre 2026,
// Claude for Microsoft 365 (Excel, PowerPoint, Word) est disponible sur tous
// les plans payants et Claude for Outlook est en bêta ; les tutoriels officiels
// d'Anthropic sur ces sujets n'existent qu'en anglais.
//
// Page-guide : ce qu'il faut installer, ce que chaque add-in fait et refuse,
// les deux risques (fichier piégé, site piégé), et la leçon gratuite du
// parcours Bien démarrer qui déroule tout ça pas à pas.

const LECON = "/courses/bien-demarrer-avec-claude/claude-dans-excel-powerpoint-word-et-chrome";
const DATE = "9 octobre 2026";

export const metadata: Metadata = {
  title: "Claude dans Excel, PowerPoint, Word et Chrome : installer, utiliser, éviter les pièges",
  description:
    "Claude for Microsoft 365 est inclus dans tous les plans payants Claude : un add-in pour Excel, PowerPoint, Word et Outlook, plus l'extension Claude in Chrome. Ce qu'il faut installer, ce que chaque outil fait et refuse, les deux risques à connaître. Vérifié le 9 octobre 2026.",
  alternates: { canonical: "/claude-excel-powerpoint" },
  keywords: [
    "claude excel",
    "claude pour excel",
    "claude dans excel",
    "claude for excel",
    "claude powerpoint",
    "claude word",
    "claude outlook",
    "claude for microsoft 365",
    "claude in chrome",
    "extension chrome claude",
  ],
  openGraph: {
    title: "Claude dans Excel, PowerPoint, Word et Chrome : le guide",
    description:
      "Un add-in pour Excel, PowerPoint, Word et Outlook, une extension pour Chrome, inclus dans les plans payants. Installer, utiliser, éviter les pièges.",
    url: "/claude-excel-powerpoint",
    type: "article",
  },
};

const outils = [
  {
    nom: "Claude for Excel",
    statut: "Disponible, tous plans payants",
    fait: "Répond sur ton classeur en citant la cellule, change une hypothèse sans casser les formules, remonte à la cause d'un #REF! ou d'un #DIV/0, construit ou remplit un modèle sur plusieurs onglets, trie, filtre, modifie un tableau croisé, pose une mise en forme conditionnelle.",
    refuse: "Les tables de données (analyses de scénarios) et les macros VBA. Et il prévient avant d'écraser des données existantes.",
  },
  {
    nom: "Claude for PowerPoint",
    statut: "Disponible, tous plans payants",
    fait: "Lit le masque, les dispositions, les polices et les couleurs de ta présentation et s'en sert. Retouche une seule diapositive, construit une section ou un deck complet, transforme des puces en schéma ou en graphique natif modifiable.",
    refuse: "Rien de bloquant côté fonctions ; la documentation rappelle qu'il ne remplace pas ton jugement sur le fil narratif et le design.",
  },
  {
    nom: "Claude for Word",
    statut: "Disponible, tous plans payants",
    fait: "Répond en citant la section, modifie une sélection en gardant styles et numérotation, travaille en suivi des modifications, traite les commentaires un par un, résume les modifications d'une contrepartie, remplit un gabarit dans ses styles.",
    refuse: "Les vieux fichiers .doc : à enregistrer en .docx d'abord.",
  },
  {
    nom: "Claude for Outlook",
    statut: "Bêta, tous plans payants",
    fait: "Trie la boîte en trois tas, rédige des brouillons dans ton ton (appris de tes envoyés), lit les pièces jointes Word et Excel sans les ouvrir, résume un fil en citant chaque email, cherche un créneau dans les agendas.",
    refuse: "Envoyer. L'add-in ne demande pas la permission d'envoi : chaque brouillon atterrit non envoyé, et c'est toi qui cliques.",
  },
  {
    nom: "Claude in Chrome",
    statut: "Tous plans payants, Chrome uniquement",
    fait: "Lit la page, clique, tape, remplit des formulaires, navigue dans les onglets que tu lui confies, enregistre des raccourcis relancés avec « / » et programmés chaque jour, semaine ou mois. Sur Max et Team, le panneau est une session Cowork synchronisée.",
    refuse: "Transactions boursières, contournement de captcha, saisie de données sensibles, collecte de visages. Sites adultes et de piratage bloqués. Permission demandée avant un site financier.",
  },
];

const installation = [
  "Ouvrir la fiche « Claude for Microsoft 365 » sur Microsoft AppSource et cliquer « Get it now ». Pour Outlook, la fiche s'appelle « Claude for Outlook ».",
  "Ouvrir Excel, PowerPoint ou Word, activer le complément (Accueil → Compléments sur Windows, Outils → Compléments sur Mac) et se connecter avec son compte Claude.",
  "Vérifier la version : web, ou Windows avec Microsoft 365 (build 16.0.13127.20296 ou plus récent, version 2205 pour Word), ou Mac 16.46 et plus (16.61 pour Word). Les éditions perpétuelles 2016 et 2019, l'iPad et Android ne sont pas pris en charge.",
  "Remplir le champ Instructions du panneau avec ses conventions de format : il s'applique à toutes les conversations dans cette application, et seulement celle-là.",
  "Pour Chrome : installer l'extension depuis le Chrome Web Store, l'épingler, accorder les permissions, et créer un profil Chrome séparé sans banque, santé ni administration.",
];

const faq = [
  {
    q: "Claude dans Excel, c'est payant ?",
    a: "C'est inclus dans les plans payants Claude : Pro, Max, Team et Enterprise. Pas de licence à part, pas d'abonnement supplémentaire. L'usage compte dans les limites de ton plan, comme une conversation dans l'application. Le plan gratuit n'y a pas accès. Vérifié sur la documentation officielle le 9 octobre 2026.",
  },
  {
    q: "Comment installer Claude dans Excel ou PowerPoint ?",
    a: "Un seul complément couvre Excel, PowerPoint et Word : la fiche « Claude for Microsoft 365 » sur Microsoft AppSource, bouton « Get it now », puis Accueil → Compléments (Windows) ou Outils → Compléments (Mac) dans l'application, et connexion avec ton compte Claude. Outlook a sa propre fiche. Dans une entreprise, l'administrateur peut déployer le complément pour tout le monde depuis le centre d'administration Microsoft 365.",
  },
  {
    q: "Claude peut-il casser mes formules Excel ?",
    a: "C'est précisément ce qu'il est conçu pour ne pas faire : il modifie des valeurs en gardant les relations entre cellules, et il prévient avant d'écraser des données. Il ne gère pas les tables de données ni les macros VBA. La bonne pratique, écrite dans la documentation d'Anthropic : travailler sur une copie, relire chaque cellule changée, et ne jamais livrer un calcul d'audit sans vérification humaine.",
  },
  {
    q: "Claude for Outlook peut-il envoyer des emails à ma place ?",
    a: "Non. Le complément ne demande pas la permission d'envoi à Microsoft : il rédige, trie, résume, mais chaque brouillon et chaque invitation atterrissent non envoyés dans la fenêtre d'Outlook. C'est toi qui cliques sur Envoyer. Claude for Outlook est en bêta au 9 octobre 2026 et exige une boîte Exchange Online.",
  },
  {
    q: "Quel est le risque avec un fichier Excel ou Word reçu de l'extérieur ?",
    a: "L'injection de prompt : un modèle téléchargé, un fichier fournisseur ou un document reçu par email peut contenir des instructions cachées (texte blanc sur blanc, commentaire, en-tête) qui tentent de faire extraire, modifier ou supprimer des données. Anthropic écrit que ses tests ont montré que ça peut marcher, et recommande de n'utiliser les compléments qu'avec des fichiers de confiance. Claude demande confirmation avant une opération risquée : il faut lire ces confirmations.",
  },
  {
    q: "Claude in Chrome voit-il mes mots de passe et mes comptes bancaires ?",
    a: "Il travaille par captures d'écran des onglets qu'on lui confie : tout ce qui y est affiché entre dans la conversation, et il ne peut pas filtrer ce qui est sensible. La documentation de sécurité recommande un profil Chrome séparé, sans banque, santé ni administration, et interdit les transactions financières, le contournement de captcha et la saisie de données sensibles. Il demande la permission avant d'ouvrir un site financier, et bloque les sites adultes et de piratage.",
  },
  {
    q: "Claude dans Excel ou Claude Code : lequel choisir ?",
    a: "Le complément Excel voit le fichier ouvert et agit dedans, avec relecture dans Excel : parfait pour une question, une correction, une hypothèse à changer. Claude Code voit tout un dossier, lit tes fichiers et tes factures, recalcule et peut tourner en tâche planifiée : c'est l'outil quand la même opération revient chaque semaine sur plusieurs fichiers. La leçon gratuite ci-dessous donne le tableau de décision complet.",
  },
];

export default function ClaudeExcelPowerPointPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "Article"],
    "@id": `${SITE_URL}/claude-excel-powerpoint#page`,
    headline: "Claude dans Excel, PowerPoint, Word et Chrome : installer, utiliser, éviter les pièges",
    description: metadata.description,
    url: `${SITE_URL}/claude-excel-powerpoint`,
    inLanguage: "fr-FR",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": ORG_ID },
    author: {
      "@type": "Person",
      name: "Alexandre Dos Reis Caetano",
      url: `${SITE_URL}/a-propos`,
    },
    dateModified: "2026-10-09",
    about: [
      { "@type": "Thing", name: "Claude for Microsoft 365" },
      { "@type": "Thing", name: "Claude in Chrome" },
      { "@type": "Thing", name: "Claude (Anthropic)" },
    ],
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Installer Claude dans Excel, PowerPoint, Word et Chrome",
    description: "Les cinq étapes, du complément Microsoft 365 au profil Chrome séparé.",
    inLanguage: "fr-FR",
    totalTime: "PT15M",
    step: installation.map((texte, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: `Étape ${i + 1}`,
      text: texte,
      url: `${SITE_URL}/claude-excel-powerpoint#etape-${i + 1}`,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(articleJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(howToJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqJsonLd)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Formation intelligence artificielle", path: "/formation-intelligence-artificielle" },
            { name: "Claude dans Excel, PowerPoint et Chrome", path: "/claude-excel-powerpoint" },
          ]),
        )}
      />

      <section className="relative overflow-hidden pt-16 pb-14 md:pt-24 md:pb-16">
        <div
          aria-hidden="true"
          className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(242,213,199,0.9), transparent 70%)" }}
        />
        <Container size="narrow">
          <nav className="mb-5 text-[13px] text-muted" aria-label="Fil d’Ariane">
            <Link href="/" className="transition-colors hover:text-coral">Accueil</Link>
            <span className="mx-2 text-line">/</span>
            <Link href="/formation-intelligence-artificielle" className="transition-colors hover:text-coral">Formation IA</Link>
            <span className="mx-2 text-line">/</span>
            <span>Claude dans Excel, PowerPoint et Chrome</span>
          </nav>

          <Eyebrow>Guide · Claude au bureau</Eyebrow>

          <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.025em] text-ink">
            Claude dans Excel, PowerPoint, Word et Chrome :{" "}
            <span className="accent-serif">ce qui est inclus</span>, ce que ça fait, ce que ça refuse.
          </h1>

          <div className="mt-8 rounded-[18px] border-l-[3px] border-coral bg-cream-soft p-7">
            <p className="text-lg leading-relaxed text-ink">
              <strong>En une phrase :</strong> si vous avez un plan Claude payant (Pro, Max, Team ou
              Enterprise), vous avez déjà Claude dans Excel, PowerPoint, Word et Outlook, et dans Chrome.
              Il n’y a rien à acheter de plus. Il y a un complément à installer, quelques règles à connaître,
              et deux risques à prendre au sérieux.
            </p>
          </div>

          <p className="mt-8 text-lg leading-relaxed text-muted">
            Tout ce qui suit vient de la documentation officielle d’Anthropic (claude.com/docs/office-agents
            et le centre d’aide), relue le {DATE}. Les tutoriels officiels sur ces sujets n’existent qu’en
            anglais ; cette page et la leçon gratuite qui l’accompagne les déroulent en français, avec les
            exemples d’un directeur de restaurant qui s’en sert tous les jours.
          </p>
        </Container>
      </section>

      <section className="border-y border-line bg-cream-soft py-16 md:py-20">
        <Container size="narrow">
          <Eyebrow>Cinq outils, un compte</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Un complément pour Office, une extension pour Chrome. Chacun voit une chose, et une seule.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Le complément Office voit le fichier ouvert. L’extension Chrome voit les onglets que vous lui
            confiez. C’est ce périmètre qui dit ce que chaque outil fait bien, et où il faut relire.
          </p>

          <div className="mt-10 flex flex-col gap-5">
            {outils.map((o, i) => (
              <article key={o.nom} className="rounded-[18px] border border-line bg-white p-7">
                <div className="flex gap-4">
                  <span className="font-serif text-2xl font-medium leading-none text-coral">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-serif text-xl font-semibold text-ink">{o.nom}</h3>
                    <p className="mt-1 text-[13px] font-mono text-muted">{o.statut}</p>
                    <p className="mt-3 leading-relaxed text-ink-soft">{o.fait}</p>
                    <p className="mt-3 border-l-2 border-coral-soft bg-cream-soft py-2 pl-4 pr-3 text-[15px] leading-relaxed text-ink">
                      <span className="font-semibold">Ce qu’il refuse : </span>
                      {o.refuse}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Installer</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Quinze minutes, cinq étapes, et une qui compte plus que les autres.
          </h2>
          <ol className="mt-10 space-y-5">
            {installation.map((texte, i) => (
              <li key={texte} id={`etape-${i + 1}`} className="flex gap-4 scroll-mt-24">
                <span className="font-serif text-2xl font-medium leading-none text-coral">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="leading-relaxed text-ink-soft">{texte}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-[18px] border border-line bg-white p-7">
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
                Le fichier piégé
              </span>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                Un modèle téléchargé, un fichier fournisseur, un document reçu par email peut contenir des
                instructions cachées qui tentent de détourner Claude : extraire des données, modifier un
                chiffre, supprimer. Anthropic écrit que ses tests ont montré que ça peut marcher. Règle :
                fichiers de confiance seulement, copie de travail, et lecture attentive de chaque
                confirmation que Claude demande.
              </p>
            </div>
            <div className="rounded-[18px] border-[1.5px] border-coral bg-white p-7">
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-coral">
                Le site piégé
              </span>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                Dans Chrome, une page peut contenir du texte invisible qui s’adresse à Claude. Deux
                classifieurs filtrent le contenu et chaque action, mais le risque n’est pas nul. Règle : un
                profil Chrome séparé sans comptes sensibles, l’approbation manuelle sur un site nouveau, et
                arrêter la tâche dès que Claude change de sujet, ouvre un site inattendu ou demande une
                information sensible.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-cream-soft py-16 md:py-24">
        <Container size="narrow">
          <h2 className="font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            La leçon complète est en accès libre : Excel, PowerPoint, Word, Outlook et Chrome, pas à pas.
          </h2>
          <p className="mt-5 max-w-[620px] text-lg leading-relaxed text-muted">
            Neuvième leçon du parcours « Bien démarrer avec Claude » : les versions prises en charge, le
            champ Instructions, les prompts pour recalculer un coût matière sans casser un classeur ou
            construire une offre de groupe dans son modèle PowerPoint, le tableau « quel outil pour quelle
            tâche », et un défi de trente minutes sur un vrai fichier. Vérifiée le {DATE}.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={LECON} variant="primary" size="lg">
              Lire la leçon gratuite
            </Button>
            <Button href="/kit?src=guide-excel" variant="ghost" size="lg">
              Le kit gratuit, 15 prompts
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Questions fréquentes</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Claude dans Excel et PowerPoint : ce qu’on nous demande.
          </h2>
          <dl className="mt-10 divide-y divide-line border-y border-line">
            {faq.map((item) => (
              <div key={item.q} className="py-7">
                <dt className="font-serif text-xl font-medium leading-snug text-ink">{item.q}</dt>
                <dd className="mt-3 leading-relaxed text-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-[15px] text-muted">
            À lire ensuite :{" "}
            <Link href="/claude-cowork" className="font-semibold text-coral hover:text-coral-dark">
              Claude Cowork et le chat, un seul Claude
            </Link>{" "}
            ·{" "}
            <Link href="/formation-claude-code" className="font-semibold text-coral hover:text-coral-dark">
              la formation Claude Code
            </Link>{" "}
            ·{" "}
            <Link href="/claude-ai-gratuit" className="font-semibold text-coral hover:text-coral-dark">
              Claude gratuit ou Pro
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
