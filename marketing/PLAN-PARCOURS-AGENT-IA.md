# Plan du parcours 9 : « Construire ton agent IA avec Claude »

> À valider avant rédaction. Proposé le 3 octobre 2026 sur la base de Google Trends France (12 mois) : `formation agent ia` +300 %, `agent hermes` et `openclaw` en progression record, `claude code n8n` +950 %, `agent IA` = 2 × « vibe coding ». C'est le seul sujet fort ET aligné sur Claude dans toute l'analyse (`marketing/IDEES-TENDANCES-2026-10.md`).

## Positionnement

Un parcours **Mastery**, 7 leçons, environ 3 h, qui part de la question que les gens tapent (« comment créer un agent IA ») et finit sur un agent qui tourne la nuit avec un budget. Pas un cours de framework : le fil conducteur est la **leçon 7 du parcours Claude Code** (qui fournit le harnais, qui fournit la machine), étendue vers le haut (agents personnels grand public) et vers le bas (production).

Ce qu'il n'est pas : un cours LangGraph (indice 2 sur Trends), un cours n8n générique (n8n décline, 38 → 8), un cours « influenceur IA » (0 recherche).

## Les sept leçons

| # | Leçon | Ce qu'on sait faire à la fin | Durée | Sources à vérifier avant d'écrire |
|---|---|---|---|---|
| 1 | **Un agent, c'est quoi, et lequel il te faut** (gratuite) | Distinguer chatbot, assistant avec outils, agent autonome, agent personnel ; choisir parmi les quatre façons de construire (harnais / machine) ; estimer un coût avant de commencer | 20 min | Leçon 7 Claude Code, doc Agent SDK, tarifs 03/10 |
| 2 | **Ton agent personnel sur ta machine : OpenClaw et Hermes, pilotés par Claude** | Installer un agent personnel open source, le brancher sur Claude par clé API, lui donner un périmètre (fichiers, messageries), et surtout ce qu'il ne doit jamais pouvoir faire | 30 min | Dépôts OpenClaw et Hermes Agent (versions, licences, modèle de permissions au jour de rédaction), prix API |
| 3 | **Claude Code comme agent : du terminal à la tâche planifiée** | Transformer un workflow Claude Code en tâche qui se lance seule (sessions cloud, tâches planifiées, Remote Control), avec garde-fous | 25 min | Doc Claude Code (cloud sessions, scheduled tasks, Remote Control), changelog 2.1.288 |
| 4 | **Claude × n8n : l'agent dans un workflow d'automatisation** | Appeler Claude depuis n8n (nœud HTTP ou nœud dédié), structurer la sortie, gérer les erreurs et les coûts ; quand n8n est le bon choix et quand il ne l'est pas | 30 min | Doc n8n (nœud Anthropic, version), tarifs n8n cloud vs auto-hébergé |
| 5 | **Construire un agent avec l'Agent SDK** | Un agent TypeScript ou Python avec outils, permissions, sous-agents et fichier de consignes, testé en local | 35 min | Doc Agent SDK 0.3.288, parité de version avec Claude Code |
| 6 | **Mettre en production : agents gérés, budgets, secrets** | Déployer sur l'infrastructure gérée d'Anthropic, fixer un budget en dollars, mettre les identifiants en coffre, lire la facture (tokens + heures de session) | 30 min | Doc agents gérés (bêta, plateformes exclues), tarif 0,08 $/h de session |
| 7 | **Sécurité et conformité d'un agent qui agit seul** | Modèle de menace (injection de prompt, exfiltration, actions irréversibles), journalisation, revue humaine, et ce que l'AI Act demande à un déployeur | 25 min | Parcours « Prompts & Skills GitHub : sécurité », AI Act art. 4 et 26, doc sandboxing |

## Ce qui est déjà écrit et réutilisable

- Leçon 7 du parcours Claude Code (Agent SDK, agents gérés, facturation, identifiants en coffre) : socle des leçons 1, 5 et 6.
- Leçon 8 du parcours Claude Code (plugins et mods) : socle des garde-fous de la leçon 2.
- Parcours sécurité (modèle de menace, checklist de vetting, sandbox) : socle de la leçon 7.
- Leçon 6 du parcours Stratégie (AI Act) : socle de la partie conformité.

## Ce que le registre de faits devra suivre

Versions d'OpenClaw et de Hermes Agent, version du nœud n8n, tarif de session des agents gérés, liste des plateformes où les agents gérés ne sont pas disponibles. Chaque fait daté dans la leçon, chaque source ajoutée à `scripts/veille/sources.mjs`.

## Effet sur l'offre

- Catalogue : 9 parcours, 57 leçons, environ 22 h de contenu propre aux leçons. Les 14 copies manuelles du nombre de leçons et les 2 du Starter sont listées par `node scripts/veille/check-facts.mjs`.
- Page de vente : une ligne « Construire ton agent IA » dans le programme Mastery, et une page SEO `/creer-un-agent-ia` (requête « comment créer un agent ia », en progression) qui donne la leçon 1 gratuitement.
- Prix inchangés : c'est ce qui justifie le Mastery à 497 €, pas une hausse.

## Décision attendue

1. Go sur le plan tel quel, ou leçons à retirer ou ajouter.
2. Leçon 2 : garder OpenClaw et Hermes nommément (risque : projets jeunes, à re-vérifier à chaque passe), ou rester générique (« un agent personnel open source »). Recommandation : les nommer, c'est ce que les gens cherchent, et la veille sait suivre une version.
3. Ordre d'écriture proposé : leçon 1 (gratuite, sert la page SEO), puis 4 (n8n, demande la plus immédiate), puis 2, 3, 5, 6, 7.
