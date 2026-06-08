// =========================================
// Parcours « Claude Code et IA agentic »
// Contenu original au standard du Parcours 1. Remplace les anciens stubs.
// Sujets : agent en terminal, CLAUDE.md & contexte, slash commands/skills,
// hooks, MCP, sub-agents & architecture de workflow agentic.
// À auditer pour exactitude (les détails Claude Code évoluent vite).
// =========================================

const FOOTER = `

---

**Sources & méthode** · Doc officielle *Claude Code* (Anthropic) et *Model Context Protocol* (modelcontextprotocol.io). Les commandes/chemins exacts évoluent : vérifiez toujours sur la doc de votre version. Contenu original rédigé pour ClaudeAI Academy, audité à la rédaction.`;

export const claudeCodeIaAgentic = {
  slug: "claude-code-ia-agentic",
  title: "Claude Code et IA agentic",
  description:
    "L'agent de coding qui s'exécute dans votre terminal : CLAUDE.md, slash commands et skills, hooks, MCP, sub-agents. Faites-en votre environnement de travail, en gardant le contrôle.",
  tier_required: "starter",
  display_order: 2,
  estimated_duration_min: 120,
  lessons: [
    {
      slug: "ce-qui-change-vraiment-avec-claude-code",
      title: "Ce qui change vraiment avec Claude Code",
      description:
        "Pas un chatbot de plus : un agent qui lit votre dépôt, édite des fichiers, lance des commandes et boucle. Le changement de posture.",
      duration_min: 14,
      is_free_preview: true,
      content_md:
        `## Le saut : du chatbot à l'agent

La plupart des gens utilisent l'IA comme un chatbot : on copie un bout de code dans une fenêtre, on colle la réponse, on recommence. Claude Code casse ce schéma. C'est un **agent qui vit dans votre terminal**, à l'intérieur de votre projet : il **lit vos fichiers**, **écrit et modifie du code**, **lance des commandes** (tests, build, git) et **observe les résultats** pour se corriger.

Le changement n'est pas cosmétique. Vous arrêtez de transférer des extraits ; vous **déléguez des tâches** — « ajoute des tests pour ce module », « refais ce composant sans changer le comportement » — et vous **relisez le résultat**.

## La boucle agentique

Tout repose sur une boucle simple, qu'il faut comprendre pour bien piloter l'outil :

    1. Rassembler le contexte  (lire les bons fichiers, comprendre l'objectif)
    2. Agir                    (éditer, lancer une commande)
    3. Observer                (lire la sortie : erreur de test, log, diff)
    4. Corriger                (ajuster, recommencer si besoin)

Votre rôle n'est pas de taper le code : c'est de **cadrer l'objectif**, de **fournir le bon contexte**, et de **valider**. L'agent fait le reste, et boucle jusqu'au résultat.

## Quand ça brille, quand ça coince

Claude Code excelle sur : les tâches répétitives ou mécaniques (tests, refactors, migrations), l'exploration d'un code inconnu, le debug guidé par les erreurs, l'écriture de scripts et d'outillage.

Il faut rester vigilant sur : les décisions d'architecture lourdes (à vous de trancher), les changements à fort risque (vous validez avant d'exécuter), et tout ce qui touche aux secrets ou à la production.

## La règle qui ne bouge pas

> L'agent **propose et exécute** sous votre contrôle. **Vous** restez responsable de ce qui part en production. Plus l'action est irréversible, plus la validation humaine est obligatoire.

## Ce que couvre ce parcours

1. **Bien démarrer** : projet, CLAUDE.md, gestion du contexte.
2. **Slash commands & skills** : industrialiser vos workflows.
3. **Hooks** : automatiser les invariants de façon déterministe.
4. **MCP** : connecter vos outils et vos données (en sécurité).
5. **Sub-agents & architecture agentic** : déléguer et orchestrer proprement.

À la fin, Claude Code ne sera plus un gadget mais votre **environnement de travail** quotidien.` +
        FOOTER,
    },
    {
      slug: "bien-demarrer-claude-md-et-contexte",
      title: "Bien démarrer : projet, CLAUDE.md et contexte",
      description:
        "Le contexte fait 80 % du résultat. CLAUDE.md, exploration initiale, mode plan, et hygiène de la fenêtre de contexte.",
      duration_min: 22,
      is_free_preview: false,
      content_md:
        `## Le contexte fait le résultat

Avec un agent, la qualité de la sortie dépend surtout de **ce qu'il sait** au moment d'agir. Un Claude Code mal contextualisé invente des conventions, casse des choses, part dans la mauvaise direction. Bien démarrer, c'est surtout **bien l'informer**.

## Le premier réflexe : le laisser explorer

Dans un dépôt inconnu, ne lui demandez pas tout de suite de coder. Demandez-lui d'abord de **lire et de cartographier** : structure du projet, points d'entrée, conventions, scripts disponibles. Vous gagnez un agent qui comprend le terrain avant d'y toucher.

## CLAUDE.md : la mémoire du projet

C'est le fichier le plus rentable. Placé à la racine, il est **chargé automatiquement** dans le contexte à chaque session. Mettez-y ce qu'un nouveau collègue devrait savoir :

    - Commandes clés : comment lancer les tests, le build, le lint
    - Conventions : style, nommage, structure des dossiers
    - Architecture : les briques importantes et leurs rôles
    - À NE PAS faire : pièges connus, zones sensibles

Gardez-le **court et factuel** — c'est du contexte permanent, pas une documentation. Vous pouvez pointer vers d'autres fichiers avec une référence du type @chemin/vers/fichier plutôt que tout recopier.

## Cadrer avant d'exécuter : le mode plan

Pour une tâche non triviale, faites d'abord **produire un plan** (mode plan / « réfléchis avant d'agir ») : l'agent décrit ce qu'il compte faire, vous corrigez le tir **avant** qu'une seule ligne ne soit écrite. C'est le meilleur ratio temps gagné / risque évité.

## L'hygiène de contexte

La fenêtre de contexte n'est pas infinie, et un contexte saturé ou pollué dégrade les réponses. Deux habitudes :

- **Repartir propre entre deux tâches sans rapport** (commande de type /clear) pour éviter que l'ancien sujet ne parasite le nouveau.
- **Compacter** une session longue (commande de type /compact) pour garder l'essentiel quand l'historique s'allonge.

> Un bon opérateur de Claude Code gère son contexte comme un plan de travail : on range entre deux tâches, on ne laisse pas tout traîner.

## À retenir

Investissez 10 minutes dans un bon CLAUDE.md et un plan validé : vous économisez des heures de corrections. Le contexte n'est pas une formalité, c'est le levier numéro un.` +
        FOOTER,
    },
    {
      slug: "slash-commands-et-skills",
      title: "Slash commands & skills : industrialiser vos workflows",
      description:
        "Transformer vos prompts récurrents en commandes et skills réutilisables — et savoir quand en créer un.",
      duration_min: 22,
      is_free_preview: false,
      content_md:
        `## Le problème : retaper les mêmes prompts

Dès que vous utilisez Claude Code sérieusement, vous répétez les mêmes consignes : « relis ce diff comme un reviewer sévère », « écris un composant selon nos conventions », « prépare un message de commit ». Les **commandes** et les **skills** servent à figer ces workflows une fois pour toutes.

## Slash commands et skills : la convergence

Historiquement, on créait des **slash commands** : des fichiers Markdown dans **.claude/commands/** invoqués par /nom. Ils ont **convergé avec les skills** : l'emplacement recommandé aujourd'hui est **.claude/skills/<nom>/SKILL.md** (le dossier .claude/commands/ reste pris en charge en legacy). Vérifiez le détail selon votre version.

Concrètement, vous écrivez une fois la consigne, et vous la rejouez d'un mot. Vous pouvez passer des arguments : une syntaxe capture **tout l'argument** (souvent ARGUMENTS), et une autre des **arguments positionnels** individuels — mais la numérotation exacte dépend de la version, vérifiez la doc avant de vous y fier.

## Un skill, c'est quoi exactement

Un skill = un fichier **SKILL.md** avec un en-tête (frontmatter) comprenant au minimum un **name** et une **description**. Point crucial : **la description est ce que l'agent lit pour décider** d'activer le skill. Une description vague = un skill qui ne se déclenche jamais au bon moment. Le détail volumineux (procédures, exemples) va dans des fichiers que le skill charge **à la demande**, pour ne pas alourdir le contexte.

## Quand créer un skill (et quand non)

Créez un skill quand un workflow est **récurrent, structuré et stable** : revue de code maison, génération d'un type de fichier selon vos conventions, procédure de release. Ne le faites pas pour un besoin ponctuel — un simple prompt suffit.

## Le réflexe sécurité

Vous trouverez des commands et skills tout faits sur GitHub. **Ce sont des instructions que votre agent va exécuter** : lisez-les avant de les installer, exactement comme du code. (Le parcours « Prompts & Skills GitHub » détaille le vetting.)

> Un bon skill transforme une expertise répétée en un réflexe à un mot. Mais un skill non lu est un risque : traitez-le comme du code, pas comme un presse-bouton.` +
        FOOTER,
    },
    {
      slug: "hooks-automatiser-les-invariants",
      title: "Hooks : automatiser les invariants",
      description:
        "Faire exécuter des commandes déterministes par le harnais à chaque événement — pour garantir ce que le modèle ne doit pas oublier.",
      duration_min: 18,
      is_free_preview: false,
      content_md:
        `## L'idée : ne pas compter sur la bonne volonté du modèle

Demander à l'agent « n'oublie pas de lancer le linter » marche… parfois. Les **hooks** rendent ça **déterministe** : ce sont des commandes shell que **le harnais** (pas le modèle) exécute automatiquement à certains événements. Ce qui passe par un hook est garanti, à chaque fois.

## Où et comment

Les hooks se configurent dans la configuration de Claude Code (un fichier de réglages de type settings.json versionné pour l'équipe, ou un settings.local.json personnel). On y associe un **événement** à une **commande**.

Les événements typiques :

    PreToolUse   -> AVANT une action de l'agent (peut la BLOQUER)
    PostToolUse  -> APRÈS une action (ex. formater le fichier édité)

Selon la convention, un hook **PreToolUse** qui renvoie un certain code de sortie (souvent un code d'erreur dédié) **bloque** l'action — utile pour interdire une opération dangereuse. Vérifiez la sémantique exacte des codes dans votre version.

## Cas d'usage qui changent la vie

- **Formater / linter** automatiquement chaque fichier édité (PostToolUse).
- **Lancer les tests** concernés après une modification.
- **Protéger des fichiers ou dossiers sensibles** : bloquer toute écriture sur, par exemple, des fichiers de secrets ou de config de prod (PreToolUse).
- **Imposer une convention** que vous ne voulez pas répéter à chaque session.

## Le revers : un hook exécute du code arbitraire

Un hook lance des commandes shell avec **vos droits**. Deux règles :

- **Relisez** tout hook avant de l'activer, surtout s'il vient d'un dépôt externe.
- Préférez des hooks **simples et lisibles** (formatage, lint, garde-fous) à des scripts opaques.

> Les hooks déplacent les invariants critiques du « le modèle s'en souviendra peut-être » vers « le système le garantit ». C'est exactement là qu'ils ont de la valeur.` +
        FOOTER,
    },
    {
      slug: "mcp-connecter-vos-outils",
      title: "MCP : connecter vos outils et vos données",
      description:
        "Le Model Context Protocol pour donner à l'agent l'accès à vos bases, API et outils — sans ouvrir une faille de sécurité.",
      duration_min: 20,
      is_free_preview: false,
      content_md:
        `## Sortir du dépôt : brancher le monde réel

Par défaut, Claude Code agit sur votre code. Le **Model Context Protocol (MCP)** lui permet de se brancher à **d'autres outils et sources** : une base de données, un système de tickets, une API interne, un service de documentation. Un **serveur MCP** expose des **outils** (actions), des **ressources** (données) et parfois des **prompts**.

## Comment on ajoute un serveur

Deux voies courantes : déclarer le serveur dans un fichier de projet (souvent **.mcp.json**, versionnable et partageable avec l'équipe), ou l'ajouter en ligne de commande. Vous vérifiez ensuite les serveurs connectés (commande de type claude mcp list, ou /mcp en session). Les noms exacts dépendent de la version — vérifiez la doc.

## Ce que ça débloque

- Interroger une base pour analyser des données réelles, sans copier-coller.
- Lire des tickets / specs pour cadrer une tâche.
- Appeler une API interne dans un workflow automatisé.

## Le point critique : un serveur MCP tourne avec vos droits

C'est la partie que personne ne doit sauter. Un serveur MCP est **un programme qui s'exécute sur votre machine, avec vos permissions**. Un serveur malveillant ou mal écrit peut lire vos fichiers, vos secrets, et les envoyer ailleurs. De plus, les **données rapportées par un outil sont du contenu non fiable** : elles peuvent contenir une injection de prompt visant à détourner votre agent.

Les règles de base :

- **N'installez que des serveurs de confiance**, et lisez leur code (comme un skill).
- **Moindre privilège** : un accès en lecture seule et restreint au strict nécessaire ; ne lui passez pas tous vos secrets.
- **Épinglez une version** ; ne suivez pas une source qui peut changer sous vous.
- Traitez les sorties d'outils comme des **données**, jamais comme des ordres.

(Le parcours « Prompts & Skills GitHub : sécuriser » détaille ce modèle de menace.)

> MCP transforme Claude Code en chef d'orchestre de vos outils. Mais chaque connexion est une porte : ouvrez-la en connaissance de cause, jamais par confort.` +
        FOOTER,
    },
    {
      slug: "sub-agents-et-workflow-agentic",
      title: "Sub-agents & architecturer un workflow agentic",
      description:
        "Déléguer à des agents spécialisés et orchestrer des tâches multi-étapes fiables, avec un humain dans la boucle.",
      duration_min: 24,
      is_free_preview: false,
      content_md:
        `## Déléguer : les sub-agents

Quand une tâche revient et mérite une expertise dédiée, créez un **sub-agent** : un agent spécialisé (défini dans **.claude/agents/**) avec son **propre system prompt**, ses **outils** et son **contexte isolé**. Comme pour un skill, sa **description** déclenche la délégation au bon moment.

Pourquoi déléguer plutôt que tout faire dans la session principale :

- **Isoler le contexte** : le sub-agent travaille sur sa tâche sans polluer (ni être pollué par) le reste.
- **Spécialiser** : un agent « revue de sécurité » avec une consigne précise est meilleur qu'un agent généraliste.
- **Paralléliser** : plusieurs sous-tâches indépendantes peuvent avancer en même temps.

Donnez à chaque sub-agent **le minimum d'outils nécessaires** (moindre privilège), comme pour un serveur MCP.

## Architecturer un workflow agentic

Un bon workflow n'est pas « lance l'agent et prie ». C'est une structure :

    1. Décomposer   : découper l'objectif en étapes vérifiables
    2. Planifier    : faire valider le plan AVANT d'agir
    3. Exécuter     : une étape à la fois, en observant les résultats
    4. Vérifier     : tests, relecture, critère de succès explicite
    5. Valider      : un humain approuve les actions irréversibles

Quelques patterns utiles :

- **Plan puis exécution** : on sépare la réflexion de l'action.
- **Générer puis relire** : un agent produit, un autre (ou vous) attaque le résultat de façon critique.
- **Fan-out / vérification** : plusieurs sous-tâches en parallèle, puis une étape qui consolide et contrôle.

## La discipline qui sépare l'amateur du pro

- **Humain dans la boucle** pour tout ce qui est irréversible (push, déploiement, suppression, paiement).
- **Critère de succès défini** avant de lancer : sinon l'agent « termine » sans que vous sachiez si c'est bon.
- **Coût et contexte maîtrisés** : plus un workflow est long, plus il consomme et plus il dérive — découpez.
- **Tout est journalisé et relu** : vous restez le responsable.

> L'objectif n'est pas que l'agent travaille seul, mais qu'il vous rende **plus rapide et plus rigoureux** — sans jamais vous retirer le contrôle des décisions qui comptent.

## Vous avez fait le tour

Agent en terminal, contexte et CLAUDE.md, commands/skills, hooks, MCP, sub-agents et orchestration : vous avez de quoi faire de Claude Code un vrai environnement de travail, puissant et maîtrisé.` +
        FOOTER,
    },
  ],
};
