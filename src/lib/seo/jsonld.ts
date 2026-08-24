// Fabriques de JSON-LD partagées.
// Un seul endroit où vit l'URL canonique et la forme des schémas : sans ça,
// les blocs divergent page par page et Google finit par voir deux entités
// « ClaudeAI Academy » au lieu d'une.

export const SITE_URL = "https://www.claudeai-academy.com";
export const ORG_ID = `${SITE_URL}/#organization`;

export function absolute(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

export type Crumb = { name: string; path: string };

/**
 * Fil d'Ariane structuré. Google s'en sert pour remplacer l'URL brute par un
 * chemin lisible dans les résultats ; les moteurs génératifs s'en servent pour
 * situer la page dans le site avant de la citer.
 */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absolute(c.path),
    })),
  };
}

/** Sérialise un bloc JSON-LD pour `dangerouslySetInnerHTML`. */
export function jsonLdScript(data: unknown): { __html: string } {
  // `<` échappé : un titre de leçon contenant « <script> » casserait la page.
  return { __html: JSON.stringify(data).replace(/</g, "\u003c") };
}
