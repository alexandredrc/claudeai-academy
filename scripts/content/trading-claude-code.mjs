// =========================================
// Parcours « Trading + Claude Code »
// Contenu original (non plagié), inspiré des bonnes pratiques publiques :
//   - Doc officielle Claude Code (platform.claude.com / docs Claude Code)
//   - Principes quant établis (biais de backtest, gestion du risque)
// Cadre : on construit de l'OUTILLAGE avec Claude Code. AUCUN conseil
// financier, aucune stratégie « clé en main ». Disclaimer dans la leçon 1.
// =========================================

const FOOTER = `

---

**Sources & méthode** · Doc officielle *Claude Code* (Anthropic) pour les capacités de l'outil ; principes quantitatifs établis de la littérature backtest/risk (biais de look-ahead, survivorship, overfitting, slippage). Contenu original rédigé pour ClaudeAI Academy — aucune reproduction de source tierce.

**Avertissement** · Ce parcours est *éducatif* et *technique*. Il enseigne à construire des outils avec Claude Code. Il ne constitue **pas un conseil en investissement**, ne recommande aucune stratégie ni aucun actif, et ne garantit aucun résultat. Les performances passées ne préjugent pas des performances futures. Vous restez seul responsable de vos décisions.`;

export const tradingClaudeCode = {
  slug: "trading-claude-code",
  title: "Trading + Claude Code : ton arsenal quant",
  description:
    "Utiliser Claude Code comme pair-programmeur pour bâtir des backtests honnêtes, une gestion du risque codée proprement et une recherche automatisée. Outillage technique — pas de conseil financier.",
  tier_required: "mastery",
  display_order: 6,
  estimated_duration_min: 180,
  lessons: [
    {
      slug: "claude-code-outil-pas-oracle",
      title: "Claude Code pour un trader : outil, pas oracle",
      description:
        "Le bon cadrage : on ne demande pas à l'IA quoi acheter, on lui fait construire la machine qui exécute votre méthode.",
      duration_min: 15,
      is_free_preview: true,
      content_md:
        `## La mauvaise question

La première chose que la plupart des gens font avec une IA et les marchés, c'est lui demander : « le BTC va monter ? », « quelle action acheter ? ». C'est la pire utilisation possible, pour deux raisons.

D'abord, un modèle de langage **n'a pas d'avantage prédictif** sur des prix. Il produit une réponse plausible, pas une réponse informée. Lui demander une prédiction, c'est transformer une devinette en quelque chose qui *a l'air* d'une analyse — le pire des deux mondes.

Ensuite, ça vous déresponsabilise. Le marché ne paie pas les opinions, il paie le **processus** : une idée testable, un risque maîtrisé, une exécution disciplinée. Aucune de ces trois choses ne se délègue à un oracle.

## Le bon cadrage

Claude Code n'est pas un oracle, c'est un **pair-programmeur senior dans votre terminal**. Il lit votre dépôt, écrit du code, lance vos scripts, corrige ses erreurs. Vous apportez l'edge et le jugement ; lui construit la machine, dix fois plus vite que vous seul.

La bascule mentale tient en une phrase :

> On ne demande pas à Claude *ce qu'il faut faire sur le marché*. On lui fait *construire les outils* qui exécutent et vérifient votre méthode.

## Ce qu'un trader a réellement besoin de construire

Regardez ce qui sépare un amateur d'un opérateur sérieux : ce n'est pas le « setup secret », c'est l'**outillage**.

- Un **backtest honnête** pour savoir si une idée tient hors de votre imagination.
- Un **module de risque** qui calcule la taille de position et refuse les expositions dangereuses.
- Un **pipeline de données** fiable et daté (point-in-time).
- Un **tableau de bord** pour suivre performance, drawdown, exposition.
- Un **journal** structuré pour apprendre de vos trades au lieu de les oublier.

Chacun de ces blocs est du code. Et écrire ce code, c'est exactement ce que Claude Code fait le mieux.

## Pourquoi Claude Code et pas un simple chat

Trois différences décisives pour ce travail :

1. **Il agit sur vos fichiers et lance des commandes.** Il ne vous donne pas un bout de code à recopier : il crée le fichier, installe la dépendance, lance le backtest, lit l'erreur, corrige.
2. **Il garde le contexte du projet.** Votre logique de risque, vos conventions, vos données — il s'y réfère au lieu de repartir de zéro à chaque message.
3. **Il boucle.** Tester → échouer → corriger → re-tester est précisément la boucle d'un développement quant. C'est sa zone de confort.

## Disclaimer (à lire, vraiment)

Ce parcours est **éducatif et technique**. On construit des outils. Rien ici n'est un conseil en investissement, une recommandation d'actif ou une stratégie garantie. L'IA se trompe, hallucine, et n'a aucune obligation de prudence à votre place. **Chaque décision reste la vôtre**, et le risque de perte sur les marchés est réel.

## La règle qui structure tout le parcours

Gardez celle-ci en tête à chaque leçon :

> **L'IA construit et vérifie. L'humain décide et engage le capital.** La frontière ne bouge jamais.

Dans les leçons suivantes, on construit concrètement : un backtest qui ne ment pas, un module de risque propre, puis l'automatisation de la recherche — toujours avec les garde-fous.` +
        FOOTER,
    },
    {
      slug: "backtester-sans-se-mentir",
      title: "Backtester sans se mentir",
      description:
        "Les 4 biais qui rendent 90 % des backtests faux, et comment faire construire par Claude Code un backtest honnête puis le torturer.",
      duration_min: 22,
      is_free_preview: false,
      content_md:
        `## La belle courbe qui ment

N'importe qui peut produire une courbe d'equity magnifique. Il suffit de tester assez de variantes sur les mêmes données jusqu'à en trouver une qui « marche ». Le problème : cette courbe décrit le **passé que vous avez sur-ajusté**, pas le futur que vous tradez.

Un backtest n'a qu'une seule utilité : **vous empêcher de perdre de l'argent sur une idée qui ne tient pas**. Pour ça, il doit être honnête. Et l'honnêteté, en backtest, se résume à éliminer quatre tueurs.

## Les 4 tueurs

**1. Le look-ahead bias.** Utiliser, à l'instant T, une information qui n'était pas disponible à T. Le cas classique : calculer un signal avec la clôture du jour puis « entrer » à l'ouverture… du même jour. Ou utiliser des données révisées a posteriori. Règle : à chaque barre, le backtest ne voit *que* ce qui était connu à cet instant.

**2. Le survivorship bias.** Tester une stratégie actions sur l'univers actuel du S&P 500, c'est ne tester que sur les survivants — les faillites et les sorties d'indice ont disparu. Vos résultats sont gonflés mécaniquement. Il faut un univers *point-in-time*.

**3. L'overfitting.** Plus vous ajoutez de paramètres et plus vous les optimisez, plus vous décrivez le bruit. Une stratégie à 8 paramètres « parfaitement réglés » est presque toujours une illusion. Le test de vérité : la performance tient-elle **hors échantillon** et sur des paramètres *voisins* ?

**4. Les coûts ignorés.** Spread, slippage, frais, impact. Une stratégie haute fréquence brillante « avant coûts » est souvent perdante après. Tout backtest sans modèle de coût réaliste est une fiction.

## Faire construire un backtest honnête par Claude Code

Le secret n'est pas de demander « code-moi un backtest ». C'est de lui donner le **cahier des charges anti-biais**. Exemple de prompt à lui donner :

    Construis un backtest vectorisé en Python (pandas) pour cette règle d'entrée/sortie.
    Contraintes NON NÉGOCIABLES :
    - Aucune donnée future : le signal à la barre t n'utilise que les données <= t,
      et l'exécution se fait à l'ouverture de t+1.
    - Modèle de coûts : commission paramétrable + slippage = k * ATR.
    - Découpe in-sample / out-of-sample (70/30), n'optimise QUE sur l'in-sample.
    - Sorties : CAGR, max drawdown, Sharpe, % winners, nombre de trades,
      et la courbe d'equity out-of-sample séparée.
    Explique chaque hypothèse que tu prends.

Le squelette qu'il produira ressemblera à ça (volontairement simple) :

    signal = rule(data).shift(1)        # décalage = pas de look-ahead
    ret    = data["open"].pct_change().shift(-1)
    cost   = commission + k * data["atr"]
    pnl    = signal * ret - signal.diff().abs() * cost
    equity = (1 + pnl).cumprod()

Le **shift(1)** sur le signal et l'exécution à t+1 sont la différence entre un backtest honnête et une machine à illusions. Faites-en une obsession, et faites-la vérifier explicitement par Claude Code à chaque fois.

## « Beat the idea to death »

Un backtest qui passe une fois ne prouve rien. La discipline pro, c'est de **tout faire pour casser l'idée**. Demandez à Claude Code de :

- **Balayer les paramètres voisins** : si la perf s'effondre quand vous bougez un seuil de 10, c'est de l'overfit.
- **Faire un test null** : remplacer votre signal par des entrées aléatoires de même fréquence. Si l'aléatoire fait presque aussi bien, votre edge est imaginaire.
- **Monte-Carlo sur l'ordre des trades** : ré-échantillonner la séquence des trades pour estimer la distribution du drawdown. Le pire cas est souvent bien pire que celui du backtest unique.
- **Walk-forward** : ré-optimiser sur une fenêtre glissante et tester sur la suivante, en continu.

Si l'idée survit à ça, elle mérite peut-être un petit capital réel. Si elle meurt, vous venez d'économiser cet argent.

## Le réflexe à garder

> Un bon backtest ne cherche pas à *valider* votre idée. Il cherche à la *tuer*. Ce qui survit a une chance.` +
        FOOTER,
    },
    {
      slug: "coder-le-risque-sizing-et-stops",
      title: "Coder le risque : sizing et stops",
      description:
        "La seule variable que vous contrôlez vraiment, c'est le risque. On la code proprement avec Claude Code : fixed-fractional, ATR, et les pièges de Kelly.",
      duration_min: 18,
      is_free_preview: false,
      content_md:
        `## La seule chose que vous contrôlez

Vous ne contrôlez pas si un trade gagne. Vous contrôlez **combien vous perdez s'il perd**. C'est tout, et c'est énorme : la gestion du risque est la seule variable sous votre maîtrise totale. La coder proprement vaut plus que n'importe quel « signal ».

L'objectif d'un module de risque : transformer une décision émotionnelle (« je mets combien ? ») en **règle déterministe et testable**.

## Trois méthodes de sizing, du plus sûr au plus agressif

**1. Fixed-fractional (le défaut raisonnable).** Vous risquez un pourcentage fixe de votre capital par trade — souvent 0,5 % à 1 %. La taille de position se déduit de la distance au stop :

    risque_€      = equity * risque_pct          # ex. 1 %
    risque_unit   = abs(prix_entree - prix_stop)  # perte par unité
    taille        = risque_€ / risque_unit

Conséquence vertueuse : plus votre stop est large, plus la position est petite. Le risque par trade reste constant quoi qu'il arrive.

**2. Stop basé sur l'ATR.** Plutôt qu'un stop arbitraire, on le place à un multiple de l'**Average True Range** (la volatilité récente). Un stop à 2×ATR s'adapte : large quand le marché est agité, serré quand il est calme. Couplé au fixed-fractional, ça donne un sizing qui **respire avec la volatilité**.

**3. Kelly (et pourquoi vous n'utiliserez pas le Kelly plein).** Le critère de Kelly donne la fraction théoriquement optimale pour maximiser la croissance. En pratique, le Kelly plein est **beaucoup trop agressif** : il suppose que vous connaissez exactement vos probabilités (vous ne les connaissez pas) et produit des drawdowns insupportables. La pratique sérieuse utilise un **Kelly fractionnaire** (un quart, un demi) — et beaucoup d'opérateurs s'en tiennent au fixed-fractional, plus robuste à l'incertitude.

## Faire coder le module par Claude Code

Le cahier des charges à lui donner doit rendre le risque **impossible à contourner** :

    Écris un module position_sizing.py avec :
    - size_fixed_fractional(equity, risk_pct, entry, stop)
    - un stop ATR : stop = entry - mult * atr (configurable)
    - un PLAFOND DUR : aucune position ne peut risquer plus de max_risk_pct
    - un plafond d'exposition corrélée : somme du risque sur actifs corrélés <= cap
    - des tests : un trade à stop large doit donner une position plus petite ;
      dépasser le plafond doit lever une erreur, pas l'ignorer.

Le point critique : le **plafond doit être une erreur, pas un avertissement**. Un garde-fou qu'on peut ignorer n'est pas un garde-fou. Faites écrire les tests par Claude Code en premier, puis le code qui les fait passer.

## L'exposition corrélée, le piège qu'on oublie

Risquer 1 % sur dix actifs qui montent et descendent ensemble, ce n'est pas dix paris à 1 % : c'est **un pari à 10 %** déguisé. Votre module doit regrouper les positions corrélées et plafonner le risque agrégé. Demandez à Claude Code d'estimer les corrélations récentes et de refuser tout ajout qui ferait dépasser le cap.

## Le réflexe à garder

> Décidez de votre risque **avant** d'entrer, codez-le en dur, et ne le négociez jamais en cours de trade. La taille de position est une règle, pas une humeur.

*(Rappel : ceci est de l'outillage technique, pas un conseil financier. Les chiffres cités sont illustratifs.)*` +
        FOOTER,
    },
    {
      slug: "automatiser-la-recherche-et-garde-fous",
      title: "Automatiser la recherche : data, dashboards & garde-fous",
      description:
        "Faire construire par Claude Code un pipeline de données daté, un tableau de bord, et poser la ligne rouge : l'IA n'exécute jamais seule.",
      duration_min: 22,
      is_free_preview: false,
      content_md:
        `## De l'outil isolé au système

Vous avez un backtest honnête et un module de risque. La couche suivante, c'est de **relier le tout** en un système de recherche que vous alimentez chaque semaine sans tout refaire à la main. Claude Code excelle à cet assemblage.

## 1. Un pipeline de données daté

La donnée est le fondement — et la source n°1 de biais. Faites construire un pipeline qui :

- **ingère** prix et, si besoin, fondamentaux depuis une source fiable ;
- **stocke** localement (Parquet ou SQLite) pour la reproductibilité ;
- **horodate** chaque enregistrement pour garantir le *point-in-time* (savoir ce qui était connu, et quand) ;
- **valide** : trous, doublons, splits/dividendes mal appliqués, valeurs aberrantes.

Le prompt-clé : demandez explicitement à Claude Code d'ajouter une étape de **validation qui échoue bruyamment** si la donnée est suspecte. Une donnée silencieusement fausse coûte plus cher qu'un pipeline qui plante.

## 2. Un tableau de bord

Une fois la donnée et le backtest en place, un dashboard transforme des chiffres en décisions. Demandez à Claude Code un tableau (par exemple en Streamlit) qui affiche :

- courbe d'equity et **drawdown** (le vrai juge de paix) ;
- exposition courante et risque agrégé par actif/corrélation ;
- distribution des trades, et les pires séries ;
- un onglet « santé des données » qui remonte les anomalies du pipeline.

Claude Code génère l'ossature en quelques minutes ; vous itérez sur ce qui vous est *utile pour décider*, pas sur la déco.

## 3. Connecter Claude à vos données (MCP) — prudemment

Claude Code peut se brancher à des outils et sources via des serveurs **MCP** (Model Context Protocol) : interroger votre base, lire vos rapports, lancer une analyse. C'est puissant pour la **recherche** (résumer, repérer, recouper). Deux règles :

- **Lecture d'abord.** Donnez des accès en lecture pour l'analyse ; n'ouvrez l'écriture qu'à des actions réversibles et bien cadrées.
- **Jamais le carnet d'ordres.** Aucune connexion qui laisse un modèle passer un ordre réel sans validation humaine explicite. C'est la ligne rouge.

## 4. Les garde-fous (la partie qui vous protège de vous-même)

C'est la leçon la plus importante du parcours.

- **Séparez outillage et décision.** L'IA prépare, calcule, alerte. Elle **n'engage jamais le capital**. Un humain valide chaque ordre.
- **Loggez tout.** Chaque signal, chaque taille, chaque décision, avec sa raison. Votre journal est votre seule vraie source d'apprentissage.
- **Méfiez-vous de la fluidité.** Une réponse d'IA bien écrite *paraît* fiable. Vérifiez les chiffres, surtout quand ils vous arrangent.
- **Un kill-switch.** Tout automate de recherche doit pouvoir être coupé instantanément, et ne jamais agir hors d'enveloppes de risque définies à l'avance.

## La discipline qui fait la différence

> Automatisez la **recherche** et la **surveillance**, jamais le **jugement**. L'objectif n'est pas que l'IA trade à votre place — c'est qu'elle vous rende plus rapide, plus rigoureux et plus honnête que vous ne le seriez seul.

## Pour aller plus loin

Vous avez désormais l'arsenal : cadrage, backtest honnête, risque codé, recherche automatisée et garde-fous. La suite, ce sont *vos* idées — passées dans cette machine qui les teste sans complaisance.

*(Rappel : parcours éducatif et technique. Aucun conseil en investissement. Vous restez responsable de chaque décision.)*` +
        FOOTER,
    },
  ],
};
