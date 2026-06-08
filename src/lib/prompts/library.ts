import promptEngineering from "./categories/prompt-engineering.json";
import claudeCode from "./categories/claude-code.json";
import business from "./categories/business.json";
import marketing from "./categories/marketing.json";
import data from "./categories/data.json";
import trading from "./categories/trading.json";
import securite from "./categories/securite.json";
import design from "./categories/design.json";

export type PromptTier = "free" | "mastery";

export type Prompt = {
  slug: string;
  category: string;
  title: string;
  useCase: string;
  prompt: string;
  tier: PromptTier;
};

export type PromptCategory = {
  key: string;
  label: string;
  emoji: string;
};

// Métadonnées d'affichage des catégories (ordre = ordre d'affichage).
export const PROMPT_CATEGORIES: PromptCategory[] = [
  { key: "prompt-engineering", label: "Prompt Engineering", emoji: "💬" },
  { key: "claude-code", label: "Claude Code", emoji: "⌨️" },
  { key: "business", label: "Business & Productivité", emoji: "📊" },
  { key: "marketing", label: "Marketing & Contenu", emoji: "🚀" },
  { key: "data", label: "Data, SQL & Analytics", emoji: "📈" },
  { key: "trading", label: "Trading (outillage)", emoji: "📉" },
  { key: "securite", label: "Sécurité & Skills GitHub", emoji: "🛡️" },
  { key: "design", label: "Design & UX", emoji: "🎨" },
];

export const ALL_PROMPTS: Prompt[] = [
  ...promptEngineering,
  ...claudeCode,
  ...business,
  ...marketing,
  ...data,
  ...trading,
  ...securite,
  ...design,
] as Prompt[];

/** Nombre total de prompts — source de vérité pour l'affichage marketing. */
export const PROMPT_COUNT = ALL_PROMPTS.length;

export const FREE_PROMPTS: Prompt[] = ALL_PROMPTS.filter((p) => p.tier === "free");

export function promptsByCategory(key: string): Prompt[] {
  return ALL_PROMPTS.filter((p) => p.category === key);
}

export function categoryLabel(key: string): string {
  return PROMPT_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}
