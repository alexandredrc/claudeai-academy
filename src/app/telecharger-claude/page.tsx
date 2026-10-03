import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { SITE_URL, ORG_ID, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo/jsonld";

// Page d'entrée. Requêtes visées : « télécharger claude ai », « télécharger
// claude ai gratuit », « claude ai pc », « claude ai app », « claude windows ».
// Google Trends FR, 12 mois au 02/10/2026 : « telecharger claude ai gratuit »
// +1 450 %, « télécharger claude ai gratuit pour pc » +450 %, « claude ai app »
// indice 25. Beaucoup de ces visiteurs cherchent un installeur sur un site
// tiers : la seule adresse sûre est celle d'Anthropic, et c'est la première
// chose que la page dit.
//
// Plateformes relevées sur claude.com/download le 3 octobre 2026.

export const metadata: Metadata = {
  title: "Télécharger Claude sur PC, Mac et mobile : la seule adresse sûre",
  description:
    "Claude se télécharge gratuitement sur Windows, macOS, Linux (bêta), iPhone et Android, uniquement depuis claude.com/download ou les boutiques officielles. Ce que l'application de bureau ajoute par rapport au navigateur, et comment démarrer sans carte bancaire. Relevé le 3 octobre 2026.",
  alternates: { canonical: "/telecharger-claude" },
  keywords: [
    "télécharger claude ai",
    "télécharger claude ai gratuit",
    "claude ai pc",
    "claude ai windows",
    "claude ai app",
    "claude ai mac",
    "installer claude",
  ],
  openGraph: {
    title: "Télécharger Claude sur PC, Mac et mobile",
    description:
      "La seule adresse sûre, les plateformes disponibles, et ce que l'application ajoute. Relevé le 3 octobre 2026.",
    url: "/telecharger-claude",
    type: "article",
  },
};

const plateformes = [
  { nom: "Windows", detail: "Application de bureau, versions x64 et arm64" },
  { nom: "macOS", detail: "Application de bureau" },
  { nom: "Linux", detail: "Ubuntu et Debian, en bêta, x64 et arm64" },
  { nom: "iPhone et iPad", detail: "Depuis l'App Store d'Apple" },
  { nom: "Android", detail: "Depuis Google Play" },
  { nom: "Navigateur Chrome", detail: "Extension Claude dans Chrome, réservée aux plans payants" },
  { nom: "Microsoft 365", detail: "Compléments Excel, PowerPoint, Word et Outlook (bêta), plans payants" },
  { nom: "Slack", detail: "Application Claude pour Slack" },
];

const etapes = [
  {
    titre: "Allez sur claude.com/download, et nulle part ailleurs",
    texte:
      "C'est la page officielle d'Anthropic, qui renvoie vers les installeurs de bureau et les boutiques Apple et Google. Un installeur « Claude » proposé par un site tiers, un dépôt de logiciels inconnu ou une publicité est un risque, jamais une commodité : vous y installeriez un programme qui lit tout ce que vous tapez.",
  },
  {
    titre: "Créez un compte gratuit",
    texte:
      "Une adresse e-mail suffit, aucune carte bancaire n'est demandée. Les applications sont disponibles pour tous les plans, Free compris ; seules certaines fonctions sont réservées aux plans payants.",
  },
  {
    titre: "Choisissez entre l'application et le navigateur",
    texte:
      "Le navigateur donne accès à tout l'essentiel. L'application de bureau ajoute l'accès à vos fichiers et à vos applications pour exécuter des tâches, et c'est aussi là que vit l'onglet Code de Claude Code sur les plans payants. Sur mobile, l'application ajoute le mode vocal et les notifications.",
  },
  {
    titre: "Faites un premier test qui prouve quelque chose",
    texte:
      "Pas « bonjour, qui es-tu ? ». Collez un vrai document de votre travail et demandez un résumé en cinq points avec, entre crochets, tout ce dont le modèle n'est pas sûr. Vous verrez en deux minutes si l'outil vous est utile.",
  },
];

const faq = [
  {
    q: "Claude est-il téléchargeable gratuitement ?",
    a: "Oui. Les applications de bureau (Windows, macOS, Linux en bêta) et mobiles (iOS, Android) sont disponibles pour tous les plans, y compris le plan gratuit, qui ne demande pas de carte bancaire. Anthropic précise que certaines fonctions sont réservées aux plans payants. Relevé sur claude.com/download le 3 octobre 2026.",
  },
  {
    q: "Où télécharger Claude pour PC sans risque ?",
    a: "Uniquement depuis claude.com/download. Les requêtes « télécharger claude ai gratuit pour pc » attirent des sites qui redistribuent des installeurs modifiés. Un assistant IA lit tout ce que vous lui donnez : la provenance de l'installeur est la seule chose que vous ne pouvez pas rattraper après coup.",
  },
  {
    q: "Quelle différence entre l'application de bureau et claude.ai dans le navigateur ?",
    a: "Le même compte, les mêmes conversations, les mêmes projets. L'application de bureau peut en plus travailler avec vos fichiers et vos applications pour exécuter des tâches, et elle héberge l'onglet Code de Claude Code sur les plans payants. Depuis le 16 septembre 2026, le chat et l'ancien Cowork sont un seul Claude, dans l'application comme dans le navigateur.",
  },
  {
    q: "Claude existe-t-il en français ?",
    a: "L'interface et les modèles fonctionnent en français. La documentation officielle et les cours gratuits d'Anthropic sont en anglais ; c'est précisément l'écart que cette académie comble, avec des parcours en français vérifiés à chaque évolution du produit.",
  },
  {
    q: "Faut-il un ordinateur puissant ?",
    a: "Non. Les modèles tournent sur les serveurs d'Anthropic, pas sur votre machine. L'application de bureau est un client : tout ordinateur récent sous Windows, macOS ou Linux convient. Anthropic renvoie à son centre d'aide pour les prérequis détaillés.",
  },
];

export default function TelechargerClaudePage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "Article"],
    "@id": `${SITE_URL}/telecharger-claude#page`,
    headline: "Télécharger Claude sur PC, Mac et mobile : la seule adresse sûre",
    description: metadata.description,
    url: `${SITE_URL}/telecharger-claude`,
    inLanguage: "fr-FR",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": ORG_ID },
    author: {
      "@type": "Person",
      name: "Alexandre Dos Reis Caetano",
      url: `${SITE_URL}/a-propos`,
    },
    dateModified: "2026-10-03",
    about: [{ "@type": "Thing", name: "Claude (Anthropic)" }],
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Installer Claude et faire un premier test utile",
    inLanguage: "fr-FR",
    totalTime: "PT10M",
    step: etapes.map((m, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: m.titre,
      text: m.texte,
      url: `${SITE_URL}/telecharger-claude#etape-${i + 1}`,
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
            { name: "FAQ", path: "/faq" },
            { name: "Télécharger Claude", path: "/telecharger-claude" },
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
            <Link href="/faq" className="transition-colors hover:text-coral">
              FAQ
            </Link>
            <span className="mx-2 text-line">/</span>
            <span>Télécharger Claude</span>
          </nav>

          <Eyebrow>Guide · Relevé le 3 octobre 2026</Eyebrow>

          <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.025em] text-ink">
            Télécharger Claude : une seule adresse, et c’est{" "}
            <span className="accent-serif">gratuit</span>.
          </h1>

          <div className="mt-8 rounded-[18px] border-l-[3px] border-coral bg-cream-soft p-7">
            <p className="text-lg leading-relaxed text-ink">
              <strong>Réponse courte :</strong> Claude se télécharge depuis{" "}
              <a
                href="https://claude.com/download"
                rel="noopener"
                className="font-semibold underline decoration-coral underline-offset-4 hover:text-coral"
              >
                claude.com/download
              </a>{" "}
              pour Windows, macOS et Linux (bêta), et depuis l’App Store ou
              Google Play sur mobile. Les applications sont disponibles pour
              tous les plans, gratuit compris, sans carte bancaire. Tout
              installeur proposé ailleurs est à refuser.
            </p>
          </div>

          <p className="mt-8 text-lg leading-relaxed text-muted">
            Nous ne distribuons pas Claude et n’avons aucun lien avec Anthropic.
            Cette page existe parce que la recherche « télécharger claude ai
            gratuit » mène trop souvent vers des sites qui n’ont rien d’officiel.
          </p>
        </Container>
      </section>

      <section className="border-y border-line bg-cream-soft py-16 md:py-20">
        <Container size="narrow">
          <Eyebrow>Plateformes</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Où Claude s’installe, au 3 octobre 2026.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {plateformes.map((p) => (
              <div key={p.nom} className="rounded-[18px] border border-line bg-white p-6">
                <h3 className="font-serif text-xl font-medium text-ink">{p.nom}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>En quatre étapes</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Installer, puis faire un test qui prouve quelque chose.
          </h2>
          <ol className="mt-12 space-y-10">
            {etapes.map((m, i) => (
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
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-y border-line bg-cream-soft py-16 md:py-24">
        <Container size="narrow">
          <h2 className="font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Installé ? Voici quinze premiers prompts qui servent vraiment.
          </h2>
          <p className="mt-5 max-w-[620px] text-lg leading-relaxed text-muted">
            Le kit de démarrage, en français, classé par métier, qui fonctionne
            sur le plan gratuit.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/kit?src=guide-telecharger" variant="primary" size="lg">
              Recevoir le kit gratuit
            </Button>
            <Button href="/claude-ai-gratuit" variant="ghost" size="lg">
              Gratuit ou Pro, que choisir ?
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Questions fréquentes</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Télécharger Claude : ce qu’on nous demande.
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
            <Link href="/claude-ai-gratuit" className="font-semibold text-coral hover:text-coral-dark">
              Claude gratuit ou Pro
            </Link>{" "}
            ·{" "}
            <Link href="/claude-cowork" className="font-semibold text-coral hover:text-coral-dark">
              ce qu’est devenu Claude Cowork
            </Link>{" "}
            ·{" "}
            <Link href="/formation-claude-ai" className="font-semibold text-coral hover:text-coral-dark">
              la formation Claude AI
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
