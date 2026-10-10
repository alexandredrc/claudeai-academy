# Benchmark : Claude Academy (Anthropic) vs ClaudeAI Academy

Relevé le 9 octobre 2026 sur `academy.claude.com/courses` et `academy.claude.com/tutorials`.
Objectif : voir ce que les tutoriels officiels proposent et que nous ne proposons pas, et trancher ce qui vaut le coup.

## Ce qu'Anthropic propose aujourd'hui

- 27 cours (gratuits, en anglais, avec badge) : Claude 101, Claude Code 101, Cowork, Claude Tag (Slack), Platform 101, MCP intro + avancé, sous-agents, agent skills, SDLC, AI Fluency (14 déclinaisons métier), API (Bedrock, Vertex).
- 37 tutoriels courts (3 à 20 min) classés par produit : Claude.ai, Cowork, Skills, Claude Code, Managed Agents, « How AI works », « Collaborating with AI », Excel, PowerPoint, Chrome, Claude Tag, Claude Design, Claude Security.

## Ce qu'ils ont et que nous n'avons pas

| Sujet officiel | Chez nous | Verdict |
| --- | --- | --- |
| Claude dans Excel (7 min), Claude dans PowerPoint (4 min) | Rien. « Excel » n'apparaît dans aucune leçon, PowerPoint seulement comme format d'export de Claude Slides | Trou le plus net pour notre cible (métiers, restauration, PME). À combler |
| Claude in Chrome (15 min) : raccourcis `/`, tâches planifiées, ce que l'extension refuse (sites financiers) | Mentionné en passant dans Bien démarrer (bascule « session Claude » du 12 août) | Une leçon courte manque : « ce que Claude peut faire dans ton navigateur, et ce qu'il refuse » |
| Skills dans l'application claude.ai (10 min) : créer un skill en décrivant la tâche, trois ingrédients (format, ton, exemple), Pro et au-dessus | Skills traités côté Claude Code (parcours 3) et sécurité GitHub (parcours 8), pas côté application pour un non-développeur | À ajouter dans Bien démarrer, leçon « Personnaliser Claude » |
| Claude Design (10 min) : présentations en HTML, export PPTX, PDF, Canva, Claude Code | Rien (Claude Slides est cité) | Mineur, à surveiller : produit « Labs » |
| « How AI works » : tokens, fenêtre de contexte et coût, « peut-on faire confiance à l'IA », avec exercices interactifs | Les notions sont dispersées (tokenizer dans Bien démarrer, contexte dans Claude Code) sans leçon d'introduction | Une leçon gratuite « Tokens et contexte : pourquoi ça coûte et pourquoi ça se trompe » servirait aussi le SEO (« fenêtre de contexte Claude ») |
| AI Fluency : « signature move » (itérer dans le chat, clarifier l'objectif dans Claude Code et Cowork), spirale du discernement, « now question it » à la fin de chaque séquence | Nos défis en fin de leçon font le travail, mais sans le geste explicite « demande à Claude ce qu'il a supposé avant d'accepter » | À reprendre comme réflexe éditorial : une ligne de vérification à la fin de chaque défi |
| MCP : 21 leçons sur deux cours | Une leçon (parcours 3, leçon 5) | Suffisant pour notre cible ; pas de nouveau parcours |
| Sous-agents : cours de 4 leçons | Une leçon (parcours 3, leçon 6) | Idem |
| Claude Tag (Slack), Claude Enterprise admin, Claude Security, SDLC playbook | Rien | Hors cible, volontairement |

## Ce que nous avons et qu'ils n'ont pas

- Le français, et des cas métiers vécus (restaurant, trading, data, marketing, stratégie).
- Les prix et les dates : la fiche officielle « Choosing the right Claude model » cite encore Haiku 4.5, Sonnet 5 et Opus 5 comme modèles courants. Nos leçons datent chaque fait et le vérificateur de faits les relit.
- AI Act, RGPD, CNIL (parcours Stratégie).
- Sécurité de l'écosystème GitHub (prompts, skills, MCP non fiables par défaut).
- Agents hors Anthropic (OpenClaw, Hermes, n8n) à côté de l'Agent SDK et des agents gérés.
- La certification, le Mentor IA, les 170 prompts, le kit gratuit.

## Ce que je retiens pour la suite (par ordre de rendement)

1. **Une leçon « Claude dans Excel, PowerPoint et Chrome »** dans Bien démarrer, en accès libre. C'est ce que cherche un directeur de restaurant ou un responsable de PME, et aucun contenu français sérieux ne l'a.
2. **Un paragraphe « Skills dans l'application »** dans la leçon « Personnaliser Claude » : créer un skill en décrivant la tâche, trois ingrédients, test dans une nouvelle conversation (« Reading [nom du skill] »).
3. **Le réflexe « demande-lui ce qu'il a supposé »** à la fin de chaque défi, inspiré de la spirale du discernement : coût éditorial nul, valeur pédagogique prouvée par l'AI Fluency Index (50 000 conversations).
4. **Une leçon gratuite « Tokens et contexte »** : explique le palier de prix de Haiku 5.5 (100 000 tokens), le tokenizer +30 %, la compaction, et quand ouvrir une nouvelle conversation.

Rien de tout cela n'est fait dans cette passe : la passe du 9 octobre corrige les faits (Haiku 5.5, cache Sonnet 5.5, crédits API Max et Team, Claude Code 2.1.295). Ces quatre points sont des décisions produit à prendre.

## Sources

- https://academy.claude.com/courses et https://academy.claude.com/tutorials (relevés le 9 octobre 2026)
- https://academy.claude.com/tutorials/getting-good-at-claude-a-research-backed-curriculum
- https://academy.claude.com/tutorials/choosing-the-right-claude-model
- https://academy.claude.com/tutorials/teach-claude-your-way-of-working-using-skills
- https://academy.claude.com/tutorials/parametric-memory-and-context
- https://academy.claude.com/tutorials/simplify-your-browsing-experience-with-claude-for-chrome
- https://platform.claude.com/docs/en/models/haiku-5-5/whats-new-haiku-5-5
- https://platform.claude.com/docs/en/about-claude/pricing
- https://platform.claude.com/docs/en/about-claude/api-credits-for-subscribers
- https://platform.claude.com/docs/en/release-notes/overview
