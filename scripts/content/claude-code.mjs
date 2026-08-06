// =========================================
// Parcours « Claude Code et IA agentic »
// Contenu original au standard du Parcours 1. Remplace les anciens stubs.
// Sujets : agent en terminal, CLAUDE.md & contexte, slash commands/skills,
// hooks, MCP, sub-agents & architecture de workflow agentic.
// À auditer pour exactitude (les détails Claude Code évoluent vite).
// =========================================

const FOOTER = `

---

**Sources & méthode** · Contenu vérifié au **6 août 2026**, sur **Claude Code 2.1.223**. Sources : changelog et doc officielle Claude Code ([code.claude.com/docs/en/changelog](https://code.claude.com/docs/en/changelog), [code.claude.com/docs/en/costs](https://code.claude.com/docs/en/costs)), doc API Anthropic ([platform.claude.com/docs/en](https://platform.claude.com/docs/en)), *Model Context Protocol* ([modelcontextprotocol.io](https://modelcontextprotocol.io)), et les articles Anthropic « Building verification loops in Claude Code with skills » (22/07/2026) et « The new rules of context engineering for Claude 5 generation models » (24/07/2026). Claude Code bouge vite : **les versions et les limites chiffrées sont datées dans le texte** — revérifiez sur le changelog de votre version. Contenu original rédigé pour ClaudeAI Academy.`;

export const claudeCodeIaAgentic = {
  slug: "claude-code-ia-agentic",
  title: "Claude Code et l'IA agentique",
  description:
    "L'agent de code qui vit dans ton terminal : CLAUDE.md léger, skills et boucles de vérification, hooks, MCP, sous-agents et coûts maîtrisés. À jour de Claude Code 2.1.223 (6 août 2026).",
  tier_required: "starter",
  display_order: 3,
  estimated_duration_min: 138,
  lessons: [
    {
      slug: "ce-qui-change-vraiment-avec-claude-code",
      title: "Ce qui change vraiment avec Claude Code",
      description:
        "Pas un chatbot de plus : un agent qui lit votre dépôt, édite des fichiers, lance des commandes et boucle. Le changement de posture.",
      duration_min: 16,
      is_free_preview: true,
      content_md:
        `:::objectifs
- Expliquer en une phrase ce qui sépare un agent de terminal d'un chatbot
- Dérouler les 4 étapes de la boucle agentique et situer ton rôle dedans
- Trier une liste de tâches entre « à déléguer » et « à garder pour toi »
- Vérifier ta version de Claude Code et savoir pourquoi c'est un geste de sécurité
:::

:::flash
Claude Code n'est pas une fenêtre de chat : c'est un agent qui vit dans ton terminal, lit ton dépôt, écrit du code, lance des commandes et boucle sur les résultats. Tu passes de « copier-coller des extraits » à « déléguer des tâches et relire ». Au 6 août 2026, la version courante est **2.1.223**, et **Opus 5** est le modèle Opus par défaut depuis le 24 juillet.
:::

## Le saut : du chatbot à l'agent

La plupart des gens utilisent l'IA comme un chatbot : on copie un bout de code dans une fenêtre, on colle la réponse, on recommence. Claude Code casse ce schéma. C'est un **agent qui vit dans ton terminal**, à l'intérieur de ton projet : il **lit tes fichiers**, **écrit et modifie du code**, **lance des commandes** (tests, build, git) et **observe les résultats** pour se corriger.

Le changement n'est pas cosmétique. Tu arrêtes de transférer des extraits ; tu **délègues des tâches** — « ajoute des tests pour ce module », « refais ce composant sans changer le comportement » — et tu **relis le résultat**.

:::avant-apres Réflexe chatbot | Réflexe agent
Je colle ma fonction dans une fenêtre de chat, je décris le bug, je récupère une version corrigée, je la recolle dans mon éditeur, je relance les tests à la main. Si ça casse ailleurs, je recommence le cycle.
===
Je décris le bug dans le terminal, au sein du dépôt. L'agent lit les fichiers concernés, modifie le code, lance la suite de tests, voit l'échec, corrige, relance. Je relis le diff final et je tranche.
:::

## La boucle agentique

Tout repose sur une boucle simple, qu'il faut comprendre pour bien piloter l'outil :

| Étape | Ce que fait l'agent | Ce que tu contrôles |
| --- | --- | --- |
| 1. Rassembler le contexte | Lit les bons fichiers, cerne l'objectif | Tu lui dis où chercher, tu poses les contraintes |
| 2. Agir | Édite, lance une commande | Tu autorises (ou non) les actions sensibles |
| 3. Observer | Lit la sortie : erreur de test, log, diff | Tu vérifies qu'il regarde la bonne sortie |
| 4. Corriger | Ajuste et recommence si besoin | Tu définis le critère d'arrêt |

Ton rôle n'est pas de taper le code : c'est de **cadrer l'objectif**, de **fournir le bon contexte**, et de **valider**. L'agent fait le reste, et boucle jusqu'au résultat.

:::cle La boucle, c'est tout le produit
Tout ce que tu vas apprendre ensuite (CLAUDE.md, skills, hooks, MCP, sous-agents) ne fait qu'améliorer **une des quatre étapes**. CLAUDE.md et MCP améliorent l'étape 1. Les skills, l'étape 2. Les hooks et les tests, l'étape 3. Quand quelque chose se passe mal, demande-toi toujours : **quelle étape de la boucle a échoué ?**
:::

## Quand ça brille, quand ça coince

Claude Code excelle sur les tâches où le résultat est **vérifiable par une machine** : c'est là que la boucle « observer / corriger » tourne toute seule.

| Ça brille | Ça coince |
| --- | --- |
| Tests, refactors mécaniques, migrations | Décisions d'architecture lourdes — à toi de trancher |
| Exploration d'un code inconnu | Choix produit et arbitrages métier |
| Debug guidé par une erreur reproductible | Changements irréversibles (prod, données, paiements) |
| Scripts, outillage, automatisations internes | Tout ce qui touche aux secrets et aux accès |

Le critère pratique : **s'il existe une commande qui dit « c'est bon » ou « c'est cassé », délègue**. Sinon, garde la main.

## Combien ça coûte, concrètement

Anthropic publie des repères d'usage. Ils cadrent bien les attentes avant de se lancer.

:::chiffres
~13 $ | par développeur et par jour actif (repère officiel)
150–250 $ | par développeur et par mois en entreprise
90 % | des utilisateurs restent sous 30 $ par jour actif
:::

Ces chiffres sont ceux de la page officielle sur les coûts au 6 août 2026. Deux détails qui pèsent : la **durée de vie du cache** est d'**1 heure sur abonnement** mais retombe à **5 minutes** dès qu'on passe en clé API ou qu'on consomme des crédits d'usage ; et les fonctions de type « équipes d'agents » consomment environ **7 fois plus de tokens** qu'une session standard (elles sont désactivées par défaut, on y revient en dernière leçon).

Un mot sur le modèle, puisqu'il pilote la facture. **Claude Opus 5 est le modèle Opus par défaut de Claude Code depuis le 24 juillet 2026**, avec 1 million de tokens de contexte. Son **fast mode** est facturé **10 $ / 50 $ par million de tokens** (entrée / sortie) — utile à savoir avant de l'activer par curiosité. Au passage, le fast mode a été **retiré pour Opus 4.7** à la même date.

## Mettre à jour n'est pas cosmétique

:::maj 6 août 2026
Claude Code est en **2.1.223**. Entre le 18 juillet et le 6 août 2026, le changelog documente **au moins cinq corrections de contournement du système de permissions Bash** : contournement en PowerShell 5.1, conditionnels regex zsh, mauvaise gestion des guillemets PowerShell, hooks pré-outil qui court-circuitaient les restrictions d'outils, et commande masquant une partie d'elle-même via des tabulations ou de l'Unicode invisible.
:::

Autrement dit : la liste d'autorisations Bash que tu configureras est de la **défense en profondeur**, pas une frontière de sécurité dure. On développera ce point dans la leçon sur les hooks. Pour l'instant, retiens le geste : **tiens ta version à jour**, c'est la mesure de sécurité la moins chère du parcours.

## La règle qui ne bouge pas

:::cle Le principe de responsabilité
L'agent **propose et exécute** sous ton contrôle. **Toi** restes responsable de ce qui part en production. Plus l'action est irréversible, plus la validation humaine est obligatoire. Aucune version, aucun modèle, aucune configuration ne change cette règle.
:::

## Ce que couvre ce parcours

1. **Bien démarrer** : projet, CLAUDE.md, gestion du contexte.
2. **Slash commands & skills** : industrialiser tes workflows.
3. **Hooks** : automatiser les invariants de façon déterministe.
4. **MCP** : connecter tes outils et tes données (en sécurité).
5. **Sous-agents & architecture agentique** : déléguer et orchestrer proprement.

À la fin, Claude Code ne sera plus un gadget mais ton **environnement de travail** quotidien.

:::defi 15 min — Ton diagnostic de départ
Avant d'aller plus loin, installe le décor et fais ton tri.
- Tu as vérifié ta version de Claude Code et tu es sur 2.1.223 ou plus récent
- Tu as ouvert Claude Code dans un vrai dépôt à toi (pas un projet jouet)
- Tu as écrit une liste de 5 tâches récurrentes de ta semaine
- Pour chacune, tu as noté s'il existe une commande qui dit « c'est bon » ou « c'est cassé »
- Tu as classé les 5 en « à déléguer » / « à garder pour moi », en justifiant en une ligne
:::

:::memo
Q: Quelles sont les 4 étapes de la boucle agentique ?
R: Rassembler le contexte, agir, observer, corriger.
===
Q: Quel critère pratique dit si une tâche est déléguable à l'agent ?
R: S'il existe une commande qui vérifie le résultat automatiquement, elle est déléguable.
===
Q: Quelle est la version de Claude Code au 6 août 2026 ?
R: 2.1.223.
===
Q: Une liste d'autorisations Bash est-elle une frontière de sécurité fiable ?
R: Non. Au moins cinq contournements ont été corrigés entre le 18 juillet et le 6 août 2026. C'est de la défense en profondeur.
===
Q: Combien coûte un développeur actif sur Claude Code, en repère officiel ?
R: Environ 13 $ par jour actif, 150 à 250 $ par mois en entreprise.
:::` +
        FOOTER,
    },
    {
      slug: "bien-demarrer-claude-md-et-contexte",
      title: "Bien démarrer : projet, CLAUDE.md et contexte",
      description:
        "Le contexte fait 80 % du résultat. CLAUDE.md, exploration initiale, mode plan, et hygiène de la fenêtre de contexte.",
      duration_min: 24,
      is_free_preview: false,
      content_md:
        `:::objectifs
- Écrire un CLAUDE.md court et utile, et savoir ce qui n'a rien à y faire
- Lancer une exploration de dépôt avant la première ligne de code
- Faire produire et valider un plan avant d'agir
- Gérer ta fenêtre de contexte avec /clear, /compact, /rewind, /fork et /resume
- Reconnaître les consignes devenues contre-productives sur les modèles récents
:::

:::flash
La qualité de la sortie dépend surtout de **ce que l'agent sait au moment d'agir**. Mais la règle a basculé en juillet 2026 : un CLAUDE.md **court** bat un CLAUDE.md exhaustif. Anthropic a supprimé plus de 80 % du system prompt de Claude Code sans perte de performance mesurable. Le spécialisé va dans des skills, pas dans le contexte permanent.
:::

## Le contexte fait le résultat

Avec un agent, la qualité de la sortie dépend surtout de **ce qu'il sait** au moment d'agir. Un Claude Code mal contextualisé invente des conventions, casse des choses, part dans la mauvaise direction. Bien démarrer, c'est surtout **bien l'informer**.

Mais « bien l'informer » ne veut plus dire « tout lui dire d'avance ». C'est le renversement le plus important de l'été 2026, et il conditionne tout le reste de cette leçon.

:::maj 24 juillet 2026
Dans l'article « The new rules of context engineering for Claude 5 generation models », Anthropic révèle avoir **supprimé plus de 80 % du system prompt de Claude Code** pour les modèles avancés (Opus 5, Fable 5) **sans perte de performance mesurable**. La logique change : on passe de « donner des règles explicites et tout charger d'avance » à « faire confiance au jugement du modèle et divulguer le contexte progressivement ».
:::

## Le premier réflexe : le laisser explorer

Dans un dépôt inconnu, ne lui demande pas tout de suite de coder. Demande-lui d'abord de **lire et de cartographier** : structure du projet, points d'entrée, conventions, scripts disponibles. Tu gagnes un agent qui comprend le terrain avant d'y toucher — et toi, une carte que tu n'avais peut-être pas.

:::prompt Cartographier un dépôt inconnu
Avant toute modification, explore ce dépôt et rends-moi une carte en 4 parties :
1. Structure : les dossiers qui comptent et le rôle de chacun, en une ligne.
2. Points d'entrée : par où démarre l'application, où sont les routes/commandes principales.
3. Outillage : comment lancer les tests, le build, le lint, le formatage. Cite les commandes exactes telles qu'elles apparaissent dans les fichiers de config.
4. Conventions implicites : nommage, style, patterns qui reviennent, choix d'architecture visibles.
Ne modifie aucun fichier. Si une information manque, dis-le au lieu de la deviner.
:::

## CLAUDE.md : la mémoire du projet, pas sa documentation

C'est le fichier le plus rentable. Placé à la racine, il est **chargé automatiquement** dans le contexte à chaque session. Mets-y ce qu'un nouveau collègue devrait savoir et qu'il **ne pourrait pas deviner en lisant le code** :

| À mettre dedans | À laisser dehors |
| --- | --- |
| Commandes clés : tests, build, lint | Ce que l'agent déduit du code en 10 secondes |
| Conventions non évidentes et leur raison | Un tutoriel sur ton framework |
| Zones sensibles, pièges connus, « ne touche pas à » | Des procédures longues et spécialisées (→ un skill) |
| Ce qui n'est écrit nulle part ailleurs | Des exemples à rallonge de code déjà présent dans le dépôt |

Garde-le **court et factuel** — c'est du contexte permanent, pas une documentation. Tu peux pointer vers d'autres fichiers avec une référence du type @chemin/vers/fichier plutôt que tout recopier.

:::piege Le CLAUDE.md obèse
L'erreur la plus fréquente en 2026 : empiler des centaines de lignes « au cas où ». Chaque ligne est rechargée à **chaque session**, coûte du contexte, et dilue les consignes qui comptent vraiment. Si un bloc n'est utile que pour un type de tâche précis, il ne va pas dans CLAUDE.md : il va dans un **skill** chargé à la demande (leçon suivante). Test simple : « Claude peut-il déduire ça du code lui-même ? » Si oui, coupe.
:::

## Les consignes devenues contre-productives

Certaines bonnes pratiques de 2025 se sont retournées. La doc officielle « Prompting Claude Opus 5 » demande explicitement d'**enlever** ces formulations de tes prompts et de ton CLAUDE.md :

- « Ajoute une étape de vérification finale », « double-check ta réponse », « utilise un sous-agent pour vérifier » → **Opus 5 vérifie déjà son travail** ; ces consignes provoquent de la sur-vérification, donc du coût et du temps pour rien.
- « Ne réfléchis pas / ne raisonne pas » dans un system prompt → augmente la fuite de balises de réflexion.
- Dans une consigne de revue de code, « ne remonte que les problèmes graves » → le modèle obéit littéralement et remonte **moins** de choses. Demande tout, filtre en seconde passe.

À l'inverse, ce qui marche mieux maintenant : une consigne de **concision** explicite (les réponses sont plus longues par défaut), une consigne de **périmètre** (tendance à élargir la tâche), et un **plafond sur la délégation** aux sous-agents.

:::astuce Une maquette vaut mieux qu'un paragraphe
Le même article d'Anthropic pose une règle simple : « une maquette HTML d'un design donnera généralement de meilleurs résultats qu'une description ». Généralise-la — pour cadrer une tâche, une **référence riche** (un fichier existant à imiter, un schéma, un exemple de sortie attendue) bat presque toujours une description en prose.
:::

## Cadrer avant d'exécuter : le mode plan

Pour une tâche non triviale, fais d'abord **produire un plan** (mode plan / « réfléchis avant d'agir ») : l'agent décrit ce qu'il compte faire, tu corriges le tir **avant** qu'une seule ligne ne soit écrite. C'est le meilleur ratio temps gagné / risque évité.

:::etapes
1. Ouvre Claude Code à la racine du projet et passe en mode plan.
2. Décris l'objectif **et le critère de succès** : « la commande de tests passe », « le comportement observable ne change pas ».
3. Lis le plan proposé. Cherche les étapes manquantes, pas les fautes de style.
4. Corrige le plan en langage naturel : « ne touche pas à tel module », « commence par un test qui échoue ».
5. Valide, puis laisse exécuter — et relis le diff, toujours.
:::

## L'hygiène de contexte

La fenêtre s'est beaucoup agrandie : **Claude Opus 5, modèle Opus par défaut de Claude Code depuis le 24 juillet 2026, offre 1 million de tokens de contexte**. Mais la règle de fond n'a pas changé : **un contexte pollué dégrade les réponses**, même très loin de la saturation.

| Commande | Quand s'en servir |
| --- | --- |
| /clear | Repartir propre entre deux tâches sans rapport |
| /compact | Garder l'essentiel d'une session longue qui s'allonge |
| /rewind | Revenir en arrière — y compris retrouver la conversation d'avant un /clear |
| /fork | Copier la conversation courante dans une session d'arrière-plan (depuis le 17/07/2026) |
| /resume | Rouvrir une session précédente via un sélecteur (depuis le 17/07/2026) |
| /doctor | Check-up de l'installation ; propose d'élaguer un CLAUDE.md trop bavard |
| /usage | Voir ta consommation — attention, remise à zéro à chaque /clear |

:::maj 6 août 2026
Deux changements à connaître sur le contexte. Depuis la version 2.1.211, les totaux de **/usage sont remis à zéro à chaque /clear** : si tu suis ta consommation, note-la avant de nettoyer. Et depuis la 2.1.223, la variable \`CLAUDE_CODE_DISABLE_1M_CONTEXT\` s'applique à **tous** les modèles à 1 million de tokens, plus seulement à certains.
:::

Au-delà des commandes, c'est une habitude qu'il faut prendre. La plupart des sessions qui dérapent ne dérapent pas par manque de contexte, mais parce qu'on empile trois sujets sans jamais nettoyer entre les deux.

:::cle Ranger entre deux tâches
Un bon opérateur de Claude Code gère son contexte comme un plan de travail : on range entre deux tâches, on ne laisse pas tout traîner. Le réflexe coûte 3 secondes et évite le grand classique — l'agent qui applique à la tâche B une contrainte que tu avais posée pour la tâche A.
:::

## À retenir

Investis 10 minutes dans un CLAUDE.md **court** et un plan validé : tu économises des heures de corrections. Le contexte n'est pas une formalité, c'est le levier numéro un — à condition d'accepter que « plus de contexte » ne veut plus dire « meilleur contexte ».

:::defi 25 min — Dégraisser ton contexte
Prends un vrai projet et remets ton contexte à plat.
- Tu as lancé une exploration du dépôt avec le prompt de cartographie de cette leçon
- Ton CLAUDE.md tient en moins de 50 lignes
- Chaque ligne restante passe le test « Claude ne peut pas le déduire du code »
- Tu as supprimé toute consigne de type « ajoute une vérification finale » / « double-check »
- Tu as ajouté une consigne de concision et une consigne de périmètre
- Tu as fait produire un plan sur une vraie tâche et corrigé au moins un point avant de l'exécuter
:::

:::memo
Q: Pourquoi faut-il garder CLAUDE.md court depuis juillet 2026 ?
R: Anthropic a retiré plus de 80 % du system prompt de Claude Code sans perte de performance. Le spécialisé va dans des skills chargés à la demande.
===
Q: Quel test appliquer à chaque ligne de CLAUDE.md ?
R: « Claude peut-il le déduire du code lui-même ? » Si oui, on coupe.
===
Q: Quelle consigne classique est devenue contre-productive sur Opus 5 ?
R: Demander une étape de vérification finale ou un double-check : le modèle vérifie déjà, on obtient de la sur-vérification.
===
Q: Que se passe-t-il pour /usage quand on fait /clear ?
R: Les totaux sont remis à zéro, depuis la version 2.1.211.
===
Q: À quoi sert /rewind ?
R: À revenir en arrière dans la session, y compris retrouver la conversation d'avant un /clear.
:::` +
        FOOTER,
    },
    {
      slug: "slash-commands-et-skills",
      title: "Slash commands & skills : industrialiser vos workflows",
      description:
        "Transformer vos prompts récurrents en commandes et skills réutilisables — et savoir quand en créer un.",
      duration_min: 26,
      is_free_preview: false,
      content_md:
        `:::objectifs
- Créer un skill dans .claude/skills/ avec un frontmatter qui déclenche au bon moment
- Passer des arguments à un skill, y compris nommés, et en empiler plusieurs
- Encoder une vérification manuelle récurrente en boucle de vérification automatisée
- Savoir quelles commandes Claude ne lance plus tout seul depuis juillet 2026
- Auditer un skill récupéré sur GitHub avant de l'installer
:::

:::flash
Les skills figent tes workflows récurrents dans \`.claude/skills/<nom>/SKILL.md\`. Le champ qui décide de tout, c'est la **description** : c'est elle que l'agent lit pour savoir s'il doit activer le skill. Depuis juillet 2026, Claude ne déclenche plus certaines commandes tout seul — le contrôle est revenu côté humain, et \`/review\` est devenu un simple alias de \`/code-review\`.
:::

## Le problème : retaper les mêmes prompts

Dès que tu utilises Claude Code sérieusement, tu répètes les mêmes consignes : « relis ce diff comme un reviewer sévère », « écris un composant selon nos conventions », « prépare un message de commit ». Les **commandes** et les **skills** servent à figer ces workflows une fois pour toutes.

C'est aussi la bonne destination pour tout ce que tu as dû **sortir de ton CLAUDE.md** à la leçon précédente : le spécialisé n'a pas disparu, il est simplement chargé à la demande au lieu d'être payé à chaque session.

## Slash commands et skills : la convergence

Historiquement, on créait des **slash commands** : des fichiers Markdown dans **.claude/commands/** invoqués par /nom. Ils ont **convergé avec les skills** : l'emplacement recommandé aujourd'hui est **.claude/skills/<nom>/SKILL.md** (le dossier .claude/commands/ reste pris en charge en legacy). Vérifie le détail selon ta version.

:::etapes
1. Crée le dossier \`.claude/skills/revue-diff/\` à la racine de ton projet.
2. Crée dedans un fichier \`SKILL.md\`.
3. Ouvre-le par un frontmatter YAML entre deux lignes \`---\` avec au moins \`name\` et \`description\`.
4. Écris la consigne en dessous, comme si tu briefais un collègue compétent mais nouveau.
5. Déplace le détail volumineux (checklists, exemples longs) dans des fichiers voisins que le skill ira lire au besoin.
6. Invoque-le avec \`/revue-diff\` et corrige la description tant qu'il ne se déclenche pas au bon moment.
:::

## Passer des arguments

Concrètement, tu écris une fois la consigne, et tu la rejoues d'un mot. Tu peux passer des arguments (syntaxe vérifiée juillet 2026) :

| Syntaxe | Ce que ça capture |
| --- | --- |
| \`$ARGUMENTS\` | **Tout** le texte passé après la commande |
| \`$ARGUMENTS[N]\` ou \`$N\` | Un argument **positionnel** — la numérotation part de **0** (\`$0\` = premier, \`$1\` = deuxième) |
| \`$issue\`, \`$branch\`… | Des arguments **nommés**, déclarés via un champ \`arguments\` dans le frontmatter |

:::piege La numérotation part de zéro
C'est le piège classique : dans un skill, \`$1\` n'est **pas** le premier argument mais le **deuxième**. Si ton skill reçoit systématiquement la mauvaise valeur, c'est presque toujours ça. Utilise plutôt des **arguments nommés** dès que tu en as plus d'un : \`$issue\` et \`$branch\` ne se mélangent jamais, contrairement à \`$0\` et \`$1\`.
:::

Astuce puissante : on peut **empiler jusqu'à 6 skills** dans un même message (\`/revue /conventions corrige ce module\`) — tous se chargent, le texte restant leur arrive en \`$ARGUMENTS\`.

## Un skill, c'est quoi exactement

Un skill = un fichier **SKILL.md** avec un en-tête (frontmatter). Tous les champs y sont **facultatifs** : sans \`name\`, le skill prend le nom de son dossier ; sans \`description\`, c'est le premier paragraphe du contenu qui sert de description. Mais ne t'en passe pas.

:::cle La description est le déclencheur
**La description est ce que l'agent lit pour décider** d'activer le skill — pas le contenu, qu'il ne charge qu'ensuite (plafond de 1 536 caractères avec \`when_to_use\`). Une description vague = un skill qui ne se déclenche jamais au bon moment. Écris-la comme une condition d'activation : « à utiliser quand… », avec les mots que tu emploies réellement dans tes demandes.
:::

Le champ **\`allowed-tools\`** mérite le détour : il restreint les outils que le skill a le droit d'utiliser. C'est du moindre privilège appliqué à tes propres workflows — un skill de relecture n'a aucune raison de pouvoir écrire des fichiers.

Le détail volumineux (procédures, exemples) va dans des fichiers que le skill charge **à la demande**, pour ne pas alourdir le contexte. C'est exactement la « divulgation progressive » de la leçon précédente.

## Ce que Claude ne lance plus tout seul

:::maj 22 juillet 2026
Le harnais a repris de la discipline. Depuis le **19 juillet 2026** (version 2.1.215), Claude **ne lance plus \`/verify\` ni \`/code-review\` automatiquement** — c'est à toi de les déclencher. Depuis le **22 juillet** (2.1.218), \`/code-review\` s'exécute dans un **sous-agent d'arrière-plan**, et **\`/deep-research\` passe en lancement manuel uniquement**. Enfin, depuis le **6 août 2026** (2.1.223), **\`/review\` est devenu un alias de \`/code-review\`** et réutilise le niveau d'effort précédent.
:::

Conséquence pratique : si tu comptais sur une relecture automatique en fin de tâche, elle n'arrive plus. Deux options — l'invoquer explicitement, ou l'encoder toi-même dans un skill, ce qui est justement le sujet du prochain point.

## Les boucles de vérification : le vrai usage avancé

Dans son article du 22 juillet 2026 « Building verification loops in Claude Code with skills », Anthropic décrit un pattern simple : **tout ce que tu vérifies à la main après chaque tâche mérite d'être encodé en skill**. Le frontmatter tient en trois champs — \`name\`, \`description\`, \`allowed-tools\` — et l'article distingue quatre façons de brancher la vérification :

| Pattern | Fonctionnement |
| --- | --- |
| Standalone | Le skill est invoqué explicitement, quand tu le décides |
| Embedded | La vérification est intégrée dans un skill de tâche plus large |
| Chained | Plusieurs skills s'enchaînent, chacun vérifiant l'étape précédente |
| PR-wide | La vérification tourne sur la pull request, via GitHub Actions |

:::prompt Transformer ta checklist manuelle en skill
Je veux encoder ma vérification manuelle en skill Claude Code.
Voici ce que je contrôle à la main après chaque modification de ce projet :
[colle ici ta checklist, même en vrac]

Crée-moi le fichier .claude/skills/<nom>/SKILL.md correspondant :
- frontmatter avec name, description et allowed-tools
- la description doit être une condition d'activation explicite, formulée avec les mots que j'emploie réellement dans mes demandes
- allowed-tools limité au strict nécessaire pour vérifier, sans droit d'écriture si la vérification n'écrit rien
- le corps décrit la procédure pas à pas, avec les commandes exactes du projet
- si la procédure dépasse 40 lignes, sors le détail dans un fichier voisin que le skill lit à la demande
Ne modifie aucun autre fichier.
:::

## Quand créer un skill (et quand non)

Crée un skill quand un workflow est **récurrent, structuré et stable** : revue de code maison, génération d'un type de fichier selon tes conventions, procédure de release. Ne le fais pas pour un besoin ponctuel — un simple prompt suffit.

Le seuil pratique : **trois fois**. Si tu as retapé la même consigne trois fois, elle est mûre pour devenir un skill. En dessous, tu figes prématurément un workflow qui bouge encore.

## Le réflexe sécurité

Tu trouveras des commands et skills tout faits sur GitHub. **Ce sont des instructions que ton agent va exécuter** : lis-les avant de les installer, exactement comme du code. (Le parcours « Prompts & Skills GitHub » détaille le vetting.)

:::piege Le skill de dépôt externe installé sans lecture
Un skill n'est pas un plugin inerte : c'est un texte qui devient une consigne pour un agent qui a accès à tes fichiers et à ton shell. Regarde en particulier son \`allowed-tools\` (que s'autorise-t-il ?), les fichiers annexes qu'il charge, et toute instruction qui lui dirait d'ignorer des consignes précédentes. Un skill non lu est un risque : traite-le comme du code, pas comme un presse-bouton.
:::

Le meilleur moyen d'apprendre à lire les skills des autres, c'est d'en écrire un. À toi.

:::defi 30 min — Ton premier skill de vérification
Encode une vérification que tu fais aujourd'hui à la main.
- Le skill vit dans .claude/skills/<nom>/SKILL.md
- Son frontmatter contient name, description et allowed-tools
- La description est formulée comme une condition d'activation, pas comme un titre
- allowed-tools ne contient aucun droit d'écriture si le skill ne fait que vérifier
- Le corps tient en moins de 40 lignes, le détail éventuel étant dans un fichier voisin
- Tu l'as déclenché deux fois : une fois par son nom, une fois sans le nommer (il s'est activé seul)
- Tu as noté quel pattern tu vises ensuite : standalone, embedded, chained ou PR-wide
:::

:::memo
Q: Où vit un skill aujourd'hui ?
R: Dans .claude/skills/<nom>/SKILL.md. Le dossier .claude/commands/ reste pris en charge en legacy.
===
Q: Quel champ du frontmatter décide si un skill se déclenche ?
R: La description : c'est ce que l'agent lit pour choisir d'activer le skill.
===
Q: Dans un skill, que capture $1 ?
R: Le deuxième argument positionnel : la numérotation part de 0.
===
Q: Depuis le 6 août 2026, que fait /review ?
R: C'est un alias de /code-review, qui réutilise le niveau d'effort précédent.
===
Q: Claude déclenche-t-il /code-review ou /deep-research tout seul ?
R: Non. Le lancement automatique de /verify et /code-review a été retiré le 19 juillet 2026, et /deep-research est manuel uniquement depuis le 22 juillet.
:::` +
        FOOTER,
    },
    {
      slug: "hooks-automatiser-les-invariants",
      title: "Hooks : automatiser les invariants",
      description:
        "Faire exécuter des commandes déterministes par le harnais à chaque événement — pour garantir ce que le modèle ne doit pas oublier.",
      duration_min: 22,
      is_free_preview: false,
      content_md:
        `:::objectifs
- Distinguer ce qui doit passer par un hook de ce qui peut rester une consigne
- Brancher un hook de formatage et un hook de protection de fichiers sensibles
- Situer les événements disponibles, dont le hook DirectoryAdded arrivé en juillet 2026
- Régler le bac à sable avec sandbox.filesystem.disabled et sandbox.network.strictAllowlist
- Expliquer pourquoi une liste d'autorisations Bash n'est pas une frontière de sécurité dure
:::

:::flash
Un hook est une commande shell que **le harnais** exécute automatiquement à un événement — pas le modèle. C'est la seule façon de rendre un invariant **déterministe**. Revers de la médaille : un hook tourne avec tes droits, et le changelog du 4 août 2026 documente un cas où des hooks pré-outil **contournaient les restrictions d'outils**. Puissant, donc à relire.
:::

## L'idée : ne pas compter sur la bonne volonté du modèle

Demander à l'agent « n'oublie pas de lancer le linter » marche… parfois. Les **hooks** rendent ça **déterministe** : ce sont des commandes shell que **le harnais** (pas le modèle) exécute automatiquement à certains événements. Ce qui passe par un hook est garanti, à chaque fois.

:::cle La bonne frontière
Consigne dans CLAUDE.md ou dans un skill = **une préférence** que le modèle suivra la plupart du temps. Hook = **une garantie** appliquée par le système. Règle de tri : si l'oubli est simplement agaçant, une consigne suffit ; si l'oubli est **coûteux ou irrattrapable**, c'est un hook.
:::

## Où et comment

Les hooks se configurent dans la configuration de Claude Code (un fichier de réglages de type settings.json versionné pour l'équipe, ou un settings.local.json personnel). On y associe un **événement** à une **commande**.

:::etapes
1. Choisis la portée : \`settings.json\` versionné si la règle vaut pour toute l'équipe, \`settings.local.json\` si elle est personnelle.
2. Ajoute la section des hooks et associe un **événement** à une **commande** shell.
3. Commence par un hook inoffensif et observable : formater le fichier qui vient d'être édité.
4. Déclenche-le pour de vrai (fais éditer un fichier) et vérifie qu'il s'est exécuté.
5. Seulement ensuite, ajoute un hook **bloquant** — et teste explicitement le cas qu'il doit refuser.
:::

Les événements les plus utiles :

| Événement | Quand il se déclenche | Usage typique |
| --- | --- | --- |
| PreToolUse | **Avant** une action de l'agent — peut la **bloquer** | Interdire l'écriture sur des fichiers de secrets ou de config de prod |
| PostToolUse | **Après** une action | Formater ou linter le fichier édité, lancer les tests concernés |
| Notification | Quand l'agent réclame ton attention | Brancher une notification système : un agent d'arrière-plan a besoin de toi ou vient de finir |
| DirectoryAdded | Quand un répertoire est ajouté à la session (depuis le 24/07/2026) | Charger un contexte propre au dossier, vérifier qu'il est autorisé |

Selon la convention, un hook **PreToolUse** qui renvoie un certain code de sortie (souvent un code d'erreur dédié) **bloque** l'action — utile pour interdire une opération dangereuse. Vérifie la sémantique exacte des codes dans ta version.

## Cas d'usage qui changent la vie

- **Formater / linter** automatiquement chaque fichier édité (PostToolUse).
- **Lancer les tests** concernés après une modification.
- **Protéger des fichiers ou dossiers sensibles** : bloquer toute écriture sur, par exemple, des fichiers de secrets ou de config de prod (PreToolUse).
- **Imposer une convention** que tu ne veux pas répéter à chaque session.
- **Être alerté au bon moment** : l'événement Notification signale entre autres qu'un agent en arrière-plan a besoin de toi ou vient de terminer — pratique pour ne plus surveiller le terminal.

:::astuce Le hook « notification » est le plus sous-estimé
Depuis que les sous-agents tournent en arrière-plan par défaut, on passe son temps à guetter le terminal. Un hook branché sur Notification qui envoie une notification système (ou un simple bip) te rend ce temps : tu lances, tu pars sur autre chose, et tu reviens quand le système t'appelle.
:::

## Le bac à sable : ce que l'agent peut atteindre

Les hooks disent ce qui **doit** se passer ; le bac à sable dit ce qui **peut** se passer. Deux réglages arrivés en juillet 2026 méritent d'être connus :

- **\`sandbox.filesystem.disabled\`** (20 juillet 2026) — contrôle l'isolation du système de fichiers.
- **\`sandbox.network.strictAllowlist\`** (24 juillet 2026) — durcit la liste des destinations réseau autorisées.

Sur Linux et WSL, la version 2.1.221 (4 août 2026) a aussi ajouté un mode \`"mask"\` pour les fichiers de credentials du bac à sable : le fichier existe toujours, mais son contenu n'est plus lisible depuis l'environnement isolé.

## Le revers : un hook exécute du code arbitraire

Un hook lance des commandes shell avec **tes droits**. Deux règles :

- **Relis** tout hook avant de l'activer, surtout s'il vient d'un dépôt externe.
- Préfère des hooks **simples et lisibles** (formatage, lint, garde-fous) à des scripts opaques.

:::maj 4 août 2026
La version 2.1.222 corrige un cas où **les hooks PreToolUse contournaient les restrictions d'outils** — un hook pouvait faire passer une action que la configuration était censée interdire. La même version corrige des sessions en worktree qui exécutaient des commandes git destructrices. Ce n'est pas anecdotique : un mécanisme de garde-fou avait lui-même un trou.
:::

## Ce que ça t'apprend sur la sécurité de Claude Code

Ce correctif n'est pas isolé. Entre le **18 juillet et le 6 août 2026**, le changelog documente **au moins cinq contournements du système de permissions Bash** corrigés :

| Version | Date | Contournement corrigé |
| --- | --- | --- |
| 2.1.214 | 18/07/2026 | Contournement en **PowerShell 5.1** ; règles \`dir/**\` auto-approuvant des sous-répertoires imbriqués |
| 2.1.221 | 04/08/2026 | Contournement via **conditionnels regex zsh** ; mauvaise gestion des **guillemets PowerShell** |
| 2.1.222 | 04/08/2026 | **Hooks PreToolUse** contournant les restrictions d'outils |
| 2.1.223 | 06/08/2026 | Commande forgée se masquant partiellement ; prompt de permission cachant une partie de la commande via **tabulations ou Unicode invisible** |

:::cle Défense en profondeur, pas frontière dure
Une liste d'autorisations Bash dans ta configuration **réduit la surface d'erreur** : elle n'est **pas** une frontière de sécurité garantie. Le corollaire est très concret : **tiens Claude Code à jour** (2.1.223 au 6 août 2026), ne lui donne pas d'accès dont tu ne veux pas assumer l'usage, et garde la validation humaine sur l'irréversible. La sécurité ne vient jamais d'un seul mécanisme.
:::

Ce point est celui qu'on interprète le plus souvent à l'envers, avec des conséquences bien réelles.

:::piege « J'ai une allowlist, donc je peux tout automatiser »
C'est le raisonnement qui fait mal. Une allowlist bien réglée arrête les accidents et la majorité des dérapages — mais les contournements ci-dessus montrent qu'un contenu hostile (un fichier lu, une page web, une PR) peut chercher à la franchir. Superpose les couches : allowlist **et** bac à sable **et** validation humaine sur ce qui compte.
:::

> Les hooks déplacent les invariants critiques du « le modèle s'en souviendra peut-être » vers « le système le garantit ». C'est exactement là qu'ils ont de la valeur — à condition de traiter le hook lui-même comme du code de production.

:::defi 25 min — Deux hooks et un test qui échoue
Mets en place le duo formatage + garde-fou, et prouve que le garde-fou marche.
- Un hook PostToolUse formate automatiquement chaque fichier édité par l'agent
- Tu l'as vu s'exécuter pour de vrai après une édition
- Un hook PreToolUse bloque toute écriture sur tes fichiers de secrets ou de config de prod
- Tu as **testé le blocage** : tu as demandé l'écriture interdite et elle a bien été refusée
- Chaque hook tient en une commande lisible, sans script opaque
- Tu as vérifié ta version de Claude Code (2.1.223 ou plus récent) et noté pourquoi ça compte
:::

:::memo
Q: Qui exécute un hook, le modèle ou le harnais ?
R: Le harnais. C'est ce qui rend le hook déterministe, contrairement à une consigne.
===
Q: Quel événement peut bloquer une action avant qu'elle ait lieu ?
R: PreToolUse.
===
Q: Quel hook est apparu le 24 juillet 2026 ?
R: DirectoryAdded, déclenché quand un répertoire est ajouté à la session.
===
Q: Une liste d'autorisations Bash est-elle une frontière de sécurité dure ?
R: Non : au moins cinq contournements ont été corrigés entre le 18 juillet et le 6 août 2026. C'est de la défense en profondeur.
===
Q: Quel réglage durcit la liste des destinations réseau autorisées ?
R: sandbox.network.strictAllowlist, ajouté le 24 juillet 2026.
:::` +
        FOOTER,
    },
    {
      slug: "mcp-connecter-vos-outils",
      title: "MCP : connecter vos outils et vos données",
      description:
        "Le Model Context Protocol pour donner à l'agent l'accès à vos bases, API et outils — sans ouvrir une faille de sécurité.",
      duration_min: 22,
      is_free_preview: false,
      content_md:
        `:::objectifs
- Brancher un serveur MCP sur ton projet et vérifier ce qui est effectivement connecté
- Appliquer le moindre privilège à une connexion d'outil
- Reconnaître la « triade létale » et savoir laquelle des trois conditions tu peux casser
- Situer la révision de la spécification MCP du 28 juillet 2026 et ce qu'elle change
:::

:::flash
MCP donne à l'agent l'accès à tes bases, tickets et API internes. Le prix à payer : un serveur MCP est **un programme qui tourne avec tes droits**, et ce qu'il te rapporte est du **contenu non fiable**. Retiens la triade létale — données privées + contenu non fiable + moyen d'exfiltration — et casse toujours au moins un des trois maillons.
:::

## Sortir du dépôt : brancher le monde réel

Par défaut, Claude Code agit sur ton code. Le **Model Context Protocol (MCP)** lui permet de se brancher à **d'autres outils et sources** : une base de données, un système de tickets, une API interne, un service de documentation. Un **serveur MCP** expose des **outils** (actions), des **ressources** (données) et parfois des **prompts**.

## Comment on ajoute un serveur

Deux voies courantes : déclarer le serveur dans un fichier de projet (souvent **.mcp.json**, versionnable et partageable avec l'équipe), ou l'ajouter en ligne de commande.

:::etapes
1. Choisis le mode de déclaration : \`.mcp.json\` à la racine si le serveur doit être partagé avec l'équipe, ligne de commande si l'usage est personnel.
2. Déclare le serveur avec le **minimum de portée** : lecture seule, périmètre restreint, pas de jeton plus large que nécessaire.
3. Vérifie ce qui est réellement connecté : \`claude mcp list\` depuis le terminal, ou \`/mcp\` en session.
4. Pour un serveur derrière OAuth, connecte-toi avec \`claude mcp login <nom>\` (et \`claude mcp logout <nom>\` pour couper l'accès).
5. Épingle une version précise du serveur, plutôt qu'une référence mouvante.
6. Fais un premier appel de lecture inoffensif et regarde ce qui revient réellement dans le contexte.
:::

## Ce que ça débloque

- Interroger une base pour analyser des données réelles, sans copier-coller.
- Lire des tickets / specs pour cadrer une tâche.
- Appeler une API interne dans un workflow automatisé.
- Consulter une documentation interne au lieu de laisser l'agent inventer une API.

## Le point critique : un serveur MCP tourne avec tes droits

C'est la partie que personne ne doit sauter. Un serveur MCP est **un programme qui s'exécute sur ta machine, avec tes permissions**. Un serveur malveillant ou mal écrit peut lire tes fichiers, tes secrets, et les envoyer ailleurs. De plus, les **données rapportées par un outil sont du contenu non fiable** : elles peuvent contenir une injection de prompt visant à détourner ton agent.

Les règles de base :

- **N'installe que des serveurs de confiance**, et lis leur code (comme un skill).
- **Moindre privilège** : un accès en lecture seule et restreint au strict nécessaire ; ne lui passe pas tous tes secrets.
- **Épingle une version** ; ne suis pas une source qui peut changer sous toi.
- Traite les sorties d'outils comme des **données**, jamais comme des ordres.

:::cle La triade létale
Une fuite de données par un agent demande **trois** conditions réunies : (1) l'accès à des **données privées**, (2) l'exposition à du **contenu non fiable**, (3) un **moyen d'exfiltration** vers l'extérieur. Tant que les trois coexistent, le risque est structurel. Ta marge de manœuvre : **en casser au moins un**. C'est le cadre de raisonnement à garder devant chaque nouvelle connexion MCP.
:::

## Une illustration réelle : l'affaire web_fetch

Le 15 juillet 2026, le chercheur Ayush Paul a publié une faille d'exfiltration sur l'outil \`web_fetch\`. La protection en place limitait \`web_fetch\` aux URL saisies par l'utilisateur ou retournées par une recherche web. Le trou : il pouvait aussi visiter les URL **contenues dans des pages déjà récupérées**.

Un site piège, déguisé en page d'authentification Cloudflare, poussait alors l'agent à naviguer « lettre par lettre » via des liens ordonnés alphabétiquement — exfiltrant nom, ville et employeur, un caractère par requête. L'attaque ne se déclenchait que pour les agents utilisateurs contenant \`Claude-User\`.

:::maj 15 juillet 2026
**La faille est corrigée** : \`web_fetch\` ne peut plus suivre les liens trouvés dans du contenu précédemment récupéré. Ce qu'il faut en retenir n'est pas le correctif, c'est le **schéma** : les trois conditions de la triade létale étaient réunies, et le maillon exploité était le plus discret des trois — un canal de sortie qui ne ressemblait pas à un canal de sortie.
:::

C'est précisément ce dernier point qui piège les gens quand ils évaluent une nouvelle connexion.

:::piege Croire que l'exfiltration passe forcément par un envoi explicite
Personne n'aurait autorisé « envoie mes données à ce serveur ». L'attaque n'en avait pas besoin : une simple **suite de lectures** suffisait, chaque URL visitée transmettant un caractère. Quand tu évalues une connexion MCP, ne cherche pas seulement les outils qui « écrivent » ou « envoient » : demande-toi si un outil de **lecture** peut être piloté pour signaler quelque chose vers l'extérieur.
:::

## Le garde-fou côté harnais

Signe que le risque est pris au sérieux jusque chez l'éditeur : depuis mi-2026, un dépôt cloné ne peut plus **auto-approuver ses propres serveurs** \`.mcp.json\` via un fichier de réglages committé — dans un espace de travail non approuvé, ils restent « en attente d'approbation » au lieu de se lancer. Exactement l'esprit de cette leçon : chaque connexion est une porte, et c'est à toi de l'ouvrir.

(Le parcours « Prompts & Skills GitHub : sécuriser » détaille ce modèle de menace.)

## Le protocole lui-même bouge : la révision du 28 juillet 2026

MCP a publié une révision majeure de sa spécification, référencée **2026-07-28**. Elle ne change rien à ta façon d'utiliser Claude Code aujourd'hui, mais elle explique pourquoi les serveurs que tu croises vont évoluer.

| Ce qui change | Conséquence |
| --- | --- |
| Suppression des sessions au niveau protocole et du header \`Mcp-Session-Id\` | L'état entre appels passe par des **handles émis par le serveur**, passés en arguments d'outil |
| MCP devient **stateless** : plus de handshake \`initialize\` | Chaque requête porte sa version de protocole et les capacités du client |
| Nouveau RPC obligatoire \`server/discover\` | Les serveurs doivent exposer leur découverte de façon standard |
| **Roots, Sampling et Logging dépréciés** | Fenêtre de dépréciation d'au moins 12 mois ; migrer vers des paramètres d'outil, l'API du fournisseur en direct, ou \`stderr\`/OpenTelemetry |
| Transport **HTTP+SSE** reclassé *Deprecated* | Les intégrations qui en dépendent devront bouger |
| **Dynamic Client Registration** dépréciée au profit des **Client ID Metadata Documents** | L'enregistrement d'un client change de mécanisme |

Côté autorisation, la révision durcit aussi les règles : les serveurs d'autorisation **devraient** inclure le champ \`iss\`, et les clients **doivent** le valider avant d'échanger le code — une protection directe contre la réutilisation de credentials sur un autre serveur d'autorisation.

:::piege Ne confonds pas « la spec a changé » et « ton outil a changé »
Anthropic a indiqué le 28 juillet 2026 que le support de cette révision « est en cours de déploiement ». **Aucune date de bascule ni de dépréciation côté Claude Code n'est publiée à ce jour.** Ne réécris donc pas tes intégrations dans l'urgence sur la foi de la spec seule : vérifie ce que supporte réellement ta version, et traite ce tableau comme une carte de ce qui arrive, pas comme une échéance.
:::

> MCP transforme Claude Code en chef d'orchestre de tes outils. Mais chaque connexion est une porte : ouvre-la en connaissance de cause, jamais par confort.

:::defi 25 min — Une connexion, trois questions
Branche un serveur MCP réel et fais-en l'audit avant de t'en servir sérieusement.
- Le serveur est déclaré au bon endroit (.mcp.json si partagé, ligne de commande sinon)
- Tu as vérifié la connexion avec claude mcp list ou /mcp
- Son accès est en lecture seule et restreint au strict nécessaire
- Sa version est épinglée
- Tu as répondu par écrit aux trois questions de la triade : à quelles données privées touche-t-il ? à quel contenu non fiable expose-t-il l'agent ? quel canal de sortie existe-t-il ?
- Tu as identifié lequel des trois maillons tu peux casser, et tu l'as cassé
:::

:::memo
Q: Quelles sont les trois conditions de la triade létale ?
R: Données privées, contenu non fiable, et un moyen d'exfiltration. Il suffit d'en casser une.
===
Q: Avec quels droits s'exécute un serveur MCP ?
R: Les tiens. C'est un programme qui tourne sur ta machine avec tes permissions.
===
Q: Comment traiter les données renvoyées par un outil MCP ?
R: Comme du contenu non fiable : des données à vérifier, jamais des ordres à exécuter.
===
Q: Qu'est-ce qui a changé dans la spécification MCP du 28 juillet 2026 ?
R: Le protocole devient stateless : plus de sessions ni de handshake initialize, un RPC server/discover obligatoire, et Roots, Sampling et Logging dépréciés.
===
Q: Faut-il migrer ses intégrations MCP tout de suite ?
R: Non. Aucune date de bascule côté Claude Code n'est publiée ; vérifie ce que supporte ta version.
:::` +
        FOOTER,
    },
    {
      slug: "sub-agents-et-workflow-agentic",
      title: "Sub-agents & architecturer un workflow agentic",
      description:
        "Déléguer à des agents spécialisés et orchestrer des tâches multi-étapes fiables, avec un humain dans la boucle.",
      duration_min: 28,
      is_free_preview: false,
      content_md:
        `:::objectifs
- Créer un sous-agent spécialisé et lui donner le strict minimum d'outils
- Citer les limites en vigueur : profondeur, concurrence, plafonds par session
- Régler workflowSizeGuideline en connaissance de cause
- Encadrer un agent d'arrière-plan qui ouvre lui-même une pull request en brouillon
- Piloter le coût d'un workflow agentique au lieu de le subir
:::

:::flash
Déléguer, c'est isoler du contexte et spécialiser — pas se débarrasser du travail. Au 6 août 2026, les limites sont bornées : **profondeur 3, 20 sous-agents en concurrence, 200 par session**. Opus 5 délègue plus volontiers qu'avant : la consigne utile n'est plus « fais vérifier par un sous-agent » mais **« plafonne la délégation »**.
:::

## Déléguer : les sous-agents

Quand une tâche revient et mérite une expertise dédiée, crée un **sous-agent** : un agent spécialisé (défini dans **.claude/agents/**) avec son **propre system prompt**, ses **outils** et son **contexte isolé**. Comme pour un skill, sa **description** déclenche la délégation au bon moment.

Pourquoi déléguer plutôt que tout faire dans la session principale :

- **Isoler le contexte** : le sous-agent travaille sur sa tâche sans polluer (ni être pollué par) le reste.
- **Spécialiser** : un agent « revue de sécurité » avec une consigne précise est meilleur qu'un agent généraliste.
- **Paralléliser** : depuis mi-2026, ce n'est plus une option mais le **comportement par défaut** — les sous-agents tournent en arrière-plan, l'agent principal continue de travailler et est notifié quand ils terminent. Si un sous-agent de fond a besoin d'une permission, la demande remonte dans ta session principale (avec le nom de l'agent demandeur).

Donne à chaque sous-agent **le minimum d'outils nécessaires** (moindre privilège), comme pour un serveur MCP. Côté création : plus d'assistant dédié — demande à Claude de créer l'agent, ou édite directement les fichiers de **.claude/agents/**.

## Les limites chiffrées, au 6 août 2026

Ce sont les chiffres qui expliquent pourquoi un workflow « part en vrille » ou au contraire s'arrête plus tôt que prévu.

:::chiffres
3 | niveaux de profondeur de délégation par défaut
20 | sous-agents en concurrence au maximum
200 | sous-agents par session
200 | recherches web par session
:::

« Profondeur 3 » veut dire qu'un sous-agent peut lui-même déléguer, et son délégué encore une fois — mais pas au-delà. C'est ce paramètre qui borne les arborescences d'agents qui partent en cascade sans que personne ne s'en aperçoive.

:::maj 24 juillet 2026
La profondeur de délégation par défaut est **revenue à 3** avec la version 2.1.219. Si tu as lu ailleurs un chiffre différent, vérifie la date : ces plafonds ont bougé plusieurs fois cet été. Autre changement de la même version, le paramètre \`mode\` de l'outil de délégation est **déprécié** depuis le 17 juillet 2026 — ne l'utilise plus dans tes configurations.
:::

## Cadrer la taille des workflows dynamiques

Quand Claude Code compose lui-même un workflow multi-agents, une clé de configuration borne son ambition : **\`workflowSizeGuideline\`**.

| Valeur | Ordre de grandeur visé |
| --- | --- |
| \`small\` | Moins de 5 agents |
| \`medium\` | Moins de 15 agents — **valeur par défaut depuis le 24 juillet 2026** |
| \`large\` | Moins de 50 agents |
| \`unrestricted\` | Aucune borne indicative (ancienne valeur par défaut) |

Au-delà de cette indication, le moteur d'exécution impose ses propres plafonds : **16 agents concurrents** et **1 000 agents par exécution** au maximum. Et si tu ne veux pas du tout de workflows dynamiques, ils se coupent avec \`disableWorkflows: true\` ou la variable d'environnement \`CLAUDE_CODE_DISABLE_WORKFLOWS=1\`.

:::cle Le défaut a changé de philosophie
Passer de \`unrestricted\` à \`medium\` n'est pas un détail de configuration : c'est un aveu que **plus d'agents ne veut pas dire meilleur résultat**. Un workflow de 40 agents coûte cher, dérive plus, et se relit très mal. Si tu montes à \`large\`, ce doit être un choix argumenté, pas un réflexe.
:::

## Ne demande plus à un sous-agent de vérifier

C'est le renversement le plus contre-intuitif de l'été 2026, et il touche directement ce chapitre.

:::piege « Utilise un sous-agent pour vérifier ton travail »
La doc officielle « Prompting Claude Opus 5 » demande de **supprimer** ces instructions : « ajoute une étape de vérification finale », « double-check ta réponse », « utilise un sous-agent pour vérifier ». Opus 5 vérifie déjà son travail ; ces consignes produisent de la **sur-vérification** — plus de tokens, plus de temps, pas plus de qualité. Et comme Opus 5 délègue déjà plus volontiers que ses prédécesseurs, la consigne utile est l'inverse : **plafonner la délégation**.
:::

À la place, ce qui marche : une consigne de **périmètre** (« ne touche pas au-delà de ces fichiers »), une consigne de **concision**, et un plafond explicite sur le nombre de sous-agents. Et surtout : une **vérification déterministe** — un test, un lint, un hook — plutôt qu'un agent chargé de relire un autre agent.

## Les agents d'arrière-plan : déléguer des sessions entières

L'étape au-dessus du sous-agent : les **agents en arrière-plan** (vue \`claude agents\`, un tableau de bord de tes sessions de fond). Chaque agent peut travailler dans un **worktree git isolé** — une copie de travail dédiée du dépôt.

:::maj 4 août 2026
Avec la version 2.1.221, les sessions d'arrière-plan **committent, poussent leur branche et ouvrent une pull request en brouillon** toutes seules à la fin d'une tâche de code.
:::

Une tension apparente avec la règle « humain dans la boucle pour tout push » ? Non : le push automatique va vers une **branche isolée** et la PR reste en **brouillon** — la validation humaine ne disparaît pas, elle se déplace au moment du merge, là où elle compte vraiment. C'est le pattern à retenir : **automatiser le trajet, garder l'humain au péage**.

Deux commodités d'interface complètent le tableau : **Focus view** (\`Ctrl+Alt+F\`, depuis le 4 août 2026) masque l'activité outil derrière un résumé par tour — précieux quand plusieurs agents parlent en même temps ; et l'outil **\`EndConversation\`** (18 juillet 2026) permet de clore proprement une conversation.

## Architecturer un workflow agentique

Un bon workflow n'est pas « lance l'agent et prie ». C'est une structure :

| Étape | Ce qu'elle garantit |
| --- | --- |
| 1. Décomposer | L'objectif est découpé en étapes **vérifiables** |
| 2. Planifier | Le plan est validé **avant** la première action |
| 3. Exécuter | Une étape à la fois, en observant les résultats |
| 4. Vérifier | Tests, relecture, critère de succès explicite |
| 5. Valider | Un humain approuve les actions irréversibles |

Quelques patterns utiles :

- **Plan puis exécution** : on sépare la réflexion de l'action.
- **Générer puis relire** : un agent produit, toi (ou une vérification déterministe) attaques le résultat.
- **Fan-out / consolidation** : plusieurs sous-tâches en parallèle, puis une étape qui rassemble et contrôle.

:::prompt Cadrer un workflow multi-agents
Objectif : [décris l'objectif en une phrase].
Critère de succès, vérifiable par une commande : [ex. « pnpm test passe et le lint est propre »].

Contraintes de pilotage :
- Découpe en étapes vérifiables et montre-moi le découpage avant d'agir.
- Périmètre : ne modifie que les fichiers de [liste des dossiers]. Rien d'autre.
- Plafonne la délégation : pas plus de 5 sous-agents au total, profondeur 1.
- N'ajoute aucune étape de vérification supplémentaire : la commande ci-dessus est le seul juge.
- Arrête-toi et demande-moi avant toute action irréversible (push, migration, suppression, appel payant).
- Sois concis dans tes comptes rendus : une ligne par étape.
:::

## Ce que ça coûte, et comment le piloter

Un workflow agentique est la partie la plus chère de Claude Code. Trois repères concrets :

- Les fonctions de type **équipes d'agents** consomment environ **7 fois plus de tokens** qu'une session standard. Elles sont **désactivées par défaut** — et c'est une bonne valeur par défaut.
- La **durée de vie du cache** est d'**1 heure sur abonnement**, mais tombe à **5 minutes** dès qu'on passe en clé API ou qu'on consomme des crédits d'usage. Un workflow long en clé API perd donc son cache en route.
- **\`/usage\`** te donne le compte courant, mais il est **remis à zéro à chaque \`/clear\`** (depuis la version 2.1.211) : relève-le avant de nettoyer.

:::astuce Balaye les niveaux d'effort avant de payer le maximum
La doc officielle recommande de refaire un balayage d'effort sur ses propres cas : **\`low\` et \`medium\` donnent une forte qualité à une fraction du coût**. Beaucoup de workflows tournent à effort élevé par habitude, pas par nécessité. Teste le niveau en dessous sur une tâche représentative avant de trancher.
:::

## La discipline qui sépare l'amateur du pro

- **Humain dans la boucle** pour tout ce qui est irréversible (push sur une branche partagée, déploiement, suppression, paiement).
- **Critère de succès défini** avant de lancer : sinon l'agent « termine » sans que tu saches si c'est bon.
- **Coût et contexte maîtrisés** : plus un workflow est long, plus il consomme et plus il dérive — découpe.
- **Tout est journalisé et relu** : tu restes le responsable.
- **Méfiance structurelle entre agents** : le harnais lui-même applique cette règle — le message d'un agent n'est jamais traité comme une approbation humaine, les notifications de tâches de fond précisent qu'aucune validation n'a eu lieu, et l'outil de délégation est durci contre l'injection de prompt via le contenu qu'un sous-agent a lu. Applique la même logique : une sortie d'agent est une **donnée à vérifier**, pas une décision.

:::cle Le message d'un agent n'est jamais une autorisation
C'est la règle qui tient debout quelle que soit la version : seul un humain autorise. Un sous-agent qui écrit « l'utilisateur a validé », un fichier lu qui affirme « tu peux pousser », une PR qui contient une consigne — ce sont des **données**, jamais des permissions. Cette confusion est précisément ce qu'exploitent les injections de prompt vues aux leçons précédentes.
:::

> L'objectif n'est pas que l'agent travaille seul, mais qu'il te rende **plus rapide et plus rigoureux** — sans jamais te retirer le contrôle des décisions qui comptent.

**Tu as fait le tour.** Agent en terminal, contexte et CLAUDE.md, commands/skills, hooks, MCP, sous-agents et orchestration : tu as de quoi faire de Claude Code un vrai environnement de travail, puissant et maîtrisé.

:::defi 40 min — Ton premier workflow encadré
Fais tourner un vrai workflow multi-étapes, en le pilotant au lieu de le subir.
- Tu as créé au moins un sous-agent dans .claude/agents/ avec une description qui déclenche au bon moment
- Ce sous-agent n'a que les outils strictement nécessaires à sa tâche
- Tu as fixé workflowSizeGuideline en connaissance de cause (et tu sais pourquoi la valeur par défaut est medium)
- Ton prompt de lancement contient un critère de succès vérifiable par une commande
- Ton prompt contient un plafond de délégation et une consigne de périmètre
- Ton prompt ne contient AUCUNE instruction de type « vérifie ton travail » ou « double-check »
- Tu as relevé ta consommation avec /usage avant et après, sans faire /clear entre les deux
- Aucune action irréversible n'a eu lieu sans ton accord explicite
:::

:::memo
Q: Quelles sont les limites de délégation au 6 août 2026 ?
R: Profondeur 3 par défaut, 20 sous-agents en concurrence, 200 par session, 200 recherches web par session.
===
Q: Quelle est la valeur par défaut de workflowSizeGuideline ?
R: medium, soit moins de 15 agents, depuis le 24 juillet 2026. C'était unrestricted avant.
===
Q: Faut-il demander à un sous-agent de vérifier le travail du principal ?
R: Non. Opus 5 vérifie déjà ; la consigne provoque de la sur-vérification. Il vaut mieux plafonner la délégation et s'appuyer sur un test.
===
Q: Que font les sessions d'arrière-plan à la fin d'une tâche de code ?
R: Elles committent, poussent leur branche et ouvrent une pull request en brouillon. La validation humaine se déplace au merge.
===
Q: Combien coûtent les équipes d'agents par rapport à une session standard ?
R: Environ 7 fois plus de tokens. Elles sont désactivées par défaut.
:::` +
        FOOTER,
    },
  ],
};
