# Idées de cours et de fonctionnalités, classées par demande réelle (France, octobre 2026)

> Source : Google Trends, France, 12 derniers mois (28 sept. 2025 → 2 oct. 2026), données brutes lues dans les réponses de l'outil (pas estimées à l'œil), le 3 octobre 2026. Trends donne des indices relatifs (100 = pic du terme le plus fort de la comparaison), pas des volumes. Les volumes absolus viennent du Keyword Planner du 22/07/2026 (mémoire projet) et sont à rafraîchir.

## 1. Ce que disent les chiffres

### Échelle générale (comparaison « Claude AI, ChatGPT, Gemini, formation IA, formation ChatGPT »)

| Terme | Indice moyen 12 mois | Tendance |
|---|---:|---|
| ChatGPT | ~80 | stable, léger déclin estival |
| Gemini | ~25 | **×3** sur l'année (13 → 39) |
| Claude AI | ~5 | **×9** sur l'année (1 → 9), pic en mai-juin |
| formation IA | < 1 | plat |
| formation ChatGPT | < 1 | plat |

Lecture : la marque Claude reste 16 fois plus petite que ChatGPT en France, mais elle a été multipliée par 9 en un an. Le constat de juillet (« personne ne cherche Claude en France ») n'est plus vrai au même degré : à refaire au Keyword Planner avant toute décision Ads.

### Les termes que tu proposais (comparaison « agent IA, influenceur IA, formation IA, Claude AI, automatisation IA »)

| Terme | Indice moyen | Commentaire |
|---|---:|---|
| Claude AI | ~50 | 15 fois « formation IA » |
| formation IA | ~3,6 | plat, mais requêtes associées en forte hausse (voir plus bas) |
| agent IA | ~3 | pic en janvier 2026, puis plateau |
| automatisation IA | < 1 | marginal |
| influenceur IA | **0** (« < 1 » toutes les semaines) | pas de demande Google mesurable |

Vérification des variantes (« influenceuse IA », « influenceur virtuel ») : **0 toutes les semaines**, même face à « agent IA » seul. « Créer un agent IA » : 0 à 4, sporadique. Conclusion : « influenceur IA » est une tendance TikTok / YouTube (vidéo, visuel), pas une demande Google. Un cours ne se vendrait pas par le SEO ni par Ads ; il faudrait le vendre par du contenu vidéo sur les réseaux, ce qui est précisément le canal où l'audience actuelle est dormante. Et le sujet repose sur des modèles image/vidéo, pas sur Claude : hors positionnement.

### Les outils (comparaison « influenceur IA, agent IA, n8n, vibe coding, Claude Code »)

| Terme | Indice moyen | Tendance |
|---|---:|---|
| Claude Code | ~42 | pic 100 fin mars 2026, ~30 depuis l'été |
| n8n | ~22 | **en baisse** (38 en nov. 2025 → 8 en août 2026) |
| agent IA | ~6 | plateau |
| vibe coding | ~3 | plat |
| influenceur IA | 0 | |

### Requêtes associées en progression (le signal le plus utile)

Autour de **« formation IA »** : `formation claude` **+950 %**, `formation claude ai` **+550 %**, `formation agent ia` **+300 %**, `agent ia` +300 %, `ia claude` +1 050 %. Les requêtes les plus fréquentes restent `cpf`, `formation cpf`, `france travail formation` (on ne les sert pas : pas de CPF, et on le dit).

Autour de **« agent IA »** : `agent hermes` / `hermes agent` (Record), `openclaw` (Record), `agent skills` / `skills ia` (Record), `claude agent` +250 %, `agent claude` +350 %, `formation ia` +70 %. Lecture : la demande « agent IA » en France est tirée par les **agents personnels open source** (Hermes, OpenClaw) et par les **skills**, pas par les frameworks de dev (LangGraph : 2).

Autour de **« Claude Code »** : `claude code skill` (Record, le plus fort de la liste), `claude code plugins` (Record), `claude cowork` (Record), `hermes claude code` (Record), `claude code auto mode` (Record), `claude code remote control` (Record), `claude code with local llm` (Record). Requêtes fréquentes : `claude code vs code`, `claude code price`, `claude code install`, `claude code mcp`.

Autour de **« Claude AI »** : `claude cowork` (Record), **`claude certified architect` +1 800 %**, `telecharger claude ai gratuit` +1 450 %, `opus 5.5` +800 %, `claude ai prix` +80 %. Fréquentes : `claude ai gratuit` (50), `claude pro` (38), `claude ai prix` (28), `claude ai app` (25).

Autour de **« n8n »** : `claude code n8n` **+950 %**, `n8n claude` +190 %, `n8n skills` +850 %, `openclaw vs n8n` (Record), `n8n academy` +700 %.

## 2. Ce qu'il faut en faire, dans l'ordre

| # | Idée | Preuve de demande | Coût | Verdict |
|---|---|---|---|---|
| 1 | **Parcours « Construire ton agent IA avec Claude »** : de l'agent personnel (OpenClaw, Hermes, pilotés par Claude) à l'agent de production (Agent SDK, agents gérés), avec un module « Claude × n8n » | `formation agent ia` +300 %, `agent hermes` et `openclaw` Record, `claude code n8n` +950 %, `agent IA` = 2× « vibe coding » | 6 à 8 leçons ; la leçon 7 de Claude Code (« Sortir du terminal ») en est déjà le socle | **À faire en premier.** C'est le seul sujet où la demande est forte ET alignée sur Claude |
| 2 | **Leçon « Skills, plugins et mods de Claude Code »** + page SEO gratuite `/claude-code-skills` | `claude code skill` = la requête qui monte le plus fort de toute l'analyse ; `claude code plugins` Record ; les mods sont sortis le 1er octobre | 1 leçon + 1 page | **Quick win**, cette semaine |
| 3 | **Page `/certification-claude-ai` à réécrire** : Anthropic a lancé le 12 mars 2026 un programme officiel (4 examens Pearson VUE : Associate, Developer, Architect Foundations, Architect Professional, 99 à 175 $, réservés aux membres du Claude Partner Network) | `claude certified architect` +1 800 % | 1 page | **Obligatoire** : positionner la formation comme préparation francophone, dire clairement qui peut passer l'examen officiel et combien ça coûte |
| 4 | **Pages d'entrée « Claude AI gratuit vs Pro », « Télécharger Claude sur PC », « Claude Cowork, ce que c'est devenu »** vers `/kit` | `claude ai gratuit` 50, `telecharger claude ai gratuit` +1 450 %, `claude cowork` Record | 3 pages courtes | Haut de tunnel pas cher, à mesurer avec l'attribution par canal |
| 5 | Module « Claude × n8n » seul (si le parcours 1 attend) | `claude code n8n` +950 %, `n8n claude` +190 % | 2 leçons | Bon, mais n8n décline : rester léger |
| 6 | Cours « Influenceur IA » | **0** sur Google France, quelle que soit l'orthographe | 8 leçons hors sujet Claude | **Non**, pas sur la base de la recherche Google ; à tester en vidéo courte si tu veux vérifier la demande TikTok, jamais en formation payante d'abord |
| 7 | Vibe coding | indice 3, plat ; `vibe coding claude` +350 % quand même | | Un article SEO, pas un parcours |

## 3. Comment vérifier avant d'investir

- **Keyword Planner** (compte Google Ads, navigateur Chrome connecté) : volumes absolus FR de `agent ia`, `créer un agent ia`, `formation agent ia`, `claude code skills`, `claude certified architect`, `claude ai gratuit`, `influenceur ia`. Trends ne donne pas de volume ; c'est le seul outil qui le fait sans payer.
- **Attribution par canal** (PR 13) : chaque page d'entrée doit porter son `?src=`, sinon on ne saura pas laquelle vend.
- **Règle** : 30 jours et 200 visiteurs mesurés par page avant de conclure.

## 4. Volumes absolus, Keyword Planner (lu le 4 octobre 2026, France, septembre 2025 à août 2026)

Source : Google Ads, outil de planification des mots clés, compte 537-199-3441, « Nombre moy. de recherches mensuelles ». La « variation sur trois mois » est négative sur presque tous les termes (de -18 % à -84 %) : effet d'été, à ne pas lire comme un retournement.

| Mot clé | Rech./mois | Variation sur un an | Concurrence | Enchère haut de page |
|---|---:|---:|---|---|
| claude ai | **1 220 000** | +809 % | Faible | 0,28 à 1,77 € |
| claude code | 90 500 | +83 % | Faible | 0,94 à 4,00 € |
| n8n | 74 000 | -45 % | Moyen | 0,40 à 4,51 € |
| openclaw | 40 500 | nouveau | Faible | 0,84 à 3,30 € |
| claude cowork | 22 200 | nouveau | Faible | 0,55 à 4,78 € |
| claude ai gratuit | 14 800 | +1 068 % | Faible | 0,23 à 0,84 € |
| hermes agent | 12 100 | nouveau | Faible | 1,34 à 4,37 € |
| formation ia | 9 900 | 0 % | Élevé | 2,63 à 6,60 € |
| agent ia | 8 100 | +23 % | Moyen | 1,63 à 5,28 € |
| prompt engineering | 3 600 | -47 % | Faible | 0,86 à 4,71 € |
| formation intelligence artificielle | 1 900 | -62 % | Élevé | 2,69 à 7,27 € |
| claude certified architect | 1 300 | nouveau | Faible | 0,57 à 2,40 € |
| claude code skills | 1 300 | nouveau | Faible | 0,78 à 3,71 € |
| formation claude | 1 000 | nouveau | Élevé | 2,05 à 4,97 € |
| télécharger claude ai | 880 | +91 % | Faible | 0,27 à 1,43 € |
| comment créer un agent ia | 590 | +321 % | Moyen | 1,13 à 4,43 € |
| formation claude ai | 590 | nouveau | Élevé | 2,55 à 6,13 € |
| formation agent ia | 480 | +129 % | Élevé | 3,63 à 11,82 € |
| influenceur ia | 320 | -48 % | Faible | 0,55 à 2,02 € |
| créer un agent ia | 320 | +136 % | Élevé | 1,50 à 6,22 € |

**Ce que ça change par rapport à juillet** : la marque Claude est devenue une requête grand public en France (1,22 M, soit 123 fois « formation ia »). « formation claude » (1 000) et « formation claude ai » (590) n'existaient pas il y a un an. Les agents personnels open source (openclaw 40 500, hermes agent 12 100) pèsent plus que « agent ia » lui-même. « influenceur ia » : 320 recherches et en baisse, verdict confirmé.

**Conséquences** : le SEO de marque (pages « claude ai gratuit », « télécharger », « cowork », « skills ») vise désormais des volumes à cinq chiffres avec une concurrence faible et des enchères sous 1 €. Le parcours agent IA doit nommer OpenClaw et Hermes dans ses titres. Les termes « formation » restent chers (jusqu'à 11,82 € l'enchère haute sur « formation agent ia ») et concurrencés : y aller en organique, pas en Ads.
