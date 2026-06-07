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
  title: "ClaudeAI Academy, devenez opérationnel sur Claude",
  description:
    "La méthode francophone pour maîtriser Claude AI en pratique : Chat, Cowork, Code, Design. Parcours guidés, mentor IA, contenu mis à jour. Accès payant.",
  metadataBase: new URL("https://claudeai-academy.com"),
  openGraph: {
    title: "ClaudeAI Academy, devenez opérationnel sur Claude",
    description:
      "La méthode francophone pour maîtriser Claude AI en pratique : Chat, Cowork, Code, Design. Parcours guidés et mentor IA.",
    type: "website",
    locale: "fr_FR",
  },
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
        <Header isLoggedIn={!!user} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
