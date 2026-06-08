# Sources — ClaudeAI Academy

Taxonomie des sources fiables qui alimentent (1) la production de contenu, (2) la veille automatisée, (3) le futur Mentor IA. Vérifiées en ligne le 2026-05-15.

Principe : **Tier 1 = source de vérité** (officiel Anthropic). Tier 2 = signal indépendant à très haute confiance. Tier 3 = appoint pédagogique, jamais cité comme autorité.

---

## Tier 1 — Officiel Anthropic (autorité maximale)

| Source | URL | Usage | Surveillé |
|---|---|---|---|
| Prompting best practices (doc vivante) | `platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices` | Référence canonique parcours 01 | ✅ |
| Prompt engineering overview | `platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview` | Fondamentaux | — |
| Interactive Prompt Engineering Tutorial | `github.com/anthropics/prompt-eng-interactive-tutorial` | Exercices parcours 01 (9 chapitres + appendix) | — |
| Release notes API / Platform | `platform.claude.com/docs/en/release-notes/overview` | Détecter features/modèles nouveaux | ✅ |
| Claude Code — best practices | `anthropic.com/engineering/claude-code-best-practices` | Référence parcours 02 | — |
| Claude Code — CHANGELOG | `github.com/anthropics/claude-code` (raw `CHANGELOG.md`) | Suivi version Claude Code | ✅ |
| Claude Agent SDK — CHANGELOG | `github.com/anthropics/claude-agent-sdk-typescript` | Suivi SDK agents | ✅ |
| Engineering blog | `anthropic.com/engineering` | Context engineering, agents, patterns avancés | ✅ |
| Building agents with the Agent SDK | `anthropic.com/engineering/building-agents-with-the-claude-agent-sdk` | Référence parcours 02 | — |
| Effective context engineering | `anthropic.com/engineering/effective-context-engineering-for-ai-agents` | Référence parcours 02 / 05 | — |
| Blog produit | `claude.com/blog` | Annonces produit/modèles | — |

## Tier 1 — Officiel juridique (UE / France)

Couvre la dérive réglementaire du parcours 05 « Stratégie » (AI Act, RGPD), dont les échéances sont mouvantes.

| Source | URL | Usage | Surveillé |
|---|---|---|---|
| Commission UE — Cadre réglementaire IA (AI Act) | `digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai` | Référence AI Act parcours 05 | ✅ |
| Commission UE — Mise en application AI Act (calendrier) | `digital-strategy.ec.europa.eu/en/policies/ai-act-implementation` | Suivi des échéances mouvantes | ✅ |
| CNIL — Intelligence artificielle | `cnil.fr/fr/intelligence-artificielle` | Doctrine RGPD/IA française | ✅ |

## Tier 2 — Indépendant haute confiance

| Source | URL | Pourquoi fiable | Surveillé |
|---|---|---|---|
| Simon Willison — Weblog | `simonwillison.net` (Atom : `/atom/everything/`) | Référence mondiale LLM appliqué, hands-on, anti-hype, quasi quotidien | ✅ |
| Prompt Engineering Guide | `promptingguide.ai` | Compile les papiers académiques + techniques, maintenu | — |
| Anthropic Interactive Tutorial (cf. T1) | — | Déjà compté en T1 (édité par Anthropic) | — |

## Tier 3 — Appoint pédagogique (jamais cité comme autorité)

- DeepLearning.AI / Andrew Ng — cours "ChatGPT Prompt Engineering for Developers" (pédagogie d'introduction)
- IBM / Google prompt engineering guides (vulgarisation, recoupement)

> Règle de rédaction : toute affirmation technique du contenu payant doit être **recoupable contre une source Tier 1**. Tier 2 sert d'éclairage et de retour d'expérience. Tier 3 ne sert qu'à structurer la pédagogie, jamais à fonder un fait.

---

## Veille automatisée

Script : `scripts/veille/run.mjs` — déterministe (fetch + diff), aucune clé API requise.

- Sources surveillées : voir `scripts/veille/sources.mjs` (colonne "Surveillé" ✅ ci-dessus)
- Sortie : `scripts/veille/reports/AAAA-MM-JJ.md` (gitignored)
- Mécanique : CHANGELOG → diff par version ; Atom → diff par entrée ; pages doc → hash normalisé anti-bruit
- Chaque finding mappe vers les `slug` de parcours potentiellement impactés

Lancement manuel : `node scripts/veille/run.mjs`

## Mentor IA (à construire)

Le Mentor IA s'appuiera sur : (1) le contenu de la formation comme base de connaissance primaire, (2) les sources Tier 1 ci-dessus comme garde-fou de fraîcheur. Ancrage strict : il répond depuis le contenu, signale quand une question sort du périmètre.
