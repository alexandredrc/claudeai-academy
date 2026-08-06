// =========================================
// Parcours « Claude pour data et SQL »
// Contenu original (non plagié), inspiré des bonnes pratiques publiques :
//   - Sémantique SQL standard (NULL en logique ternaire, NOT IN vs NOT EXISTS,
//     cadres de fenêtrage ROWS vs RANGE)
//   - Statistiques robustes (MAD, constante 1.4826, profilage)
// Fil rouge : Claude est un bras droit puissant, mais ses sorties (surtout le
// SQL) doivent TOUJOURS être vérifiées. Jamais de confiance aveugle.
//
// Mise à jour du 2026-08-06 : Opus 5 (contexte 1M, thinking par défaut, effort),
// grille de prix datée (Sonnet 5 : 2/10 $ jusqu'au 31/08/2026 puis 3/15 $),
// cache de prompt à 512 tokens, code execution, spec MCP 2026-07-28 (stateless),
// connecteurs (>950) + Anthropic Economic Index, confidentialité des données
// par plan. Blocs pédagogiques appliqués selon scripts/content/FORMAT.md.
// =========================================

const FOOTER = `

---

**Sources & méthode** · Bonnes pratiques SQL, statistiques robustes et data-viz : savoir établi, vérifié à la rédaction. Contenu original pour ClaudeAI Academy.

Faits Claude vérifiés le **6 août 2026** — [Opus 5, ce qui change](https://platform.claude.com/docs/en/about-claude/models/whats-new-opus-5) · [Modèles et tarifs](https://platform.claude.com/docs/en/about-claude/models/overview) · [Cache de prompt](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) · [Prompter Opus 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5) · [Notes de version](https://platform.claude.com/docs/en/release-notes/overview) · [Spécification MCP 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/changelog) · [Connecteur Anthropic Economic Index](https://www.anthropic.com/news/anthropic-economic-index-connector) · [Plans et tarifs](https://claude.com/pricing). Les prix, les limites et les versions bougent vite : redate-les avant de t'en servir dans une décision.`;

export const claudeDataSql = {
  slug: "claude-data-sql",
  title: "Claude pour data et SQL",
  description:
    "Faire de Claude ton bras droit data — générer, debugger et optimiser du SQL, profiler des données, brancher tes sources et bâtir des dashboards — en vérifiant systématiquement chaque sortie. À jour au 6 août 2026 (Opus 5, contexte 1M, connecteurs MCP, confidentialité des données).",
  tier_required: "mastery",
  display_order: 4,
  estimated_duration_min: 152,
  lessons: [
    {
      slug: "data-bras-droit-pas-remplacant",
      title: "Claude, bras droit data — pas remplaçant",
      description:
        "Cadrer l'usage de Claude sur la data, installer la règle d'or — ses sorties se vérifient toujours — et savoir quelles données tu as le droit de lui coller.",
      duration_min: 16,
      is_free_preview: true,
      content_md:
        `:::objectifs
- Nommer précisément ce que Claude fait très bien sur la data, et les trois familles d'erreurs qu'il commet
- Appliquer la règle d'or : aucun chiffre n'est utilisable avant vérification indépendante
- Décider ce que tu as le droit de coller dans une conversation, selon ton plan
- Tirer parti du contexte de 1M tokens d'Opus 5 sans lui accorder pour autant plus de confiance
:::

:::flash
Claude écrit du SQL plus vite que toi et décortique une requête héritée de 200 lignes en trente secondes. Mais il produit du texte *plausible*, pas du texte *vérifié* — et sur la data, un chiffre faux mais crédible est bien plus dangereux qu'une erreur évidente. Le cadre de ce parcours tient en une phrase : tu délègues la production, tu gardes la vérification. Et avant même de commencer, tu décides quelles données tu as le droit de lui montrer.
:::

## Le réflexe qui coûte cher

Tu colles ta question, Claude renvoie une requête SQL impeccable, un chiffre tombe : « 1 284 312 € de chiffre d'affaires sur le trimestre ». Tu le recopies dans le rapport du COMEX. Trois jours plus tard, quelqu'un remarque que la requête comptait deux fois les commandes remboursées. Le mal est fait.

Ce scénario est la raison d'être de ce parcours. Claude est un **bras droit data extraordinaire** : il écrit du SQL plus vite que toi, connaît les dialectes, repère des patterns d'analyse, rédige des synthèses claires. Mais il produit du texte *plausible*, pas du texte *vérifié*. Sur la data, plausible ne suffit jamais — un chiffre faux mais crédible est plus dangereux qu'une erreur évidente.

## La règle d'or, non négociable

> Toute sortie de Claude qui touche à un chiffre, une requête ou une décision se vérifie de façon indépendante avant d'être utilisée.

Ce n'est pas de la méfiance, c'est de la méthode. Les meilleurs analystes ne font confiance ni à leur propre SQL ni à celui d'un collègue sans contrôle. Claude ne mérite pas un traitement de faveur. Il mérite mieux : un cadre où ses forces brillent et où ses erreurs sont attrapées avant qu'elles ne fuient.

:::cle Vérifier, c'est ce qui te permet d'aller vite
Sans protocole de vérification, tu ralentis par prudence : tu relis tout, tu doutes de tout, tu n'oses rien publier. Avec un protocole, tu peux laisser Claude produire à pleine vitesse, parce que tu sais exactement à quel moment et par quel moyen l'erreur sera attrapée.
:::

## Ce que Claude fait remarquablement bien

- **Traduire une intention en SQL** : « le panier moyen par segment client, hors commandes annulées » devient une requête en secondes.
- **Jongler avec les dialectes** : PostgreSQL, BigQuery, Snowflake, MySQL n'ont pas la même syntaxe de dates ni les mêmes fonctions. Claude bascule de l'un à l'autre sans effort, *si tu lui dis lequel*.
- **Expliquer et commenter** : il décortique une requête héritée de 200 lignes et te dit ce qu'elle fait.
- **Profiler et explorer** : il propose des angles d'analyse, des contrôles de qualité, des visualisations.
- **Rédiger** : il transforme un tableau de chiffres en synthèse lisible par un décideur non technique.

## Ce sur quoi il se trompe — et pourquoi

Trois familles d'erreurs reviennent sans cesse :

1. **Les hypothèses silencieuses.** Sans le schéma, Claude *invente* des noms de colonnes plausibles (**order_date** alors que la vraie colonne est **created_at**), suppose qu'un montant est en euros alors qu'il est en centimes, ou ignore qu'une table contient des doublons logiques.
2. **La sémantique SQL piégeuse.** Les **NULL**, les jointures qui dupliquent les lignes, les agrégats sur des données dénormalisées : autant de zones où une requête *s'exécute sans erreur* tout en renvoyant un faux résultat. C'est le pire cas — pas de message d'alerte, juste un chiffre faux.
3. **L'aplomb.** Claude formule une réponse fausse avec la même assurance qu'une réponse juste. Il n'y a pas de signal de confiance fiable dans le ton. C'est à toi de créer ce signal, par la vérification.

:::piege Il ne te dira jamais « là, je ne suis pas sûr »
Tu attends un signal d'hésitation qui n'arrivera pas : une hallucination de nom de colonne sort avec exactement la même assurance qu'une requête juste. Ne cherche pas le doute dans son ton — provoque-le. Demande-lui la liste de ses hypothèses, et un chemin de calcul alternatif. C'est toi qui fabriques le signal de confiance.
:::

## Le contexte de 1M tokens change ce que tu peux coller

Depuis Opus 5, tu n'as plus d'excuse pour briefer à moitié : le schéma complet, la doc métier, un extrait de données et la requête historique tiennent dans la même conversation. La plupart des erreurs de la leçon 2 viennent d'un contexte tronqué — ce plafond-là vient de sauter.

:::maj 24 juillet 2026
**Claude Opus 5** (**claude-opus-5**) devient le modèle Opus courant. Contexte **1M tokens** (c'est le défaut *et* le maximum), **128k tokens de sortie**, **réflexion étendue activée par défaut**, **5 $ / 25 $ par million de tokens** — le même prix qu'Opus 4.8. Dans l'application, c'est le modèle par défaut sur Max et le plus puissant accessible sur Pro.
:::

:::chiffres
1M | tokens de contexte sur Opus 5, défaut et maximum
128k | tokens de sortie maximum
5 $ / 25 $ | par million de tokens, entrée / sortie (6 août 2026)
:::

## Analyste junior brillant, pas oracle

Traite Claude comme un analyste junior surdoué et infatigable, à qui tu confierais du travail — mais dont tu **relis systématiquement le livrable**, parce qu'il ne connaît pas tes données aussi bien que toi et qu'il ne te dira jamais spontanément « là, je ne suis pas sûr ».

Concrètement, ça change ta façon de prompter :

:::avant-apres Prompt qui invite à l'hallucination | Prompt qui la rend impossible
Donne-moi le CA du trimestre.
===
Voici le schéma de la table orders, collé ci-dessous. Le CA = somme de amount_cents / 100, uniquement pour status = 'paid', sur les commandes dont created_at tombe dans Q2 2026 (fuseau Europe/Paris). Attention aux remboursements : ils sont dans une table refunds séparée. Donne-moi la requête PostgreSQL, liste tes hypothèses, et propose une requête de contrôle indépendante pour valider le total.
:::

La différence de qualité est radicale — et la dernière phrase (« propose une requête de contrôle ») installe la vérification dès le premier prompt.

:::prompt Ouvrir une session data proprement
Tu es analyste data senior. Nous allons travailler ensemble sur une base réelle.

Règles de travail, valables pour toute la conversation :
1. Tu ne devines jamais un nom de colonne, un type ou une unité : si l'information manque, tu la demandes.
2. Après chaque requête, tu listes explicitement les hypothèses que tu as faites (colonnes, unités, fuseau, filtres, cardinalités).
3. Tu proposes systématiquement une requête de contrôle indépendante qui valide le résultat par un autre chemin.
4. Tu restes concis : la requête, les hypothèses, le contrôle. Pas de préambule.

Confirme que tu as compris en une phrase, puis attends mon schéma.
:::

## Ce que tu as le droit de coller

Sur la data, la question n'est pas seulement « est-ce juste ? » mais « ai-je le droit de montrer ça ? ». Au **6 août 2026**, le régime dépend de ton plan :

| Plan | Tes conversations peuvent-elles entraîner les modèles ? | Rétention |
| --- | --- | --- |
| Free, Pro, Max | Oui, **si le réglage correspondant est activé** dans tes paramètres | 5 ans |
| Team, Enterprise | **Non** | 30 jours |

Trois conséquences concrètes :

- Si tu manipules des données clients réelles, **un compte Pro ne suffit pas juridiquement**. Il te faut Team ou Enterprise — ou une pseudonymisation sérieuse avant de coller quoi que ce soit.
- **Anthropic n'héberge pas l'inférence dans l'Union européenne en direct** : côté API, le paramètre **inference_geo** n'accepte que **us** ou **global**. Si ton cadre de conformité impose l'UE, ce point se traite en amont, pas dans le prompt.
- Une bonne pratique universelle, quel que soit le plan : colle des **schémas** et des **échantillons anonymisés**, pas des exports bruts. Claude a besoin de la structure, pas des noms de tes clients.

:::piege Désactiver l'entraînement ne couvre pas tout
Couper le réglage d'entraînement dans tes paramètres est nécessaire, mais ça ne rend pas la conversation invisible : les échanges **signalés en revue de sécurité** peuvent être conservés **jusqu'à deux ans**, indépendamment de ce réglage. La seule protection qui ne dépend de personne, c'est de ne pas coller la donnée sensible : pseudonymise les identifiants, tronque les e-mails, remplace les noms par des codes.
:::

## Le contrat de ce parcours

Sur les six leçons, tu vas apprendre à générer du SQL fiable à partir d'un schéma, debugger et optimiser une requête, mener une analyse exploratoire robuste, brancher Claude sur tes sources — et, c'est le cœur en leçon 5, **vérifier le travail de l'IA** par des requêtes de contrôle et du recompute indépendant. On termine par la synthèse exécutive : transformer des chiffres vérifiés en décisions.

À aucun moment tu ne délègues ton jugement. Tu délègues la production, tu gardes le contrôle. C'est exactement ce qui sépare un analyste qui *utilise* l'IA d'un analyste qui se fait *piéger* par elle.

:::defi 20 min — Ton cadre data personnel
Écris noir sur blanc les règles dans lesquelles tu vas utiliser Claude sur tes données. Ce document d'une page te servira pendant tout le parcours.
- Tu as identifié ton plan (Free, Pro, Max, Team ou Enterprise) et vérifié l'état du réglage d'entraînement dans tes paramètres
- Tu as listé trois types de données que tu t'interdis de coller en clair (noms de clients, e-mails, identifiants de compte…)
- Tu as écrit ta règle de pseudonymisation : ce que tu remplaces, et par quoi
- Tu as choisi une question data réelle de ton travail, qui te servira de fil rouge sur les six leçons
- Tu sais dire en une phrase par quel **autre chemin** tu vérifierais la réponse à cette question
:::

:::memo
Q: Pourquoi un chiffre faux mais crédible est-il plus dangereux qu'une erreur évidente ?
R: Parce que personne ne le questionne. Il traverse les relectures et finit dans une décision.
===
Q: Combien de temps les conversations sont-elles conservées sur un plan Free, Pro ou Max ?
R: Cinq ans. Sur Team et Enterprise, trente jours, et sans entraînement des modèles.
===
Q: Désactiver l'entraînement suffit-il à couvrir toutes tes conversations ?
R: Non. Celles signalées en revue de sécurité peuvent être conservées jusqu'à deux ans.
===
Q: Qu'est-ce que le contexte de 1M tokens d'Opus 5 change concrètement sur la data ?
R: Tu peux coller le schéma entier, la doc métier et un extrait dans la même conversation. Ça ne rend pas la réponse vérifiée pour autant.
===
Q: Quel modèle mental adopter face à Claude sur la data ?
R: Un analyste junior surdoué et infatigable, dont on relit systématiquement le livrable.
:::` + FOOTER,
    },
    {
      slug: "data-generer-sql-fiable",
      title: "Générer du SQL fiable : du schéma à la requête",
      description:
        "Donner à Claude le contexte qui élimine les hypothèses inventées : schéma, dialecte, contraintes métier, pièges classiques — et le coût réel quand tu passes par l'API.",
      duration_min: 28,
      is_free_preview: false,
      content_md:
        `:::objectifs
- Briefer Claude avec les quatre piliers : schéma réel, dialecte, contraintes métier, sortie attendue
- Désamorcer les trois pièges qui ne lèvent aucune erreur : fuseaux horaires, jointures qui dupliquent, NULL
- Exiger systématiquement la liste des hypothèses et une requête de contrôle
- Choisir ton modèle et maîtriser le coût quand tu génères du SQL par l'API
:::

:::flash
Un SQL faux est presque toujours un SQL mal briefé : Claude a comblé un trou avec une hypothèse plausible. Colle le DDL, nomme le moteur, écris les règles métier qui ne sont dans aucun schéma, décris la sortie attendue — puis termine toujours par « liste tes hypothèses et propose une requête de contrôle ». Avec 1M tokens de contexte, donner un schéma tronqué n'est plus une contrainte, c'est un choix.
:::

## Le SQL faux est presque toujours un SQL mal briefé

Quand Claude produit une requête fausse, la cause est rarement une faille de raisonnement. C'est presque toujours un **manque de contexte** : il a comblé un trou avec une hypothèse plausible mais fausse. La discipline de cette leçon : ne laisse aucun trou.

## Les quatre piliers d'un bon prompt SQL

**1. Le schéma réel.** C'est l'élément qui change tout. Colle les définitions de tables — idéalement le DDL :

    CREATE TABLE orders (
      id            bigint PRIMARY KEY,
      customer_id   bigint NOT NULL,
      created_at    timestamptz NOT NULL,
      status        text NOT NULL,   -- 'paid' | 'pending' | 'cancelled'
      amount_cents  integer NOT NULL -- montant en CENTIMES, pas en euros
    );

Les commentaires comptent autant que les colonnes. **amount_cents en centimes** est exactement le genre d'information que Claude ne peut pas deviner et qui produit un résultat faux d'un facteur 100. Si tu n'as pas le DDL, donne au moins : noms de colonnes exacts, types, et la sémantique des colonnes ambiguës (qu'est-ce qu'un **status = 'pending'** ? une commande **cancelled** compte-t-elle dans le CA ?).

Les trois autres piliers tiennent en trois lignes :

2. **Le dialecte.** PostgreSQL, BigQuery, Snowflake, MySQL et SQL Server divergent sur les dates, le découpage de chaînes, les fonctions de fenêtrage et la syntaxe de **LIMIT**. Une requête PostgreSQL parfaite échoue en BigQuery. Annonce le moteur, et la version si elle compte.
3. **Les contraintes métier.** Ce sont les règles qui ne sont écrites nulle part dans le schéma : « le CA exclut les commandes de test (customer_id < 1000) », « le fuseau de référence est Europe/Paris », « un client peut avoir plusieurs lignes dans customers après une fusion de comptes ». Sans elles, la requête sera techniquement correcte et métier-fausse.
4. **La sortie attendue.** Décris la forme du résultat : « une ligne par mois, colonnes mois / CA / nb_commandes, triées par mois ». Tu évites les allers-retours et tu te donnes un critère pour juger la sortie.

:::prompt Gabarit universel — générer une requête SQL fiable
Contexte technique
- Moteur : PostgreSQL 16 (remplace par le tien)
- Schéma des tables concernées, DDL complet ci-dessous :
[colle ici le CREATE TABLE de chaque table, commentaires compris]

Contraintes métier qui ne sont pas dans le schéma
- Les montants sont en centimes.
- Le CA ne compte que status = 'paid'.
- Les remboursements sont dans une table refunds séparée et se déduisent du CA.
- Les commandes de test ont customer_id < 1000 et sont exclues.
- Fuseau de référence pour découper les périodes : Europe/Paris.

Relations à surveiller
- orders et order_items sont en un-vers-plusieurs : ne duplique aucun montant.
- Colonnes pouvant être NULL : [liste-les, avec ce que NULL signifie pour chacune]

Ce que je veux
[décris la question métier, puis la forme exacte du résultat : colonnes, granularité, tri]

Livre dans cet ordre
1. La requête.
2. La liste explicite de toutes les hypothèses que tu as faites (colonnes, unités, fuseau, filtres, cardinalités).
3. Une requête de contrôle indépendante qui valide le résultat par un autre chemin.
Pas de préambule.
:::

## Le piège des dates et des fuseaux

C'est la source d'erreur numéro un en pratique. Une commande passée le 1er juillet à 01h00 heure de Paris est, en UTC, le 30 juin à 23h00. Si ton filtre trimestriel travaille en UTC sans conversion, cette commande tombe dans le mauvais trimestre.

Précise toujours deux choses : la colonne est-elle en **timestamptz** (avec fuseau) ou en **timestamp** naïf ? Et quel fuseau sert à découper les périodes ? Demande explicitement la conversion, par exemple en PostgreSQL **created_at AT TIME ZONE 'Europe/Paris'**.

:::piege Le décalage d'un jour qu'on ne voit jamais
Un rapport mensuel décalé d'une heure ne se remarque pas : les totaux restent plausibles, seuls quelques enregistrements changent de bucket. Symptôme à connaître — la somme des douze mois ne retombe pas exactement sur le total annuel. Si tu vois cet écart, cherche le fuseau avant de chercher ailleurs.
:::

## Le piège qui ne lève aucune erreur : la jointure qui duplique

Tu joins **orders** à une table **order_items** pour récupérer une catégorie, puis tu sommes **amount_cents**. Problème : une commande de 3 lignes apparaît désormais 3 fois, et ton total est gonflé. La requête s'exécute parfaitement. Le chiffre est faux.

Règle : dès qu'une jointure passe sur une relation **un-vers-plusieurs**, demande-toi ce que devient ton agrégat. Souvent la bonne réponse est d'agréger *avant* de joindre, ou de joindre sur une clé garantie unique. Mets Claude en garde dans le prompt : « attention, orders et order_items sont en un-vers-plusieurs, ne duplique pas les montants ».

:::avant-apres Somme après jointure (gonflée) | Agrégation avant jointure (juste)
On joint, puis on somme — chaque commande est comptée autant de fois qu'elle a de lignes :

    SELECT c.nom, SUM(o.amount_cents) / 100.0 AS ca
    FROM orders o
    JOIN order_items i ON i.order_id = o.id
    JOIN categories c  ON c.id = i.category_id
    GROUP BY c.nom;
===
On ramène d'abord une ligne par commande, puis on joint — un montant compté une seule fois :

    WITH par_commande AS (
      SELECT o.id, o.amount_cents,
             MIN(i.category_id) AS category_id   -- ou la regle metier de rattachement
      FROM orders o
      JOIN order_items i ON i.order_id = o.id
      GROUP BY o.id, o.amount_cents
    )
    SELECT c.nom, SUM(p.amount_cents) / 100.0 AS ca
    FROM par_commande p
    JOIN categories c ON c.id = p.category_id
    GROUP BY c.nom;
:::

## Le piège des NULL

En SQL, **NULL** n'est pas une valeur, c'est « inconnu », et il se propage en logique ternaire (vrai / faux / inconnu). **amount = NULL** n'est jamais vrai — il faut **amount IS NULL**. Un **COUNT(colonne)** ignore les NULL alors que **COUNT(\\*)** les compte. Une condition **WHERE remboursement <> 'oui'** exclut silencieusement les lignes où **remboursement** est NULL.

Liste à Claude les colonnes qui peuvent être NULL et ce que NULL signifie pour chacune : « pas encore renseigné » et « non applicable » n'appellent pas le même traitement.

:::astuce Coller le schéma, ou brancher la source ?
Le copier-coller reste la méthode la plus sûre et la plus portable : tu contrôles exactement ce qui sort de ton système. L'alternative — brancher Claude directement sur une base ou un entrepôt via un connecteur — est traitée en leçon 4, avec ce que la nouvelle spécification MCP du 28 juillet 2026 a changé. Commence par maîtriser le brief manuel : un connecteur mal cadré ne fait qu'automatiser une erreur de contexte.
:::

## Toujours exiger les hypothèses et un contrôle

Termine chaque prompt SQL par deux demandes :

    1. Liste explicitement toutes les hypothèses que tu as faites (colonnes, types,
       sémantique, fuseau, filtres).
    2. Propose une requête de contrôle indépendante qui valide le résultat
       par un autre chemin (ex. un COUNT et une SUM séparés, ou un recompte
       sur un sous-ensemble connu).

La liste d'hypothèses est ta checklist de relecture : tu valides chaque point contre ta connaissance des données. La requête de contrôle prépare la leçon 5.

## Ce que ça coûte quand tu passes par l'API

Si tu génères du SQL depuis un script, un notebook ou un agent, le choix du modèle se chiffre. Tarifs par million de tokens relevés au **6 août 2026** :

| Modèle | Entrée | Sortie | Bon pour |
| --- | --- | --- | --- |
| Haiku 4.5 | 1 $ | 5 $ | contrôles répétitifs, reformatage, classification |
| Sonnet 5 | **2 $ jusqu'au 31/08/2026, puis 3 $** | **10 $ jusqu'au 31/08/2026, puis 15 $** | l'essentiel de la génération SQL |
| Opus 5 | 5 $ | 25 $ | schémas énormes, requêtes analytiques tordues |

Deux leviers de coût qui comptent beaucoup sur des traitements data répétitifs :

- Le **traitement par lots** (batch) coûte **50 % moins cher** : idéal pour requalifier 10 000 lignes ou générer 200 contrôles en une passe, quand la réponse n'est pas attendue dans la seconde.
- Le **cache de prompt** : lire un préfixe déjà mis en cache coûte **un dixième** du prix d'entrée. Comme ton schéma est identique d'une requête à l'autre, mets-le en tête de prompt et laisse-le en cache. L'écriture en cache coûte ×1,25 pour une durée de vie de 5 minutes, ×2 pour une heure.
- Le paramètre **inference_geo: "us"** applique un supplément de 10 % sur le tarif.

:::maj 24 juillet 2026
Sur Opus 5, le **minimum cacheable descend à 512 tokens** (contre 1 024 sur Opus 4.8). Concrètement, même un petit schéma de deux ou trois tables devient cacheable : sur une boucle qui envoie cent requêtes avec le même DDL en tête, la facture d'entrée est divisée par dix sur la partie cachée.
:::

## Mini-méthode en cinq étapes

:::etapes
1. **Briefer** : schéma + dialecte + contraintes métier + sortie attendue. Aucun trou.
2. **Générer** : laisser Claude produire la requête *et* ses hypothèses.
3. **Relire les hypothèses** une par une, corriger ce qui est faux, regénérer.
4. **Exécuter sur un échantillon** : ajoute un **LIMIT**, ou filtre sur un client dont tu connais le résultat à la main.
5. **Valider l'ordre de grandeur** : le total tombe-t-il dans une fourchette plausible ? Un CA trimestriel à 12 € ou à 40 millions sur une PME doit déclencher une alarme immédiate.
:::

Un SQL bien briefé est juste 9 fois sur 10. Ces cinq étapes attrapent la 10e — et c'est elle qui aurait fini dans le rapport du COMEX.

:::defi 30 min — Ton gabarit de brief SQL
Prends une table réelle de ton travail et fabrique le brief qui rend Claude fiable dessus. Garde-le : tu le réutiliseras à chaque question.
- Tu as collé le DDL complet, ou à défaut les noms exacts, les types et la sémantique des colonnes ambiguës
- Tu as nommé le moteur et sa version
- Tu as écrit au moins trois contraintes métier qui ne figurent nulle part dans le schéma
- Tu as listé les colonnes qui peuvent être NULL et ce que NULL veut dire pour chacune
- Tu as décrit la forme exacte de la sortie attendue (colonnes, granularité, tri)
- Claude a listé ses hypothèses et tu en as corrigé au moins une
- Tu as exécuté la requête sur un périmètre restreint dont tu connais déjà la réponse
:::

:::memo
Q: Quels sont les quatre piliers d'un prompt SQL ?
R: Le schéma réel, le dialecte, les contraintes métier et la sortie attendue.
===
Q: Pourquoi une jointure un-vers-plusieurs fausse-t-elle un SUM ?
R: Elle duplique les lignes avant l'agrégat. Le total gonfle sans qu'aucune erreur ne soit levée.
===
Q: Que fait WHERE remboursement <> 'oui' sur une ligne où la colonne est NULL ?
R: Elle l'exclut silencieusement : la comparaison vaut « inconnu », donc pas vrai.
===
Q: Combien coûte Sonnet 5 par million de tokens ?
R: 2 $ en entrée et 10 $ en sortie jusqu'au 31 août 2026, puis 3 $ et 15 $.
===
Q: À partir de quelle taille un préfixe de prompt est-il cacheable sur Opus 5 ?
R: 512 tokens depuis le 24 juillet 2026. La lecture depuis le cache coûte un dixième du prix d'entrée.
:::` + FOOTER,
    },
    {
      slug: "data-debugger-optimiser",
      title: "Debugger et optimiser une requête avec Claude",
      description:
        "Lire un plan d'exécution, poser les bons index, et désamorcer les pièges de jointure, de NULL et de fenêtrage — sans jamais optimiser à l'aveugle.",
      duration_min: 28,
      is_free_preview: false,
      content_md:
        `:::objectifs
- Séparer les deux diagnostics : une requête fausse et une requête lente ne se traitent pas pareil
- Repérer les trois suspects habituels du faux : jointure qui duplique, NULL dans un NOT IN, cadre de fenêtrage par défaut
- Faire interpréter un plan d'exécution par Claude et décider quel index poser
- Prouver qu'une optimisation n'a rien changé au résultat
:::

:::flash
Faux et lent sont deux problèmes distincts : le faux se traite en sémantique, le lent en lisant un plan d'exécution. Pour le faux, demande d'abord une explication ligne par ligne — l'erreur saute souvent aux yeux avant même la correction. Pour le lent : **EXPLAIN (ANALYZE, BUFFERS)**, jamais l'intuition. Et une requête optimisée se prouve identique par deux **EXCEPT** croisés qui renvoient zéro ligne.
:::

## Deux problèmes différents : faux, et lent

Une requête peut être **fausse** (mauvais résultat) ou **lente** (bon résultat, temps inacceptable). Claude aide sur les deux, mais ce sont des diagnostics distincts. Pour le faux, on raisonne sémantique. Pour le lent, on lit un plan d'exécution. Ne mélange pas les deux : la moitié des « optimisations » ratées viennent de gens qui accélèrent une requête déjà fausse.

## Debugger le faux : faire expliquer la requête ligne par ligne

Quand un chiffre semble suspect, ne demande pas « corrige ça ». Demande d'abord une lecture. L'explication révèle souvent l'erreur sans même la corriger — et surtout, elle te laisse le jugement sur ce qui est réellement anormal.

:::prompt Faire auditer une requête suspecte
Voici une requête et le schéma des tables qu'elle utilise.

[requête]

[DDL des tables concernées]

Fais-en la lecture, dans cet ordre :
1. Explique étape par étape ce que produit chaque CTE, chaque jointure, chaque filtre, chaque agrégat.
2. Indique à quelle ligne précise le résultat pourrait être dupliqué, tronqué ou décalé, et pourquoi.
3. Signale toute hypothèse implicite sur les unités, les fuseaux, les valeurs NULL ou la cardinalité des jointures.
4. Liste tout ce qui te paraît discutable, du plus grave au plus anodin, sans filtrer toi-même.

Ne corrige rien pour l'instant. Je veux d'abord comprendre.
:::

Le point 4 mérite une explication : si tu écris « ne me signale que les problèmes graves », le modèle obéit littéralement et remonte moins de choses. Demande tout, et fais le tri toi-même en seconde passe.

## Suspect n°1 — la jointure qui duplique

Vu en leçon 2 : un **JOIN** sur du un-vers-plusieurs multiplie les lignes avant l'agrégat. Symptôme typique, un **SUM** ou un **COUNT** trop élevé.

:::astuce Le contrôle en dix secondes
Compare **COUNT(\\*)** avant et après la jointure. S'il augmente, tu dupliques — inutile de chercher plus loin. Fais-en un réflexe systématique avant tout agrégat sur une requête jointe.
:::

## Suspect n°2 — NULL, NOT IN et le zéro ligne inexplicable

Le piège le plus vicieux du SQL. **WHERE id NOT IN (SELECT customer_id FROM ...)** renvoie **zéro ligne** dès qu'un seul **customer_id** de la sous-requête est NULL. La raison : **x NOT IN (..., NULL)** s'évalue à *inconnu*, jamais à *vrai*, donc le **WHERE** rejette tout.

La parade : utilise **NOT EXISTS**, insensible aux NULL parce qu'il teste la présence de lignes et non l'égalité de valeurs. Ou ajoute **WHERE customer_id IS NOT NULL** dans la sous-requête.

:::piege Quand Claude te propose un NOT IN
Ce n'est pas une faute de sa part — **NOT IN** est la formulation la plus naturelle en français comme en SQL. Mais c'est un déclencheur : demande systématiquement la version **NOT EXISTS**, et vérifie sur tes données si la colonne de la sous-requête peut être NULL. Un « zéro ligne » silencieux passe pour un résultat métier légitime.
:::

## Suspect n°3 — le cadre de fenêtrage par défaut

Les fonctions de fenêtre cachent un piège peu connu. Dès que tu mets un **ORDER BY** dans le **OVER(...)** sans préciser le cadre, le défaut SQL est **RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW**, pas **ROWS**. Avec **RANGE**, toutes les lignes ayant la même valeur d'**ORDER BY** (par exemple la même date) sont traitées comme des pairs et reçoivent le **même** cumul. Ton « total courant » se fige sur les doublons de date au lieu d'avancer ligne par ligne.

:::avant-apres Cadre implicite (RANGE) | Cadre explicite (ROWS)
Toutes les lignes du même jour reçoivent le même cumul : le total courant fait des paliers.

    SUM(montant) OVER (ORDER BY jour)
===
Le cumul avance ligne par ligne, comme attendu — et c'est aussi plus rapide.

    SUM(montant) OVER (
      ORDER BY jour
      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    )
:::

## Optimiser le lent : lire le plan d'exécution

La règle d'or de l'optimisation : **on ne devine pas, on mesure**. La mesure, c'est le plan d'exécution. En PostgreSQL :

    EXPLAIN (ANALYZE, BUFFERS) <ta requête>;

**ANALYZE** exécute réellement la requête et donne les temps mesurés ; sans lui, tu n'as que des estimations. Colle le plan complet à Claude — avec un contexte de 1M tokens, tu peux y joindre le DDL, les index existants et la requête sans rien tronquer. Les signaux à traquer :

- **Seq Scan** sur une grosse table avec un filtre sélectif → un index manque probablement.
- **Écart estimé / réel** énorme sur le nombre de lignes (le planificateur attendait 10 lignes, en a eu 2 millions) → statistiques périmées, pense à lancer **ANALYZE** sur la table.
- **Nested Loop** sur de gros volumes des deux côtés → un **Hash Join** serait souvent plus adapté.
- **Sort** ou **Hash** qui déborde sur disque → mémoire de travail insuffisante, ou volume à réduire en amont.

:::prompt Faire interpréter un plan d'exécution
Voici le plan d'exécution d'une requête lente, son DDL et la liste des index déjà en place.

[sortie complète de EXPLAIN (ANALYZE, BUFFERS)]

[DDL + index existants]

Volumétrie : [nb de lignes par table] · Fréquence d'écriture : [ex. 2 000 INSERT/minute sur orders]

Analyse dans cet ordre :
1. Les trois opérations qui consomment le plus de temps réel, chiffres à l'appui.
2. Pour chacune, la cause probable (index manquant, statistiques périmées, mauvais type de jointure, débordement mémoire).
3. Les corrections possibles, classées par rapport gain / risque, une seule modification par proposition.
4. Pour chaque index proposé : ce qu'il coûte en écriture et en espace.

Ne propose pas de réécrire la requête entière. Je veux des changements testables un par un.
:::

:::maj 24 juillet 2026
Opus 5 a la **réflexion étendue activée par défaut** : sur un plan d'exécution touffu, c'est exactement ce qu'il faut. Le levier de réglage n'est plus « activer la réflexion » mais le **niveau d'effort** (**low**, **medium**, **high** — le défaut —, **xhigh**, **max**). Sur une lecture de plan, **medium** suffit souvent et coûte nettement moins cher : fais le test sur tes propres cas avant de tout passer en **max**.
:::

## Les index : utiles, mais pas magiques

Un index accélère la lecture mais ralentit les écritures et occupe de l'espace. Principes que Claude doit respecter — et que tu vérifies :

- Indexe les colonnes de **filtre** (**WHERE**) et de **jointure** très sélectives.
- Un **index composite (a, b)** sert les requêtes filtrant sur **a** seul ou sur **a** *et* **b**, mais **pas** sur **b** seul : l'ordre des colonnes compte.
- Une fonction sur la colonne tue l'index : **WHERE date(created_at) = '2026-06-01'** ignore l'index sur **created_at**. Réécris en intervalle : **created_at >= '2026-06-01' AND created_at < '2026-06-02'**.
- Claude *suggère* des index, il ne sait pas si tu écris 10 000 fois par seconde dans cette table. La décision finale te revient.

## Vérifier que l'optimisation n'a rien cassé

Une requête optimisée doit renvoyer **exactement le même résultat** que l'originale. Ne le suppose jamais. Le test imparable :

    SELECT * FROM (ancienne requête) EXCEPT SELECT * FROM (nouvelle requête);
    -- puis l'inverse

Les deux **EXCEPT** doivent renvoyer zéro ligne. C'est la preuve que l'optimisation a préservé la sémantique — exactement l'esprit de vérification indépendante qu'on systématise à la leçon suivante.

:::defi 35 min — Autopsie d'une requête lente
Prends la requête la plus lente que tu subis au quotidien et traite-la de bout en bout.
- Tu as capturé la sortie complète de **EXPLAIN (ANALYZE, BUFFERS)**, pas seulement **EXPLAIN**
- Claude a nommé les trois opérations les plus coûteuses, chiffres à l'appui
- Tu as identifié au moins un **Seq Scan** évitable ou un écart estimé/réel supérieur à 10×
- Tu n'as testé qu'**une seule** modification à la fois, en mesurant après chacune
- Les deux **EXCEPT** croisés renvoient zéro ligne
- Tu as noté le gain en millisecondes et ce que le nouvel index coûte en écriture
:::

:::memo
Q: Une requête renvoie zéro ligne avec un NOT IN. Quelle est la première hypothèse ?
R: Un NULL dans la sous-requête. La condition vaut « inconnu » pour toutes les lignes. Passe en NOT EXISTS.
===
Q: Quel est le cadre de fenêtrage par défaut quand on écrit OVER (ORDER BY jour) ?
R: RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW. Les lignes de même date reçoivent le même cumul.
===
Q: À quoi sert le mot-clé ANALYZE dans EXPLAIN (ANALYZE, BUFFERS) ?
R: Il exécute réellement la requête et donne les temps mesurés. Sans lui, tu n'as que des estimations.
===
Q: Un index composite (a, b) sert quelles requêtes ?
R: Celles qui filtrent sur a seul, ou sur a et b. Pas sur b seul.
===
Q: Comment prouver qu'une optimisation n'a pas changé le résultat ?
R: Deux EXCEPT croisés entre l'ancienne et la nouvelle requête. Les deux doivent renvoyer zéro ligne.
:::` + FOOTER,
    },
    {
      slug: "data-exploration-anomalies",
      title: "Analyse exploratoire et détection d'anomalies",
      description:
        "Profiler une table, choisir des statistiques robustes, repérer les outliers avec la MAD — et brancher Claude sur une vraie source de données.",
      duration_min: 28,
      is_free_preview: false,
      content_md:
        `:::objectifs
- Profiler une table colonne par colonne avant d'en tirer la moindre conclusion
- Choisir des statistiques robustes : médiane et MAD plutôt que moyenne et écart-type
- Calculer un z-score robuste et reconnaître ses deux cas dégénérés
- Brancher Claude sur une source de données via un connecteur, en sachant ce que la spécification MCP du 28 juillet 2026 a changé
:::

:::flash
On ne conclut rien d'une table qu'on n'a pas profilée. Une moyenne éloignée de la médiane est un signal : bascule sur la médiane et la **MAD**, qui ne se laissent pas contaminer par les valeurs extrêmes qu'elles cherchent à détecter. Et pour explorer, tu n'es plus obligé de tout copier-coller : au 6 août 2026, l'annuaire des connecteurs compte **plus de 950 serveurs MCP**.
:::

## Avant d'analyser : profiler

On ne tire aucune conclusion d'une table qu'on n'a pas profilée. Le profilage, c'est l'examen systématique de chaque colonne : volume, valeurs manquantes, distribution, valeurs distinctes, bornes. Claude excelle à générer ces requêtes — à condition que tu saches lesquelles demander et lire le résultat de façon critique.

Pour une colonne numérique, une seule requête suffit à tout voir :

    SELECT
      COUNT(*)                      AS n_lignes,
      COUNT(montant)                AS n_non_null,
      COUNT(*) - COUNT(montant)     AS n_null,
      MIN(montant), MAX(montant),
      AVG(montant)                  AS moyenne,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY montant) AS mediane
    FROM ventes;

Ce que tu lis là-dedans :

- **n_null** élevé → un filtre ou une jointure risque de se comporter bizarrement (revois la leçon 3).
- **MIN négatif** sur un montant censé être positif → données sales, ou avoirs mal taggés.
- **Moyenne très éloignée de la médiane** → distribution asymétrique ou présence d'outliers. C'est le signal qui déclenche toute la suite de la leçon.
- **MAX** absurde (un panier à 9 999 999 €) → valeur sentinelle, bug de saisie, ou test resté en production.

Pour une colonne catégorielle, un **GROUP BY ... ORDER BY count DESC** révèle les valeurs inattendues : un **status** censé avoir 3 valeurs en a 7, dont **'Paid'** et **'paid'** — une casse incohérente qui faussera tous tes filtres.

:::prompt Générer une batterie de profilage
Voici le DDL de ma table et le moteur SQL utilisé.

[DDL] · Moteur : [PostgreSQL 16 / BigQuery / Snowflake…]

Génère une batterie de profilage exécutable, organisée ainsi :
1. Une requête de volumétrie globale (nb de lignes, période couverte, fraîcheur de la donnée).
2. Pour chaque colonne numérique : n, nb de NULL, min, max, moyenne, médiane, 1er et 9e décile.
3. Pour chaque colonne catégorielle : les valeurs distinctes avec leur effectif, triées par effectif décroissant.
4. Pour chaque colonne de date : min, max, nb de dates futures, nb de dates avant la création de l'entreprise.
5. Dix contrôles de qualité : doublons sur les clés, orphelins de jointure, incohérences de casse, bornes aberrantes, cardinalités inattendues.

Pour chaque requête, écris en une ligne ce qu'un résultat anormal signifierait. Ne commente pas au-delà.
:::

## Moyenne contre médiane : pourquoi la robustesse compte

La **moyenne** et l'**écart-type** sont *non robustes* : une seule valeur extrême les déplace fortement. Sur des données réelles — montants, durées, temps de réponse — il y a presque toujours des extrêmes. Une commande à 2 millions d'euros au milieu de paniers à 40 € tire la moyenne vers le haut et explose l'écart-type, rendant ces deux statistiques trompeuses.

Les statistiques **robustes** résistent à ces extrêmes : la **médiane** au lieu de la moyenne, la **MAD** au lieu de l'écart-type. C'est ce qu'il faut utiliser pour décrire des distributions réelles et pour détecter des anomalies.

:::cle Le chiffre que tu montres n'est pas neutre
Choisir la moyenne plutôt que la médiane, c'est déjà une décision éditoriale. Sur un panier, la moyenne raconte le chiffre d'affaires par commande, la médiane raconte l'expérience du client typique. Les deux sont justes, elles ne répondent pas à la même question — dis toujours laquelle tu montres, et pourquoi.
:::

## La MAD, et ses deux cas dégénérés

La **MAD** (Median Absolute Deviation, écart absolu médian) se calcule en trois temps :

:::etapes
1. Calculer la **médiane** des valeurs.
2. Pour chaque valeur, calculer son écart absolu à cette médiane : **abs(x - médiane)**.
3. Prendre la **médiane de ces écarts absolus** : c'est la MAD.
:::

On en tire un **z-score robuste** pour chaque point :

    z_robuste = 0.6745 * (x - médiane) / MAD

Le **0.6745** rend la MAD comparable à un écart-type sous une loi normale (c'est l'inverse de la constante 1.4826 : 1 / 1.4826 ≈ 0.6745). On déclare un point **outlier** si son z-robuste dépasse un seuil — typiquement **3**, les seuils usuels étant 2, 2,5 ou 3 selon la sévérité voulue. L'intérêt décisif : contrairement au z-score classique basé sur moyenne et écart-type, la MAD n'est pas elle-même contaminée par les outliers qu'elle cherche à détecter. On ne se mord pas la queue.

En SQL, fais calculer médiane et MAD via **PERCENTILE_CONT(0.5)**, puis le z-robuste par ligne. Vérifie un cas à la main : un point que tu *sais* aberrant doit ressortir.

:::piege Deux divisions par zéro statistiques
**MAD = 0** : si plus de la moitié des valeurs sont identiques, la MAD vaut zéro et le z-robuste explose. C'est fréquent sur des colonnes peu variées. Parade : se rabattre sur l'écart interquartile, ou traiter ce cas à part.

**Petit échantillon** : la détection d'anomalies sur 12 lignes n'a aucun sens statistique. Vérifie toujours le **n** avant de conclure — Claude, lui, calculera sans broncher.
:::

## Corrélation n'est pas explication

Claude trouvera des corrélations à la pelle. Deux garde-fous permanents :

- Une corrélation peut être **fortuite** (faux positif) ou portée par un **facteur tiers** non observé. Ne la présente jamais comme une cause.
- Les **agrégats cachent les sous-populations** (paradoxe de Simpson) : une tendance globale peut s'inverser dans chaque segment. Avant de conclure « le CA baisse », découpe par segment — il se peut que chaque segment monte et que seul le mix change.

## Brancher Claude sur tes données : connecteurs et MCP

Un **connecteur**, c'est un serveur **MCP** (Model Context Protocol) que Claude interroge pour lire des données ou appeler des outils. Au **6 août 2026**, l'annuaire en compte **plus de 950**. C'est l'alternative au copier-coller : plutôt que d'exporter puis coller, tu poses ta question et Claude va chercher.

La spécification **2026-07-28** est la plus grosse révision du protocole depuis son lancement. Ce qu'il faut en retenir si tu construis ou maintiens un serveur MCP interne :

| Avant | Depuis la spec 2026-07-28 |
| --- | --- |
| Protocole à état, handshake **initialize** au démarrage | **Stateless** : plus de handshake, chaque requête porte sa version et les capacités du client |
| Header **Mcp-Session-Id** pour suivre la session | Supprimé — l'état inter-appels passe par des **handles** renvoyés par le serveur et repassés en arguments d'outil |
| **Roots**, **Sampling**, **Logging** comme primitives | Les trois sont **dépréciées** (fenêtre de dépréciation d'au moins 12 mois) |
| **Tasks** dans le cœur du protocole | Sorti du cœur, dans l'extension versionnée **io.modelcontextprotocol/tasks** |
| Transport **HTTP+SSE** | Reclassé **déprécié** |

Le passage au stateless a une conséquence très concrète : un serveur MCP peut désormais tourner en serverless ou en edge, sans maintenir de session — c'est beaucoup plus simple à déployer devant un entrepôt de données.

:::piege Ne cale aucune migration sur une deadline inventée
Côté Anthropic, le support de la nouvelle spécification est annoncé « en cours de déploiement », **sans date publiée** — ni de bascule, ni de fin de support des connecteurs existants. Si quelqu'un t'annonce une échéance précise, demande la source. Ce qui est acquis, en revanche : ne construis plus rien de neuf sur Roots, Sampling, Logging ou le transport HTTP+SSE.
:::

Deux règles de sécurité qui valent quel que soit le connecteur :

- **Droits en lecture seule.** Un serveur MCP branché sur ta base doit utiliser un compte technique restreint à ce que Claude a besoin de lire. Pas de **DELETE**, pas de **DROP**, pas d'accès aux tables qui ne servent pas à l'analyse.
- **Les données que tu lis peuvent contenir des instructions.** Un champ de texte libre — commentaire client, ticket support, description produit — peut contenir une phrase qui s'adresse au modèle. La combinaison dangereuse est toujours la même : données privées + contenu non fiable + un moyen d'envoyer quelque chose vers l'extérieur. Si les trois sont réunis dans une même session, coupe-en un.

## Un TP gratuit : le connecteur Anthropic Economic Index

Pour t'entraîner à interroger une source de données en langage naturel sans risquer une seule donnée de ton entreprise, il existe un bac à sable idéal, ouvert depuis le **22 juillet 2026** :

:::etapes
1. Ouvre le menu **Connecteurs** dans Claude et active **Anthropic Economic Index**. Rien à installer, rien à configurer.
2. Pose une question large en langage naturel : quelles catégories de tâches concentrent l'usage de l'IA, comment ça évolue, comment ça se répartit géographiquement.
3. Demande systématiquement **la source et la granularité** de chaque chiffre renvoyé : sur quelle période, quel périmètre, quelle unité.
4. Reformule ta question autrement et compare les deux réponses. Un écart entre les deux, c'est une hypothèse implicite quelque part.
5. Refais l'exercice sur une question dont tu connais déjà la réponse par ailleurs. C'est ton étalon.
:::

L'étape 3 est la vraie compétence : un connecteur ne rend pas les chiffres vérifiés, il rend leur récupération plus rapide. Le protocole de la leçon 5 s'applique exactement pareil.

## Faire tourner du code sur tes fichiers

Quand la donnée tient dans un fichier plutôt que dans une base, Claude peut exécuter du code dessus : charger un CSV, calculer une médiane, tracer une distribution. Dans l'application, l'exécution de code fait partie de ce qu'inclut le plan Free. Côté API, l'outil d'exécution de code est **gratuit lorsqu'il est utilisé avec web_search ou web_fetch** ; sinon tu disposes de **1 550 heures de conteneur gratuites par mois**, puis **0,05 $ par heure et par conteneur** (tarifs au 6 août 2026).

L'avantage sur le SQL : tu vois le code *et* son résultat, donc tu peux vérifier les deux. L'inconvénient : ce qui tourne sur un échantillon exporté ne prouve rien sur la table complète. Sers-t'en pour explorer, refais le calcul final en SQL sur le périmètre réel.

## Le réflexe d'exploration assistée

Fais de Claude ton générateur de pistes, jamais ta source de vérité :

:::etapes
1. Demande-lui **dix contrôles de qualité** sur la table : NULL, doublons, bornes, cardinalités, dates futures.
2. Fais-le **profiler** chaque colonne clé, numérique et catégorielle.
3. Demande une **détection d'outliers par MAD**, pas par écart-type, et fixe toi-même le seuil.
4. Pour chaque anomalie remontée, **inspecte les lignes brutes**. Une anomalie statistique est une *hypothèse*, pas un fait : la confirmation vient toujours des données réelles.
:::

:::defi 40 min — Un profil complet et une anomalie confirmée
Prends la table qui te sert le plus souvent et fais-en le tour comme si tu la découvrais.
- Tu as un profil chiffré des cinq colonnes clés : n, NULL, min, max, moyenne, médiane
- Tu as trouvé au moins une valeur catégorielle inattendue (casse incohérente, doublon logique, statut fantôme)
- Tu as calculé un z-robuste par MAD, avec un seuil que tu peux justifier en une phrase
- Tu as vérifié que la MAD n'est pas nulle et que le **n** est suffisant
- Tu as inspecté les lignes brutes des trois anomalies les plus fortes
- Tu as confirmé une anomalie, ou tu l'as écartée en écrivant explicitement pourquoi
:::

:::memo
Q: Que signale une moyenne très éloignée de la médiane ?
R: Une distribution asymétrique ou des valeurs extrêmes. C'est le signal qui doit déclencher une analyse robuste.
===
Q: Pourquoi la MAD est-elle préférable à l'écart-type pour détecter des outliers ?
R: Elle n'est pas contaminée par les valeurs extrêmes qu'elle cherche justement à détecter.
===
Q: Que vaut la MAD si plus de la moitié des valeurs sont identiques, et que faire ?
R: Elle vaut zéro et le z-robuste explose. On se rabat sur l'écart interquartile, ou on traite ce cas à part.
===
Q: Qu'est-ce que la spécification MCP du 28 juillet 2026 a changé de plus structurant ?
R: Le protocole devient stateless : plus de handshake initialize, plus de header Mcp-Session-Id.
===
Q: Une anomalie statistique remontée par Claude, c'est quoi exactement ?
R: Une hypothèse. Elle se confirme en allant lire les lignes brutes.
:::` + FOOTER,
    },
    {
      slug: "data-verifier-travail-ia",
      title: "Vérifier le travail de l'IA : le cœur du métier",
      description:
        "Requêtes de contrôle, recompute indépendant et réconciliation : la méthode qui transforme une sortie plausible en chiffre défendable.",
      duration_min: 30,
      is_free_preview: false,
      content_md:
        `:::objectifs
- Vérifier un chiffre par un chemin indépendant, et non par une relecture
- Écrire une batterie de sanity checks et fixer toi-même les seuils d'alerte
- Réconcilier avec une source de vérité et savoir expliquer l'écart
- Comprendre pourquoi, depuis Opus 5, demander à Claude de « double-checker » se retourne contre toi
:::

:::flash
Un chiffre n'existe pas tant qu'il n'a pas été vérifié par un autre chemin. Relire la requête de Claude avec les yeux de Claude reproduit ses biais : il faut un second calcul qui ne partage pas l'hypothèse fautive. Nouveauté contre-intuitive de 2026 : ajouter « vérifie bien ton travail » dans ton prompt est devenu contre-productif. Ce n'est pas sa vérification qui compte, c'est la tienne.
:::

## La leçon qui justifie toutes les autres

Tout ce qui précède sert à produire vite. Cette leçon sert à ne pas se tromper. C'est le cœur du parcours, et le réflexe qui sépare un analyste professionnel d'un presse-bouton : **un chiffre n'existe pas tant qu'il n'a pas été vérifié de façon indépendante.** Pas relu — vérifié, par un autre chemin.

Pourquoi « indépendant » ? Parce que relire la requête de Claude avec les yeux de Claude reproduit ses biais. Si l'erreur vient d'une hypothèse fausse (le montant est en centimes, la jointure duplique), la relire ne la révèle pas : il faut un second calcul qui *ne partage pas* cette hypothèse.

## Technique 1 : le recompute par un autre chemin

Le principe : obtenir le même chiffre par une méthode différente. Si les deux convergent, la confiance monte fortement. S'ils divergent, tu viens d'attraper un bug avant qu'il ne sorte.

- Le CA total via **SUM(amount_cents)/100** sur **orders** doit égaler la somme des CA mensuels calculés séparément avec un **GROUP BY mois**. Si le total annuel et la somme des 12 mois diffèrent, une commande tombe hors période (piège des fuseaux) ou un statut est mal filtré.
- Un **COUNT** de clients distincts via **COUNT(DISTINCT customer_id)** doit correspondre au nombre de lignes d'un **GROUP BY customer_id**.
- Un agrégat calculé en SQL doit retomber sur le même résultat recalculé dans un tableur, ou en Python avec pandas, sur un export du même périmètre.

Fais générer le recompute par Claude *dans une conversation séparée*, en reformulant la demande autrement, pour qu'il ne se contente pas de réécrire sa première requête.

:::prompt Recompute indépendant (à lancer dans une conversation neuve)
Voici le schéma de mes tables et une question métier. Je veux un calcul, sans influence extérieure.

[DDL] · Moteur : [le tien] · Question : [formulée autrement que la première fois]

Contraintes :
- N'utilise pas la formulation la plus évidente : propose le chemin de calcul qui repose sur le moins d'hypothèses possible.
- Explicite chaque hypothèse que tu es obligé de faire.
- Donne le résultat attendu sous forme d'un seul nombre, plus la requête qui le produit.
- Ajoute une seconde requête qui atteint le même nombre par une décomposition différente (par période, par segment, par statut).

Je ne te donne volontairement pas le résultat que j'ai déjà obtenu.
:::

## Technique 2 : les requêtes de contrôle (sanity checks)

Avant de croire un résultat, exécute une batterie de contrôles qui doivent tous passer :

    -- Pas de doublons sur la clé censée être unique
    SELECT id, COUNT(*) FROM orders GROUP BY id HAVING COUNT(*) > 1;
    -- doit renvoyer 0 ligne

    -- Les montants restent dans des bornes plausibles
    SELECT COUNT(*) FROM orders WHERE amount_cents < 0 OR amount_cents > 100000000;
    -- doit renvoyer 0 (ou un nombre que tu expliques)

    -- Pas de date dans le futur
    SELECT COUNT(*) FROM orders WHERE created_at > now();
    -- doit renvoyer 0

    -- La jointure n'a pas gonflé le volume
    SELECT COUNT(*) FROM orders;                 -- nombre de référence
    SELECT COUNT(*) FROM orders o JOIN items i   -- doit rester cohérent
      ON i.order_id = o.id;

Demande à Claude de générer une dizaine de ces contrôles adaptés à ton schéma. Mais c'est **toi** qui décides ce qu'est un résultat « normal » : Claude propose les tests, tu fixes les seuils d'alerte.

:::prompt Générer dix sanity checks sur mesure
Voici mon schéma et le chiffre que je viens de calculer.

[DDL] · Chiffre obtenu : [valeur + définition métier exacte + périmètre + période]

Génère dix requêtes de contrôle qui pourraient invalider ce chiffre. Pour chacune :
- la requête, exécutable telle quelle sur [moteur] ;
- ce que le résultat devrait valoir si tout va bien ;
- ce qu'un résultat différent révélerait précisément.

Couvre au minimum : unicité des clés, doublons de jointure, bornes de valeurs, dates aberrantes ou futures, lignes orphelines, valeurs NULL sur les colonnes de filtre, cohérence entre le total et sa décomposition, périmètre de dates aux bords, statuts inattendus, enregistrements de test restés en base.

Ne fixe aucun seuil chiffré toi-même : c'est moi qui décide ce qui est normal.
:::

## Technique 3 : la réconciliation avec une source de vérité

Le contrôle le plus puissant compare ton résultat à une référence externe connue : le CA de la compta, le nombre d'utilisateurs facturés par le système de billing, un chiffre déjà publié au trimestre précédent. Si ta requête dit 1,28 M€ et que la compta dit 1,19 M€, l'écart de 90 k€ est une **piste**, pas un détail. Cherche-le : remboursements ? TVA incluse ou non ? période décalée d'un jour ? La réconciliation transforme un chiffre isolé en chiffre défendable devant un directeur financier.

## Technique 4 : tester sur un cas dont tu connais la réponse

Le test le plus simple et le plus sous-utilisé. Prends **un** client, **une** journée, **une** commande dont tu peux vérifier le résultat à la main ou dans une autre interface. Lance la requête restreinte à ce périmètre. Si elle se trompe sur un cas que tu maîtrises, elle se trompe à grande échelle — tu viens juste de le voir en clair.

## Le piège du « ça a l'air juste »

Un chiffre rond, un total plausible, un graphe lisse : rien de tout cela n'est une preuve. Les erreurs les plus coûteuses produisent des résultats *crédibles* — c'est précisément ce qui les rend coûteuses, car personne ne les questionne.

:::piege Le résultat qui te fait plaisir est le plus dangereux
Méfie-toi particulièrement quand le chiffre **confirme ce que tu espérais** : le biais de confirmation te fera baisser la garde au pire moment. Règle pratique — un résultat qui va dans ton sens mérite un contrôle de plus, pas un de moins. Écris la phrase « ce chiffre serait faux si… » avant de le diffuser.
:::

## « Double-check ta réponse » : l'instruction qui s'est retournée

Claude affirmera « le CA est de 1 284 312 € » avec exactement le même ton, qu'il ait raison ou tort. Il n'existe aucun signal fiable de confiance dans sa formulation. Ce qui a changé, c'est la manière d'y répondre dans le prompt.

:::maj 24 juillet 2026
Avec Opus 5, la documentation d'Anthropic recommande de **retirer** les instructions de vérification héritées des modèles précédents — « ajoute une étape de vérification finale », « fais vérifier par un sous-agent », « double-check ta réponse ». Le modèle vérifie déjà son travail : ces consignes provoquent de la **sur-vérification**, plus longue et plus chère, sans gain de justesse. Même logique côté périmètre : dire « ne me signale que les problèmes graves » lui fait remonter moins de choses, littéralement. Demande tout, filtre ensuite.
:::

:::cle Retirer la consigne, pas la vérification
Ne confonds pas les deux. Ce qui devient inutile, c'est **d'ordonner à Claude de se relire lui-même**. Ce qui reste absolument obligatoire, c'est **ta** vérification : recompute par un autre chemin, sanity checks, réconciliation, cas connu. La seule chose qui compte, c'est qu'un second calcul ne partage pas l'hypothèse fautive du premier — et une auto-relecture ne remplira jamais cette condition.
:::

Deux formulations qui, elles, restent très utiles :

- « **Quelles hypothèses pourraient rendre ce résultat faux ? Sous quelles conditions ta requête renverrait-elle un chiffre erroné ?** » — ce n'est pas une demande d'auto-vérification, c'est une demande d'énumération. Elle te fabrique une liste de contrôles à exécuter toi-même.
- La même question posée dans une **conversation neuve**, sans son premier résultat sous les yeux. Si les deux chiffres divergent, tu tiens un problème.

## La checklist non négociable

Avant qu'un chiffre quitte ton écran :

:::etapes
1. **Recompute** par un autre chemin — les deux valeurs convergent-elles ?
2. **Sanity checks** : doublons, bornes, dates, volume de jointure. Tous au vert ?
3. **Réconciliation** avec une source de vérité — l'écart est-il expliqué, pas seulement constaté ?
4. **Cas connu** testé à la main — résultat exact ?
5. **Hypothèses** de Claude relues une par une — toutes valides sur tes données ?
:::

Cinq cases. Tant qu'elles ne sont pas cochées, le chiffre n'est pas prêt — quelle que soit l'assurance avec laquelle l'IA l'a annoncé.

:::defi 45 min — Faire passer un chiffre au grill
Prends le chiffre que tu as produit en leçon 2 ou 4, celui qui compte vraiment, et applique-lui le protocole complet.
- Recompute effectué dans une conversation neuve, par un chemin différent : écart nul, ou écart expliqué
- Au moins huit sanity checks écrits, exécutés, tous au vert — ou l'exception documentée noir sur blanc
- Une réconciliation avec une source externe, avec l'écart chiffré **et** sa cause identifiée
- Un cas connu testé à la main et retrouvé à l'unité près
- La liste des hypothèses de Claude relue point par point, avec au moins une correction
- Une phrase écrite quelque part : « ce chiffre serait faux si… »
:::

:::memo
Q: Pourquoi relire la requête de Claude ne suffit-il pas à la vérifier ?
R: Parce que la relecture reproduit les mêmes biais. Une hypothèse fausse au départ ne se voit pas en relisant.
===
Q: Comment fait-on générer un recompute réellement indépendant ?
R: Dans une conversation séparée, en reformulant la demande autrement, sans lui montrer le premier résultat.
===
Q: Qui fixe les seuils d'alerte des requêtes de contrôle ?
R: Toi. Claude propose les tests, tu décides ce qu'est un résultat normal.
===
Q: Que faire d'un écart de 90 k€ entre ta requête et la compta ?
R: Le traiter comme une piste : remboursements, TVA, décalage de période. Jamais l'arrondir ni l'ignorer.
===
Q: Faut-il écrire « double-check ta réponse » dans un prompt destiné à Opus 5 ?
R: Non, c'est contre-productif depuis le 24 juillet 2026. Mais ta propre vérification, elle, reste obligatoire.
:::` + FOOTER,
    },
    {
      slug: "data-synthese-dashboards",
      title: "Synthèse exécutive et dashboards qui parlent",
      description:
        "Transformer des chiffres vérifiés en décisions : storytelling data, visualisations honnêtes, anticipation des questions du décideur et rapport récurrent.",
      duration_min: 22,
      is_free_preview: false,
      content_md:
        `:::objectifs
- Structurer une synthèse en pyramide inversée : conclusion, trois chiffres, décision, annexe
- Choisir le bon graphe et le titrer par la conclusion qu'il porte
- Repérer les artifices qui font mentir un dashboard sans une seule donnée fausse
- Faire jouer à Claude l'avocat du diable avant que ton comité ne s'en charge
:::

:::flash
Un chiffre juste mais mal raconté ne sert à rien. Commence par la réponse, appuie-la sur trois chiffres — pas dix —, termine par la décision, et renvoie la méthode en annexe. Un graphe égale un message, titré par sa conclusion, avec un axe qui part de zéro. Et fais-toi démonter par Claude avant de te faire démonter en réunion.
:::

## Un chiffre juste mais mal raconté ne sert à rien

Tu as généré du SQL fiable, profilé, détecté les anomalies, tout vérifié. Reste l'étape qui décide de l'impact : faire comprendre. Un décideur ne lit pas un tableau de 40 lignes ; il veut savoir **ce qui se passe, pourquoi, et ce qu'il doit décider**. Claude est excellent pour cette mise en forme — à condition de ne jamais le laisser rédiger sur des chiffres non vérifiés. La synthèse vient *après* la leçon 5, jamais avant.

## La pyramide inversée : la conclusion d'abord

Un analyste débutant raconte sa démarche dans l'ordre chronologique. Un analyste senior commence par la **réponse**. Structure toute synthèse ainsi :

1. **Le message principal en une phrase** : « Le CA Q2 progresse de 8 % mais uniquement porté par un client ; hors ce client, il recule de 3 %. »
2. **Les trois chiffres qui le soutiennent.** Pas dix. Trois.
3. **L'implication, la décision** : « Risque de concentration — recommandation : sécuriser le contrat de ce client et relancer l'acquisition. »
4. **Le détail et la méthode**, en annexe, pour qui veut creuser.

:::avant-apres Synthèse chronologique | Synthèse en pyramide
« J'ai extrait les commandes de Q2, retiré les commandes de test, croisé avec la table des remboursements, puis agrégé par mois et par segment. Après vérification, le total ressort à 1,28 M€, en hausse par rapport au trimestre précédent. On observe par ailleurs une concentration sur certains comptes. »

Le lecteur doit lire jusqu'au bout pour savoir ce qu'on lui demande de décider. Et souvent, il ne lit pas jusqu'au bout.
===
« **Le CA Q2 progresse de 8 %, mais uniquement grâce à un client : hors ce compte, il recule de 3 %.** »

1,28 M€ de CA · 42 % du total sur un seul client · −3 % hors ce client

« **Décision proposée : sécuriser ce contrat avant octobre et rouvrir un budget d'acquisition.** »

Méthode et périmètre en annexe.
:::

Demande à Claude de réécrire ton brouillon selon cette pyramide. Il est très bon pour hiérarchiser — tu gardes la main sur l'interprétation métier.

:::prompt Réécrire une analyse en pyramide inversée
Voici mon brouillon d'analyse, dont tous les chiffres ont déjà été vérifiés.

[brouillon]

Public : [comité de direction / directeur financier / responsable produit] · Durée de lecture visée : 90 secondes.

Réécris-le selon cette structure, dans cet ordre :
1. Le message principal en UNE phrase, qui contient le chiffre et sa nuance.
2. Exactement trois chiffres d'appui, chacun en une ligne.
3. Une recommandation actionnable, formulée à l'impératif, avec une échéance.
4. Une section « méthode et périmètre » de cinq lignes maximum.

Contraintes : pas de jargon technique SQL, pas d'adverbe d'intensité, aucun chiffre que je ne t'ai pas donné. Si une information te manque pour tenir la structure, dis-le au lieu de l'inventer.
:::

## Choisir le bon graphe, et un seul message par graphe

Chaque type de question appelle un type de visuel :

| Ce que tu veux montrer | Le visuel qui marche |
| --- | --- |
| Une évolution dans le temps | Une courbe |
| Une comparaison entre catégories | Des barres, horizontales s'il y en a beaucoup |
| La composition d'un tout | Barres empilées ou treemap — pas de camembert au-delà de 4 ou 5 parts |
| La relation entre deux variables | Un nuage de points |

Règle d'or : **un graphe = un message**. Si tu ne peux pas titrer le graphe par la conclusion qu'il porte (« La croissance vient à 90 % d'un seul segment »), c'est qu'il en dit trop ou pas assez.

:::astuce Montre une maquette plutôt que de décrire
Pour obtenir le rendu que tu as en tête, une maquette vaut mieux qu'un paragraphe d'explications : une capture d'écran d'un graphe existant, ou une petite page HTML de référence, donnent généralement de meilleurs résultats qu'une description en mots. C'est un des enseignements des travaux d'Anthropic sur le contexte publiés le 24 juillet 2026 : mieux vaut fournir une référence riche qu'un cahier des charges verbeux.
:::

## Les visualisations honnêtes

Un dashboard peut mentir sans une seule donnée fausse. Les pièges à éviter — et à traquer dans ce que Claude produit :

- **Axe Y tronqué** : commencer un axe à 95 au lieu de 0 transforme une variation de 2 % en falaise spectaculaire. Pour des barres, l'axe part de zéro, sans exception.
- **Échelles incohérentes** entre deux graphes comparés côte à côte.
- **Double axe Y** qui suggère une corrélation fabriquée par le choix des échelles.
- **Couleurs qui orientent** : du rouge sur un chiffre neutre crée une alarme injustifiée.

Une visualisation honnête laisse le lecteur tirer sa propre conclusion — elle ne la lui force pas par un artifice graphique.

:::piege L'axe tronqué que personne ne remarque
C'est le mensonge graphique le plus fréquent, et il arrive rarement par malice : beaucoup d'outils tronquent l'axe automatiquement pour « mieux remplir » l'espace. Le réflexe : sur chaque graphe à barres que tu diffuses, vérifie la valeur de départ de l'axe. Si tu tiens absolument à zoomer sur une variation faible, dis-le en toutes lettres dans le titre.
:::

## Anticiper les questions du décideur

C'est ce qui distingue une synthèse qui inspire confiance d'une qui se fait démonter en réunion. Claude joue remarquablement bien le rôle d'adversaire — utilise-le avant que quelqu'un d'autre ne le fasse à ta place.

:::prompt L'avocat du diable avant la réunion
Tu es le directeur financier qui reçoit cette synthèse. Tu es bienveillant mais exigeant, et tu as vu passer beaucoup d'analyses fausses.

[colle ta synthèse]

Donne-moi :
1. Les cinq questions les plus dures que tu poserais en réunion, classées par difficulté.
2. Pour chacune, l'angle d'attaque précis : méthode, périmètre, définition métier, comparabilité, ou chiffre lui-même.
3. Les deux endroits où la synthèse pourrait donner une impression trompeuse, même si tous les chiffres sont exacts.
4. Ce qui manque et que tu t'attendrais à voir.

Ne me ménage pas et ne filtre pas : je préfère lire ça maintenant.
:::

Les questions classiques qu'il fera surgir : « ces chiffres incluent-ils les remboursements ? », « la hausse est-elle saisonnière ? », « comment se compare-t-on à l'an dernier sur la même période ? », « quel est l'intervalle d'incertitude ? ». Prépare une réponse chiffrée à chacune *avant* la réunion. La moitié de ces réponses sont des requêtes de contrôle que tu as déjà écrites en leçon 5.

## Dire l'incertitude sans noyer le message

Un bon analyste ne cache pas les limites de ses données, mais ne les transforme pas non plus en brouillard. La bonne dose : une ligne honnête. « Chiffres arrêtés au 6 juin, hors commandes en attente de validation, soit environ 2 % du volume. » Ça protège ta crédibilité quand un écart apparaîtra plus tard — et il apparaîtra.

## Industrialiser le rapport récurrent

Quand la même synthèse revient chaque semaine, le vrai gain n'est plus la rédaction, c'est la répétition sans erreur. Deux repères au **6 août 2026** :

- Le plan **Pro** liste **Claude Cowork**, **Claude Design** et **Claude Science** — ce ne sont plus des fonctions réservées aux plans supérieurs.
- Depuis le **7 juillet 2026**, **Cowork** ne se limite plus à une application de bureau : il est disponible sur le web et sur mobile, en bêta, avec des **sessions qui tournent dans le cloud** et des **tâches planifiées**. Une extraction lancée depuis ton téléphone continue quand tu fermes ton portable. Le déploiement bêta a commencé par les abonnés Max avant de s'étendre aux autres plans : vérifie ce que ton compte propose plutôt que de te fier à une liste figée.

Ce qui s'automatise sans risque : l'extraction, la mise en forme, les contrôles de qualité, la génération du support. Ce qui ne s'automatise pas : la lecture des écarts et la décision. Un rapport automatisé qui n'est jamais relu redevient exactement le scénario de la leçon 1.

## Le mot de la fin : tu signes, pas l'IA

Quand tu présentes une synthèse, c'est **ton** nom dessus, pas celui de Claude. Il a accéléré la production, structuré le récit, joué l'avocat du diable. Mais la responsabilité du chiffre est la tienne, et c'est exactement pour ça que le fil rouge de ce parcours n'est pas négociable : **Claude est un bras droit puissant ; la vérification, le jugement et la signature restent humains.** C'est ce qui fait de toi un analyste augmenté plutôt qu'un relais d'erreurs bien présentées.

:::defi 30 min — La synthèse qui tient en réunion
Reprends le chiffre que tu as fait passer au grill en leçon 5 et transforme-le en une page qui déclenche une décision.
- Un message principal en une seule phrase, contenant le chiffre **et** sa nuance
- Exactement trois chiffres d'appui, pas quatre
- Une recommandation actionnable avec une échéance, pas un simple constat
- Un graphe, titré par sa conclusion, avec un axe qui part de zéro
- Les cinq questions dures générées par Claude, avec ta réponse chiffrée à chacune
- Une ligne d'incertitude honnête : date d'arrêté, périmètre, exclusions
:::

:::memo
Q: Par quoi commence une synthèse en pyramide inversée ?
R: Par la réponse : le message principal en une phrase, avant toute méthode.
===
Q: Combien de chiffres d'appui met-on derrière le message principal ?
R: Trois. Au-delà, le lecteur ne retient plus rien.
===
Q: Quelle est la règle d'or d'un graphe ?
R: Un graphe, un message. Si tu ne peux pas le titrer par sa conclusion, il en dit trop ou pas assez.
===
Q: Qu'est-ce qu'une visualisation honnête ?
R: Une visualisation qui laisse le lecteur tirer sa propre conclusion, sans la forcer par un artifice graphique.
===
Q: À quel moment la synthèse intervient-elle dans le parcours ?
R: Après la vérification de la leçon 5. Jamais avant.
:::` + FOOTER,
    },
  ],
};
