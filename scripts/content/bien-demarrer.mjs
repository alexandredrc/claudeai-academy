// =========================================
// Parcours « Bien démarrer avec Claude »
// Parcours d'onboarding : compte, installation, plans, modèles,
// interface, réglages, personnalisation (préférences, skills, mémoire),
// projets. Placé en position 01 — prérequis de tous les autres parcours.
// Sources Tier 1 : documentation officielle (platform.claude.com/docs/en/),
// centre d'aide officiel Claude (support.claude.com) et page tarifs officielle
// (claude.com/pricing), vérifiées le 2026-08-06.
// =========================================

const FOOTER = `

---

**Sources** · Vérifié le **19 août 2026**. Documentation officielle : *What's new in Opus 5*, *Models overview*, *Model deprecations*, *Release notes* — \`platform.claude.com/docs/en/\`. Centre d'aide (Tier 1) : *Get started with Claude*, *Install Claude Desktop*, *Understanding Claude's personalization features*, *Change the model, effort, and thinking settings*, *Usage limit best practices*, *Buy usage bundles*, *Claude Fable 5 on your plan*, *Use Claude Cowork on web, desktop and mobile*, *Get started with Claude in Chrome*, *Use Claude's chat search and memory*, *What are projects?* — \`support.claude.com\`. Tarifs : \`claude.com/pricing\`. Anthropic ne publie aucun quota d'usage chiffré : les limites se lisent dans Réglages → Usage. L'interface évolue vite : en cas de doute, la doc officielle fait foi.`;

export const bienDemarrerAvecClaude = {
  slug: "bien-demarrer-avec-claude",
  title: "Bien démarrer avec Claude",
  description:
    "Tout ce qu'il faut mettre en place avant ta première vraie session : compte, applications, bon plan, bon modèle (Opus 5 depuis juillet 2026), réglages essentiels — et surtout la personnalisation qui fait que Claude te répond comme TOI tu le veux.",
  tier_required: "starter",
  display_order: 1,
  estimated_duration_min: 139,
  lessons: [
    {
      slug: "creer-son-compte-et-installer-claude-partout",
      title: "Créer son compte et installer Claude partout",
      description:
        "Web, ordinateur, téléphone : les trois façons d'accéder à Claude, laquelle utiliser pour quoi, et ce que le plan gratuit contient vraiment en 2026.",
      duration_min: 17,
      is_free_preview: true,
      content_md: `:::objectifs
- Créer ton compte Claude et l'ouvrir sur les trois surfaces : web, ordinateur, téléphone
- Installer l'application de bureau et repérer le raccourci clavier global
- Choisir la bonne porte d'entrée selon la situation
- Envoyer ton premier message dans de bonnes conditions
:::

:::flash
Un seul compte, trois portes. Le web pour découvrir, l'application de bureau pour le quotidien (le raccourci clavier global change tout), le mobile pour capturer. Historique, projets et mémoire sont synchronisés. Le plan gratuit suffit pour cette leçon — et au 6 août 2026 il contient bien plus qu'un simple chat.
:::

## Trois portes d'entrée, un seul compte

Claude est accessible de trois façons, toutes reliées au même compte — tes conversations te suivent d'un appareil à l'autre :

1. **Le web** : \`claude.ai\` dans n'importe quel navigateur. Zéro installation, c'est le point de départ.
2. **L'application de bureau** : Mac et Windows (et Linux en bêta). Plus rapide au quotidien, toujours à un raccourci clavier de distance.
3. **L'application mobile** : iOS (App Store) et Android (Play Store, cherche « Claude by Anthropic »).

Au 6 août 2026, ces trois surfaces partagent le même historique, les mêmes projets et la même mémoire. Ce qui change d'une porte à l'autre, ce n'est pas la puissance du modèle : c'est la friction.

:::cle Un compte, pas trois outils
Ne crée pas « un compte pour le bureau » et « un compte pour le téléphone ». Tout l'intérêt vient de la continuité : une idée capturée dans le métro se retrouve le lendemain sur ton écran de travail, dans le même fil.
:::

## Créer le compte

Va sur \`claude.ai\` et crée un compte avec ton adresse email ou ton compte Google. Deux conditions officielles : avoir **au moins 18 ans** et se trouver dans une **région supportée** (la France, la Belgique, la Suisse, le Luxembourg et le Canada le sont).

C'est tout. Pas de carte bancaire : le plan gratuit permet de commencer immédiatement.

Et « gratuit » ne veut plus dire « vitrine ». Au 6 août 2026, la page tarifs officielle liste dans le plan Free : l'accès web, iOS, Android et bureau, **Claude Code**, la **recherche web**, la **mémoire**, la création de fichiers, l'exécution de code, les extensions de bureau, les connecteurs Slack et Google Workspace, et la **réflexion étendue** (extended thinking). Ce qui te limitera, ce n'est pas la liste des fonctions : c'est le volume d'usage (leçon 2).

:::maj 20 juillet 2026
Le modèle **Claude Fable 5** n'est plus accessible sur le plan Free. La promotion qui l'incluait dans les limites hebdomadaires s'est terminée le 19 juillet 2026. Sur les plans payants, il reste accessible mais selon un régime particulier — détaillé en leçon 2.
:::

## Installer l'application de bureau

:::etapes
1. Ouvre la page de téléchargement de Claude : \`claude.com/download\`.
2. Choisis la version de ton système : Mac ou Windows (pour Linux, voir juste en dessous).
3. Ouvre le fichier téléchargé et laisse l'installation se terminer.
4. Lance Claude depuis le dossier Applications (Mac) ou le menu Démarrer (Windows), puis connecte-toi avec le compte créé à l'étape précédente.
5. Ouvre les réglages de l'application et repère le raccourci **Quick Entry** — c'est celui que tu utiliseras dix fois par jour.
:::

Sur **Linux**, Anthropic recommande d'installer depuis son dépôt apt plutôt qu'un \`.deb\` téléchargé à la main : les mises à jour arrivent alors par le gestionnaire de paquets du système, sans que tu aies à y penser.

Pourquoi s'embêter avec l'application de bureau alors que le web existe ? Pour une seule raison, mais elle est décisive : le **raccourci clavier global**. Claude s'ouvre par-dessus n'importe quelle application, tu poses ta question, tu reviens à ton travail. C'est la différence entre « un outil que je vais consulter » et « un réflexe ».

:::astuce Fais du Quick Entry un réflexe de la première semaine
Choisis un raccourci que tes doigts atteignent sans regarder et qui n'entre en conflit avec rien (beaucoup de gens prennent une combinaison à trois touches type Ctrl+Alt+Espace). Puis force-toi pendant cinq jours : chaque fois que tu allais ouvrir un onglet pour chercher quelque chose, appuie sur le raccourci à la place. Au bout d'une semaine, c'est acquis.
:::

## Installer sur mobile

- **iPhone/iPad** : App Store → « Claude by Anthropic ».
- **Android** : Play Store → « Claude by Anthropic ».

Connecte-toi avec le même compte : l'historique est synchronisé. Le mobile est idéal pour dicter une idée en marchant, photographier un document à analyser, ou reprendre une conversation commencée au bureau.

:::maj 7 juillet 2026
**Claude Cowork** — l'espace où tu délègues des tâches de fond — n'est plus réservé à l'application de bureau : il est arrivé en beta sur \`claude.ai\` et sur mobile iOS/Android. Les sessions tournent **dans le cloud** : une tâche lancée depuis le téléphone continue même quand tu ranges ton portable, et Claude te notifie quand il a besoin d'une décision. Le déploiement a commencé par les abonnés Max, puis s'étend aux autres plans. On y revient en leçon 4.
:::

## Quelle porte pour quel usage

| Accès | Idéal pour | Ce qu'on y perd |
| --- | --- | --- |
| Web | Découvrir, sessions longues, gérer tous les réglages | Il faut aller chercher l'onglet |
| Bureau | Usage quotidien intensif, Quick Entry, fichiers locaux | Rien, c'est le poste de travail principal |
| Mobile | Capture d'idées, photos de documents, validations en déplacement | Confort de lecture sur les réponses longues |

:::piege « Je testerai plus tard sur mon téléphone »
C'est l'installation qu'on repousse le plus, et c'est celle qui change le plus d'habitudes. Sans le mobile, les idées qui te viennent hors du bureau ne rentrent jamais dans l'outil. Installe les trois aujourd'hui, même si tu n'utilises le mobile qu'une fois par semaine.
:::

## Le premier message

Le conseil officiel d'Anthropic tient en une phrase : parle à Claude **comme à un collègue**, naturellement et en français si c'est ta langue. Claude fonctionne très bien en français. Commence simple (« explique-moi X », « relis ce paragraphe »), sois précis, et affine par des questions de suivi.

Pour ton tout premier échange, tu peux copier ce prompt : il sert de calibrage, et la réponse te dira déjà beaucoup sur la façon dont Claude raisonne.

:::prompt Ton premier message de calibrage
Je découvre Claude aujourd'hui. Voici mon contexte : je suis [ton métier] et je passe le plus clair de mon temps sur [tes 2 ou 3 tâches principales].

Pose-moi 3 questions courtes pour bien cerner mon travail, puis propose-moi 5 usages concrets de Claude adaptés à MON quotidien, classés du plus rentable au moins rentable. Pour chacun : la tâche, le temps que ça me ferait gagner par semaine, et un exemple de demande que je pourrais te faire.

Réponds en français, sans flatterie, et va droit au but.
:::

Les techniques avancées viendront dans le parcours Prompt Engineering. Ici, l'objectif est plus modeste et plus important : que l'outil soit installé partout où tu travailles, et que tu aies déjà eu un vrai échange avec lui.

:::defi 20 min — Claude installé partout
Rends Claude accessible depuis tes trois surfaces et vérifie que la synchronisation fonctionne.
- Compte créé et connecté sur \`claude.ai\`
- Application de bureau installée, connectée, et raccourci Quick Entry repéré (ou modifié)
- Application mobile installée et connectée avec le même compte
- Le prompt de calibrage envoyé depuis le **mobile**
- La conversation retrouvée dans l'historique côté **web** quelques secondes plus tard
- Le raccourci Quick Entry utilisé au moins une fois depuis une autre application
:::

:::memo
Q: Combien de comptes faut-il pour utiliser Claude sur web, ordinateur et téléphone ?
R: Un seul. Historique, projets et mémoire sont synchronisés entre les trois surfaces.
===
Q: Quelles sont les deux conditions officielles pour créer un compte Claude ?
R: Avoir au moins 18 ans et se trouver dans une région supportée. Aucune carte bancaire n'est demandée.
===
Q: Quel est le vrai intérêt de l'application de bureau par rapport au web ?
R: Le raccourci clavier global (Quick Entry), qui ouvre Claude par-dessus n'importe quelle application.
===
Q: Cowork est-il encore une application de bureau uniquement ?
R: Non. Depuis le 7 juillet 2026, Cowork est aussi sur le web et le mobile, avec des sessions qui tournent dans le cloud.
===
Q: Le plan gratuit se limite-t-il au chat ?
R: Non. Au 6 août 2026 il inclut notamment Claude Code, la recherche web, la mémoire et la réflexion étendue. C'est le volume d'usage qui est limité.
:::` + FOOTER,
    },
    {
      slug: "gratuit-pro-ou-max-choisir-son-plan",
      title: "Gratuit, Pro ou Max : choisir son plan sans se tromper",
      description:
        "Ce que chaque plan débloque vraiment au 6 août 2026, comment fonctionnent les limites d'usage (et pourquoi aucun chiffre de messages n'est fiable), les crédits d'usage, et le critère simple pour décider.",
      duration_min: 16,
      is_free_preview: false,
      content_md: `:::objectifs
- Situer ce que chaque plan débloque réellement au 6 août 2026
- Comprendre la mécanique des limites d'usage (fenêtre de 5 h + limite hebdomadaire)
- Lire ton tableau de bord Usage au lieu de croire des chiffres de messages inventés
- Savoir ce que sont les crédits et les bundles d'usage, et quand ils servent
- Décider entre Free, Pro et Max sur un critère unique et vérifiable
:::

:::flash
Anthropic ne publie **aucun quota chiffré** : ni « X messages par jour », ni nombre de tokens. Deux compteurs tournent en parallèle sur les plans payants — une fenêtre glissante de 5 heures et une limite hebdomadaire — avec des remises à zéro distinctes pour Opus. Le seul réflexe fiable, c'est Réglages → Usage. Et le critère de choix tient en une question : combien d'heures par semaine cet outil me fait-il gagner ?
:::

## Les plans, sans le marketing

Grille relevée sur \`claude.com/pricing\` le **6 août 2026** :

| Plan | Prix affiché | Ce qui compte vraiment |
| --- | --- | --- |
| **Free** | 0 $ | Web, iOS, Android et bureau. **Claude Code**, recherche web, mémoire, création de fichiers, exécution de code, extensions de bureau, connecteurs Slack et Google Workspace, **réflexion étendue**. Limites d'usage serrées. |
| **Pro** | **17 $/mois** en annuel (200 $ payés d'avance) ou **20 $/mois** au mois | Tout le Free, plus : usage augmenté, choix entre plusieurs modèles, **Research**, **Claude Cowork**, **Claude Design**, **Claude Science**, **projets illimités**, intégration **Microsoft 365**. |
| **Max** | « à partir de 100 $/mois » | Usage 5× ou 20× celui de Pro, accès anticipé aux nouveautés. |
| **Team** | **20 $/siège/mois** en annuel (25 $ au mois) ; siège premium **100 $** en annuel (125 $ au mois) | Facturation centralisée, administration, connexion via le compte d'entreprise (SSO). |
| **Enterprise** | **20 $/siège** + usage aux tarifs API | Contrôles de sécurité et de conformité avancés : journaux d'audit, gestion automatique des comptes, conformité santé HIPAA. |

Les prix sont en dollars et bougent : \`claude.com/pricing\` fait foi.

:::piege Ne recopie pas les prix Max entendus sur les réseaux
Au 6 août 2026, la page officielle affiche « à partir de 100 $ par mois » sur les **deux** tuiles Max (5× et 20×). Le fameux « Max 20× à 200 $ » circule beaucoup mais n'est pas affiché comme prix officiel sur la page tarifs. Si tu construis un budget, vérifie le montant réel dans le tunnel d'achat, pas dans un thread.
:::

## Ce qui a changé côté Pro (et que beaucoup ignorent)

:::maj 6 août 2026
Le plan **Pro** ne se résume plus à « plus de messages ». Il liste désormais **Claude Cowork**, **Claude Design**, **Claude Science**, les **projets illimités**, **Research** et l'intégration **Microsoft 365**. Si tu as lu quelque part que Cowork, Design ou Science étaient réservés à Max, c'est périmé.
:::

Trois de ces éléments reviendront constamment dans les parcours suivants :

- **Le choix des modèles** (leçon suivante) — la différence de qualité est réelle sur les tâches complexes.
- **Research** : Claude mène une vraie investigation multi-sources et rend un rapport structuré et sourcé.
- **Claude Code** : l'agent en terminal, au cœur du parcours « Claude Code et IA agentic ». Il est désormais listé jusque dans le plan **Free** — ce qui change les limites, pas l'accès.

## Comprendre les limites d'usage (le vrai sujet)

Sur les plans payants, **deux compteurs tournent en même temps** :

1. Une **fenêtre glissante de 5 heures** : une enveloppe d'usage qui se recharge en continu.
2. Une **limite hebdomadaire** globale, qui se réinitialise chaque semaine.

Et une subtilité qui explique beaucoup de surprises : **les remises à zéro sont distinctes pour Opus** d'un côté et pour tous les autres modèles de l'autre. Tu peux donc être bloqué sur Opus tout en pouvant continuer sur Sonnet — ce n'est pas un bug.

Ce qui change d'un plan à l'autre, c'est la taille de l'enveloppe, exprimée en multiplicateurs : Pro = 1×, Max = 5× ou 20× celui de Pro.

:::cle Anthropic ne publie aucun quota chiffré
Ni nombre de messages, ni nombre de tokens. Uniquement des multiplicateurs. Toute formation, tout article ou toute vidéo qui t'annonce « 45 messages toutes les 5 heures » invente, extrapole ou recopie une valeur périmée. La seule source fiable de TON usage, c'est **Réglages → Usage**, dans ton compte.
:::

Concrètement : tu peux tester sérieusement Claude gratuitement, mais tu toucheras le plafond dès que tu travailleras vraiment avec — analyse de documents longs, sessions suivies, gros volumes. Ce n'est pas un défaut caché, c'est le modèle économique : le gratuit sert à évaluer, les plans payants à travailler.

:::astuce Regarde ton tableau de bord AVANT de changer de plan
Beaucoup de gens passent à Max parce qu'ils « ont l'impression » d'être souvent bloqués. Ouvre Réglages → Usage pendant deux semaines d'usage normal. Si tu ne touches la limite hebdomadaire qu'une fois, le problème n'est pas le plan : c'est le choix de modèle et le niveau d'effort (leçon suivante).
:::

## Crédits et bundles d'usage : la porte de sortie

Quand tu atteins les limites incluses de ton plan, tu n'es pas obligé d'attendre la réinitialisation. Au 6 août 2026, Pro, Max et Team peuvent activer les **crédits d'usage** (usage credits) et continuer à travailler, facturés aux tarifs API standard.

Pour ceux qui consomment régulièrement, il existe en plus des **bundles d'usage** pré-achetés :

:::chiffres
30 % | de remise maximale sur les bundles d'usage (paliers 10, 20 et 30 %)
2 000 $ | plafond mensuel de bundles pour un particulier Pro ou Max
:::

Le solde acheté est utilisable dans Claude, Claude Code, Claude Cowork et certains produits tiers. C'est le levier que presque personne n'active en France, alors qu'il coûte souvent moins cher qu'un passage à Max pour un besoin ponctuel : une grosse semaine de migration de code, un audit de documents, un lancement.

:::piege « Je prends Max pour être tranquille »
C'est l'erreur la plus fréquente et la plus chère. Commence par Pro : la grande majorité des professionnels n'atteint jamais ses limites hebdomadaires. Si tu butes trois semaines de suite, compare **honnêtement** deux options : passer à Max, ou acheter un bundle d'usage. Max se justifie par un constat d'usage répété, pas par précaution.
:::

## Le cas Fable 5 : ne te fie pas aux anciens articles

:::maj 20 juillet 2026
La promotion qui incluait **Claude Fable 5** dans les limites hebdomadaires s'est terminée le 19 juillet 2026. Depuis, le régime est le suivant : **Free** → Fable 5 indisponible. **Pro** et **Team siège standard** → non inclus dans les limites, accès via crédits d'usage (avec un crédit unique offert). **Max** et **Team siège premium** → jusqu'à **50 % des limites hebdomadaires** utilisables sur Fable 5 sans surcoût, puis crédits d'usage.
:::

Autrement dit : « Fable 5 est inclus dans mon abonnement Pro » est faux depuis le 20 juillet 2026. Si tu veux l'utiliser sur Pro, tu passes par les crédits — c'est un choix conscient, pas un défaut.

## Le critère de décision

Pose-toi une seule question : **combien d'heures par semaine cet outil va-t-il me faire gagner ?**

| Ton usage estimé | Le bon plan | Pourquoi |
| --- | --- | --- |
| 0 à 1 h/semaine gagnée | **Free** | Le temps de suivre cette formation et de décider en connaissance de cause. |
| 2 h/semaine ou plus | **Pro** | Rentabilisé dès la première semaine du mois si tu valorises ton heure à plus de 10 €. Le plan recommandé pour suivre cette formation confortablement. |
| Claude toute la journée | **Max** | Développeurs sur Claude Code, créateurs intensifs, analystes — **et seulement après** avoir constaté dans Réglages → Usage que tu butes régulièrement sur Pro. |
| Équipe de 5 personnes ou plus | **Team** | Facturation centralisée et administration ; le siège premium existe pour ceux qui consomment le plus. |

:::defi 15 min — Ton audit de plan
Prends une décision documentée au lieu d'une intuition.
- Tu as ouvert \`claude.com/pricing\` et noté le prix actuel de Pro en facturation annuelle
- Tu as ouvert **Réglages → Usage** dans ton compte et repéré où se lisent la fenêtre de 5 h et la limite hebdomadaire
- Tu as noté deux fonctionnalités listées dans Pro dont tu ne comprends pas encore l'intérêt (tu y reviendras à la fin du parcours)
- Tu sais dire, en une phrase, quel est TON régime d'accès à Fable 5 sur ton plan actuel
- Tu as écrit ta décision (« je reste en Free jusqu'à… » / « je passe en Pro parce que… ») avec le déclencheur qui te ferait changer d'avis
:::

:::memo
Q: Combien de messages par jour donne le plan Pro ?
R: Personne ne le sait : Anthropic ne publie aucun quota chiffré. Il faut lire Réglages → Usage.
===
Q: Quels sont les deux compteurs de limite sur un plan payant ?
R: Une fenêtre glissante de 5 heures et une limite hebdomadaire, avec des remises à zéro distinctes pour Opus.
===
Q: Que faire quand on atteint les limites incluses sans vouloir changer de plan ?
R: Activer les crédits d'usage, ou acheter un bundle d'usage (jusqu'à 30 % de remise, plafond 2 000 $/mois pour un particulier).
===
Q: Fable 5 est-il inclus dans l'abonnement Pro ?
R: Non, plus depuis le 20 juillet 2026. Sur Pro il passe par les crédits d'usage ; Max en couvre jusqu'à 50 % des limites hebdomadaires.
===
Q: Cowork, Design et Science sont-ils réservés à Max ?
R: Non, ils sont listés dans le plan Pro au 6 août 2026.
:::` + FOOTER,
    },
    {
      slug: "choisir-le-bon-modele-effort-reflexion",
      title: "Choisir le bon modèle (et régler l'effort et la réflexion)",
      description:
        "La famille de modèles au 6 août 2026 — Opus 5 en tête —, le sélecteur à côté du bouton d'envoi, et le niveau d'effort devenu le vrai levier de qualité.",
      duration_min: 18,
      is_free_preview: false,
      content_md: `:::objectifs
- Situer Opus 5, Sonnet 5, Fable 5 et Haiku 4.5 sans confondre les générations
- Comprendre pourquoi la réflexion étendue n'est plus un interrupteur sur Opus 5
- Régler le **niveau d'effort** selon la tâche — le vrai levier de 2026
- Reconnaître un modèle « Legacy » et savoir quand il sert encore
- Supprimer de tes prompts les consignes devenues contre-productives
:::

:::flash
Opus 5 (24 juillet 2026) réfléchit **par défaut**, et dans l'application ce comportement **ne se désactive pas**. Le levier n'est donc plus « activer la réflexion » mais « régler l'effort », sur une échelle \`low / medium / high / xhigh / max\`. Commence à \`medium\` pour le courant, monte à \`high\` quand la réponse manque de rigueur, réserve \`xhigh\` et \`max\` aux vrais problèmes.
:::

## Il n'y a pas « un » Claude

Claude est une **famille de modèles**, et choisir le bon pour la bonne tâche reste le premier levier de qualité — avant même le prompt. État de la gamme au **6 août 2026** :

| Modèle | Statut | Pour quoi | Contexte |
| --- | --- | --- | --- |
| **Claude Fable 5** | Actuel — le plus capable | Les tâches les plus exigeantes, quand le coût passe après | 1M tokens |
| **Claude Opus 5** | Actuel — sorti le 24/07/2026 | Code, tâches agentiques, raisonnement exigeant. **Défaut sur Max**, et le modèle le plus puissant accessible sur **Pro** | 1M tokens |
| **Claude Sonnet 5** | Actuel | L'équilibré : rédaction, analyse, usage d'outils, travail quotidien | 1M tokens |
| **Claude Haiku 4.5** | Actuel | Le plus rapide et le plus économe : questions simples, gros volumes | 200k tokens |
| Opus 4.8 / 4.7 / 4.6, Sonnet 4.6 / 4.5, Opus 4.5 | **Legacy** | Reproductibilité, comparaisons, workflows déjà calés dessus | — |

:::maj 24 juillet 2026
**Claude Opus 5** remplace Opus 4.8 comme modèle Opus de référence : contexte de **1 million de tokens** (c'est à la fois le défaut et le maximum, il n'y a pas de variante 200k), **128 000 tokens de sortie**, réflexion étendue **activée par défaut**, connaissances arrêtées à **mai 2026**. Opus 4.8 bascule dans les « modèles Legacy ». Côté API, Opus 5 est au **même tarif** qu'Opus 4.8 : 5 $ / 25 $ par million de tokens.
:::

Retiens la logique plutôt que les numéros (ils changent tous les trimestres) : **Haiku = vitesse, Sonnet = équilibre, Opus = puissance de travail, Fable = plafond de capacité.**

:::piege « Legacy » ne veut pas dire « cassé »
Un modèle Legacy fonctionne toujours. Il n'est simplement plus celui qu'Anthropic met en avant, et il finira par être retiré — avec un préavis. Deux repères concrets : **Opus 4.1 a été retiré le 5 août 2026** (il ne répond plus via l'API), et la prochaine retraite annoncée, celle de Sonnet 4.5, n'interviendra **pas avant le 29 septembre 2026**. Si un flux de travail dépend d'un modèle Legacy, prévois la bascule avant d'y être forcé.
:::

## Où ça se règle

Le sélecteur se trouve **à côté du bouton d'envoi**. Il affiche le modèle actif et donne accès à deux réglages :

1. **Le modèle** : clique sur son nom, choisis dans la liste.
2. **L'effort** : l'intensité de traitement de chaque réponse.

Au 6 août 2026, le sélecteur de l'application propose **Opus 5, Sonnet 5, Fable 5, Opus 4.8, Opus 4.7, Opus 4.6 et Sonnet 4.6**. Haiku 4.5 est bien un modèle actuel, mais il ne figure pas dans cette liste : on l'utilise via l'API et les outils qui l'appellent, pas depuis le sélecteur du chat.

Deux autres raisons possibles si tu ne vois pas un modèle cité ici : ton plan (Fable 5 dépend de crédits d'usage sur Pro, voir leçon 2), ou une politique d'entreprise — sur les comptes Team et Enterprise, les administrateurs peuvent restreindre par rôle les modèles et les niveaux d'effort accessibles. Ce n'est pas un bug.

## Le changement qui déroute : la réflexion ne s'éteint plus

Jusqu'à Opus 4.8, la réflexion étendue était un interrupteur : on l'activait pour les tâches de raisonnement, on la laissait éteinte pour le reste.

:::cle Sur Opus 5, le toggle a disparu
La réflexion étendue est **activée par défaut** et **ne peut pas être désactivée dans l'application**. Ce n'est pas une option masquée : le réglage n'existe plus pour ce modèle. Côté API, la désactivation reste possible, mais **uniquement si l'effort est \`high\` ou en dessous** — avec \`xhigh\` ou \`max\`, la requête renvoie une erreur 400.
:::

Conséquence pratique : si tu veux des réponses rapides et peu coûteuses pour du courant, la bonne réaction n'est plus « je coupe la réflexion », c'est **« je baisse l'effort »** — ou « je bascule sur Sonnet 5 ».

## L'effort : le réglage qui décide de tout

La doc officielle est directe : *« Higher effort means more thorough responses, but they take longer and use more tokens. »* Plus d'effort = réponses plus fouillées, mais plus lentes et plus consommatrices de ton quota.

| Niveau | Quand l'utiliser | Ce que tu paies |
| --- | --- | --- |
| \`low\` | Reformulation, traduction, question factuelle simple | Presque rien, réponse immédiate |
| \`medium\` | Le courant : e-mails, synthèses, brouillons | Le meilleur rapport qualité/quota au quotidien |
| \`high\` | Le travail sérieux : analyse, rédaction structurée, code | Le défaut sur l'API et Claude Code pour Opus 5 et Sonnet 5 |
| \`xhigh\` | Problème réellement difficile, bug tenace, décision lourde | Nettement plus lent et plus coûteux |
| \`max\` | Le plafond, à sortir rarement | Le maximum de temps et de quota |

Dans l'application, les niveaux \`xhigh\` et au-delà ne sont proposés que sur Opus 4.7 et les modèles plus récents.

:::astuce La montée d'un cran, pas de trois
Quand une réponse ne te satisfait pas, ne change pas tout d'un coup. Monte **un seul** cran d'effort et relance la même demande. Neuf fois sur dix, passer de \`medium\` à \`high\` suffit — et tu apprends au passage ce que chaque cran apporte réellement sur TES tâches, au lieu de payer \`max\` par superstition.
:::

## La consigne de prompting qui s'inverse

Voici le piège le plus subtil de cette période, et il concerne tout le monde — pas seulement les développeurs.

:::piege Supprime tes « ajoute une étape de vérification finale »
Anthropic recommande explicitement de **retirer** les instructions de vérification héritées des modèles précédents (« relis-toi et vérifie ton travail avant de répondre », « utilise un sous-agent pour contrôler »). Opus 5 **vérifie déjà son travail spontanément** : ces consignes provoquent de la sur-vérification, donc des réponses plus longues, plus lentes et plus chères, sans gain de qualité. Si tu as des prompts enregistrés écrits pour Opus 4.x, c'est la première ligne à couper.
:::

Autres différences de comportement à connaître sur Opus 5 : les réponses sont **plus longues par défaut**, la progression est **narrée plus souvent**, et la délégation à des sous-agents est **plus spontanée**. Rien de tout cela n'est un dysfonctionnement — mais si tu veux du concis, il faut le demander explicitement dans tes instructions de profil (leçon 6).

## Ce que ça coûte, si tu passes par les crédits

Les tarifs API comptent pour toi dès que tu utilises des crédits ou des bundles d'usage (leçon 2), puisque la consommation y est facturée aux tarifs API standard :

| Modèle | Prix par million de tokens (entrée / sortie) |
| --- | --- |
| Claude Fable 5 | 10 $ / 50 $ |
| Claude Opus 5 | 5 $ / 25 $ |
| Claude Sonnet 5 | **2 $ / 10 $** (tarif définitif) |
| Claude Haiku 4.5 | 1 $ / 5 $ |

:::maj 11 août 2026
Le tarif de **Sonnet 5** (2 $ / 10 $ par million de tokens), annoncé au lancement comme un tarif d'introduction valable jusqu'au 31 août, **devient permanent**. La hausse à 3 $ / 15 $ qui était prévue au 1er septembre 2026 **n'aura pas lieu**. Si tu as chiffré un budget sur l'ancienne annonce, tu peux le réviser à la baisse — et si tu lis encore « le tarif augmente le 1er septembre » quelque part, c'est périmé.
:::

## La règle pratique

> Tâche simple → Sonnet 5, effort bas (Haiku 4.5 si tu passes par l'API).
> Tâche sérieuse → Sonnet 5 à \`high\`, puis Opus 5 si la rigueur manque encore.
> Tâche vraiment difficile → Opus 5 à \`xhigh\`, et seulement là.

Tout monter d'un coup pour une question banale, c'est payer plusieurs fois — en temps, en quota, en attente — pour un gain nul.

:::prompt Faire choisir le bon réglage par Claude lui-même
Voici la tâche que je veux te confier :

[colle ta tâche ici, avec son contexte et le livrable attendu]

Avant de la traiter, réponds-moi en 5 lignes maximum :
1. Cette tâche relève-t-elle du raisonnement, de la rédaction, de la recherche d'information récente, ou de l'exécution ?
2. Un modèle rapide suffirait-il, ou la difficulté justifie-t-elle le modèle le plus puissant ?
3. Quel niveau d'effort recommandes-tu (low, medium, high, xhigh, max) et pourquoi ?
4. Quelles informations te manquent pour bien faire ?

Ensuite seulement, attends ma confirmation avant de traiter la tâche.
:::

:::defi 25 min — Ton étalonnage personnel
Arrête de croire ce qu'on raconte sur les modèles : mesure-le sur TON travail.
- Tu as choisi un problème non trivial de ton métier (une décision à argumenter, un document à structurer)
- Tu l'as posé une première fois à **Sonnet 5**, réglages par défaut, et copié la réponse
- Tu l'as reposé à **Opus 5** dans une nouvelle conversation, et copié la réponse
- Tu l'as reposé une troisième fois avec un **cran d'effort en plus** que l'essai précédent
- Tu as noté pour chaque essai : le temps d'attente ressenti et ce que la réponse apporte de plus
- Tu as écrit ta règle personnelle en une phrase (« pour mes [type de tâche], j'utilise [modèle] à [effort] »)
- Bonus : tu as ouvert un ancien prompt et supprimé toute consigne du type « vérifie ton travail avant de répondre »
:::

:::memo
Q: Sur Opus 5, comment désactiver la réflexion étendue dans l'application ?
R: On ne peut pas. Le réglage n'existe plus pour ce modèle. Via l'API, uniquement à effort \`high\` ou en dessous.
===
Q: Quel est le premier réglage à ajuster quand une réponse manque de rigueur ?
R: Le niveau d'effort — un cran à la fois, pas trois.
===
Q: Quel modèle est le défaut sur le plan Max au 6 août 2026 ?
R: Claude Opus 5, sorti le 24 juillet 2026. C'est aussi le plus puissant accessible sur Pro.
===
Q: Quelle consigne de prompting est devenue contre-productive sur Opus 5 ?
R: « Ajoute une étape de vérification finale ». Opus 5 vérifie déjà son travail : la consigne provoque de la sur-vérification.
===
Q: Que signifie « Legacy » pour un modèle Claude ?
R: Qu'il fonctionne encore mais n'est plus mis en avant, et sera retiré un jour avec préavis. Opus 4.8 est passé Legacy le 24 juillet 2026.
:::` + FOOTER,
    },
    {
      slug: "le-tour-de-l-interface-qui-compte",
      title: "Le tour de l'interface : chats, artefacts, recherche, incognito",
      description:
        "Les fonctions de l'interface qui changent ta façon de travailler — artefacts, recherche, incognito, Cowork en session cloud — et celles que tu peux ignorer au début.",
      duration_min: 17,
      is_free_preview: false,
      content_md: `:::objectifs
- Joindre des fichiers et activer les bons outils depuis la zone de saisie
- Demander systématiquement tes livrables en artefact, et les éditer sur place
- Distinguer recherche web, réflexion étendue et Research — et choisir le bon
- Utiliser le mode incognito en connaissant ses limites réelles
- Savoir ce qu'est devenu Cowork en 2026, et quand il remplace le chat
:::

:::flash
Trois réflexes suffisent la première semaine : joindre les vrais documents plutôt que de les résumer, demander tout livrable **en artefact**, et ouvrir **une conversation par sujet**. Le reste de l'écosystème — Cowork (y compris dans Chrome), Design, mode vocal — s'ajoutera quand tu en auras l'usage.
:::

## L'essentiel visible

L'interface de Claude est volontairement sobre : une zone de saisie, un historique de conversations à gauche, le sélecteur de modèle à côté du bouton d'envoi (leçon précédente). Deux raccourcis à connaître dès le premier jour :

- **« + »** (dans la zone de saisie) : joindre des fichiers (PDF, images, tableurs, code…) et activer ou désactiver des capacités comme la recherche web — ce que l'interface appelle les « outils ».
- **« / »** dans la zone de saisie : accéder aux commandes et aux skills (on y revient en leçon 6).

Tu peux envoyer des documents entiers : Claude lit les PDF, analyse les images et les captures d'écran, décortique les tableurs. C'est l'un des usages les plus rentables dès la première semaine.

:::cle Donne le document, pas ton souvenir du document
La différence de qualité entre « voici le contrat » et « en gros le contrat dit que… » est énorme, et elle est gratuite. Chaque fois que tu t'apprêtes à paraphraser un fichier que tu as sous la main, joins-le à la place.
:::

## Les artefacts : quand Claude produit un livrable

Dès que tu demandes un contenu structuré — document, tableau, page web, diagramme, morceau de code — Claude peut le créer dans un **artefact** : un panneau dédié à côté de la conversation, téléchargeable et partageable.

Les documents texte s'y **éditent directement** : surligne le passage à changer et clique « Edit with Claude », sans repasser par le chat. Les autres types (pages web, code, diagrammes) se modifient en redemandant à Claude dans la conversation. Dans tous les cas, la logique est la même : la conversation sert à itérer, l'artefact contient le livrable propre.

:::astuce Demande l'artefact dès la première phrase
N'attends pas d'avoir une bonne réponse pour demander « mets-la en artefact » : dis-le d'emblée (« rédige-moi cette note en artefact »). Tu gagnes un aller-retour, et tu itères directement sur le document au lieu de le reconstruire à partir du fil.
:::

## Recherche web, réflexion étendue, Research : trois choses différentes

| Outil | Sert à | Exemple de question |
| --- | --- | --- |
| **Recherche web** | Aller chercher un fait récent, ponctuel | « Quel est le prix actuel de l'abonnement X ? » |
| **Réflexion étendue** | Raisonner sans information externe | « Trouve la faille dans ce raisonnement financier » |
| **Research** (plans payants) | Mener une investigation multi-sources de plusieurs minutes et rendre un rapport structuré et **sourcé** | « Fais-moi l'état du marché de la logistique urbaine en France » |

La doc officielle résume bien la répartition : recherche web pour les **faits récents ponctuels**, réflexion étendue pour le **raisonnement sans information externe**, Research pour **l'investigation en profondeur**.

:::piege Croire que Claude cherche sur le web tout seul, systématiquement
Il ne le fait que quand il juge la question concernée — et son cutoff de connaissances (mai 2026 pour Opus 5) le trompe parfois. Si ta question porte sur un fait daté, demande-le en toutes lettres : « cherche sur le web et cite tes sources ». Puis **regarde les sources** : c'est là que se repèrent les réponses construites de mémoire.
:::

## Le mode incognito

L'icône **fantôme** (en haut à droite) ouvre une conversation incognito : elle n'est pas sauvegardée dans l'historique et n'alimente pas la mémoire de Claude (leçon 7). Utile pour les sujets sensibles ou les tests jetables.

Deux nuances qui surprennent tout le monde : incognito ne veut pas dire zéro trace — Anthropic conserve ces conversations **30 jours** pour des raisons de sécurité — et une conversation incognito fermée ne peut **jamais** être rouverte. Copie ce que tu veux garder avant de la quitter.

## Cowork : ce n'est plus une application de bureau

:::maj 7 juillet 2026
**Claude Cowork** est arrivé en beta sur \`claude.ai\` et sur mobile iOS/Android. Le changement de fond n'est pas la surface, c'est l'architecture : les **sessions tournent dans le cloud**. Une tâche lancée depuis ton portable **continue après que tu l'as fermé**, et Claude te notifie quand il a besoin d'une décision. S'y ajoutent le travail en arrière-plan, les **tâches planifiées**, les approbations depuis le mobile, et un **accueil unifié Chat + Cowork** avec projets et artifacts partagés. Le déploiement a commencé par les abonnés Max et s'étend aux autres plans.
:::

La distinction utile à retenir : le **chat** sert quand tu veux une réponse maintenant et que tu restes devant l'écran. **Cowork** sert quand tu veux confier un travail qui prend du temps et revenir plus tard — Cowork est listé dans le plan Pro depuis 2026 (leçon 2), ce n'est plus un privilège Max.

## Le reste de l'écosystème

| Brique | Ce que c'est | Quand t'en occuper |
| --- | --- | --- |
| **Claude Design** | Prototypes et maquettes visuelles | Quand tu produis des interfaces ou des supports |
| **Claude Code** | L'agent en terminal | Un parcours entier lui est consacré |
| **Claude Science** | Outils orientés travaux scientifiques | Selon ton métier |
| **Connecteurs** | Brancher Claude sur Drive, Slack, Microsoft 365… | Leçon suivante |
| **Claude Cowork dans Chrome** | Le panneau latéral qui laisse Claude agir dans ton navigateur | Voir la mise à jour ci-dessous |

:::maj 12 août 2026
**« Claude in Chrome » n'existe plus sous ce nom.** Le panneau latéral de Chrome est devenu une **session Claude Cowork**. Ce n'est pas qu'un changement d'étiquette : ce que tu commences dans le navigateur **se retrouve sur le bureau, le web et le mobile**, les conversations sont enregistrées dans l'historique de ton compte, et tes **skills et connecteurs fonctionnent dans le navigateur**. Déploiement immédiat sur **Max et Team**, puis **Pro dans les semaines qui suivent**. Toujours **Chrome uniquement** : ni Edge, ni Brave, ni Arc, ni le mobile.
:::

Le **mode vocal** a lui aussi changé de dimension : depuis le 23 juillet 2026, sur les plans payants, il ne tourne plus seulement sur Haiku mais aussi sur **Opus et Sonnet**, reprend la famille de modèle utilisée en dernier dans le chat texte, et peut accéder à tes **outils connectés pendant la conversation vocale** (Gmail, Google Agenda, Google Docs, Slack). Le plan Free reste sur Haiku avec un seul outil connecté. Ce point est relayé par la presse spécialisée plus que par les notes de version officielles : considère-le comme fiable dans les grandes lignes, et vérifie le détail dans ton application.

:::piege La conversation-fleuve
Rester dans un fil de 200 messages où se mélangent ton contrat, tes posts LinkedIn et tes questions de code : les réponses se dégradent avec le bruit accumulé, et tu ne retrouves plus rien. Règle simple : **un sujet = une conversation**. La recherche d'historique et les projets (leçon 7) font le reste.
:::

:::defi 30 min — Le tour de piste complet
Une seule session, cinq gestes. Chacun devient un réflexe.
- Tu as joint un PDF de ton quotidien et demandé une synthèse en 5 points
- Tu as demandé un livrable **en artefact** (« transforme cette synthèse en note d'une page pour mon équipe, en artefact »)
- Tu as modifié un titre **dans l'artefact** : surligné puis « Edit with Claude », sans repasser par le chat
- Tu as posé une question exigeant la recherche web et **vérifié les sources citées** (si aucune n'apparaît, active la recherche web via le bouton « + »)
- Tu as ouvert une conversation incognito et constaté qu'elle n'apparaît pas dans l'historique
- Bonus : tu as ouvert Cowork et lancé une tâche de fond pour voir le fonctionnement en session cloud
:::

:::memo
Q: Quel est le réflexe pour tout contenu qui doit sortir de Claude ?
R: Le demander en artefact : panneau dédié, éditable sur place, téléchargeable et partageable.
===
Q: Quelle est la différence entre la recherche web et Research ?
R: La recherche web va chercher un fait récent ponctuel ; Research mène une investigation multi-sources de plusieurs minutes et rend un rapport sourcé.
===
Q: Une conversation incognito laisse-t-elle zéro trace ?
R: Non. Elle n'entre ni dans l'historique ni dans la mémoire, mais Anthropic la conserve 30 jours pour des raisons de sécurité. Et elle est irrécupérable une fois fermée.
===
Q: Cowork est-il réservé à l'application de bureau et au plan Max ?
R: Non. Depuis le 7 juillet 2026 il est sur le web et le mobile, avec des sessions cloud, et il est listé dans le plan Pro.
===
Q: Qu'est devenu « Claude in Chrome » ?
R: Depuis le 12 août 2026, le panneau latéral de Chrome est une session Claude Cowork : le travail se poursuit sur bureau, web et mobile, et les skills et connecteurs y fonctionnent. Chrome uniquement.
:::` + FOOTER,
    },
    {
      slug: "parametrer-claude-les-reglages-qui-comptent",
      title: "Paramétrer Claude : les réglages qui comptent",
      description:
        "Le tour des Settings : capacités, mémoire, tableau de bord Usage, connecteurs, langue, données. Dix minutes de configuration qui améliorent tous tes usages futurs.",
      duration_min: 16,
      is_free_preview: false,
      content_md: `:::objectifs
- Trouver les réglages et activer les capacités qui comptent, mémoire comprise
- Lire ton tableau de bord Usage pour piloter ta consommation
- Brancher un connecteur en connaissant le risque qu'il ouvre
- Régler la langue de l'interface sans confondre avec la langue des réponses
- Faire un choix conscient sur la contribution à l'amélioration des modèles
:::

:::flash
Dix minutes de configuration améliorent tous tes usages futurs. Trois réglages font l'essentiel : la **mémoire** activée (avec le bouton « View and edit memory » repéré), le tableau de bord **Usage** identifié, et **zéro connecteur activé « au cas où »**. Le reste est du confort.
:::

## Où tout se trouve

Un seul chemin à mémoriser : clique sur **tes initiales en bas à gauche** de l'interface, puis **Settings** (Paramètres). Tout ce qui suit se passe là.

Si ton interface est en français, les libellés s'affichent traduits. Ce parcours donne les libellés anglais — repère la section équivalente dans ta langue, la position dans le menu est la même.

## Settings > Capabilities : le cœur du réacteur

C'est la section la plus importante. Tu y actives ou désactives les **capacités** de Claude :

- **La mémoire** : Claude retient qui tu es et ce sur quoi tu travailles d'une conversation à l'autre. C'est le sujet complet de la leçon 7 — active-la dès maintenant si elle ne l'est pas.
- **« View and edit memory »** : le bouton pour voir exactement ce que Claude a retenu de toi, corriger ou supprimer. À repérer avant même d'activer la mémoire : tu gardes la main.
- **La recherche dans les chats passés** (plans payants) : permet de demander « qu'avions-nous conclu sur X ? » et que Claude retrouve la conversation.
- Les capacités de recherche et d'analyse selon ton plan.

:::maj 10 juillet 2026
La mémoire a changé de mécanique : Claude est passé de **résumés quotidiens** à des **entrées catégorisées individuelles**, lues et mises à jour **en cours de conversation**. Concrètement, ce que tu vois dans « View and edit memory » n'est plus un pavé de texte à prendre ou à laisser : ce sont des entrées séparées que tu peux corriger ou supprimer une par une. C'est aussi plus réactif — dire « retiens que je préfère X » n'attend plus le cycle de synthèse suivant.
:::

## Settings > Usage : le réglage que personne n'ouvre

C'est pourtant le seul endroit qui te dit la vérité sur ta consommation. Anthropic ne publie **aucun quota chiffré** (leçon 2) : la fenêtre glissante de 5 heures et la limite hebdomadaire ne se lisent que là, dans ton compte, avec tes chiffres.

:::astuce Mets-toi un rappel mensuel sur Usage
Cinq minutes une fois par mois suffisent à répondre aux deux seules questions qui comptent : est-ce que je bute vraiment sur mes limites, et sur quel type de modèle ? La réponse décide de tout le reste — changer de plan, acheter un bundle d'usage, ou simplement baisser le niveau d'effort par défaut.
:::

## Settings > Appearance

Thème clair/sombre (ou calé sur le système) et police du chat — y compris une option adaptée aux dyslexiques. Cosmétique, mais deux minutes bien investies si tu passes des heures dans l'outil.

## Les sections « prise de recul »

- **Settings > Reflect** (bêta) : un bilan de ton usage de Claude — sujets récurrents, périodes d'activité, façons de collaborer — sur 1, 3, 6 ou 12 mois. Nécessite la mémoire activée ; les conversations incognito en sont exclues. Utile pour repérer *tes* usages à fort rendement (et ceux que tu sous-exploites).
- **Settings > Time and focus** : notifications de pause optionnelles et heures calmes. Anecdotique en apparence, sain en pratique.

:::maj 9 juillet 2026
Ces réglages se sont étoffés : **récapitulatif mensuel d'usage**, **rappels de pause**, **heures calmes** et **insights de travail**. Ils ne changent pas la qualité des réponses, mais ils changent ton rapport à l'outil — et pour quelqu'un qui va passer plusieurs heures par jour dedans, ce n'est pas rien.
:::

## Les connecteurs : brancher Claude sur tes outils

Claude peut se connecter à des services externes — Google Drive, agenda, GitHub, Slack, Microsoft 365 et beaucoup d'autres — via les **connecteurs**, basés sur le standard **MCP** que le parcours Claude Code approfondit. Une fois un connecteur autorisé, Claude peut par exemple chercher dans tes documents Drive ou lire un ticket.

:::maj 7 juillet 2026
Le connecteur **Microsoft 365** n'est plus en lecture seule : il dispose désormais d'**outils d'écriture** — rédaction et envoi d'e-mails, gestion d'agenda, création et mise à jour de fichiers OneDrive et SharePoint. Le changement est majeur du point de vue du risque : un connecteur qui lit peut divulguer, un connecteur qui écrit peut **agir**. Accorde-le en connaissance de cause.
:::

:::piege N'active pas des connecteurs « au cas où »
Chaque connecteur est une porte d'accès à tes données — et, depuis qu'ils savent écrire, une porte d'action. La règle du premier jour est simple : **un connecteur = un besoin identifié**. Le parcours « Prompts & Skills GitHub : trouver, installer, sécuriser » traite en profondeur des risques (injection de prompt, exfiltration).
:::

L'écosystème bouge vite de ce côté : au 6 août 2026, l'annuaire des connecteurs dépasse **950 serveurs MCP**, et la spécification du protocole a été revue le 28 juillet 2026 (autorisation alignée sur OAuth 2.0 / OIDC, interfaces interactives dans la conversation, gestion centralisée par les administrateurs en entreprise). Tu n'as rien à faire de ton côté : l'annonce ne mentionne aucune migration obligatoire pour les connecteurs existants.

## La langue

Il existe un réglage **Language** (menu profil) : il traduit l'**interface** — menus, boutons — en français. Mais la langue des **réponses** de Claude ne se règle pas là : Claude répond par défaut dans la langue de ton message.

Si tu veux forcer un comportement (« réponds-moi toujours en français, même quand je colle des sources en anglais »), ce n'est pas un réglage : c'est une **instruction de profil** — précisément l'objet de la leçon suivante.

## Tes données : ce qu'il faut savoir

Deux points à retenir, réglables dans Settings > Privacy :

1. Tu peux consulter et **exporter tes données** (conversations, mémoire).
2. Vérifie le réglage de **contribution à l'amélioration des modèles** (interrupteur « Help improve Claude ») et aligne-le sur ta politique — c'est particulièrement important si tu traites des données clients.

Pour les conversations qui ne doivent rester ni dans ton historique ni dans la mémoire, le mode incognito (leçon 4) reste l'outil dédié — en gardant en tête qu'Anthropic les conserve 30 jours pour des raisons de sécurité.

:::cle Un réglage par défaut est quand même un choix
Ne pas ouvrir Settings > Privacy, c'est accepter la configuration livrée. Ce n'est pas forcément un mauvais choix ; c'en est un que tu n'as pas fait. Prends deux minutes, décide, et tu pourras répondre à ton client ou à ton employeur quand la question tombera.
:::

## La procédure de configuration (10 minutes)

:::etapes
1. Ouvre **Settings > Capabilities** et active la **mémoire**, puis repère le bouton « View and edit memory ».
2. Ouvre **Settings > Usage** et repère où se lisent la fenêtre de 5 heures et la limite hebdomadaire.
3. Passe dans **Settings > Appearance** : thème et police à ton confort.
4. Ouvre **Settings > Privacy** et tranche sur « Help improve Claude » — décision consciente, pas défaut subi.
5. Vérifie la liste de tes **connecteurs** et désactive tout ce dont tu n'as pas un besoin identifié.
6. Reviens dans le chat et vérifie que tu retrouves le **sélecteur de modèle et d'effort** (leçon 3).
:::

:::defi 15 min — Ta configuration de base
Déroule la procédure, puis vérifie que tu sais où revenir.
- Mémoire activée et bouton « View and edit memory » ouvert au moins une fois
- Tableau de bord **Usage** repéré, avec tes deux compteurs identifiés
- Apparence réglée (thème + police)
- Choix fait et assumé sur « Help improve Claude »
- Liste des connecteurs passée en revue : aucun activé sans besoin identifié
- Tu sais dire de mémoire le chemin exact pour retrouver ce que Claude a retenu de toi
:::

:::memo
Q: Où se trouvent tous les réglages de Claude ?
R: Tes initiales en bas à gauche, puis Settings. La section Capabilities est la plus importante.
===
Q: Comment voir exactement ce que Claude a retenu de toi ?
R: Settings > Capabilities > « View and edit memory ». Depuis le 10 juillet 2026, ce sont des entrées catégorisées éditables une par une.
===
Q: Où lire ta consommation réelle ?
R: Settings > Usage. C'est le seul endroit fiable, puisque Anthropic ne publie aucun quota chiffré.
===
Q: Quelle est la règle de sécurité de base sur les connecteurs ?
R: Un connecteur = un besoin identifié. Chaque connecteur ouvre un accès à tes données, et certains savent désormais écrire.
===
Q: Le réglage Language change-t-il la langue des réponses ?
R: Non, seulement celle de l'interface. La langue des réponses se pilote par une instruction de profil.
:::` + FOOTER,
    },
    {
      slug: "personnaliser-claude-dites-lui-qui-vous-etes",
      title: "Personnaliser Claude : dis-lui qui tu es",
      description:
        "La leçon la plus rentable de ce parcours : les instructions de profil qui font que Claude répond comme TOI tu le veux — qui tu es, ce que tu fais, comment répondre, comment ne pas répondre.",
      duration_min: 20,
      is_free_preview: false,
      content_md: `:::objectifs
- Écrire des instructions de profil qui changent réellement les réponses
- Structurer ces instructions en quatre blocs, dont celui que tout le monde oublie
- Faire dire à Claude ce qu'il ne doit PAS faire — le levier le plus rentable
- Distinguer profil, instructions de projet et skills, et savoir lequel utiliser
- Mesurer le gain par un vrai test avant/après
:::

:::flash
Par défaut, Claude ne sait rien de toi, donc il répond « pour tout le monde ». Les **instructions de profil** s'écrivent une seule fois et s'appliquent à toutes tes conversations. Quatre blocs : qui tu es, ce que tu fais, comment répondre, comment **ne pas** répondre. 150 à 300 mots, et chaque phrase doit changer quelque chose.
:::

## Le problème que presque personne ne règle

Par défaut, Claude ne sait **rien** de toi. Alors il répond « pour tout le monde » : réponses génériques, précautions inutiles, niveau de détail au hasard, anglicismes, listes à puces à rallonge. La plupart des gens compensent en répétant les mêmes consignes au début de chaque conversation — « réponds en français », « je suis développeur, pas besoin d'expliquer ce qu'est une API », « sois direct »…

Il existe un endroit pour écrire ces consignes **une seule fois** : les **instructions de profil**. Elles s'appliquent automatiquement à toutes tes conversations.

**Où** : tes initiales en bas à gauche → Settings → section **« Instructions for Claude »**. (Si ton interface est en français, les libellés s'affichent traduits — Settings = Paramètres. Ce parcours donne les libellés anglais : repère la section équivalente dans ta langue.)

:::cle C'est la leçon la plus rentable du parcours
Une heure passée ici améliore chacune des milliers de réponses que tu liras cette année. Aucune technique de prompt avancée n'a ce rapport effort/effet — parce que celle-ci s'applique automatiquement, y compris les jours où tu écris un prompt bâclé.
:::

## Les quatre blocs d'une bonne instruction de profil

La doc officielle recommande d'y mettre tes approches préférées, tes termes récurrents, tes scénarios typiques et tes consignes de communication. Structure-les en quatre blocs :

### 1. Qui tu es
Métier, secteur, niveau d'expertise, langue de travail. C'est ce qui calibre le niveau des réponses.

> *« Je suis consultante indépendante en logistique, 15 ans d'expérience, basée à Lyon. Je travaille en français. Tu peux utiliser le vocabulaire technique du métier (WMS, cross-docking, OTIF) sans l'expliquer. »*

### 2. Ce que tu fais
Tes tâches et contextes récurrents — ce sur quoi Claude va réellement t'aider chaque semaine.

> *« Mes usages principaux : rédiger des propositions commerciales, analyser des appels d'offres, préparer des restitutions client, structurer des audits d'entrepôt. »*

### 3. Ce que tu veux — comment répondre
Ton, format, longueur, structure. Sois concret.

> *« Réponds de façon directe et structurée. Commence par la réponse, les justifications ensuite. Pour les documents : titres courts, phrases complètes, pas plus de 2 niveaux de plan. Quand ma demande est ambiguë, pose-moi UNE question de clarification plutôt que de deviner. »*

### 4. Ce que tu ne veux PAS — comment ne pas répondre
Le bloc que presque tout le monde oublie, et souvent le plus efficace.

> *« Ne me flatte pas ("excellente question !"). N'ajoute pas d'avertissements évidents ("consultez un professionnel"). Pas de listes à puces pour tout : de la prose quand c'est plus clair. Ne réponds jamais en anglais sauf si je le demande. N'invente pas de chiffres : si tu ne sais pas, dis-le. »*

:::maj 24 juillet 2026
Deux consignes à ajuster depuis l'arrivée d'**Opus 5**. D'abord, **supprime** de ton profil toute instruction du type « vérifie ton travail avant de répondre » ou « ajoute une étape de contrôle final » : Opus 5 se vérifie déjà spontanément, et ces consignes provoquent de la sur-vérification. Ensuite, Opus 5 produit des **réponses plus longues par défaut** : si tu tiens au concis, écris-le explicitement dans ton bloc 3 (« va droit au but, pas de récapitulatif en fin de réponse »).
:::

## La méthode pour l'écrire (15 minutes, une fois)

:::etapes
1. Ouvre tes 5 dernières conversations avec une IA. Note chaque consigne que tu as répétée : ce sont tes instructions de profil qui s'ignorent.
2. Note 3 réponses qui t'ont agacé, et pourquoi. Chaque agacement devient une ligne du bloc 4.
3. Rédige les 4 blocs — 150 à 300 mots au total. Trop long dilue ; trop court ne calibre rien.
4. Colle le tout dans Settings > Instructions for Claude.
5. Teste sur une vraie tâche, et ajuste la seule ligne qui n'a pas produit l'effet attendu.
:::

Si tu bloques sur la rédaction, fais-toi aider — c'est même la meilleure façon de commencer :

:::prompt Faire rédiger tes instructions de profil par Claude
Je veux rédiger mes instructions de profil permanentes pour toi (la section « Instructions for Claude » des réglages).

Mon contexte : je suis [métier, secteur, niveau d'expérience, ville/pays]. Je travaille en français. Mes tâches récurrentes : [liste 3 à 5 tâches].

Ce qui m'agace dans les réponses d'IA : [liste 3 agacements concrets].

Interroge-moi d'abord : pose-moi 5 questions courtes, une par une, pour cerner mon niveau d'expertise, mes formats préférés et mes interdits. Après mes réponses, rédige mes instructions de profil en 4 blocs (qui je suis / ce que je fais / comment répondre / comment NE PAS répondre), entre 150 et 300 mots au total, en français, sous forme de consignes opérationnelles et non de biographie. Chaque phrase doit changer quelque chose dans tes futures réponses.
:::

C'est un document vivant : chaque fois que tu te surprends à re-corriger Claude sur la même chose deux fois, remonte la consigne dans le profil.

## Les skills : la personnalisation par contexte

Les instructions de profil définissent ton défaut permanent. Pour des **modes** ponctuels — un ton spécifique, un format récurrent — Claude propose les **skills** (qui remplacent progressivement les anciens « styles » ; pendant la transition, tu verras peut-être encore un menu de styles) : des paquets de consignes activables à la demande, via **Customize > Skills** ou une commande **« / »** dans le chat. Exemple : le skill « Learning » fait adopter à Claude une posture de pédagogue qui te fait travailler au lieu de donner la réponse (à installer une fois : Customize > Skills > « + » > Browse skills > « Learning »).

Et quand tu seras à l'aise, sache que tu peux **créer tes propres skills** : un fichier de consignes \`SKILL.md\` (un nom, une description, tes instructions), éventuellement accompagné de ressources, chargé via Customize > Skills — disponible sur tous les plans quand l'exécution de code est activée. La méthode pas-à-pas est dans l'article officiel « How to create custom skills » du centre d'aide, et deux parcours de cette formation la mettent en pratique : **Claude Code et IA agentic** (créer ses skills de travail) et **Prompts & Skills GitHub** (installer ceux des autres sans risque).

La hiérarchie à retenir :

| Niveau | Portée | Tu y mets |
| --- | --- | --- |
| **Profil** | Toutes tes conversations, toujours | Qui tu es, comment répondre et ne pas répondre |
| **Projet** (leçon suivante) | Un sujet | Les règles et le contexte de CE dossier |
| **Skill** | À la demande | Un mode ponctuel : un ton, un format, une posture |

:::piege N'écris pas ta biographie
L'erreur classique : un roman de 2 000 mots sur sa vie. Les instructions de profil ne sont pas un CV, ce sont des **consignes opérationnelles**. Test de tri, phrase par phrase : « est-ce que ça change quelque chose dans une réponse ? » « J'aime la mer » ne change rien. « Ne me propose jamais de solution qui nécessite de coder » change tout.
:::

:::astuce Ne teste pas le « sans profil » en incognito
C'est le piège du test avant/après : les instructions de profil **s'appliquent aussi** aux conversations incognito. L'incognito ne coupe que l'historique et la mémoire. Pour comparer honnêtement, fais ton essai « avant » d'abord, puis installe le profil, puis rouvre une conversation normale.
:::

:::defi 30 min — Le test avant/après
La seule façon de mesurer ce que tu viens de gagner.
- Tu as posé une vraie question métier **avant** toute personnalisation, et copié la réponse quelque part
- Tu as rédigé tes 4 blocs (150 à 300 mots), seul ou avec le prompt de cette leçon
- Le bloc 4 (« comment NE PAS répondre ») contient au moins 3 interdits concrets tirés de tes agacements réels
- Aucune consigne de type « vérifie ton travail avant de répondre » n'y figure
- Les instructions sont collées dans Settings > Instructions for Claude
- Tu as reposé **exactement** la même question dans une nouvelle conversation et comparé les deux réponses
- Tu as noté la différence en une phrase : c'est ton gain sur toutes tes conversations futures
:::

:::memo
Q: Quels sont les quatre blocs d'une bonne instruction de profil ?
R: Qui tu es, ce que tu fais, comment répondre, et comment NE PAS répondre — le dernier étant le plus souvent oublié.
===
Q: Quelle longueur viser pour les instructions de profil ?
R: 150 à 300 mots. Trop long dilue, trop court ne calibre rien.
===
Q: Quelle est la différence entre profil, instructions de projet et skill ?
R: Le profil est toujours actif, le projet ne vaut que dans son sujet, le skill s'active à la demande.
===
Q: Les instructions de profil s'appliquent-elles en mode incognito ?
R: Oui. L'incognito ne coupe que l'historique et la mémoire, pas le profil.
===
Q: Quelle consigne faut-il retirer de son profil depuis Opus 5 ?
R: Les demandes de vérification finale : Opus 5 se vérifie déjà seul, la consigne le fait sur-vérifier.
:::` + FOOTER,
    },
    {
      slug: "memoire-et-projets-contexte-durable",
      title: "Mémoire et projets : donner à Claude un contexte durable",
      description:
        "La mémoire refondue en entrées catégorisées, les projets qui organisent le travail, et comment garder le contrôle des deux.",
      duration_min: 17,
      is_free_preview: false,
      content_md: `:::objectifs
- Comprendre ce que la mémoire retient, et ce qu'elle ne retient jamais
- Corriger, suspendre ou effacer la mémoire en sachant ce que chaque geste fait
- Créer un projet avec sa base de connaissances et ses instructions propres
- Placer chaque information au bon étage : profil, mémoire, projet ou conversation
:::

:::flash
Deux mécanismes règlent le problème du contexte. La **mémoire** se construit seule et te suit partout : depuis le 10 juillet 2026 elle fonctionne par **entrées catégorisées** mises à jour en cours de conversation, plus par résumés quotidiens. Les **projets** cloisonnent un sujet avec ses documents et ses règles. La mémoire sert au contexte de fond ; les documents de travail vont dans un projet.
:::

## Deux mécanismes complémentaires

La personnalisation (leçon précédente) dit à Claude *comment* répondre. Restait le problème du *quoi* : re-expliquer ton contexte à chaque conversation. Deux mécanismes le règlent :

- **La mémoire** : Claude retient automatiquement, entre les conversations, qui tu es et ce sur quoi tu travailles.
- **Les projets** : des espaces de travail par sujet, avec leurs documents et leurs consignes propres.

## La mémoire : comment ça marche vraiment

Disponible pour **tous les utilisateurs** (gratuit inclus), elle s'active dans **Settings > Capabilities**.

:::maj 10 juillet 2026
La mécanique a changé. Avant, Claude construisait un **résumé quotidien** de tes conversations, mis à jour environ toutes les 24 heures. Désormais, la mémoire est faite d'**entrées catégorisées individuelles**, **lues et mises à jour en cours de conversation**. Deux conséquences très concrètes : ce que tu dis à Claude de retenir est pris en compte **tout de suite**, sans attendre le cycle du lendemain ; et dans « View and edit memory », tu corriges ou supprimes **une entrée précise** au lieu de tout reprendre.
:::

Ce qui y entre typiquement : ton rôle professionnel, tes projets en cours, tes préférences de communication, ta façon de travailler. Ce qui n'y entre pas : les conversations **incognito** (jamais), et le contenu des projets — chaque projet a **sa propre mémoire, séparée** de la mémoire générale.

Trois gestes de contrôle à connaître :

:::etapes
1. **Voir et corriger** : Settings > Capabilities > « View and edit memory ». Tout ce que Claude retient est là, entrée par entrée, éditable.
2. **Diriger** : dis-le en pleine conversation — « retiens que je préfère X ». La mémoire n'est pas seulement automatique, elle se pilote.
3. **Suspendre ou effacer** : « Pause memory » conserve la mémoire mais cesse de l'utiliser ; « Reset » efface **définitivement et irréversiblement** toutes les mémoires, y compris celles de tes projets.
:::

:::piege Reset n'est pas Pause
« Reset » n'a pas de corbeille et pas de bouton retour. Si tu veux seulement vérifier si la mémoire perturbe une conversation, utilise **Pause** : tu retrouveras tout ensuite. Le Reset se réserve aux vrais cas — changement de métier, compte partagé qu'on reprend, mémoire devenue incohérente au point d'être irrécupérable.
:::

Sur les plans payants s'ajoute la **recherche dans les chats passés** : « qu'avions-nous conclu sur la tarification le mois dernier ? » et Claude retrouve la conversation.

## Les projets : un dossier = un contexte

Un **projet** regroupe des conversations autour d'un même sujet, avec deux super-pouvoirs :

1. **La base de connaissances** : tu y déposes les documents de référence (brief, contrat, charte, code…). Claude les consulte pour toutes les conversations du projet — plus besoin de les joindre à chaque fois.
2. **Les instructions de projet** : des consignes qui ne s'appliquent que là. *« Dans ce projet, tu es relecteur de mes propositions commerciales. Adopte un ton critique et exigeant. Vérifie systématiquement la cohérence des chiffres. »*

Côté quotas, au 6 août 2026, la page tarifs officielle liste les **projets illimités** dans le plan Pro (et au-dessus) ; le plan gratuit, lui, est plafonné — 5 projets à notre dernière vérification. Point important de la doc officielle : les conversations d'un projet **ne partagent pas leur contenu entre elles**. Ce qui doit être durable va dans la base de connaissances, pas dans un fil.

:::prompt Écrire les instructions d'un nouveau projet
Je crée un projet Claude pour ce dossier : [décris le dossier en 3 lignes — client, produit, sujet, échéance].

Les documents que je vais déposer dans la base de connaissances : [liste-les].

Rédige-moi les instructions de ce projet, en 8 lignes maximum, en français. Elles doivent préciser : le rôle que tu tiens dans ce projet, le niveau d'exigence attendu, les formats de livrable habituels, les points sur lesquels tu dois systématiquement m'alerter, et ce que tu ne dois jamais faire ici.

Ne me donne que les instructions, prêtes à coller. Pas d'introduction.
:::

## L'architecture complète du contexte

Tu as maintenant les quatre étages. Du plus permanent au plus ponctuel :

| Étage | Portée | Tu y mets |
| --- | --- | --- |
| Instructions de profil | Toutes conversations | Qui tu es, comment répondre / ne pas répondre |
| Mémoire | Toutes conversations | (Se construit seule — tu supervises) |
| Projet (instructions + documents) | Un sujet | Le contexte et les règles de CE sujet |
| La conversation | Un échange | La tâche du moment |

:::cle C'est cette architecture qui sépare l'occasionnel du professionnel
L'utilisateur occasionnel redonne tout son contexte à chaque conversation, et s'étonne que les réponses soient génériques. Le professionnel a un outil déjà calibré qui sait qui il est, comment il travaille et où en est le dossier. La différence de résultat n'a rien à voir avec le talent en prompt.
:::

:::piege N'utilise pas la mémoire comme un entrepôt
« Retiens ces 40 références produit » : mauvaise place. La mémoire sert au **contexte de fond** — qui tu es, comment tu travailles —, pas aux données de travail. Les données vont dans la base de connaissances d'un projet, où elles sont consultables telles quelles, sans risque de déformation.
:::

:::defi 25 min — Ton premier vrai projet
Prends un dossier réel en cours, pas un exemple fictif.
- Le projet est créé et porte un nom explicite
- Tu y as déposé au moins 2 documents de référence dans la base de connaissances
- Tu as écrit 5 à 8 lignes d'instructions de projet (rôle de Claude + exigences + interdits)
- Tu as lancé une vraie conversation de travail dedans, pas un test
- Tu as ouvert « View and edit memory » et lu ce que Claude a déjà retenu de toi
- Tu as corrigé ou supprimé au moins une entrée fausse ou périmée (ou constaté qu'il n'y en a pas)
- Tu t'es fixé un rendez-vous dans une semaine pour relire la mémoire
:::

:::memo
Q: Comment la mémoire de Claude fonctionne-t-elle depuis le 10 juillet 2026 ?
R: Par entrées catégorisées individuelles, lues et mises à jour en cours de conversation — plus par résumés quotidiens.
===
Q: Quelle est la différence entre « Pause memory » et « Reset » ?
R: Pause conserve la mémoire sans l'utiliser. Reset l'efface définitivement, projets compris, sans retour possible.
===
Q: Que met-on dans la base de connaissances d'un projet plutôt qu'en mémoire ?
R: Les documents de travail durables du sujet : brief, contrat, charte, code. La mémoire sert au contexte de fond.
===
Q: Les conversations d'un même projet partagent-elles leur contenu ?
R: Non. Seule la base de connaissances est commune : ce qui doit durer doit y être déposé.
===
Q: Quels contenus n'entrent jamais dans la mémoire générale ?
R: Les conversations incognito, et le contenu des projets — chaque projet a sa mémoire séparée.
:::` + FOOTER,
    },
    {
      slug: "les-dix-reflexes-pour-bien-demarrer",
      title: "Les 10 réflexes qui font la différence dès la première semaine",
      description:
        "La synthèse opérationnelle du parcours : dix habitudes concrètes, les repères datés de l'été 2026, et la passerelle vers le prompt engineering sérieux.",
      duration_min: 18,
      is_free_preview: false,
      content_md: `:::objectifs
- Transformer les six leçons précédentes en dix habitudes tenables
- Repérer et corriger l'erreur d'état d'esprit qui plafonne 90 % des utilisateurs
- Mesurer, sur une tâche réelle, le temps que Claude te fait gagner
- Savoir ce que le parcours suivant va t'apporter, et pourquoi dans cet ordre
:::

:::flash
Tout est en place : compte, plan, modèle, interface, réglages, profil, mémoire, projets. Ce qui suit est la synthèse à garder sous la main — dix réflexes, dont trois font l'essentiel du gain : **un sujet = une conversation**, **les vrais documents plutôt que ton souvenir**, et **chaque agacement remonté dans ton profil**.
:::

## Tout est en place. Maintenant, les réflexes.

Compte créé partout, plan choisi, modèle compris, interface apprivoisée, réglages faits, profil personnalisé, mémoire et projets en route. Ce qui suit est la synthèse : dix réflexes, chacun découlant directement de ce parcours ou des recommandations officielles d'Anthropic.

### Comment tu parles à Claude

**1. Parle comme à un collègue.** Le conseil n° 1 de la doc officielle. Pas de formules magiques ni de style télégraphique : des phrases naturelles, complètes, en français. Claude n'est pas un moteur de recherche, c'est un interlocuteur.

**2. Sois spécifique — toujours plus que tu ne le crois nécessaire.** « Améliore ce texte » produit une réponse moyenne. La spécificité est le levier n° 1, avant toute technique avancée.

**3. Itère au lieu de recommencer.** La première réponse est un premier jet. « Plus court », « moins formel », « développe le point 2 » — l'itération est le mode de travail normal, pas un échec du prompt initial.

:::avant-apres Demande vague | Demande cadrée
Améliore ce texte.
===
Resserre ce texte à 150 mots pour un comité de direction financier. Garde les deux chiffres clés, supprime les adverbes, et termine par la décision que j'attends d'eux.
:::

### Comment tu organises le travail

**4. Un sujet = une conversation.** Les conversations-fleuves dégradent les réponses et rendent l'historique inutilisable. Nouveau sujet, nouvelle conversation — les projets organisent le reste.

**5. Le bon modèle et le bon effort pour la bonne tâche.** Question simple : Sonnet 5, effort bas, quota préservé. Enjeu réel : Opus 5, et l'**effort monté d'un cran à la fois**. Depuis Opus 5, la réflexion étendue n'est plus un interrupteur à actionner : c'est l'effort qui règle tout.

:::astuce Renomme tes conversations le jour même
Claude leur donne un titre automatique, souvent générique. Trente secondes pour le remplacer par le nom du dossier et la date, et ton historique reste exploitable six mois plus tard. C'est le complément indispensable du réflexe n° 4 : cloisonner ne sert à rien si tu ne retrouves plus les cloisons.
:::

**6. Donne les documents, pas des résumés de documents.** Claude lit les PDF, les images, les tableurs. Un vrai contrat en pièce jointe vaut mieux que trois paragraphes qui le paraphrasent de mémoire.

**7. Les livrables en artefact.** Tout ce qui doit sortir de Claude — note, page, script, tableau — se demande en artefact : éditable, téléchargeable, propre.

### Comment tu progresses

**8. Vérifie ce qui est vérifiable.** Claude peut se tromper avec assurance — chiffres, dates, références. Pour les faits récents, exige la recherche web (« cherche sur le web et cite tes sources ») et **regarde** les sources. Pour les enjeux forts, demande : « qu'est-ce qui, dans ta réponse, mériterait vérification ? » Cette vigilance est un thème central des parcours suivants.

**9. Chaque agacement devient une ligne de profil.** Deux fois la même correction (« pas de puces ! », « en français ! ») = une consigne à remonter dans tes instructions de profil. C'est ainsi que l'outil converge vers toi, semaine après semaine.

**10. Audite ta mémoire et ton usage une fois par mois.** « View and edit memory » pour corriger ce qui est faux ou périmé, et **Settings > Usage** pour savoir si tu butes vraiment sur tes limites. Dix minutes par mois, deux décisions bien informées.

:::cle Trois réflexes portent 80 % du gain
Si tu ne devais en tenir que trois : **un sujet = une conversation** (n° 4), **les vrais documents** (n° 6), **chaque agacement dans le profil** (n° 9). Les sept autres affinent. Ces trois-là changent le niveau de tes réponses dès la première semaine.
:::

## Ce qui a bougé pendant que tu apprenais

L'écosystème avance vite, et une partie de ce que tu liras ailleurs sur Claude est déjà périmée. Les repères datés à garder en tête :

| Date | Ce qui a changé | Ce qui devient faux |
| --- | --- | --- |
| 7 juillet 2026 | Cowork sur web et mobile, sessions cloud, tâches planifiées | « Cowork est une application de bureau » |
| 10 juillet 2026 | Mémoire en entrées catégorisées | « La mémoire fonctionne par résumés quotidiens » |
| 20 juillet 2026 | Fin de la promo Fable 5 | « Fable 5 est inclus dans mon abonnement » |
| 23 juillet 2026 | Mode vocal sur Opus et Sonnet (plans payants) | « Le mode vocal tourne sur Haiku » |
| 24 juillet 2026 | **Opus 5**, thinking par défaut, effort comme levier | « Le dernier Opus est le 4.8 » |
| 5 août 2026 | Retrait d'Opus 4.1 | « Opus 4.1 est encore utilisable » |
| 11 août 2026 | Tarif Sonnet 5 (2 $ / 10 $) rendu **permanent** | « Sonnet 5 augmente le 1er septembre » |
| 12 août 2026 | Le panneau Chrome devient une **session Cowork** | « Claude in Chrome est une extension à part » |

:::astuce Prends le réflexe de dater ce que tu apprends
Quand tu lis un tutoriel sur Claude, cherche d'abord sa date. Sans date, ou plus vieux que trois mois, traite-le comme une hypothèse à vérifier — pas comme un fait. La documentation officielle est sur \`platform.claude.com/docs/en/\` et le centre d'aide sur \`support.claude.com\` : ce sont les deux seules sources qui bougent en même temps que le produit.
:::

## L'erreur d'état d'esprit à éviter

:::piege Traiter Claude comme un distributeur
Question → réponse → copier-coller → fermer. C'est le plafond où stagne la majorité des utilisateurs. Les gains sérieux viennent du travail **en dialogue** — cadrer, déléguer, critiquer, faire réviser — sur un outil **configuré** (profil, projets, mémoire). Tu viens de faire la partie « configuré » ; la partie « dialogue » est exactement l'objet de la suite.
:::

## Et maintenant : le prompt engineering

Ce parcours t'a donné l'environnement. Le parcours suivant — **Prompt Engineering pro** — te donne la méthode : critères de succès, clarté, contexte, exemples, raisonnement, chaînage. C'est là que la règle d'or d'Anthropic prend tout son sens : *« montre ton prompt à un collègue sans contexte ; s'il est confus, Claude le sera aussi. »*

:::prompt Faire le bilan de ta configuration avec Claude
Je viens de terminer un parcours d'onboarding sur Claude. Voici où j'en suis :

- Applications installées : [web / bureau / mobile]
- Plan actuel : [Free / Pro / Max / Team]
- Instructions de profil : [écrites / pas encore]
- Projets créés : [nombre et sujets]
- Mémoire : [activée / désactivée], relue le [date ou « jamais »]

Analyse ma configuration et dis-moi, en priorité décroissante, les 3 choses qui me feraient gagner le plus de temps dans les 30 prochains jours. Pour chacune : ce qu'il faut faire, en combien de temps, et le gain attendu.

Sois franc si ma configuration est incomplète. Pas de flatterie, pas de récapitulatif de ce que je viens d'écrire.
:::

:::defi 1 h — Ta mesure de référence
Le seul chiffre qui compte pour la suite de la formation : ce que Claude te fait gagner sur une tâche réelle.
- Tu as choisi la tâche récurrente de ta semaine qui te coûte le plus de temps (rapport, veille, préparation de réunion…)
- Tu as noté le temps que cette tâche te prend **habituellement**
- Tu l'as traitée intégralement avec Claude : conversation dédiée, vrais documents joints, modèle et effort choisis, livrable en artefact, itérations
- Tu as vérifié les faits et les chiffres de la réponse avant de l'utiliser
- Tu as chronométré la version « avec Claude »
- Tu as écrit l'écart quelque part où tu le reverras : c'est ta référence pour tout le reste de la formation
- Bonus : au moins une consigne née de cette session est remontée dans tes instructions de profil
:::

:::memo
Q: Quel est le conseil n° 1 de la doc officielle pour parler à Claude ?
R: Lui parler comme à un collègue : des phrases naturelles et complètes, en français.
===
Q: Que faire quand tu corriges Claude deux fois sur la même chose ?
R: Remonter la consigne dans tes instructions de profil, pour ne plus jamais avoir à la répéter.
===
Q: Quel réglage remplace « activer la réflexion » depuis Opus 5 ?
R: Le niveau d'effort. Sur Opus 5, la réflexion est active par défaut et ne se désactive pas dans l'application.
===
Q: À quelle fréquence auditer sa mémoire et son usage ?
R: Une fois par mois : « View and edit memory » pour la mémoire, Settings > Usage pour les limites.
===
Q: Où trouver la documentation officielle à jour ?
R: Sur platform.claude.com/docs/en/ et support.claude.com — et toujours vérifier la date de ce qu'on lit ailleurs.
:::` + FOOTER,
    },
  ],
};
