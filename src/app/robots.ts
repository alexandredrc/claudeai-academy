import type { MetadataRoute } from "next";

const BASE = "https://www.claudeai-academy.com";

// Chemins sans valeur d'indexation : espace membre, tunnel de paiement, API.
// On bloque le crawl uniquement là où il n'y a rien à lire pour un moteur.
// Les pages qui doivent sortir de l'index mais rester lisibles (/acces,
// /kit/merci, /kit/ressources) portent un `noindex` : bloquer leur crawl
// empêcherait justement Google de lire ce noindex et les laisserait
// indexées en URL nue.
const PRIVATE_PATHS = [
  "/api/",
  "/account",
  "/checkout/",
  "/mentor",
  "/login",
  "/signup",
  "/auth/",
];

// Crawlers des moteurs génératifs. Ils suivent la règle "*", mais une
// autorisation nommée lève toute ambiguïté — plusieurs d'entre eux
// interprètent l'absence de règle dédiée comme un refus par défaut.
// Google-Extended ne gouverne pas le classement, seulement l'usage du
// contenu dans les réponses IA : le refuser nous exclurait des AI Overviews.
const AI_CRAWLERS = [
  "GPTBot", // OpenAI — entraînement
  "OAI-SearchBot", // OpenAI — index de ChatGPT Search
  "ChatGPT-User", // OpenAI — navigation à la demande
  "ClaudeBot", // Anthropic — index
  "Claude-User", // Anthropic — navigation à la demande
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot", // Perplexity — index
  "Perplexity-User",
  "Google-Extended", // Google — AI Overviews / Gemini
  "Applebot-Extended",
  "Bingbot", // Bing → Copilot
  "DuckAssistBot",
  "cohere-ai",
  "Meta-ExternalAgent",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      // La landing publicitaire est en noindex : AdsBot doit malgré tout
      // pouvoir la crawler, sinon le Quality Score s'effondre.
      {
        userAgent: ["AdsBot-Google", "AdsBot-Google-Mobile"],
        allow: "/",
        disallow: ["/api/", "/account", "/checkout/", "/auth/"],
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: PRIVATE_PATHS,
      })),
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
