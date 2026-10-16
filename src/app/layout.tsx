import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { PriceBar } from "@/components/site/price-bar";
import { Analytics } from "@vercel/analytics/next";
import { GoogleTag, GOOGLE_TAG_ENABLED } from "@/components/site/google-tag";
import { ConsentBanner } from "@/components/site/consent-banner";
import { AuthHashGuard } from "@/components/site/auth-hash-guard";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { EnHeader, EnFooter } from "@/components/site/en-chrome";
import { INSTAGRAM_URL } from "@/components/site/instagram";
import { annonceHausseMastery, maintenant, prixMastery } from "@/lib/offre/prix";

// Polices embarquées dans le dépôt (src/app/fonts) : avec next/font/google, le
// build téléchargeait les fichiers chez Google et échouait quand Google ne
// répondait pas (préversion du 16/10/2026, « Module not found » sur Inter).
// Ce sont, à l'octet près, les fichiers variables du sous-ensemble latin que
// la prod servait (Inter v20, Fraunces v38) : rendu identique, aucun réseau au
// build. Le code du site n'emploie aucun caractère hors de ce sous-ensemble
// (scan du 16/10).
const inter = localFont({
  variable: "--font-sans",
  src: [{ path: "./fonts/inter-latin.woff2", weight: "400 700", style: "normal" }],
  display: "swap",
});

const fraunces = localFont({
  variable: "--font-serif",
  src: [
    { path: "./fonts/fraunces-latin.woff2", weight: "500 600", style: "normal" },
    { path: "./fonts/fraunces-italic-latin.woff2", weight: "500 600", style: "italic" },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  // La requete « claude academy » pese 6 849 impressions par trimestre pour
  // 3,3 % de clics seulement : le titre ne reprenait pas le mot cherche, et
  // « | ClaudeAI Academy » tombait dans la troncature de Google. Le nom passe
  // donc en tete, et « en francais » porte le seul differenciateur reel face a
  // academy.claude.com, dont les cours sont gratuits mais en anglais.
  // 04/10/2026, Search Console 28 j : « formation claude » = 2 798 impressions,
  // position 5, CTR 2,9 % ; la page d'accueil porte 429 des 542 clics du site.
  // La requête commerciale passe donc en tête du titre, le nom reste visible.
  title: "Formation Claude AI en français, dès 47 € | ClaudeAI Academy",
  description:
    "La formation Claude AI en français, à votre rythme : bien démarrer, prompt engineering, Claude Code, data, marketing, stratégie. 9 parcours, 58 leçons, 170 prompts prêts à copier et un Mentor IA. Accès à vie dès 47 €, sans dossier CPF ni devis, garantie 14 jours.",
  metadataBase: new URL("https://www.claudeai-academy.com"),
  keywords: [
    "claude academy",
    "claude academy français",
    "claude academie",
    "formation Claude AI",
    "formation Claude AI en ligne",
    "formation Claude Anthropic",
    "apprendre Claude AI",
    "Claude AI en français",
    "comment utiliser Claude AI",
    "Claude AI tutoriel français",
    "formation prompt engineering Claude",
    "prompts Claude",
    "formation Claude Code",
    "formation IA en ligne",
    "maîtriser Claude",
    "IA générative entreprise",
  ],
  openGraph: {
    title: "Formation Claude AI en ligne, en français, dès 47 €",
    description:
      "La formation francophone pour maîtriser Claude AI en pratique : prompt engineering, Claude Code, data, marketing, stratégie. Mentor IA inclus. À votre rythme, dès 47 €.",
    type: "website",
    locale: "fr_FR",
    url: "https://www.claudeai-academy.com",
    siteName: "ClaudeAI Academy",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "ClaudeAI Academy, la formation francophone pour maîtriser Claude AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Formation Claude AI en ligne, en français, dès 47 €",
    description:
      "9 parcours, 58 leçons, 170 prompts et un Mentor IA pour maîtriser Claude AI en pratique. À votre rythme, sans CPF ni dossier.",
    images: ["/og.png"],
  },
};

// Compte Instagram de marque (le compte personnel du fondateur reste dans
// `instagram.tsx`, il porte le pied de page et l'en-tête). Les deux figurent
// dans `sameAs` : l'un prouve la personne, l'autre la marque.
const INSTAGRAM_ACADEMY_URL = "https://www.instagram.com/official_claude_ai_academy/";

// `EducationalOrganization` plutôt que `Organization` : c'est le type que
// Google et les moteurs génératifs relient aux requêtes « formation … ».
// `sameAs` et l'identité de l'éditeur alimentent l'E-E-A-T (Trust), sans
// quoi un site marchand récent reste une entité inconnue.
// Audit SEO du 15/10/2026 : logo carré (Google demande un carré lisible sur
// fond blanc, pas la bannière Open Graph), désambiguïsation face à « Claude
// Academy » d'Anthropic, politique de retour portée par l'organisation.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "Organization"],
  "@id": "https://www.claudeai-academy.com/#organization",
  name: "ClaudeAI Academy",
  alternateName: "Claude AI Academy",
  url: "https://www.claudeai-academy.com",
  logo: {
    "@type": "ImageObject",
    url: "https://www.claudeai-academy.com/logo-1024.png",
    width: 1024,
    height: 1024,
  },
  image: "https://www.claudeai-academy.com/og.png",
  email: "contact@claudeai-academy.com",
  inLanguage: "fr-FR",
  areaServed: ["FR", "BE", "CH", "LU", "CA"],
  knowsLanguage: "fr-FR",
  sameAs: [INSTAGRAM_URL, INSTAGRAM_ACADEMY_URL],
  founder: {
    "@type": "Person",
    "@id": "https://www.claudeai-academy.com/a-propos#alexandre-dos-reis-caetano",
    name: "Alexandre Dos Reis Caetano",
    // Même valeur que le ProfilePage de /a-propos : un seul @id, une seule
    // fonction déclarée.
    jobTitle: ["Restaurant Manager en Suisse", "Fondateur de ClaudeAI Academy"],
    url: "https://www.claudeai-academy.com/a-propos",
  },
  parentOrganization: { "@type": "Organization", name: "ADRC Group" },
  disambiguatingDescription:
    "Organisme de formation indépendant, non affilié à Anthropic PBC, l'entreprise qui édite Claude. Claude est une marque d'Anthropic PBC. À ne pas confondre avec Claude Academy, la plateforme d'Anthropic.",
  // Garantie 14 jours satisfait ou remboursé (CGV). Produit numérique : pas
  // de returnMethod, un accès en ligne ne se renvoie pas par la poste.
  hasMerchantReturnPolicy: {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "FR",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 14,
    returnFees: "https://schema.org/FreeReturn",
  },
  knowsAbout: [
    "Intelligence artificielle générative",
    "Claude (Anthropic)",
    "Prompt engineering",
    "Claude Code",
    "Automatisation par IA",
    "Analyse de données assistée par IA",
  ],
  description:
    "Organisme de formation en ligne francophone spécialisé dans la maîtrise de l'IA générative avec Claude d'Anthropic : prompt engineering, Claude Code, data, marketing et stratégie IA.",
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.claudeai-academy.com/#website",
  name: "ClaudeAI Academy",
  url: "https://www.claudeai-academy.com",
  inLanguage: "fr-FR",
  publisher: { "@id": "https://www.claudeai-academy.com/#organization" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Pages anglaises du test d'octobre 2026 (/en/…) : langue du document et
  // habillage anglais. Le chemin vient du proxy (en-tête x-pathname).
  const pathname = (await headers()).get("x-pathname") ?? "";
  const en = pathname === "/en" || pathname.startsWith("/en/");
  // Prix daté du Pass Mastery (lib/offre/prix.ts), lu à chaque requête et
  // passé à la barre de prix, composant client qui ne lit pas l'heure.
  const at = maintenant();

  return (
    <html
      lang={en ? "en" : "fr"}
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <GoogleTag />
        <AuthHashGuard />
        {en ? <EnHeader /> : <Header isLoggedIn={!!user} />}
        <main className="flex-1">{children}</main>
        {en ? <EnFooter /> : <Footer />}
        {/* Barre de prix : n'apparait qu'apres un debut de lecture, et jamais
            dans le tunnel ni dans l'espace membre. */}
        <PriceBar
          prixMastery={prixMastery(at)}
          annonce={annonceHausseMastery(at)}
        />
        {GOOGLE_TAG_ENABLED ? <ConsentBanner /> : null}
        <Analytics />
      </body>
    </html>
  );
}
