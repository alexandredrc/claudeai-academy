// =========================================
// ClaudeAI Academy — Sources de veille
//
// Taxonomie : chaque source a un "kind" qui détermine comment on la lit.
//  - github-changelog : fichier CHANGELOG.md brut sur GitHub (diff par version)
//  - atom             : flux Atom/RSS (diff par entry id)
//  - html-hash        : page HTML, on hash le texte (flag si changé, pas de diff fin)
//
// tier 1 = officiel Anthropic (autorité maximale, source de vérité)
// tier 2 = indépendant haute confiance (signal/bruit excellent)
// =========================================

export const SOURCES = [
  // ---------- TIER 1 — Officiel Anthropic ----------
  {
    id: "claude-code-changelog",
    label: "Claude Code — CHANGELOG",
    tier: 1,
    kind: "github-changelog",
    url: "https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md",
    impacts: ["claude-code-ia-agentic"],
  },
  {
    id: "agent-sdk-ts-changelog",
    label: "Claude Agent SDK (TS) — CHANGELOG",
    tier: 1,
    kind: "github-changelog",
    url: "https://raw.githubusercontent.com/anthropics/claude-agent-sdk-typescript/main/CHANGELOG.md",
    impacts: ["claude-code-ia-agentic"],
  },
  {
    id: "anthropic-release-notes",
    label: "Anthropic — Release notes (API / Platform)",
    tier: 1,
    kind: "html-hash",
    url: "https://platform.claude.com/docs/en/release-notes/overview",
    impacts: ["prompt-engineering-pro", "claude-code-ia-agentic", "strategie-conduite-ia"],
  },
  {
    id: "anthropic-prompting-best-practices",
    label: "Anthropic — Prompting best practices (doc vivante)",
    tier: 1,
    kind: "html-hash",
    url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
    impacts: ["prompt-engineering-pro"],
  },
  {
    id: "anthropic-engineering-blog",
    label: "Anthropic — Engineering blog",
    tier: 1,
    kind: "html-hash",
    url: "https://www.anthropic.com/engineering",
    impacts: ["claude-code-ia-agentic", "strategie-conduite-ia"],
  },

  // ---------- TIER 2 — Indépendant haute confiance ----------
  {
    id: "simon-willison",
    label: "Simon Willison — Weblog (LLM, agents, pratique)",
    tier: 2,
    kind: "atom",
    url: "https://simonwillison.net/atom/everything/",
    impacts: ["prompt-engineering-pro", "claude-code-ia-agentic", "claude-data-sql"],
  },
];
