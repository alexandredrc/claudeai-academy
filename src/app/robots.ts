import type { MetadataRoute } from "next";

// Routes privées ou sans valeur d'indexation : on les exclut explicitement.
// Les bots IA (GPTBot, ClaudeBot, PerplexityBot…) suivent la règle générale "*"
// et sont donc autorisés sur tout le contenu public.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/account", "/checkout/", "/mentor", "/login", "/signup"],
      },
    ],
    sitemap: "https://www.claudeai-academy.com/sitemap.xml",
  };
}
