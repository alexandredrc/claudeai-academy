import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { createClient } from "@/lib/supabase/server";

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
  title: "ClaudeAI Academy — Formation Claude AI en français",
  description:
    "La formation francophone pour maîtriser Claude AI en pratique : prompt engineering, Claude Code, data, marketing, stratégie. 7 parcours, 40 leçons, 170 prompts, mentor IA.",
  metadataBase: new URL("https://www.claudeai-academy.com"),
  keywords: [
    "formation Claude AI",
    "formation IA en ligne",
    "prompt engineering français",
    "Claude Code formation",
    "maîtriser Claude",
    "formation intelligence artificielle",
    "IA générative entreprise",
  ],
  openGraph: {
    title: "ClaudeAI Academy — Formation Claude AI en français",
    description:
      "La formation francophone pour maîtriser Claude AI en pratique : prompt engineering, Claude Code, data, marketing, stratégie. Mentor IA inclus.",
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
    title: "ClaudeAI Academy — Formation Claude AI en français",
    description:
      "7 parcours, 40 leçons, 170 prompts et un mentor IA pour maîtriser Claude AI en pratique.",
    images: ["/og.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ClaudeAI Academy",
  url: "https://www.claudeai-academy.com",
  logo: "https://www.claudeai-academy.com/og.png",
  email: "contact@claudeai-academy.com",
  description:
    "Organisme de formation en ligne francophone spécialisé dans la maîtrise de Claude AI : prompt engineering, Claude Code, data, marketing et stratégie IA.",
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ClaudeAI Academy",
  url: "https://www.claudeai-academy.com",
  inLanguage: "fr-FR",
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
        <Header isLoggedIn={!!user} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
