import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // imapflow ouvre une connexion TCP/TLS brute : il doit rester un module Node
  // externe, sinon le bundler tente de l'embarquer et casse au chargement.
  serverExternalPackages: ["imapflow"],
  // Lien court de la bio Instagram du compte de marque. Instagram affiche
  // l'adresse brute du premier lien sous la bio : « claudeai-academy.com/ig »
  // se lit, « …/kit?src=instagram-academy-kit » fait technique. Le `src` est
  // posé ici, le proxy le traduit ensuite en utm comme pour tout lien tracé.
  async redirects() {
    return [
      { source: "/ig", destination: "/kit?src=instagram-academy-kit", permanent: false },
    ];
  },
  turbopack: {
    // Force la racine Turbopack sur le projet (évite la confusion
    // avec un lockfile parasite dans C:\Users\adrc1\)
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
