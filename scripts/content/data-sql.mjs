// =========================================
// Parcours « Claude pour data et SQL »
// Contenu original (non plagié), inspiré des bonnes pratiques publiques :
//   - Sémantique SQL standard (NULL en logique ternaire, NOT IN vs NOT EXISTS,
//     cadres de fenêtrage ROWS vs RANGE)
//   - Statistiques robustes (MAD, constante 1.4826, profilage)
// Fil rouge : Claude est un bras droit puissant, mais ses sorties (surtout le
// SQL) doivent TOUJOURS être vérifiées. Jamais de confiance aveugle.
// =========================================

const FOOTER = `

---

**Sources & méthode** · Bonnes pratiques SQL/analytics établies, vérifiées à la rédaction. Contenu original pour ClaudeAI Academy.`;

export const claudeDataSql = {
  slug: "claude-data-sql",
  title: "Claude pour data et SQL",
  description:
    "Faire de Claude votre analyste senior — générer, debugger et optimiser du SQL, profiler des données et bâtir des dashboards — tout en vérifiant systématiquement chaque sortie.",
  tier_required: "mastery",
  display_order: 3,
  estimated_duration_min: 130,
  lessons: [
    {
      slug: "data-bras-droit-pas-remplacant",
      title: "Claude, bras droit data — pas remplaçant",
      description:
        "Cadrer l'usage de Claude sur la data et installer la règle d'or : ses sorties se vérifient toujours, surtout le SQL.",
      duration_min: 14,
      is_free_preview: true,
      content_md:
        `## Le réflexe qui coûte cher

Vous collez votre question, Claude renvoie une requête SQL impeccable, un chiffre tombe : « 1 284 312 € de chiffre d'affaires sur le trimestre ». Vous le copiez dans le rapport du COMEX. Trois jours plus tard, quelqu'un remarque que la requête comptait deux fois les commandes remboursées. Le mal est fait.

Ce scénario est la raison d'être de ce parcours. Claude est un **bras droit data extraordinaire** : il écrit du SQL plus vite que vous, connaît les dialectes, repère des patterns d'analyse, rédige des synthèses claires. Mais il produit du texte *plausible*, pas du texte *vérifié*. Sur la data, plausible ne suffit jamais — un chiffre faux mais crédible est plus dangereux qu'une erreur évidente.

## La règle d'or, non négociable

> Toute sortie de Claude qui touche à un chiffre, une requête ou une décision se vérifie de façon indépendante avant d'être utilisée.

Ce n'est pas de la méfiance, c'est de la méthode. Les meilleurs analystes ne font confiance ni à leur propre SQL ni à celui d'un collègue sans contrôle. Claude ne mérite pas un traitement de faveur. Il mérite mieux : un cadre où ses forces brillent et où ses erreurs sont attrapées avant qu'elles ne fuient.

## Ce que Claude fait remarquablement bien

- **Traduire une intention en SQL** : « le panier moyen par segment client, hors commandes annulées » devient une requête en secondes.
- **Jongler avec les dialectes** : PostgreSQL, BigQuery, Snowflake, MySQL n'ont pas la même syntaxe de dates ni les mêmes fonctions. Claude bascule de l'un à l'autre sans effort, *si vous lui dites lequel*.
- **Expliquer et commenter** : il décortique une requête héritée de 200 lignes et vous dit ce qu'elle fait.
- **Profiler et explorer** : il propose des angles d'analyse, des contrôles de qualité, des visualisations.
- **Rédiger** : il transforme un tableau de chiffres en synthèse lisible par un décideur non technique.

## Ce sur quoi il se trompe — et pourquoi

Trois familles d'erreurs reviennent sans cesse :

1. **Les hypothèses silencieuses.** Sans le schéma, Claude *invente* des noms de colonnes plausibles (**order_date** alors que la vraie colonne est **created_at**), suppose qu'un montant est en euros alors qu'il est en centimes, ou ignore qu'une table contient des doublons logiques.
2. **La sémantique SQL piégeuse.** Les **NULL**, les jointures qui dupliquent les lignes, les agrégats sur des données dénormalisées : autant de zones où une requête *s'exécute sans erreur* tout en renvoyant un faux résultat. C'est le pire cas — pas de message d'alerte, juste un chiffre faux.
3. **L'aplomb.** Claude formule une réponse fausse avec la même assurance qu'une réponse juste. Il n'y a pas de signal de confiance fiable dans le ton. C'est à vous de créer ce signal, par la vérification.

## Le bon modèle mental : analyste senior, pas oracle

Traitez Claude comme un analyste junior surdoué et infatigable, à qui vous confieriez du travail — mais dont vous **relisez systématiquement le livrable** parce qu'il ne connaît pas vos données aussi bien que vous, et qu'il ne vous dira jamais spontanément « là, je ne suis pas sûr ».

Concrètement, cela change votre façon de prompter. Au lieu de :

    Donne-moi le CA du trimestre.

vous écrivez :

    Voici le schéma de la table orders (je le colle ci-dessous). Le CA = somme de amount_cents / 100, uniquement pour status = 'paid', sur les commandes dont created_at est dans Q2 2026. Attention aux remboursements : ils sont dans une table refunds séparée. Donne-moi la requête PostgreSQL, explique tes hypothèses, et propose une requête de contrôle indépendante pour valider le total.

La différence de qualité est radicale — et la dernière phrase (« propose une requête de contrôle ») installe la vérification dès le premier prompt.

## Le contrat de ce parcours

Sur les six leçons, vous allez apprendre à : générer du SQL fiable à partir d'un schéma, debugger et optimiser une requête, mener une analyse exploratoire robuste, et — c'est le cœur, la leçon 5 — **vérifier le travail de l'IA** par des requêtes de contrôle et du recompute indépendant. On termine par la synthèse exécutive : transformer des chiffres vérifiés en décisions.

À aucun moment vous ne déléguerez votre jugement. Vous déléguerez la production, vous garderez le contrôle. C'est exactement ce qui sépare un analyste qui *utilise* l'IA d'un analyste qui se fait *piéger* par elle.` + FOOTER,
    },
    {
      slug: "data-generer-sql-fiable",
      title: "Générer du SQL fiable : du schéma à la requête",
      description:
        "Donner à Claude le contexte qui élimine les hypothèses inventées : schéma, dialecte, contraintes métier et pièges classiques.",
      duration_min: 24,
      is_free_preview: false,
      content_md:
        `## Le SQL faux est presque toujours un SQL mal briefé

Quand Claude produit une requête fausse, la cause est rarement une faille de raisonnement. C'est presque toujours un **manque de contexte** : il a comblé un trou avec une hypothèse plausible mais fausse. La discipline de cette leçon : ne laissez aucun trou.

## Les quatre piliers d'un bon prompt SQL

**1. Le schéma réel.** C'est l'élément qui change tout. Collez les définitions de tables — idéalement le DDL :

    CREATE TABLE orders (
      id            bigint PRIMARY KEY,
      customer_id   bigint NOT NULL,
      created_at    timestamptz NOT NULL,
      status        text NOT NULL,   -- 'paid' | 'pending' | 'cancelled'
      amount_cents  integer NOT NULL -- montant en CENTIMES, pas en euros
    );

Les commentaires comptent autant que les colonnes. **amount_cents en centimes** est exactement le genre d'information que Claude ne peut pas deviner et qui produit un résultat faux d'un facteur 100. Si vous n'avez pas le DDL, donnez au moins : noms de colonnes exacts, types, et la sémantique des colonnes ambiguës (qu'est-ce qu'un **status = 'pending'** ? une commande **cancelled** compte-t-elle dans le CA ?).

**2. Le dialecte.** PostgreSQL, BigQuery, Snowflake, MySQL et SQL Server divergent sur les dates, le découpage de chaînes, les fonctions de fenêtrage et la syntaxe de **LIMIT**. Une requête PostgreSQL parfaite échoue en BigQuery. Annoncez le moteur, et la version si elle compte.

**3. Les contraintes métier.** Ce sont les règles qui ne sont écrites nulle part dans le schéma : « le CA exclut les commandes de test (customer_id < 1000) », « le fuseau de référence est Europe/Paris », « un client peut avoir plusieurs lignes dans customers après une fusion de comptes ». Sans elles, la requête sera techniquement correcte et métier-fausse.

**4. La sortie attendue.** Décrivez la forme du résultat : « une ligne par mois, colonnes mois / CA / nb_commandes, triées par mois ». Vous évitez les allers-retours et vous vous donnez un critère pour juger la sortie.

## Le piège des dates et fuseaux

C'est la source d'erreur numéro un en pratique. Une commande passée le 1er juillet à 01h00 heure de Paris est, en UTC, le 30 juin à 23h00. Si votre filtre trimestriel travaille en UTC sans conversion, cette commande tombe dans le mauvais trimestre. Précisez toujours : la colonne est-elle en **timestamptz** (avec fuseau) ou en **timestamp** naïf ? Quel fuseau pour découper les périodes ? Demandez explicitement la conversion, par exemple en PostgreSQL **created_at AT TIME ZONE 'Europe/Paris'**.

## Le piège qui ne lève aucune erreur : la jointure qui duplique

Vous joignez **orders** à une table **order_items** pour récupérer une catégorie, puis vous sommez **amount_cents**. Problème : une commande de 3 lignes apparaît désormais 3 fois, et votre total est gonflé. La requête s'exécute parfaitement. Le chiffre est faux.

Règle : dès qu'une jointure passe sur une relation **un-vers-plusieurs**, demandez-vous ce que devient votre agrégat. Souvent la bonne réponse est d'agréger *avant* de joindre, ou de joindre sur une clé garantie unique. Mettez Claude en garde dans le prompt : « attention, orders et order_items sont en un-vers-plusieurs, ne duplique pas les montants ».

## Le piège des NULL

En SQL, **NULL** n'est pas une valeur, c'est « inconnu », et il se propage en logique ternaire (vrai / faux / inconnu). **amount = NULL** n'est jamais vrai — il faut **amount IS NULL**. Un **COUNT(colonne)** ignore les NULL alors que **COUNT(\\*)** les compte. Une condition **WHERE remboursement <> 'oui'** exclut silencieusement les lignes où **remboursement** est NULL. Listez à Claude les colonnes qui peuvent être NULL et ce que NULL signifie pour chacune.

## Toujours exiger les hypothèses et un contrôle

Terminez chaque prompt SQL par deux demandes :

    1. Liste explicitement toutes les hypothèses que tu as faites (colonnes, types,
       sémantique, fuseau, filtres).
    2. Propose une requête de contrôle indépendante qui valide le résultat
       par un autre chemin (ex. un COUNT et une SUM séparés, ou un recompte
       sur un sous-ensemble connu).

La liste d'hypothèses est votre checklist de relecture : vous validez chaque point contre votre connaissance des données. La requête de contrôle prépare la leçon 5.

## Mini-méthode en cinq étapes

1. **Briefer** : schéma + dialecte + contraintes + sortie attendue.
2. **Générer** : laisser Claude produire la requête *et* ses hypothèses.
3. **Relire les hypothèses** une par une, corriger ce qui est faux, regénérer.
4. **Exécuter sur un échantillon** (ajoutez un **LIMIT**, ou filtrez sur un client connu dont vous connaissez le résultat à la main).
5. **Valider l'ordre de grandeur** : le total tombe-t-il dans une fourchette plausible ? Un CA trimestriel à 12 € ou à 40 millions sur une PME doit déclencher une alarme immédiate.

Un SQL bien briefé est juste 9 fois sur 10. Les 5 étapes attrapent la 10e — et c'est elle qui aurait fini dans le rapport du COMEX.` + FOOTER,
    },
    {
      slug: "data-debugger-optimiser",
      title: "Debugger et optimiser une requête avec Claude",
      description:
        "Lire un plan d'exécution, poser les bons index, et désamorcer les pièges de jointure, de NULL et de fenêtrage.",
      duration_min: 24,
      is_free_preview: false,
      content_md:
        `## Deux problèmes différents : faux, et lent

Une requête peut être **fausse** (mauvais résultat) ou **lente** (bon résultat, temps inacceptable). Claude aide sur les deux, mais ce sont des diagnostics distincts. Pour le faux, on raisonne sémantique. Pour le lent, on lit un plan d'exécution. Ne mélangez pas les deux.

## Debugger le faux : faire expliquer la requête ligne par ligne

Quand un chiffre semble suspect, ne demandez pas « corrige ça ». Demandez d'abord :

    Explique cette requête étape par étape : que produit chaque jointure,
    chaque filtre, chaque agrégat ? À quelle ligne le résultat pourrait-il
    être dupliqué ou tronqué ?

Cette explication révèle souvent l'erreur sans même la corriger. Les trois suspects habituels :

**Jointures qui dupliquent.** Vu en leçon 2 : un **JOIN** sur du un-vers-plusieurs multiplie les lignes avant l'agrégat. Symptôme typique : un **SUM** ou un **COUNT** trop élevé. Contrôle rapide — comparez **COUNT(\\*)** avant et après la jointure ; s'il augmente, vous dupliquez.

**NULL dans les filtres et les NOT IN.** Le piège le plus vicieux : **WHERE id NOT IN (SELECT customer_id FROM ...)** renvoie **zéro ligne** dès qu'un seul **customer_id** de la sous-requête est NULL. La raison : **x NOT IN (..., NULL)** s'évalue à *inconnu*, jamais à *vrai*, donc le **WHERE** rejette tout. La parade : utilisez **NOT EXISTS** (insensible aux NULL car il teste la présence de lignes, pas l'égalité de valeurs), ou ajoutez **WHERE customer_id IS NOT NULL** dans la sous-requête. Quand Claude vous propose un **NOT IN**, c'est un réflexe : demandez la version **NOT EXISTS**.

**Fenêtrage et cadre par défaut.** Les fonctions de fenêtre cachent un piège peu connu. Dès que vous mettez un **ORDER BY** dans le **OVER(...)** sans préciser le cadre, le défaut SQL est **RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW**, pas **ROWS**. Avec **RANGE**, toutes les lignes ayant la même valeur d'**ORDER BY** (par exemple la même date) sont traitées comme des pairs et reçoivent le **même** cumul. Résultat : votre « total courant » se fige sur les doublons de date au lieu d'avancer ligne par ligne. Pour un vrai cumul positionnel, écrivez toujours explicitement :

    SUM(montant) OVER (
      ORDER BY jour
      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    )

C'est plus juste *et* plus rapide que le **RANGE** par défaut.

## Optimiser le lent : lire le plan d'exécution

La règle d'or de l'optimisation : **on ne devine pas, on mesure**. La mesure, c'est le plan d'exécution. En PostgreSQL :

    EXPLAIN (ANALYZE, BUFFERS) <votre requête>;

**ANALYZE** exécute réellement la requête et donne les temps mesurés ; sans lui, vous n'avez que des estimations. Collez le plan complet à Claude et demandez-lui de l'interpréter. Les signaux à traquer :

- **Seq Scan** sur une grosse table avec un filtre sélectif → un index manque probablement.
- **Écart estimé / réel** énorme sur le nombre de lignes (le planificateur attendait 10 lignes, en a eu 2 millions) → statistiques périmées, pensez à **ANALYZE** la table.
- **Nested Loop** sur de gros volumes des deux côtés → un **Hash Join** serait souvent plus adapté.
- **Sort** ou **Hash** qui déborde sur disque → mémoire de travail insuffisante ou volume à réduire en amont.

## Les index : utiles, mais pas magiques

Un index accélère la lecture mais ralentit les écritures et occupe de l'espace. Principes que Claude doit respecter — et que vous vérifiez :

- Indexez les colonnes de **filtre** (**WHERE**) et de **jointure** très sélectives.
- Un **index composite (a, b)** sert les requêtes filtrant sur **a** seul ou sur **a** *et* **b**, mais **pas** sur **b** seul (l'ordre des colonnes compte).
- Une fonction sur la colonne tue l'index : **WHERE date(created_at) = '2026-06-01'** ignore l'index sur **created_at**. Réécrivez en intervalle : **created_at >= '2026-06-01' AND created_at < '2026-06-02'**.
- Claude *suggère* des index, il ne sait pas si vous écrivez 10 000 fois par seconde dans cette table. La décision finale vous revient.

## Vérifier que l'optimisation n'a rien cassé

Une requête optimisée doit renvoyer **exactement le même résultat** que l'originale. Ne le supposez jamais. Le test imparable :

    SELECT * FROM (ancienne requête) EXCEPT SELECT * FROM (nouvelle requête);
    -- puis l'inverse

Les deux **EXCEPT** doivent renvoyer zéro ligne. C'est la preuve que l'optimisation a préservé la sémantique — exactement l'esprit de vérification indépendante qu'on systématise à la leçon suivante.` + FOOTER,
    },
    {
      slug: "data-exploration-anomalies",
      title: "Analyse exploratoire et détection d'anomalies",
      description:
        "Profiler une table, choisir des statistiques robustes et repérer les outliers avec la MAD plutôt qu'avec l'écart-type.",
      duration_min: 24,
      is_free_preview: false,
      content_md:
        `## Avant d'analyser : profiler

On ne tire aucune conclusion d'une table qu'on n'a pas profilée. Le profilage, c'est l'examen systématique de chaque colonne : volume, valeurs manquantes, distribution, valeurs distinctes, bornes. Claude excelle à générer ces requêtes de profilage — à condition que vous sachiez lesquelles demander et lire le résultat de façon critique.

## Le profilage de base, colonne par colonne

Pour une colonne numérique, demandez à Claude une requête qui donne d'un coup :

    SELECT
      COUNT(*)                      AS n_lignes,
      COUNT(montant)                AS n_non_null,
      COUNT(*) - COUNT(montant)     AS n_null,
      MIN(montant), MAX(montant),
      AVG(montant)                  AS moyenne,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY montant) AS mediane
    FROM ventes;

Ce que vous lisez là-dedans :

- **n_null** élevé → un filtre ou une jointure risque de se comporter bizarrement (revoir la leçon 3).
- **MIN négatif** sur un montant censé être positif → données sales ou avoirs mal taggés.
- **Moyenne très éloignée de la médiane** → distribution asymétrique ou présence d'outliers. C'est le signal qui doit déclencher la suite.
- **MAX** absurde (un panier à 9 999 999 €) → valeur sentinelle, bug de saisie, ou test en production.

Pour une colonne catégorielle, un **GROUP BY ... ORDER BY count DESC** révèle les valeurs inattendues : un **status** qui devait avoir 3 valeurs en a 7, dont **'Paid'** et **'paid'** (casse incohérente) qui fausseront tous vos filtres.

## Moyenne vs médiane : pourquoi la robustesse compte

La **moyenne** et l'**écart-type** sont *non robustes* : une seule valeur extrême les déplace fortement. Sur des données réelles — montants, durées, temps de réponse — il y a presque toujours des extrêmes. Une commande à 2 millions d'euros au milieu de paniers à 40 € tire la moyenne vers le haut et explose l'écart-type, rendant ces deux statistiques trompeuses.

Les statistiques **robustes** résistent à ces extrêmes : la **médiane** (au lieu de la moyenne) et la **MAD** (au lieu de l'écart-type). C'est ce qu'il faut utiliser pour décrire des distributions réelles et pour détecter des anomalies.

## La MAD : détecter les outliers sans se faire piéger

La **MAD** (Median Absolute Deviation, écart absolu médian) se calcule en trois temps :

1. Calculer la **médiane** des valeurs.
2. Pour chaque valeur, calculer l'écart absolu à cette médiane : la valeur de **abs(x - médiane)**.
3. Prendre la **médiane de ces écarts absolus** : c'est la MAD.

On en tire un **z-score robuste** pour chaque point :

    z_robuste = 0.6745 * (x - médiane) / MAD

Le **0.6745** rend la MAD comparable à un écart-type sous une loi normale (c'est l'inverse de la constante 1.4826 : 1 / 1.4826 ≈ 0.6745). On déclare alors un point **outlier** si son z-robuste dépasse un seuil — typiquement **3** (seuils usuels : 2, 2.5 ou 3 selon la sévérité voulue). L'intérêt décisif : contrairement au z-score classique basé sur moyenne et écart-type, la MAD n'est pas elle-même contaminée par les outliers qu'elle cherche à détecter. On ne se mord pas la queue.

En SQL, demandez à Claude de calculer médiane et MAD via **PERCENTILE_CONT(0.5)**, puis le z-robuste par ligne. Vérifiez un cas à la main : un point que vous *savez* aberrant doit ressortir.

## Le piège des deux divisions par zéro statistiques

Deux cas dégénérés à connaître :

- **MAD = 0** : si plus de la moitié des valeurs sont identiques, la MAD vaut zéro et le z-robuste explose (division par zéro). C'est fréquent sur des colonnes peu variées. Parade : se rabattre sur l'écart interquartile, ou traiter ce cas à part.
- **Sur-interprétation d'un petit échantillon** : la détection d'anomalies sur 12 lignes n'a aucun sens statistique. Vérifiez toujours le **n** avant de conclure.

## Corrélation n'est pas explication

Claude trouvera des corrélations à la pelle. Deux garde-fous permanents :

- Une corrélation peut être **fortuite** (faux positif) ou portée par un **facteur tiers** non observé. Ne la présentez jamais comme une cause.
- Les **agrégats cachent les sous-populations** (paradoxe de Simpson) : une tendance globale peut s'inverser dans chaque segment. Avant de conclure « le CA baisse », découpez par segment — il se peut que chaque segment monte et que seul le mix change.

## Le réflexe d'exploration assistée

Faites de Claude votre générateur de pistes, jamais votre source de vérité :

1. Demandez-lui **10 contrôles de qualité** sur la table (NULL, doublons, bornes, cardinalités, dates futures).
2. Faites-le **profiler** chaque colonne clé.
3. Demandez une **détection d'outliers par MAD**, pas par écart-type.
4. Pour chaque anomalie remontée, **inspectez les lignes brutes** : une anomalie statistique est une *hypothèse*, pas un fait. La confirmation vient toujours des données réelles.` + FOOTER,
    },
    {
      slug: "data-verifier-travail-ia",
      title: "Vérifier le travail de l'IA : le cœur du métier",
      description:
        "Requêtes de contrôle, recompute indépendant et tests qualité : la méthode qui transforme une sortie plausible en chiffre fiable.",
      duration_min: 26,
      is_free_preview: false,
      content_md:
        `## La leçon qui justifie toutes les autres

Tout ce qui précède sert à produire vite. Cette leçon sert à ne pas se tromper. C'est le cœur du parcours, et le réflexe qui sépare un analyste professionnel d'un presse-bouton : **un chiffre n'existe pas tant qu'il n'a pas été vérifié de façon indépendante.** Pas relu — vérifié, par un autre chemin.

Pourquoi « indépendant » ? Parce que relire la requête de Claude avec les yeux de Claude reproduit ses biais. Si l'erreur vient d'une hypothèse fausse (le montant est en centimes, la jointure duplique), la relire ne la révèle pas : il faut un second calcul qui *ne partage pas* cette hypothèse.

## Technique 1 : le recompute par un autre chemin

Le principe : obtenir le même chiffre par une méthode différente. Si les deux convergent, la confiance monte fortement. S'ils divergent, vous venez d'attraper un bug avant qu'il ne sorte.

Exemples concrets :

- Le CA total via **SUM(amount_cents)/100** sur **orders** doit égaler la somme des CA mensuels que vous calculez séparément avec un **GROUP BY mois**. Si le total annuel et la somme des 12 mois diffèrent, une commande tombe hors période (piège des fuseaux) ou un statut est mal filtré.
- Un **COUNT** de clients distincts via **COUNT(DISTINCT customer_id)** doit correspondre au nombre de lignes d'un **GROUP BY customer_id**.
- Un agrégat calculé en SQL doit retomber sur le même résultat recalculé dans un tableur ou en Python (pandas) sur un export du même périmètre.

Faites générer le recompute par Claude *dans une conversation séparée*, en reformulant la demande autrement, pour qu'il ne se contente pas de réécrire sa première requête.

## Technique 2 : les requêtes de contrôle (sanity checks)

Avant de croire un résultat, exécutez une batterie de contrôles qui doivent tous passer :

    -- Pas de doublons sur la clé censée être unique
    SELECT id, COUNT(*) FROM orders GROUP BY id HAVING COUNT(*) > 1;
    -- doit renvoyer 0 ligne

    -- Les montants restent dans des bornes plausibles
    SELECT COUNT(*) FROM orders WHERE amount_cents < 0 OR amount_cents > 100000000;
    -- doit renvoyer 0 (ou un nombre que vous expliquez)

    -- Pas de date dans le futur
    SELECT COUNT(*) FROM orders WHERE created_at > now();
    -- doit renvoyer 0

    -- La jointure n'a pas gonflé le volume
    SELECT COUNT(*) FROM orders;                 -- nombre de référence
    SELECT COUNT(*) FROM orders o JOIN items i   -- doit rester cohérent
      ON i.order_id = o.id;

Demandez à Claude de générer une dizaine de ces contrôles adaptés à votre schéma. Mais c'est **vous** qui décidez ce qu'est un résultat « normal » : Claude propose les tests, vous fixez les seuils d'alerte.

## Technique 3 : la réconciliation avec une source de vérité

Le contrôle le plus puissant compare votre résultat à une référence externe connue : le CA de la compta, le nombre d'utilisateurs facturés par le système de billing, un chiffre déjà publié au trimestre précédent. Si votre requête dit 1,28 M€ et que la compta dit 1,19 M€, l'écart de 90 k€ est une **piste**, pas un détail. Cherchez-le : remboursements ? TVA incluse ou non ? période décalée d'un jour ? La réconciliation transforme un chiffre isolé en chiffre défendable devant un directeur financier.

## Technique 4 : tester sur un cas dont vous connaissez la réponse

Le test le plus simple et le plus sous-utilisé. Prenez **un** client, **une** journée, **une** commande dont vous pouvez vérifier le résultat à la main ou dans une autre interface. Lancez la requête restreinte à ce périmètre. Si elle se trompe sur un cas que vous maîtrisez, elle se trompe à grande échelle — vous venez juste de le voir en clair.

## Le piège du « ça a l'air juste »

Un chiffre rond, un total plausible, un graphe lisse : rien de tout cela n'est une preuve. Les erreurs les plus coûteuses produisent des résultats *crédibles* — c'est précisément ce qui les rend coûteuses, car personne ne les questionne. Méfiez-vous particulièrement quand le résultat **confirme ce que vous espériez** : le biais de confirmation vous fera baisser la garde au pire moment.

## Et l'aplomb de Claude ?

Claude affirmera « le CA est de 1 284 312 € » avec exactement le même ton, qu'il ait raison ou tort. Il n'existe aucun signal fiable de confiance dans sa formulation. Deux pratiques utiles :

- Demandez-lui explicitement : « quelles hypothèses pourraient rendre ce résultat faux ? sous quelles conditions ta requête renverrait-elle un chiffre erroné ? ». Il génère alors lui-même la liste des choses à vérifier.
- Posez la même question dans une conversation neuve, sans son premier résultat sous les yeux. Si les deux chiffres divergent, vous tenez un problème.

## La checklist non négociable

Avant qu'un chiffre quitte votre écran :

1. **Recompute** par un autre chemin → convergent ?
2. **Sanity checks** (doublons, bornes, dates, volume de jointure) → tous au vert ?
3. **Réconciliation** avec une source de vérité → écart expliqué ?
4. **Cas connu** testé → résultat exact ?
5. **Hypothèses** de Claude relues → toutes valides sur vos données ?

Cinq cases. Tant qu'elles ne sont pas cochées, le chiffre n'est pas prêt — quelle que soit l'assurance avec laquelle l'IA l'a annoncé.` + FOOTER,
    },
    {
      slug: "data-synthese-dashboards",
      title: "Synthèse exécutive et dashboards qui parlent",
      description:
        "Transformer des chiffres vérifiés en décisions : storytelling data, visualisations honnêtes et anticipation des questions du décideur.",
      duration_min: 18,
      is_free_preview: false,
      content_md:
        `## Un chiffre juste mais mal raconté ne sert à rien

Vous avez généré du SQL fiable, profilé, détecté les anomalies, tout vérifié. Reste l'étape qui décide de l'impact : faire comprendre. Un décideur ne lit pas un tableau de 40 lignes ; il veut savoir **ce qui se passe, pourquoi, et ce qu'il doit décider**. Claude est excellent pour cette mise en forme — à condition de ne jamais le laisser rédiger sur des chiffres non vérifiés. La synthèse vient *après* la leçon 5, jamais avant.

## La pyramide inversée : conclusion d'abord

Un analyste débutant raconte sa démarche dans l'ordre chronologique. Un analyste senior commence par la **réponse**. Structurez toute synthèse ainsi :

1. **Le message principal en une phrase** : « Le CA Q2 progresse de 8 % mais uniquement porté par un client ; hors ce client, il recule de 3 %. »
2. **Les 3 chiffres qui le soutiennent.** Pas dix. Trois.
3. **L'implication / la décision** : « Risque de concentration — recommandation : sécuriser le contrat de ce client et relancer l'acquisition. »
4. **Le détail et la méthode**, en annexe, pour qui veut creuser.

Demandez à Claude de réécrire votre brouillon selon cette pyramide. Il est très bon pour hiérarchiser — vous gardez la main sur l'interprétation métier.

## Choisir le bon graphe (et un seul message par graphe)

Chaque type de question appelle un type de visuel :

- **Évolution dans le temps** → courbe.
- **Comparaison entre catégories** → barres (horizontales si beaucoup de catégories).
- **Composition d'un tout** → barres empilées ou treemap ; évitez le camembert dès qu'il y a plus de 4 ou 5 parts.
- **Relation entre deux variables** → nuage de points.

Règle d'or : **un graphe = un message**. Si vous ne pouvez pas titrer le graphe par la conclusion qu'il porte (« La croissance vient à 90 % d'un seul segment »), c'est qu'il en dit trop ou pas assez.

## Les visualisations honnêtes

Un dashboard peut mentir sans une seule donnée fausse. Les pièges à éviter — et à traquer dans ce que Claude produit :

- **Axe Y tronqué** : commencer un axe à 95 au lieu de 0 transforme une variation de 2 % en falaise spectaculaire. Pour des barres, l'axe part de zéro, sans exception.
- **Échelles incohérentes** entre deux graphes comparés côte à côte.
- **Double axe Y** qui suggère une corrélation fabriquée par le choix d'échelle.
- **Couleurs qui orientent** : du rouge sur un chiffre neutre crée une alarme injustifiée.

Une visualisation honnête laisse le lecteur tirer sa propre conclusion — elle ne la lui force pas par un artifice graphique.

## Anticiper les questions du décideur

C'est ce qui distingue une synthèse qui inspire confiance d'une qui se fait démonter en réunion. Avant de présenter, demandez à Claude :

    Tu es le directeur financier qui reçoit cette synthèse. Quelles sont les
    5 questions les plus dures que tu poserais ? Où attaquerais-tu la
    méthode ou les chiffres ?

Claude joue remarquablement bien ce rôle d'adversaire. Les questions classiques qu'il fera surgir : « ces chiffres incluent-ils les remboursements ? », « la hausse est-elle saisonnière ? », « comment se compare-t-on à l'an dernier sur la même période ? », « quel est l'intervalle d'incertitude ? ». Préparez une réponse chiffrée à chacune *avant* la réunion. La moitié de ces réponses sont des requêtes de contrôle que vous avez déjà écrites en leçon 5.

## Dire l'incertitude sans noyer le message

Un bon analyste ne cache pas les limites de ses données, mais ne les transforme pas non plus en brouillard. La bonne dose : une ligne honnête. « Chiffres arrêtés au 6 juin, hors commandes en attente de validation (~2 % du volume). » Cela protège votre crédibilité quand un écart apparaîtra plus tard — et il apparaîtra.

## Le mot de la fin : vous signez, pas l'IA

Quand vous présentez une synthèse, c'est **votre** nom dessus, pas celui de Claude. Il a accéléré la production, structuré le récit, joué l'avocat du diable. Mais la responsabilité du chiffre est la vôtre, et c'est exactement pour cela que le fil rouge de ce parcours n'est pas négociable : **Claude est un bras droit puissant ; la vérification, le jugement et la signature restent humains.** C'est ce qui fait de vous un analyste augmenté plutôt qu'un relais d'erreurs bien présentées.` + FOOTER,
    },
  ],
};
