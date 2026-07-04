// =========================================
// Parcours « Bien démarrer avec Claude »
// Parcours d'onboarding : compte, installation, plans, modèles,
// interface, réglages, personnalisation (préférences, skills, mémoire),
// projets. Placé en position 01 — prérequis de tous les autres parcours.
// Sources Tier 1 : Centre d'aide officiel Claude (support.claude.com)
// + page tarifs officielle (claude.com/pricing), vérifiées le 2026-07-04.
// =========================================

const FOOTER = `

---

**Sources** · Centre d'aide officiel Claude (Tier 1, vérifié 2026-07-04) : *Get started with Claude*, *Install Claude Desktop*, *Understanding Claude's personalization features*, *Change the model, effort, and thinking settings*, *Use Claude's chat search and memory*, *What are projects?*, *When should I use web search, extended thinking, and research?* — \`support.claude.com\`. Tarifs : \`claude.com/pricing\`. L'interface évolue vite : en cas de doute, la doc officielle fait foi.`;

export const bienDemarrerAvecClaude = {
  slug: "bien-demarrer-avec-claude",
  title: "Bien démarrer avec Claude",
  description:
    "Tout ce qu'il faut mettre en place avant votre première vraie session : compte, applications, bon plan, bon modèle, réglages essentiels — et surtout la personnalisation qui fait que Claude vous répond comme VOUS le voulez.",
  tier_required: "starter",
  display_order: 1,
  estimated_duration_min: 115,
  lessons: [
    {
      slug: "creer-son-compte-et-installer-claude-partout",
      title: "Créer son compte et installer Claude partout",
      description:
        "Web, ordinateur, téléphone : les trois façons d'accéder à Claude, et laquelle utiliser pour quoi.",
      duration_min: 14,
      is_free_preview: true,
      content_md: `## Trois portes d'entrée, un seul compte

Claude est accessible de trois façons, toutes reliées au même compte — vos conversations vous suivent d'un appareil à l'autre :

1. **Le web** : \`claude.ai\` dans n'importe quel navigateur. Zéro installation, c'est le point de départ.
2. **L'application de bureau** : Mac et Windows (et Linux en bêta). Plus rapide au quotidien, toujours à un raccourci clavier de distance.
3. **L'application mobile** : iOS (App Store) et Android (Play Store, cherchez « Claude by Anthropic »).

## Créer le compte

Rendez-vous sur \`claude.ai\` et créez un compte avec votre adresse email ou votre compte Google. Deux conditions officielles : avoir **au moins 18 ans** et se trouver dans une **région supportée** (la France, la Belgique, la Suisse, le Luxembourg et le Canada le sont).

C'est tout. Pas de carte bancaire : le plan gratuit permet de commencer immédiatement.

## Installer l'application de bureau

1. Allez sur la page de téléchargement de Claude (\`claude.com/download\`).
2. Choisissez la version pour votre système (Mac ou Windows — pour Linux, voir ci-dessous).
3. Ouvrez le fichier téléchargé et laissez l'installation se terminer.
4. Lancez Claude depuis le dossier Applications (Mac) ou le menu Démarrer (Windows), puis connectez-vous.

Sur **Linux**, Anthropic recommande d'installer depuis son dépôt apt plutôt qu'un .deb téléchargé : les mises à jour arrivent alors par le gestionnaire de paquets du système.

Pourquoi s'embêter avec l'app de bureau alors que le web existe ? Le raccourci clavier global : Claude s'ouvre par-dessus n'importe quelle application, vous posez votre question, vous revenez à votre travail. Cette fonction s'appelle **Quick Entry** — vous trouverez (et pourrez modifier) le raccourci dans les réglages de l'application de bureau. C'est la différence entre « un outil que je vais consulter » et « un réflexe ».

## Installer sur mobile

- **iPhone/iPad** : App Store → « Claude by Anthropic ».
- **Android** : Play Store → « Claude by Anthropic ».

Connectez-vous avec le même compte : l'historique de conversations est synchronisé. Le mobile est idéal pour dicter une idée en marchant, photographier un document à analyser, ou reprendre une conversation commencée au bureau.

## Quelle porte pour quel usage

| Accès | Idéal pour |
| --- | --- |
| Web | Découvrir, sessions longues, gérer les réglages |
| Bureau | Usage quotidien intensif, raccourci clavier, fichiers locaux |
| Mobile | Capture d'idées, photos de documents, en déplacement |

## Le premier message

Le conseil officiel d'Anthropic tient en une phrase : parlez à Claude **comme à un collègue**, naturellement et en français si c'est votre langue. Claude fonctionne très bien en français. Commencez simple (« explique-moi X », « relis ce paragraphe »), soyez précis, et affinez par des questions de suivi. Les techniques avancées viendront dans le parcours Prompt Engineering — pour l'instant, l'objectif est que l'outil soit installé partout où vous travaillez.

## Exercice

Installez Claude aux trois endroits : web (compte créé), bureau (app installée + connectée), mobile (app installée + connectée). Puis envoyez le même message depuis le mobile et vérifiez sur le web que la conversation apparaît bien dans l'historique. À partir de maintenant, Claude est à portée de main partout où vous travaillez.` + FOOTER,
    },
    {
      slug: "gratuit-pro-ou-max-choisir-son-plan",
      title: "Gratuit, Pro ou Max : choisir son plan sans se tromper",
      description:
        "Ce que chaque plan débloque vraiment, comment fonctionnent les limites d'usage, et le critère simple pour décider.",
      duration_min: 12,
      is_free_preview: false,
      content_md: `## Les plans, sans le marketing

Au moment où nous vérifions (juillet 2026), l'offre officielle est la suivante :

| Plan | Prix | Ce qui compte vraiment |
| --- | --- | --- |
| **Free** | 0 $ | Chat sur web, mobile et bureau. Accès limité aux modèles, limites d'usage serrées. |
| **Pro** | 17 $/mois (facturation annuelle) ou 20 $/mois | Usage nettement augmenté, accès aux modèles les plus capables, Research, Claude Code, Cowork, Design, intégration Microsoft 365. |
| **Max** | à partir de 100 $/mois | Usage 5× ou 20× celui de Pro, accès anticipé aux nouveautés. |
| **Team** | 20 $/siège/mois (annuel) | Pour 5 à 150 personnes : facturation centralisée, administration, connexion via le compte d'entreprise (SSO). |
| **Enterprise** | sur devis | Réservé aux grandes organisations : contrôles de sécurité et de conformité avancés (journaux d'audit, gestion automatique des comptes, conformité santé HIPAA). |

Les prix sont en dollars et évoluent : vérifiez toujours \`claude.com/pricing\` avant de décider.

## Comprendre les limites d'usage (le vrai sujet)

**Tous les plans fonctionnent par sessions de 5 heures** : une enveloppe d'usage qui se réinitialise toutes les 5 heures (et varie selon la charge des serveurs). Ce qui change d'un plan à l'autre, c'est la taille de l'enveloppe : très serrée en Free, environ 5× plus large en Pro, 5× à 20× celle de Pro en Max. Les plans payants ont **en plus une limite hebdomadaire globale**, qui se réinitialise à heure fixe chaque semaine.

Concrètement : vous pouvez tester sérieusement Claude gratuitement, mais vous toucherez le plafond dès que vous travaillerez vraiment avec — analyse de documents longs, sessions de travail suivies, gros volumes. Ce n'est pas un défaut caché, c'est le modèle : le gratuit sert à évaluer, les plans payants à travailler. Et si vous atteignez les limites d'un plan payant, sachez qu'il existe des **crédits d'usage** optionnels pour continuer sans attendre la réinitialisation.

## Le critère de décision

Posez-vous une seule question : **combien d'heures par semaine cet outil va-t-il me faire gagner ?**

- **0 à 1 h/semaine** → restez en Free le temps de suivre cette formation. Vous déciderez ensuite en connaissance de cause.
- **2 h/semaine ou plus** → Pro est rentabilisé dès la première semaine du mois si vous valorisez votre heure à plus de 10 €. C'est le plan recommandé pour suivre cette formation confortablement.
- **Claude toute la journée** (développeurs avec Claude Code, créateurs de contenu intensifs, analystes) → Max, uniquement quand vous constatez que vous butez régulièrement sur les limites de Pro.

## Ce que Pro débloque pour cette formation

Trois éléments de Pro reviendront constamment dans les parcours suivants :

- **Les modèles les plus capables** (leçon suivante) — la différence de qualité est réelle sur les tâches complexes.
- **Research** : Claude mène une vraie recherche multi-sources sur le web et rend un rapport sourcé.
- **Claude Code** : l'agent en terminal, au cœur du parcours « Claude Code et IA agentic ».

## Anti-pattern

Prendre Max « pour être tranquille » dès le premier jour. Commencez par Pro : la quasi-totalité des professionnels n'atteint jamais ses limites. Max se justifie par un constat d'usage, pas par précaution.

## Exercice

Ouvrez \`claude.com/pricing\` et notez : (1) le prix actuel de Pro en facturation annuelle, (2) deux fonctionnalités listées dans Pro dont vous ne comprenez pas encore l'intérêt. Gardez cette note : à la fin de ce parcours, vous saurez exactement à quoi elles servent — et si vous en avez besoin.` + FOOTER,
    },
    {
      slug: "choisir-le-bon-modele-effort-reflexion",
      title: "Choisir le bon modèle (et régler l'effort et la réflexion)",
      description:
        "La famille de modèles Claude en 2026, le sélecteur à côté du bouton d'envoi, et les trois réglages qui changent la qualité des réponses.",
      duration_min: 14,
      is_free_preview: false,
      content_md: `## Il n'y a pas « un » Claude

Claude est une **famille de modèles**, et choisir le bon pour la bonne tâche est le premier levier de qualité — avant même le prompt. Au moment où nous vérifions (juillet 2026), la gamme s'articule ainsi :

- **Claude Sonnet 5** (sorti le 30 juin 2026) : le modèle équilibré de dernière génération — raisonnement, usage d'outils et rédaction en net progrès. Excellent défaut pour le travail quotidien.
- **Claude Opus 4.8** (mai 2026) : le haut de gamme pour le code, les tâches agentiques et le raisonnement exigeant.
- **Claude Fable 5** : le haut de gamme absolu de la génération Claude 5, disponible depuis le 1er juillet 2026. Modalités d'accès particulières au moment où nous écrivons : inclus pour les plans payants à hauteur de 50 % du quota hebdomadaire jusqu'au 7 juillet, ensuite via des crédits d'usage optionnels — situation transitoire, vérifiez la doc officielle.
- **Claude Haiku 4.5** : le plus rapide et le plus économe — parfait pour les questions simples et les gros volumes.
- Les générations précédentes (Opus 4.7, Opus 4.6, Sonnet 4.6…) restent accessibles via « Plus de modèles ».

Retenez la logique plutôt que les numéros (ils changent tous les trimestres) : **Haiku = vitesse, Sonnet = équilibre, Opus/Fable = puissance maximale.**

## Où ça se règle

Le sélecteur se trouve **à côté du bouton d'envoi** du message. Il affiche le modèle actif et contrôle trois choses indépendantes :

1. **Le modèle** : cliquez sur son nom, choisissez dans la liste.
2. **L'effort** : l'intensité de traitement de chaque réponse.
3. **La réflexion étendue** (extended thinking) : un temps de réflexion visible avant la réponse.

Précision importante (juillet 2026) : le sélecteur d'**effort** n'est proposé que sur certains modèles — la doc officielle liste Opus 4.8, 4.7, 4.6 et Sonnet 4.6. Sur les autres, dont **Sonnet 5 proposé par défaut**, vous verrez seulement l'interrupteur de réflexion étendue (« Extended »). Si vous ne trouvez pas le réglage d'effort, ce n'est donc pas un bug : changez de modèle via « Plus de modèles » ou passez-vous-en.

## L'effort : le réglage que tout le monde ignore

La doc officielle est claire : *« Higher effort means more thorough responses, but they take longer and use more tokens […] »* Plus d'effort = réponses plus fouillées, mais plus lentes et plus consommatrices de votre quota.

- **Low / Medium** : questions simples, reformulations, usage courant — et votre quota dure plus longtemps.
- **High** : le bon équilibre par défaut pour le travail sérieux.
- **Extra high / Max** : problèmes de code complexes, analyses profondes — quand la qualité prime sur tout.

## La réflexion étendue : quand l'activer

Réflexion étendue et effort se combinent librement. La réflexion étendue brille sur les **tâches de raisonnement pur** qui ne nécessitent pas d'aller chercher de l'information récente : problème mathématique, débogage, analyse d'un raisonnement, décision structurée. Claude explore plusieurs angles avant de conclure, et vous pouvez lire son cheminement.

Inutile de l'activer pour « résume cet email ». Indispensable pour « trouve la faille dans ce raisonnement financier ».

## La règle pratique

> Tâche simple → défauts (Sonnet, sans réflexion étendue).
> Tâche complexe → montez UN cran à la fois : d'abord la réflexion étendue, puis le modèle supérieur, puis — sur les modèles qui le proposent — l'effort.

Tout monter d'un coup pour une question banale, c'est payer plusieurs fois (temps, quota) pour un gain nul.

## Exercice

Prenez un même problème non trivial de votre métier (une décision à argumenter, un texte à structurer). Posez-le trois fois dans trois conversations : (1) Haiku 4.5, réglages par défaut ; (2) Sonnet 5, réglages par défaut ; (3) le meilleur modèle disponible + réflexion étendue. Comparez les trois réponses : vous saurez d'expérience — pas par ouï-dire — ce que chaque cran apporte sur VOS tâches. Bonus si vous voulez tester l'effort : ouvrez « Plus de modèles », choisissez Sonnet 4.6, et comparez effort bas vs effort haut sur la même question.` + FOOTER,
    },
    {
      slug: "le-tour-de-l-interface-qui-compte",
      title: "Le tour de l'interface : chats, artefacts, recherche, incognito",
      description:
        "Les fonctions de l'interface qui changent votre façon de travailler — et celles que vous pouvez ignorer au début.",
      duration_min: 14,
      is_free_preview: false,
      content_md: `## L'essentiel visible

L'interface de Claude est volontairement sobre : une zone de saisie, un historique de conversations à gauche, le sélecteur de modèle à côté du bouton d'envoi (leçon précédente). Deux raccourcis à connaître dès le premier jour :

- **« + »** (dans la zone de saisie) : joindre des fichiers (PDF, images, tableurs, code…) et activer ou désactiver des capacités comme la recherche web — ce que l'interface appelle les « outils ».
- **« / »** dans la zone de saisie : accéder aux commandes et aux skills (on y reviendra dans la leçon sur la personnalisation).

Vous pouvez envoyer des documents entiers : Claude lit les PDF, analyse les images et les captures d'écran, décortique les tableurs. C'est l'un des usages les plus rentables dès la première semaine.

## Les artefacts : quand Claude produit un livrable

Dès que vous demandez un contenu structuré — document, tableau, page web, diagramme, morceau de code — Claude peut le créer dans un **artefact** : un panneau dédié à côté de la conversation, téléchargeable et partageable. Les documents texte s'y **éditent directement** : surlignez le passage à changer et cliquez « Edit with Claude », sans repasser par le chat. Les autres types (pages web, code, diagrammes) se modifient en redemandant à Claude dans la conversation. Dans tous les cas : la conversation sert à itérer, l'artefact contient le livrable propre.

Réflexe à prendre : pour tout ce qui doit *sortir* de Claude (un document à envoyer, une page, un script), demandez-le en artefact.

## Recherche web et Research : deux choses différentes

- **La recherche web** : Claude va chercher des informations récentes quand la question l'exige. Utile dès que la réponse dépend de faits postérieurs à son entraînement — prix, actualités, docs récentes.
- **Research** (plans payants) : un mode d'un autre calibre. Claude mène une investigation multi-sources pendant plusieurs minutes et rend un **rapport structuré et sourcé**. À réserver aux vraies questions de fond : étude d'un marché, comparatif fourni, état de l'art.

La doc officielle résume bien la répartition : recherche web pour les **faits récents ponctuels**, réflexion étendue pour le **raisonnement sans information externe**, Research pour **l'investigation en profondeur**.

## Le mode incognito

L'icône **fantôme** (en haut à droite) ouvre une conversation incognito : elle n'est pas sauvegardée dans l'historique et n'alimente pas la mémoire de Claude (leçon 7). Utile pour les sujets sensibles ou les tests jetables. Deux nuances à connaître : incognito ne veut pas dire zéro trace — Anthropic conserve ces conversations 30 jours pour des raisons de sécurité — et une conversation incognito fermée ne peut **jamais être rouverte** : copiez ce que vous voulez garder avant de la quitter.

## Ce que vous pouvez ignorer pour l'instant

L'écosystème Claude comprend aussi **Cowork** (déléguer des tâches de fond), **Claude Design** (prototypes visuels), **Claude Code** (l'agent en terminal — un parcours entier lui est consacré), et les **connecteurs** vers vos outils (leçon suivante). Ne cherchez pas à tout ouvrir la première semaine : maîtrisez d'abord chat + fichiers + artefacts, le reste s'ajoutera naturellement.

## Anti-pattern

Rester dans une seule conversation-fleuve de 200 messages où se mélangent votre contrat, vos posts LinkedIn et vos questions de code. Les performances se dégradent avec le bruit accumulé, et vous ne retrouvez rien. Règle simple : **un sujet = une conversation**. La recherche d'historique et les projets (leçon 7) font le reste.

## Exercice

En une session : (1) envoyez un PDF de votre quotidien et demandez-en une synthèse en 5 points ; (2) demandez un livrable en artefact (« transforme cette synthèse en note d'une page pour mon équipe, en artefact ») puis modifiez un titre directement : surlignez-le dans l'artefact et cliquez « Edit with Claude » ; (3) posez une question qui exige la recherche web (« que s'est-il passé cette semaine dans [votre secteur] ? ») et vérifiez les sources citées — si aucune source n'apparaît, vérifiez que la recherche web est activée via le bouton « + ».` + FOOTER,
    },
    {
      slug: "parametrer-claude-les-reglages-qui-comptent",
      title: "Paramétrer Claude : les réglages qui comptent",
      description:
        "Le tour des Settings : capacités, apparence, connecteurs, langue, données. Dix minutes de configuration qui améliorent tous vos usages futurs.",
      duration_min: 13,
      is_free_preview: false,
      content_md: `## Où tout se trouve

Un seul chemin à mémoriser : cliquez sur **vos initiales en bas à gauche** de l'interface, puis **Settings** (Paramètres). Tout ce qui suit se passe là.

## Settings > Capabilities : le cœur du réacteur

C'est la section la plus importante. Vous y activez ou désactivez les **capacités** de Claude :

- **La mémoire** : Claude retient qui vous êtes et ce sur quoi vous travaillez d'une conversation à l'autre. C'est le sujet complet de la leçon 7 — activez-la dès maintenant si elle ne l'est pas.
- **« View and edit memory »** : le bouton pour voir exactement ce que Claude a retenu de vous, corriger ou supprimer. À connaître avant même d'activer la mémoire : vous gardez la main.
- **La recherche dans les chats passés** (plans payants) : permet de demander « qu'avions-nous conclu sur X ? » et que Claude retrouve la conversation.
- Les capacités de recherche et d'analyse selon votre plan.

## Settings > Appearance

Thème clair/sombre (ou calé sur le système) et police du chat — y compris une option adaptée aux dyslexiques. Cosmétique, mais deux minutes bien investies si vous passez des heures dans l'outil.

## Les connecteurs : brancher Claude sur vos outils

Claude peut se connecter à des services externes — Google Drive, calendrier, GitHub, et des dizaines d'autres via les **connecteurs** (basés sur le standard MCP, que le parcours Claude Code approfondit). Une fois un connecteur autorisé, Claude peut par exemple chercher dans vos documents Drive ou lire un ticket.

Règle de sécurité dès le premier jour : **ne connectez que ce dont vous avez un besoin identifié**, et souvenez-vous que chaque connecteur est une porte d'accès à vos données. Le parcours « Prompts & Skills GitHub : trouver, installer, sécuriser » traite en profondeur des risques (injection de prompt, exfiltration).

## La langue

Il existe un réglage **Language** (menu profil) : il traduit l'**interface** — menus, boutons — en français. Mais la langue des **réponses** de Claude, elle, ne se règle pas là : Claude répond par défaut dans la langue de votre message. Et si vous voulez forcer un comportement (« réponds-moi toujours en français, même quand je colle des sources en anglais »), ce n'est pas un réglage : c'est une **instruction de profil** — précisément l'objet de la leçon suivante.

## Vos données : ce qu'il faut savoir

Deux points à retenir, réglables dans Settings > Privacy :

1. Vous pouvez consulter et **exporter vos données** (conversations, mémoire).
2. Vérifiez le réglage de **contribution à l'amélioration des modèles** (interrupteur « Help improve Claude ») et alignez-le sur votre politique — c'est particulièrement important si vous traitez des données clients. Pour les conversations qui ne doivent pas rester dans votre historique ni nourrir la mémoire, le mode incognito (leçon 4) reste l'outil dédié — en gardant en tête qu'Anthropic les conserve 30 jours pour des raisons de sécurité.

## La checklist de configuration (10 minutes)

1. ☐ Mémoire activée (Settings > Capabilities) — et bouton « View and edit memory » repéré.
2. ☐ Apparence réglée à votre goût.
3. ☐ Réglage de confidentialité (« Help improve Claude ») vérifié — choix fait en connaissance de cause.
4. ☐ Aucun connecteur activé « au cas où » — uniquement ceux dont vous avez besoin.
5. ☐ Le sélecteur de modèle/effort repéré (leçon 3).

## Exercice

Déroulez la checklist ci-dessus, puis ouvrez « View and edit memory » et lisez ce que Claude sait déjà de vous (probablement rien à ce stade — c'est normal, la mémoire se construit à l'usage). Vous saurez où revenir la corriger quand elle se sera remplie.` + FOOTER,
    },
    {
      slug: "personnaliser-claude-dites-lui-qui-vous-etes",
      title: "Personnaliser Claude : dites-lui qui vous êtes",
      description:
        "La leçon la plus rentable de ce parcours : les instructions de profil qui font que Claude répond comme VOUS le voulez — qui vous êtes, ce que vous faites, comment répondre, comment ne pas répondre.",
      duration_min: 18,
      is_free_preview: false,
      content_md: `## Le problème que presque personne ne règle

Par défaut, Claude ne sait **rien** de vous. Alors il répond « pour tout le monde » : réponses génériques, précautions inutiles, niveau de détail au hasard, anglicismes, listes à puces à rallonge. La plupart des gens compensent en répétant les mêmes consignes au début de chaque conversation — « réponds en français », « je suis développeur, pas besoin d'expliquer ce qu'est une API », « sois direct »…

Il existe un endroit pour écrire ces consignes **une seule fois** : les **instructions de profil**. Elles s'appliquent automatiquement à toutes vos conversations.

**Où** : vos initiales en bas à gauche → Settings → section **« Instructions for Claude »**. (Si votre interface est en français, les libellés s'affichent traduits — Settings = Paramètres. Ce parcours donne les libellés anglais : repérez la section équivalente dans votre langue.)

## Les quatre blocs d'une bonne instruction de profil

La doc officielle recommande d'y mettre vos approches préférées, vos termes récurrents, vos scénarios typiques et vos consignes de communication. Structurez-les en quatre blocs :

### 1. Qui vous êtes
Métier, secteur, niveau d'expertise, langue de travail. C'est ce qui calibre le niveau des réponses.

> *« Je suis consultante indépendante en logistique, 15 ans d'expérience, basée à Lyon. Je travaille en français. Tu peux utiliser le vocabulaire technique du métier (WMS, cross-docking, OTIF) sans l'expliquer. »*

### 2. Ce que vous faites
Vos tâches et contextes récurrents — ce sur quoi Claude va réellement vous aider chaque semaine.

> *« Mes usages principaux : rédiger des propositions commerciales, analyser des appels d'offres, préparer des restitutions client, structurer des audits d'entrepôt. »*

### 3. Ce que vous voulez — comment répondre
Ton, format, longueur, structure. Soyez concret.

> *« Réponds de façon directe et structurée. Commence par la réponse, les justifications ensuite. Pour les documents : titres courts, phrases complètes, pas plus de 2 niveaux de plan. Quand ma demande est ambiguë, pose-moi UNE question de clarification plutôt que de deviner. »*

### 4. Ce que vous ne voulez PAS — comment ne pas répondre
Le bloc que presque tout le monde oublie, et souvent le plus efficace.

> *« Ne me flatte pas ("excellente question !"). N'ajoute pas d'avertissements évidents ("consultez un professionnel"). Pas de listes à puces pour tout : de la prose quand c'est plus clair. Ne réponds jamais en anglais sauf si je le demande. N'invente pas de chiffres : si tu ne sais pas, dis-le. »*

## La méthode pour l'écrire (15 minutes, une fois)

1. Ouvrez vos 5 dernières conversations avec une IA. Notez chaque consigne que vous avez répétée : ce sont vos instructions de profil qui s'ignorent.
2. Notez 3 réponses qui vous ont agacé, et pourquoi. Chaque agacement devient une ligne du bloc 4.
3. Rédigez les 4 blocs — 150 à 300 mots au total. Trop long dilue ; trop court ne calibre rien.
4. Collez dans Settings > Instructions for Claude, et testez sur une vraie tâche.

C'est un document vivant : chaque fois que vous vous surprenez à re-corriger Claude sur la même chose deux fois, remontez la consigne dans le profil.

## Les skills : la personnalisation par contexte

Les instructions de profil définissent votre défaut permanent. Pour des **modes** ponctuels — un ton spécifique, un format récurrent — Claude propose les **skills** (qui remplacent progressivement les anciens « styles » ; pendant la transition, vous verrez peut-être encore un menu de styles) : des paquets de consignes activables à la demande, via **Customize > Skills** ou une commande **« / »** dans le chat. Exemple : le skill « Learning » fait adopter à Claude une posture de pédagogue qui vous fait travailler au lieu de donner la réponse (à installer une fois : Customize > Skills > « + » > Browse skills > « Learning »).

Et quand vous serez à l'aise, sachez que vous pouvez **créer vos propres skills** : un fichier de consignes \`SKILL.md\` (un nom, une description, vos instructions), éventuellement accompagné de ressources, chargé via Customize > Skills — disponible sur tous les plans quand l'exécution de code est activée. La méthode pas-à-pas est dans l'article officiel « How to create custom skills » du centre d'aide, et deux parcours de cette formation la mettent en pratique : **Claude Code et IA agentic** (créer ses skills de travail) et **Prompts & Skills GitHub** (installer ceux des autres sans risque).

La hiérarchie à retenir :

> **Profil** = toujours actif, toutes conversations. **Projet** (leçon suivante) = actif dans un projet. **Skill** = activé à la demande.

## Anti-pattern

Écrire un roman de 2 000 mots sur votre vie. Les instructions de profil ne sont pas une biographie : ce sont des **consignes opérationnelles**. Chaque phrase doit changer quelque chose dans les réponses. « J'aime la mer » ne change rien ; « ne me propose jamais de solution qui nécessite de coder » change tout.

## Exercice

Faites le test avant/après. AVANT d'installer quoi que ce soit : posez une vraie question métier dans une conversation et copiez la réponse. Rédigez ensuite vos instructions de profil avec la méthode des 4 blocs, installez-les, ouvrez une NOUVELLE conversation et reposez exactement la même question. Comparez les deux réponses : la différence, c'est ce que vous venez de gagner sur TOUTES vos futures conversations. (Ne testez pas le « sans profil » en fenêtre incognito : les instructions de profil s'y appliquent aussi — l'incognito ne coupe que l'historique et la mémoire.)` + FOOTER,
    },
    {
      slug: "memoire-et-projets-contexte-durable",
      title: "Mémoire et projets : donner à Claude un contexte durable",
      description:
        "La mémoire qui se construit toute seule, les projets qui organisent le travail, et comment garder le contrôle des deux.",
      duration_min: 15,
      is_free_preview: false,
      content_md: `## Deux mécanismes complémentaires

La personnalisation (leçon précédente) dit à Claude *comment* répondre. Restait le problème du *quoi* : re-expliquer votre contexte à chaque conversation. Deux mécanismes le règlent :

- **La mémoire** : Claude retient automatiquement, entre les conversations, qui vous êtes et ce sur quoi vous travaillez.
- **Les projets** : des espaces de travail par sujet, avec leurs documents et leurs consignes propres.

## La mémoire : comment ça marche vraiment

Disponible pour **tous les utilisateurs** (gratuit inclus), elle s'active dans **Settings > Capabilities**. Concrètement : Claude construit une synthèse de vos conversations, la met à jour environ **toutes les 24 heures**, et l'injecte comme contexte dans chaque nouvelle conversation.

Ce qui y entre typiquement : votre rôle professionnel, vos projets en cours, vos préférences de communication, votre façon de travailler. Ce qui n'y entre pas : les conversations **incognito** (jamais), et le contenu des projets — chaque projet a **sa propre mémoire, séparée** de la mémoire générale.

Trois gestes de contrôle à connaître :

1. **Voir et corriger** : Settings > Capabilities > « View and edit memory ». Tout ce que Claude retient est là, éditable.
2. **Diriger** : vous pouvez dire en pleine conversation « retiens que je préfère X » — la mémoire n'est pas qu'automatique.
3. **Suspendre ou effacer** : « Pause memory » (la mémoire est conservée mais plus utilisée) ou « Reset » (effacement définitif et irréversible de toutes les mémoires, y compris celles de vos projets).

Sur les plans payants s'ajoute la **recherche dans les chats passés** : « qu'avions-nous conclu sur la tarification le mois dernier ? » et Claude retrouve la conversation.

## Les projets : un dossier = un contexte

Un **projet** regroupe des conversations autour d'un même sujet, avec deux super-pouvoirs :

1. **La base de connaissances** : vous y déposez les documents de référence (brief, contrat, charte, code…). Claude les consulte pour toutes les conversations du projet — plus besoin de les joindre à chaque conversation.
2. **Les instructions de projet** : des consignes qui ne s'appliquent que là. *« Dans ce projet, tu es relecteur de mes propositions commerciales. Adopte un ton critique et exigeant. Vérifie systématiquement la cohérence des chiffres. »*

Le plan gratuit permet jusqu'à **5 projets** (nombre illimité sur les plans payants), base de connaissances et instructions de projet incluses. Point important de la doc officielle : les conversations d'un projet **ne partagent pas leur contenu entre elles** — ce qui doit être durable doit aller dans la base de connaissances.

## L'architecture complète du contexte

Vous avez maintenant les quatre étages. Du plus permanent au plus ponctuel :

| Étage | Portée | Vous y mettez |
| --- | --- | --- |
| Instructions de profil | Toutes conversations | Qui vous êtes, comment répondre / ne pas répondre |
| Mémoire | Toutes conversations | (Se construit seule — vous supervisez) |
| Projet (instructions + documents) | Un sujet | Le contexte et les règles de CE sujet |
| La conversation | Un échange | La tâche du moment |

C'est cette architecture qui sépare l'utilisateur occasionnel du professionnel : le premier redonne tout le contexte à chaque fois ; le second a un outil déjà calibré qui sait où il en est.

## Anti-pattern

Utiliser la mémoire comme du stockage (« retiens ces 40 références produit ») : c'est le rôle de la base de connaissances d'un projet. La mémoire sert au contexte de fond, pas aux données de travail.

## Exercice

Créez votre premier projet sur un dossier réel en cours : (1) nommez-le, (2) déposez 2 ou 3 documents de référence, (3) écrivez 5 lignes d'instructions de projet (rôle de Claude + exigences), (4) lancez une conversation de travail dedans. Une semaine plus tard, ouvrez « View and edit memory » : constatez ce que Claude a retenu, corrigez ce qui est faux ou obsolète.` + FOOTER,
    },
    {
      slug: "les-dix-reflexes-pour-bien-demarrer",
      title: "Les 10 réflexes qui font la différence dès la première semaine",
      description:
        "La synthèse opérationnelle du parcours : dix habitudes concrètes, et la passerelle vers le prompt engineering sérieux.",
      duration_min: 15,
      is_free_preview: false,
      content_md: `## Tout est en place. Maintenant, les réflexes.

Compte créé partout, plan choisi, modèle compris, interface apprivoisée, réglages faits, profil personnalisé, mémoire et projets en route. Ce qui suit est la synthèse à garder sous la main : dix réflexes, chacun découlant directement de ce parcours ou des recommandations officielles d'Anthropic.

**1. Parlez comme à un collègue.** Le conseil n° 1 de la doc officielle. Pas de formules magiques ni de style télégraphique : des phrases naturelles, complètes, en français. Claude n'est pas un moteur de recherche, c'est un interlocuteur.

**2. Soyez spécifique — toujours plus que vous ne pensez nécessaire.** « Améliore ce texte » produit une réponse moyenne. « Resserre ce texte à 150 mots pour des DAF, en gardant les deux chiffres clés » produit ce que vous voulez. La spécificité est le levier n° 1, avant toute technique avancée.

**3. Itérez au lieu de recommencer.** La première réponse est un premier jet. « Plus court », « moins formel », « développe le point 2 » — l'itération est le mode de travail normal, pas un échec du prompt initial.

**4. Un sujet = une conversation.** Les conversations-fleuves dégradent les réponses et rendent l'historique inutilisable. Nouveau sujet, nouvelle conversation — les projets organisent le reste.

**5. Le bon modèle et les bons réglages pour la bonne tâche.** Question simple : modèle rapide, réglages par défaut, quota préservé. Enjeu réel : réflexion étendue si c'est du raisonnement pur, modèle supérieur — et effort haut sur les modèles qui le proposent. Montez un cran à la fois.

**6. Donnez les documents, pas des résumés de documents.** Claude lit les PDF, les images, les tableurs. Un vrai contrat en pièce jointe vaut mieux que trois paragraphes qui le paraphrasent de mémoire.

**7. Les livrables en artefact.** Tout ce qui doit sortir de Claude — note, page, script, tableau — se demande en artefact : éditable, téléchargeable, propre.

**8. Vérifiez ce qui est vérifiable.** Claude peut se tromper avec assurance — chiffres, dates, références. Pour les faits récents, exigez la recherche web — demandez-le en toutes lettres (« cherche sur le web et cite tes sources ») — et regardez les sources. Pour les enjeux forts, demandez : « qu'est-ce qui, dans ta réponse, mériterait vérification ? » Cette vigilance est un thème central des parcours suivants.

**9. Chaque agacement devient une ligne de profil.** Deux fois la même correction (« pas de puces ! », « en français ! ») = une consigne à remonter dans vos instructions de profil. C'est ainsi que l'outil converge vers vous, semaine après semaine.

**10. Auditez votre mémoire une fois par mois.** « View and edit memory » (Settings > Capabilities) : cinq minutes pour corriger ce qui est faux, effacer ce qui est périmé. Une mémoire propre = un contexte fiable partout.

## L'erreur d'état d'esprit à éviter

Traiter Claude comme un distributeur : question → réponse → copier-coller → fermer. Les gains sérieux viennent du travail **en dialogue** — cadrer, déléguer, critiquer, faire réviser — sur un outil **configuré** (profil, projets, mémoire). Vous venez de faire la partie « configuré ». La partie « dialogue » est exactement l'objet de la suite.

## Et maintenant : le prompt engineering

Ce parcours vous a donné l'environnement. Le parcours suivant — **Prompt Engineering pro** — vous donne la méthode : critères de succès, clarté, contexte, exemples, raisonnement, chaînage. C'est là que la règle d'or d'Anthropic prend tout son sens : *« montrez votre prompt à un collègue sans contexte ; s'il est confus, Claude le sera aussi. »*

## Exercice final du parcours

Choisissez la tâche récurrente de votre semaine qui vous coûte le plus de temps (rapport, veille, préparation de réunion…). Traitez-la intégralement avec Claude en appliquant les 10 réflexes : bonne conversation, bons documents joints, bon modèle/effort, livrable en artefact, itérations, vérification. Chronométrez. Ce chiffre — le temps gagné sur UNE tâche réelle — est votre référence pour tout le reste de la formation.` + FOOTER,
    },
  ],
};
