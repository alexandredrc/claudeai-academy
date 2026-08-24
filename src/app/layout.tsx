import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Analytics } from "@vercel/analytics/next";
import { GoogleTag, GOOGLE_TAG_ENABLED } from "@/components/site/google-tag";
import { ConsentBanner } from "@/components/site/consent-banner";
import { AuthHashGuard } from "@/components/site/auth-hash-guard";
import { createClient } from "@/lib/supabase/server";
import { INSTAGRAM_URL } from "@/components/site/instagram";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Formation Claude AI en ligne, en français — dès 47 € | ClaudeAI Academy",
  description:
    "Formation Claude AI en ligne et en français, à votre rythme : bien démarrer, prompt engineering, Claude Code, data, marketing, stratégie. 8 parcours, 48 leçons, 170 prompts, Mentor IA. Dès 47 €, sans CPF ni dossier.",
  metadataBase: new URL("https://www.claudeai-academy.com"),
  keywords: [
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
    title: "Formation Claude AI en ligne, en français — dès 47 €",
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
        alt: "ClaudeAI Academy — la formation francophone pour maîtriser Claude AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Formation Claude AI en ligne, en français — dès 47 €",
    description:
      "8 parcours, 48 leçons, 170 prompts et un Mentor IA pour maîtriser Claude AI en pratique. À votre rythme, sans CPF ni dossier.",
    images: ["/og.png"],
  },
};

// `EducationalOrganization` plutôt que `Organization` : c'est le type que
// Google et les moteurs génératifs relient aux requêtes « formation … ».
// `sameAs` et l'identité de l'éditeur alimentent l'E-E-A-T (Trust) — sans
// quoi un site marchand récent reste une entité inconnue.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "Organization"],
  "@id": "https://www.claudeai-academy.com/#organization",
  name: "ClaudeAI Academy",
  alternateName: "Claude AI Academy",
  url: "https://www.claudeai-academy.com",
  logo: {
    "@type": "ImageObject",
    url: "https://www.claudeai-academy.com/og.png",
    width: 1200,
    height: 630,
  },
  image: "https://www.claudeai-academy.com/og.png",
  email: "contact@claudeai-academy.com",
  inLanguage: "fr-FR",
  areaServed: ["FR", "BE", "CH", "LU", "CA"],
  knowsLanguage: "fr-FR",
  sameAs: [INSTAGRAM_URL],
  founder: {
    "@type": "Person",
    name: "Alexandre Dos Reis Caetano",
    jobTitle: "Fondateur, ClaudeAI Academy",
    url: "https://www.claudeai-academy.com/a-propos",
  },
  parentOrganization: { "@type": "Organization", name: "ADRC Group" },
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

  return (
    <html
      lang="fr"
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
        <Header isLoggedIn={!!user} />
        <main className="flex-1">{children}</main>
        <Footer />
        {GOOGLE_TAG_ENABLED ? <ConsentBanner /> : null}
        <Analytics />
      </body>
    </html>
  );
}
