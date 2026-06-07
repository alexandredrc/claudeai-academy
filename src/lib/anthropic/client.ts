import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// Sonnet 4.6 : bon compromis coût/latence pour un chat ancré (RAG).
export const MENTOR_MODEL = "claude-sonnet-4-6";

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
