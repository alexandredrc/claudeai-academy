import "server-only";
import Anthropic from "@anthropic-ai/sdk";

/**
 * Sonnet 5.5 : le bon compromis coût/latence pour un chat ancré (RAG).
 *
 * Même tarif que Sonnet 5 — 2 $ / 10 $ par million de tokens. Mesuré sur le
 * Mentor le 29 septembre 2026 : même délai avant le premier mot (≈ 2 s, cache
 * chaud), rédaction environ moitié plus rapide (≈ 150 tokens/s contre ≈ 95).
 * La formation elle-même enseigne « Sonnet = l'équilibré » : faire tourner le
 * Mentor sur la génération précédente contredirait sa propre leçon.
 *
 * Le cache de prompt est propre à chaque modèle : changer cette constante fait
 * réécrire toute la base de connaissance à la première requête qui suit.
 */
export const MENTOR_MODEL = "claude-sonnet-5-5";

// Garde-fou coût : nombre max de messages au Mentor par utilisateur et par jour.
export const MENTOR_DAILY_LIMIT = 40;

let cached: Anthropic | null = null;

/**
 * Init paresseuse : on ne valide la clé qu'au moment de l'appel (pas au
 * chargement du module), sinon `next build` plante en collectant les routes
 * alors qu'aucune requête n'est servie.
 */
export function getAnthropic(): Anthropic {
  if (cached) return cached;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to .env.local (console.anthropic.com → Settings → API Keys).",
    );
  }
  cached = new Anthropic({ apiKey });
  return cached;
}
