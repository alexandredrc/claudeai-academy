import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    // Force la racine Turbopack sur le projet (évite la confusion
    // avec un lockfile parasite dans C:\Users\adrc1\)
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
