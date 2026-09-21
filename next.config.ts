import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // imapflow ouvre une connexion TCP/TLS brute : il doit rester un module Node
  // externe, sinon le bundler tente de l'embarquer et casse au chargement.
  serverExternalPackages: ["imapflow"],
  turbopack: {
    // Force la racine Turbopack sur le projet (évite la confusion
    // avec un lockfile parasite dans C:\Users\adrc1\)
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
