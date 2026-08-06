// =========================================
// Parcours « Trading + Claude Code »
// Contenu original (non plagié), inspiré des bonnes pratiques publiques :
//   - Doc officielle Claude Code (code.claude.com/docs/en/…)
//   - Doc API / prompt engineering Anthropic (platform.claude.com/docs/en/…)
//   - Principes quant établis (biais de backtest, gestion du risque)
// Vérifié le 2026-08-06 · Claude Code 2.1.223 · Opus 5 modèle Opus par défaut.
// Cadre : on construit de l'OUTILLAGE avec Claude Code. AUCUN conseil
// financier, aucune stratégie « clé en main ». Disclaimer dans la leçon 1.
// =========================================

const FOOTER = `

---

**Sources & méthode** · Vérifié le **6 août 2026** — Claude Code **2.1.223**, **Opus 5** modèle Opus par défaut depuis le 24/07/2026. Doc officielle : \`code.claude.com/docs/en/changelog\`, \`code.claude.com/docs/en/costs\` ; prompt engineering Opus 5 : \`platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5\` ; « The new rules of context engineering for Claude 5 generation models » et « Building verification loops in Claude Code with skills » (\`claude.com/blog\`). Côté quant : principes établis de la littérature backtest/risk (look-ahead, survivorship, overfitting, slippage). Contenu original rédigé pour ClaudeAI Academy — aucune reproduction de source tierce.

**Avertissement** · Ce parcours est *éducatif* et *technique*. Il enseigne à construire des outils avec Claude Code. Il ne constitue **pas un conseil en investissement**, ne recommande aucune stratégie ni aucun actif, ne présente aucune stratégie comme gagnante et ne garantit aucun résultat. **Les performances passées ne préjugent en rien des performances futures** et le risque de perte, y compris totale, est réel. Tu restes seul responsable de tes décisions.`;

export const tradingClaudeCode = {
  slug: "trading-claude-code",
  title: "Trading + Claude Code : ton arsenal quant",
  description:
    "Utiliser Claude Code comme pair-programmeur pour bâtir des backtests honnêtes, une gestion du risque codée proprement et une recherche automatisée — avec les coûts et les garde-fous réels. Outillage technique, aucun conseil financier.",
  tier_required: "mastery",
  display_order: 7,
  estimated_duration_min: 195,
  lessons: [
    {
      slug: "claude-code-outil-pas-oracle",
      title: "Claude Code pour un trader : outil, pas oracle",
      description:
        "Le bon cadrage : on ne demande pas à l'IA quoi acheter, on lui fait construire la machine qui teste ta méthode. Avec ce que ça coûte et ce que ça ne protège pas.",
      duration_min: 20,
      is_free_preview: true,
      content_md:
        `:::objectifs
- Cadrer Claude Code comme un outil de construction, jamais comme une source de prédiction
- Identifier les cinq briques d'outillage qu'un opérateur sérieux doit posséder
- Amorcer un dépôt de recherche avec un CLAUDE.md **léger** — et savoir ce qu'il ne doit surtout pas contenir
- Estimer ce que coûte une journée de travail avec Claude Code avant de lancer des backtests en boucle
:::

:::flash
Claude Code n'a aucun avantage prédictif sur un prix. Ce qu'il fait très bien, c'est écrire, lancer et corriger le code qui teste ta méthode. Au 6 août 2026 il est en version **2.1.223** et tourne sur **Opus 5** (contexte 1M, réflexion activée par défaut) comme modèle Opus par défaut. La frontière qui structure tout le parcours : l'IA construit, l'humain décide et engage le capital.
:::

## La mauvaise question

La première chose que la plupart des gens font avec une IA et les marchés, c'est lui demander : « le BTC va monter ? », « quelle action acheter ? ». C'est la pire utilisation possible, et pour une raison technique, pas morale.

Un modèle de langage **n'a aucun avantage prédictif** sur un prix. Il produit une réponse plausible, pas une réponse informée. Lui demander une prédiction, c'est transformer une devinette en quelque chose qui *a l'air* d'une analyse — le pire des deux mondes, parce que tu vas la croire.

:::piege La fluidité n'est pas de la fiabilité
Une réponse bien écrite, structurée, avec des chiffres ronds et un ton assuré déclenche exactement le même sentiment de confiance qu'un vrai rapport d'analyste. Rien ne garantit pourtant l'origine de ces chiffres. **À faire à la place** : ne demande jamais un jugement de marché, demande du code qui produit un chiffre que tu peux recalculer toi-même.
:::

Et surtout, la question « ça va monter ? » te déresponsabilise. Le marché ne paie pas les opinions, il paie le **processus** : une idée testable, un risque maîtrisé, une exécution disciplinée. Aucune de ces trois choses ne se délègue à un oracle.

## Le bon cadrage

Claude Code n'est pas un oracle, c'est un **pair-programmeur senior dans ton terminal**. Il lit ton dépôt, écrit du code, lance tes scripts, corrige ses erreurs. Tu apportes l'idée et le jugement ; lui construit la machine, bien plus vite que toi seul.

:::cle La bascule mentale
On ne demande pas à Claude *ce qu'il faut faire sur le marché*. On lui fait *construire les outils* qui exécutent et vérifient ta méthode. Tout le reste du parcours découle de cette seule phrase.
:::

## Les cinq briques à construire

Ce qui sépare un amateur d'un opérateur sérieux, ce n'est pas le « setup secret », c'est l'**outillage**. Cinq briques, toutes en code :

| Brique | Ce qu'elle t'évite | Traitée en |
| --- | --- | --- |
| **Backtest honnête** | Miser sur une idée qui n'existe que dans ta tête | leçon 2 |
| **Module de risque** | Une seule position qui efface six mois de travail | leçon 3 |
| **Pipeline de données daté** | Des résultats faux à cause de données révisées après coup | leçon 4 |
| **Tableau de bord** | Découvrir un drawdown trop tard | leçon 4 |
| **Journal structuré** | Répéter la même erreur sans jamais la voir | leçon 4 |

Chacune de ces briques est du code ordinaire. Et écrire du code ordinaire, correctement testé, c'est exactement ce que Claude Code fait le mieux.

### Pourquoi Claude Code et pas un simple chat

Trois différences décisives pour ce travail :

1. **Il agit sur tes fichiers et lance des commandes.** Il ne te donne pas un bout de code à recopier : il crée le fichier, installe la dépendance, lance le backtest, lit la trace d'erreur, corrige.
2. **Il garde le contexte du projet.** Ta logique de risque, tes conventions, tes données — il s'y réfère au lieu de repartir de zéro à chaque message.
3. **Il boucle.** Tester → échouer → corriger → re-tester est précisément la boucle d'un développement quant. C'est sa zone de confort.

## Ce qui a changé cet été

:::maj 24 juillet 2026
**Opus 5** devient le modèle Opus par défaut dans Claude Code : contexte **1 million de tokens**, **réflexion étendue activée par défaut**, fast mode à 10 $ / 50 $ par million de tokens (l'ancien Opus 4.7 en est retiré). En pratique, tu peux lui faire avaler un long rapport de backtest et une bonne partie de ton dépôt dans la même session.
:::

Le reste des changements de l'été touche des commandes que tu as peut-être vues dans des tutos plus anciens :

| Ce que tu as pu lire ailleurs | État au 6 août 2026 |
| --- | --- |
| La commande \`ultraplan\` | **Supprimée** le 4 août (2.1.222) |
| \`/review\` est une commande distincte | **Alias de \`/code-review\`** depuis le 6 août (2.1.223) |
| Claude lance \`/verify\` et \`/code-review\` tout seul | **Non**, comportement retiré le 19 juillet (2.1.215) |
| Claude peut déclencher \`/deep-research\` | **Lancement manuel uniquement** depuis le 22 juillet |
| Version de Claude Code | **2.1.223** |

:::astuce Vérifie ta version avant de suivre un tuto
\`claude --version\`. Beaucoup de contenus « trading + IA » qui circulent datent d'avant juillet 2026 et décrivent des commandes qui n'existent plus. Si un tuto te fait taper \`ultraplan\`, il a au moins un mois de retard — méfie-toi aussi du reste de ses affirmations.
:::

## Le piège du prompt « fais-toi vérifier »

Un réflexe très répandu consiste à finir ses prompts par « ajoute une étape de vérification finale » ou « fais relire ton code par un sous-agent ». Sur un projet qui manipule de l'argent, la tentation est maximale : on veut de la rigueur, alors on en demande deux fois.

:::piege « Ajoute une étape de vérification finale »
La doc officielle de prompt engineering pour Opus 5 demande explicitement de **retirer** ces instructions. Le modèle vérifie déjà son travail ; le lui redemander provoque de la **sur-vérification** : plus de tokens, plus de temps, pas plus de justesse. **À faire à la place** : mets la vérification dans le *code* — des tests, des assertions, un jeu de données de contrôle dont tu connais le résultat à l'avance. Une assertion ne flatte personne.
:::

Même logique pour ton \`CLAUDE.md\` : garde-le **léger**. Anthropic a supprimé plus de 80 % du system prompt de Claude Code pour les modèles de la génération 5 sans perte de performance mesurable. Un fichier de consignes de 400 lignes n'ajoute pas de rigueur, il dilue le contexte utile.

:::prompt Amorcer un dépôt de recherche quantitative
Tu travailles dans un dépôt de recherche quantitative personnelle.
Stack : Python 3.12, pandas, pytest. Les données brutes sont en lecture seule dans data/raw.
Règles du dépôt :
- Aucun code de ce dépôt ne passe d'ordre chez un courtier. Rien ne doit jamais appeler une API de trading, même en environnement de démonstration.
- Toute fonction qui calcule une taille de position ou un P&L est accompagnée de tests.
- Les hypothèses (frais, slippage, fuseau horaire, source et date des données) sont écrites en tête de chaque script.
Commence par lire l'arborescence et propose-moi un plan en 5 lignes. Ne code rien avant que je valide.
:::

## Ce que ça coûte

Personne n'en parle, et ça devient concret dès la leçon 2 quand tu enchaînes les backtests.

:::chiffres
13 $ | par développeur et par jour actif, repère officiel Anthropic
7× | les tokens d'une session « agent teams » face à une session standard
1 h | durée de vie du cache sur abonnement — 5 min seulement en clé API
:::

Trois conséquences pratiques :

- Les **agent teams** sont **désactivées par défaut** (\`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1\` pour les activer). Vu le facteur 7 sur les tokens, laisse-les désactivées tant que tu n'as pas une raison précise.
- Sur abonnement, regroupe tes sessions de backtest dans la **même heure** : le cache tient 1 h et tes gros fichiers de données ne sont pas refacturés plein tarif à chaque relance. En clé API, le cache tombe à 5 min — le calcul change complètement.
- \`/usage\` te donne le cumul, mais il **repart de zéro à chaque \`/clear\`** depuis la version 2.1.211. Relève le chiffre avant de nettoyer, sinon tu perds ta comptabilité.

## Sécurité : ton dépôt touche à de l'argent

Un dépôt de recherche quantitative contient souvent des choses qu'on ne veut pas voir traîner : clés d'API de données, exports de portefeuille, parfois pire. Et tu vas y laisser un agent écrire et exécuter du code.

:::piege Une allowlist Bash n'est pas une frontière de sécurité
Entre le **18 juillet et le 6 août 2026**, au moins cinq contournements des permissions Bash ont été corrigés dans Claude Code : conditionnels regex zsh, guillemets PowerShell mal gérés, hooks PreToolUse qui contournaient les restrictions d'outils, commandes forgées masquant une partie d'elles-mêmes par tabulation ou caractère Unicode invisible. **À faire à la place** : traite ton allowlist comme de la **défense en profondeur**, garde Claude Code à jour, et ne place jamais une clé d'API de courtier dans un dépôt où un agent travaille.
:::

## Le disclaimer, à lire vraiment

Ce parcours est **éducatif et technique**. On construit des outils. Rien ici n'est un conseil en investissement, une recommandation d'actif, ni une stratégie présentée comme gagnante. **Les performances passées ne préjugent en rien des performances futures.**

L'IA se trompe, invente, et n'a aucune obligation de prudence à ta place. **Chaque décision reste la tienne**, et le risque de perte sur les marchés est réel — y compris la perte totale du capital engagé.

:::cle La règle qui ne bouge jamais
**L'IA construit et vérifie. L'humain décide et engage le capital.** Si un outil que tu construis efface cette frontière, c'est l'outil qui est faux, pas la règle.
:::

Dans les leçons suivantes, on construit concrètement : un backtest qui ne ment pas, un module de risque propre, puis l'automatisation de la recherche — toujours avec les garde-fous.

:::defi 20 min — Poser le cadre avant la première ligne de code
Crée le dépôt qui servira aux trois leçons suivantes et amorce-le avec Claude Code, sans écrire une seule ligne de stratégie.
- \`claude --version\` renvoie 2.1.223 ou plus récent
- Le dépôt existe, avec un dossier \`data/raw\` et un dossier \`tests\`
- Un \`CLAUDE.md\` de moins de 30 lignes : stack, règles du dépôt, interdiction explicite d'appeler une API de courtier
- Ton \`CLAUDE.md\` ne contient **aucune** instruction du type « vérifie ton travail » ou « fais relire par un sous-agent »
- Aucun secret dans le dépôt : les clés d'API sont hors du dossier ou dans un \`.env\` ignoré par git
- Le README dit en une phrase ce que tu cherches à tester — et cette phrase ne contient aucune promesse de rendement
:::

:::memo
Q: Pourquoi ne pas demander à Claude si un actif va monter ?
R: Un modèle de langage n'a aucun avantage prédictif sur un prix. Il produit du plausible, pas de l'informé.
===
Q: Quel modèle Opus Claude Code utilise-t-il par défaut au 6 août 2026, et dans quelle version ?
R: Opus 5 depuis le 24 juillet, contexte 1M et réflexion activée par défaut. Claude Code est en 2.1.223.
===
Q: Faut-il écrire « ajoute une étape de vérification finale » dans ses prompts ?
R: Non. La doc Opus 5 demande de retirer ces instructions, qui provoquent de la sur-vérification. La vérification va dans le code, pas dans le prompt.
===
Q: Une allowlist Bash protège-t-elle un dépôt qui manipule de l'argent ?
R: Non, c'est de la défense en profondeur. Au moins cinq contournements ont été corrigés entre le 18 juillet et le 6 août 2026.
===
Q: Où passe la frontière entre l'IA et toi ?
R: L'IA construit et vérifie. Toi seul décides et engages le capital.
:::` +
        FOOTER,
    },
    {
      slug: "backtester-sans-se-mentir",
      title: "Backtester sans se mentir",
      description:
        "Les 4 biais qui rendent la plupart des backtests faux, comment faire construire un backtest honnête par Claude Code, puis comment le torturer — sans exploser ta facture de tokens.",
      duration_min: 26,
      is_free_preview: false,
      content_md:
        `:::objectifs
- Nommer les quatre biais qui rendent un backtest faux et les repérer dans du code existant
- Monter un environnement de backtest reproductible avec Claude Code
- Écrire un cahier des charges anti-biais plutôt qu'un « code-moi un backtest »
- Torturer une idée avec quatre tests de robustesse avant de lui accorder le moindre crédit
- Garder le coût en tokens sous contrôle quand tu enchaînes les runs
:::

:::flash
Une belle courbe d'equity ne prouve rien : elle décrit le passé que tu as sur-ajusté. Un backtest sert à **tuer** une idée, pas à la valider. Quatre biais font l'essentiel des dégâts — look-ahead, survivance, surapprentissage, coûts ignorés — et Claude Code ne les élimine pas tout seul : c'est ton cahier des charges qui les élimine. Rien de tout ceci n'est un conseil financier.
:::

## La belle courbe qui ment

N'importe qui peut produire une courbe d'equity magnifique. Il suffit de tester assez de variantes sur les mêmes données jusqu'à en trouver une qui « marche ». Le problème : cette courbe décrit le **passé que tu as sur-ajusté**, pas le futur dans lequel tu vas engager de l'argent.

Un backtest n'a qu'une seule utilité : **t'empêcher d'engager de l'argent sur une idée qui ne tient pas**. Pour ça, il doit être honnête. Et l'honnêteté, en backtest, se résume à éliminer quatre tueurs.

:::cle Un backtest est un test de rejet
Il ne dit jamais « cette stratégie gagne ». Au mieux, il dit « je n'ai pas réussi à la casser avec ce que j'ai essayé ». La différence entre les deux phrases, c'est tout ton capital.
:::

## Les quatre tueurs

| Biais | Le symptôme | La parade dans le code |
| --- | --- | --- |
| **Look-ahead** | Résultats trop réguliers, Sharpe irréaliste | Décaler le signal, exécuter à la barre suivante |
| **Survivance** | Backtest actions qui ne perd jamais gros | Univers *point-in-time*, faillites incluses |
| **Surapprentissage** | Perf qui s'effondre dès qu'on bouge un seuil | In-sample / out-of-sample, balayage de paramètres |
| **Coûts ignorés** | Stratégie brillante « avant frais » | Commission + slippage modélisés, toujours |

Le premier est le plus vicieux parce qu'il se cache dans une seule ligne de code.

:::piege Look-ahead : le signal calculé sur la barre où tu entres
Calculer un signal avec la clôture du jour puis « entrer » à l'ouverture… du même jour. Ou nourrir le backtest avec des données révisées après coup (fondamentaux corrigés, prix ajustés rétroactivement). **À faire à la place** : à chaque barre, le backtest ne voit *que* ce qui était connu à cet instant, et l'exécution a lieu à la barre suivante. Fais-le vérifier par un test qui échoue si une colonne future fuit dans le calcul du signal.
:::

Le deuxième ne se voit jamais dans le code : il est dans le fichier de données que tu as téléchargé.

:::piege Survivance : tester sur l'univers d'aujourd'hui
Tester une stratégie actions sur la composition **actuelle** du S&P 500, c'est ne tester que sur les survivants — les faillites et les sorties d'indice ont disparu du fichier. Les résultats sont gonflés mécaniquement, et personne ne s'en aperçoit. **À faire à la place** : un univers *point-in-time*, qui contient à chaque date les titres réellement présents ce jour-là, radiations comprises. Si ta source ne le permet pas, écris-le noir sur blanc dans les hypothèses du script.
:::

Le troisième est le plus insidieux, parce que c'est toi qui le fabriques, un paramètre après l'autre.

:::piege Surapprentissage : la stratégie à huit paramètres « parfaitement réglés »
Plus tu ajoutes de paramètres et plus tu les optimises, plus tu décris le bruit. Une courbe parfaite sur 8 paramètres est presque toujours une illusion. **À faire à la place** : deux tests de vérité, la performance tient-elle **hors échantillon**, et tient-elle sur des paramètres **voisins** ? Si déplacer un seuil de 20 à 22 fait s'effondrer le résultat, tu n'as pas une stratégie, tu as une coïncidence.
:::

Le quatrième est le plus facile à corriger — et le plus souvent oublié.

:::piege Coûts ignorés : le slippage n'est pas une option
Spread, slippage, commissions, impact de marché. Une stratégie qui multiplie les allers-retours peut être brillante avant coûts et nettement perdante après. **À faire à la place** : un modèle de coût dès le premier run, jamais « on l'ajoutera plus tard ». Et teste la sensibilité : si doubler le slippage tue la stratégie, elle était déjà morte.
:::

## Monter l'environnement de backtest

Avant de demander quoi que ce soit à Claude Code, donne-lui un terrain reproductible. Un backtest qui ne redonne pas le même chiffre deux fois n'est pas un backtest.

:::etapes
1. Crée un environnement virtuel dédié et fige les versions (\`pip freeze > requirements.txt\`). Une montée de version de pandas peut changer un résultat.
2. Dépose tes données brutes dans \`data/raw\` en **lecture seule**, avec un fichier texte à côté : source, date de téléchargement, période couverte, ajustements appliqués.
3. Fixe une graine aléatoire globale et exige que chaque script écrive ses hypothèses (frais, slippage, fuseau horaire) dans son fichier de résultats.
4. Ouvre Claude Code à la racine et laisse-le lire l'arborescence avant de coder quoi que ce soit.
5. Écris **d'abord** le test qui vérifie l'absence de fuite temporelle, ensuite seulement le moteur de backtest.
:::

## Faire construire le backtest

Le secret n'est pas de demander « code-moi un backtest ». C'est de lui donner le **cahier des charges anti-biais**.

:::prompt Cahier des charges d'un backtest anti-biais
Construis un backtest vectorisé en Python (pandas) pour la règle d'entrée/sortie décrite dans strategy.md.
Contraintes non négociables :
- Aucune donnée future : le signal à la barre t n'utilise que les données jusqu'à t inclus, et l'exécution se fait à l'ouverture de t+1.
- Modèle de coûts obligatoire : commission paramétrable + slippage exprimé en multiple d'ATR.
- Découpe in-sample / out-of-sample 70/30 sur l'axe du temps, jamais aléatoire. N'optimise que sur l'in-sample.
- Sorties : CAGR, drawdown maximum, Sharpe, pourcentage de trades gagnants, nombre de trades, et la courbe d'equity out-of-sample dans un fichier séparé.
- Écris en tête du fichier de résultats toutes les hypothèses que tu as prises, y compris celles que je n'ai pas précisées.
Ajoute un test pytest qui échoue si une colonne postérieure à t entre dans le calcul du signal.
:::

Le squelette qu'il produira ressemblera à ça, volontairement simple :

\`\`\`python
signal = rule(data).shift(1)                 # décalage : aucun accès au futur
ret    = data["open"].pct_change().shift(-1) # rendement de la barre suivante
cost   = commission + k * data["atr"]        # slippage proportionnel à la volatilité
pnl    = signal * ret - signal.diff().abs() * cost
equity = (1 + pnl).cumprod()
\`\`\`

:::cle Le décalage d'une barre, c'est toute la différence
Le \`shift(1)\` sur le signal et l'exécution à t+1 séparent un backtest honnête d'une machine à illusions. Ce n'est pas un détail d'implémentation : c'est la seule chose qui distingue une mesure d'un souhait.
:::

## « Beat the idea to death »

Un backtest qui passe une fois ne prouve rien. La discipline sérieuse consiste à **tout faire pour casser l'idée**. Quatre attaques, dans cet ordre :

1. **Balayage de paramètres voisins** — si la performance s'effondre quand tu bouges un seuil de 10 %, c'est du surapprentissage, pas une stratégie.
2. **Test null** — remplace ton signal par des entrées aléatoires de même fréquence et même durée moyenne. Si l'aléatoire fait presque aussi bien, ton avantage est imaginaire.
3. **Monte-Carlo sur l'ordre des trades** — ré-échantillonne la séquence pour estimer la distribution du drawdown. Le pire cas plausible est presque toujours pire que celui du run unique.
4. **Walk-forward** — ré-optimise sur une fenêtre glissante et teste sur la suivante, en continu. C'est le test le plus proche de la réalité, et le plus impitoyable.

:::prompt Analyser un résultat de backtest sans complaisance
Voici le fichier de résultats du backtest et la courbe d'equity out-of-sample.
Réponds dans cet ordre, sans reformuler ma question :
1. Quelles hypothèses de ce backtest sont les plus fragiles, et pourquoi.
2. Quels chiffres sont incohérents entre eux (par exemple Sharpe vs drawdown vs nombre de trades).
3. Quelle part du résultat vient d'un petit nombre de trades ou d'une seule période.
4. Quel test supplémentaire casserait cette stratégie le plus vite.
Ne conclus pas sur la rentabilité et ne me dis pas si je dois trader cette stratégie. Reste sur la qualité de la mesure. Sois concis, pas de préambule.
:::

Si l'idée survit à ces quatre attaques, elle mérite au mieux d'être observée plus longtemps. Si elle meurt, tu viens d'économiser l'argent que tu allais y mettre.

:::piege Confondre « a survécu au backtest » et « va gagner »
Un backtest mesure une hypothèse sur des données passées, dans des conditions de marché qui ne se répéteront pas à l'identique. Il ne prédit rien. **À faire à la place** : traite un backtest réussi comme l'autorisation de continuer à chercher, pas comme un feu vert. Et rappelle-toi que ce parcours ne te dit pas quoi trader — il te dit comment mesurer proprement.
:::

## Le prompt qui te fait perdre en rigueur

Sur un sujet aussi sensible, le réflexe est de demander une double vérification. C'est précisément ce qu'il ne faut plus faire.

:::piege « Fais vérifier ton backtest par un sous-agent »
Depuis Opus 5, la doc officielle demande de **retirer** les instructions de vérification (« ajoute une étape de vérification finale », « fais relire par un sous-agent », « double-check »). Le modèle vérifie déjà seul ; ces consignes déclenchent de la sur-vérification et gonflent la facture sans améliorer le résultat. **À faire à la place** : un test pytest sur la fuite temporelle, un jeu de données jouet dont tu connais le résultat exact, et un test null. Trois artefacts vérifiables valent mieux que dix relectures.
:::

:::maj 19 juillet 2026
Claude Code ne lance plus \`/verify\` ni \`/code-review\` de lui-même. Si tu veux une revue de ton moteur de backtest, tu la déclenches toi-même avec \`/code-review\` — dont \`/review\` est devenu un alias le 6 août 2026 (2.1.223), en réutilisant le niveau d'effort précédent.
:::

## Ce que ça coûte de tester en boucle

Un backtest, ça se relance vingt fois par soirée. Avec un agent dans la boucle, la facture n'est plus théorique.

:::chiffres
13 $ | par développeur et par jour actif, repère officiel Anthropic
7× | les tokens d'une session « agent teams », désactivée par défaut
:::

Quelques réflexes qui changent tout :

- **Ne fais pas relire tes CSV par le modèle.** Fais-lui écrire un script qui produit un résumé chiffré, puis donne-lui le résumé. Un an de données minute dans le contexte, c'est de l'argent brûlé pour rien.
- **Regroupe tes itérations.** Sur abonnement le cache tient 1 h, en clé API seulement 5 min : enchaîner dix runs dans la même heure coûte beaucoup moins cher que dix runs étalés sur la journée.
- **Plafonne la délégation.** Opus 5 délègue volontiers à des sous-agents ; sur une boucle de backtest, dis-lui explicitement de traiter la tâche lui-même quand elle est petite.
- **Relève \`/usage\` avant chaque \`/clear\`** : depuis la version 2.1.211, le compteur repart de zéro à chaque nettoyage.

:::defi 45 min — Casser ta propre idée
Prends une règle d'entrée/sortie simple, la tienne ou une règle d'école, et essaie de la démolir proprement.
- Le moteur de backtest tourne et redonne exactement le même chiffre deux fois de suite
- Un test automatisé échoue si une donnée postérieure à t entre dans le calcul du signal
- Commission et slippage sont paramétrables, et tu as relancé le run avec un slippage doublé
- Tu as fait tourner le test null : le résultat de l'aléatoire est écrit à côté du tien
- Le balayage de paramètres voisins est fait, et tu sais dire si la perf est un plateau ou un pic
- Le fichier de résultats liste les hypothèses, la source des données et leur date de téléchargement
- Ta conclusion est écrite en une phrase qui ne contient ni « rentable » ni « ça marche »
:::

:::memo
Q: À quoi sert un backtest ?
R: À tuer une idée qui ne tient pas. Il ne valide jamais une stratégie, il échoue seulement à la casser.
===
Q: Quelle ligne de code élimine le look-ahead bias dans un backtest vectorisé ?
R: Le décalage du signal d'une barre et l'exécution à la barre suivante.
===
Q: Que révèle un test null ?
R: On remplace le signal par des entrées aléatoires de même fréquence. Si l'aléatoire fait presque aussi bien, l'avantage est imaginaire.
===
Q: Pourquoi ne pas demander « fais vérifier ce backtest par un sous-agent » ?
R: Depuis Opus 5 la doc demande de retirer ces instructions : elles provoquent de la sur-vérification et coûtent des tokens sans gagner en justesse.
===
Q: Comment réduire le coût quand on relance un backtest vingt fois ?
R: Résumer les données par script au lieu de les mettre dans le contexte, et regrouper les runs dans la même heure pour profiter du cache.
:::` +
        FOOTER,
    },
    {
      slug: "coder-le-risque-sizing-et-stops",
      title: "Coder le risque : sizing et stops",
      description:
        "La seule variable que tu contrôles vraiment, c'est le risque. On la code proprement avec Claude Code : fixed-fractional, stop ATR, pièges de Kelly — et la revue de code obligatoire dès qu'un agent touche à ce fichier.",
      duration_min: 22,
      is_free_preview: false,
      content_md:
        `:::objectifs
- Transformer « je mets combien ? » en une fonction déterministe et testée
- Coder un sizing fixed-fractional et un stop adossé à la volatilité
- Rendre un plafond de risque **impossible à contourner**, y compris par toi-même
- Repérer l'exposition corrélée, le risque qui ne se voit sur aucune ligne
- Mettre en place la revue de code du module de risque, à la main, parce que Claude ne la déclenche plus seul
:::

:::flash
Tu ne contrôles pas si un trade gagne, tu contrôles combien tu perds s'il perd. Un module de risque transforme une décision émotionnelle en règle testable : risque fixe par trade, stop adossé à la volatilité, plafond dur qui lève une erreur. Les pourcentages cités ici sont **illustratifs** — ce n'est pas un conseil financier, et aucun réglage n'est « le bon ».
:::

## La seule chose que tu contrôles

Tu ne contrôles pas si un trade gagne. Tu contrôles **combien tu perds s'il perd**. C'est tout, et c'est énorme : la gestion du risque est la seule variable sous ta maîtrise totale. La coder proprement vaut plus que n'importe quel « signal ».

L'objectif d'un module de risque tient en une phrase : transformer une décision émotionnelle (« je mets combien ? ») en **règle déterministe et testable**.

:::cle Une règle, pas une humeur
Une taille de position décidée dans l'instant est une humeur déguisée en calcul. Si la règle est dans un fichier, testée, avec un plafond qui lève une erreur, elle ne dépend plus de ton état du moment.
:::

## Trois méthodes de sizing

| Méthode | Ce qu'elle fixe | Robustesse à l'incertitude |
| --- | --- | --- |
| **Fixed-fractional** | Un pourcentage constant de l'equity risqué par trade | Élevée |
| **Stop ATR + fixed-fractional** | Idem, mais le stop suit la volatilité récente | Élevée |
| **Kelly plein** | La fraction théoriquement optimale de croissance | Faible — suppose des probabilités connues |

**Fixed-fractional**, le défaut raisonnable. Tu risques un pourcentage fixe de ton capital par trade. La taille de position se déduit alors de la distance au stop :

\`\`\`python
risque_eur   = equity * risque_pct            # % de l'equity COURANTE, pas du capital initial
risque_unite = abs(prix_entree - prix_stop)   # perte par unité si le stop est touché
taille       = risque_eur / risque_unite
\`\`\`

Conséquence vertueuse : plus ton stop est large, plus la position est petite. Le risque par trade reste constant quoi qu'il arrive.

**Stop adossé à l'ATR.** Plutôt qu'un stop arbitraire, on le place à un multiple de l'**Average True Range**, c'est-à-dire de la volatilité récente. Un stop à 2×ATR s'élargit quand le marché s'agite et se resserre quand il se calme. Couplé au fixed-fractional, ça donne un sizing qui **respire avec la volatilité** au lieu de la subir.

:::piege Le Kelly plein, la formule qui a l'air scientifique
Le critère de Kelly donne la fraction théoriquement optimale pour maximiser la croissance. En pratique il est **beaucoup trop agressif** : il suppose que tu connais exactement tes probabilités — tu ne les connais pas, tu les as estimées sur un backtest — et il produit des drawdowns que personne ne tient psychologiquement. **À faire à la place** : un Kelly fractionnaire (un quart, un demi) si tu y tiens, ou tout simplement le fixed-fractional, plus robuste quand tes estimations sont fausses. Et elles le sont.
:::

:::piege Calculer le risque sur le capital initial
Si ton module calcule 1 % de ton capital de départ au lieu de 1 % de ton equity **courante**, tu augmentes mécaniquement ton risque relatif pendant les périodes de perte — exactement au pire moment. **À faire à la place** : le sizing lit l'equity actuelle à chaque appel, et un test le vérifie avec une equity dégradée.
:::

## Faire coder le module par Claude Code

Le cahier des charges doit rendre le risque **impossible à contourner**. Et l'ordre compte : les tests d'abord.

:::etapes
1. Fais écrire les **tests** en premier, sans le code : un stop large doit produire une position plus petite, un dépassement de plafond doit lever une exception.
2. Fais échouer les tests (\`pytest\` en rouge) — c'est la preuve qu'ils testent quelque chose.
3. Demande ensuite l'implémentation minimale qui les fait passer.
4. Ajoute un jeu de cas limites : equity nulle, stop égal au prix d'entrée, ATR manquant, prix négatif.
5. Verrouille : plus aucune modification de ce module sans relancer la suite complète et sans revue.
:::

:::prompt Spécifier un module de sizing verrouillé
Écris un module position_sizing.py, en commençant par les tests pytest, sans implémentation.
Fonctions attendues :
- size_fixed_fractional(equity, risk_pct, entry, stop) qui lit l'equity courante et renvoie une taille entière
- stop_from_atr(entry, atr, mult, sens) pour un stop adossé à la volatilité
- check_portfolio_risk(positions, correlations, cap) pour le risque agrégé
Contraintes non négociables :
- Un plafond dur max_risk_pct : le dépasser lève une exception dédiée, jamais un avertissement, jamais une valeur tronquée en silence.
- Le plafond d'exposition corrélée refuse l'ajout d'une position qui ferait dépasser le cap agrégé.
- Aucune valeur par défaut implicite pour un paramètre de risque : si l'appelant ne le fournit pas, c'est une erreur.
- Cas limites couverts : equity nulle ou négative, stop égal au prix d'entrée, ATR absent.
Écris les tests, montre-les-moi, et n'implémente rien tant que je n'ai pas validé.
:::

:::cle Un garde-fou qu'on peut ignorer n'est pas un garde-fou
Le plafond doit **lever une erreur**, pas afficher un avertissement. Un message dans les logs se contourne d'un haussement d'épaules à 23 h ; une exception arrête le programme.
:::

## L'exposition corrélée, le risque invisible

Risquer 1 % sur dix actifs qui montent et descendent ensemble, ce n'est pas dix paris à 1 % : c'est **un pari à 10 %** déguisé en diversification. Aucune ligne de ton portefeuille ne l'affiche.

Ton module doit donc regrouper les positions corrélées et plafonner le risque agrégé, pas seulement le risque unitaire.

:::piege « Je suis diversifié, j'ai dix positions »
Dix positions sur des actifs qui partagent le même facteur — même secteur, même devise, même sensibilité aux taux — se comportent comme une seule position dix fois plus grosse le jour où ça tourne mal. **À faire à la place** : fais estimer par Claude Code les corrélations récentes entre tes positions, regroupe-les en paniers, et applique le plafond au **panier**, pas à la ligne. Et souviens-toi que les corrélations montent brutalement dans les phases de stress : teste ton plafond avec des corrélations forcées à 1.
:::

## Quand un agent modifie le code qui gère l'argent

Ce module est le seul de ton dépôt dont une régression silencieuse coûte directement de l'argent. Il mérite un traitement à part.

:::piege Laisser un agent réécrire le module de risque sans revue
Un agent qui « nettoie » ou « refactorise » peut très bien transformer une exception en avertissement, un plafond en valeur par défaut, ou déplacer un \`abs()\` qui inversait le signe du stop. Tout passe, les tests aussi si l'agent les a ajustés au passage. **À faire à la place** : traite \`position_sizing.py\` comme du code protégé — diff relu ligne à ligne, tests jamais modifiés dans le même commit que l'implémentation, et revue explicite avant merge.
:::

:::maj 19 juillet — 6 août 2026
Claude Code **ne lance plus \`/verify\` ni \`/code-review\` de lui-même** (retiré le 19 juillet). Depuis le 22 juillet, \`/code-review\` s'exécute dans un sous-agent d'arrière-plan, et depuis le 6 août (2.1.223) **\`/review\` est un alias de \`/code-review\`** qui réutilise le niveau d'effort précédent. Traduction : la revue de ton module de risque, c'est toi qui la déclenches. Personne ne le fera à ta place.
:::

:::astuce Encode ta revue plutôt que de la redemander
Plutôt que d'écrire « vérifie bien » dans chaque prompt, mets tes contrôles récurrents dans un skill de dépôt (\`.claude/skills/\`) : « aucune exception transformée en warning », « aucun paramètre de risque avec valeur par défaut », « les tests de plafond existent toujours ». Un skill est réutilisable et vérifiable ; une consigne répétée dans le prompt ne l'est pas.
:::

## Le réflexe à garder

> Décide de ton risque **avant** d'entrer, code-le en dur, et ne le négocie jamais en cours de trade. La taille de position est une règle, pas une humeur.

*(Rappel : outillage technique, pas conseil financier. Les pourcentages cités sont illustratifs et ne constituent aucune recommandation ; les performances passées ne préjugent en rien des performances futures.)*

:::defi 40 min — Un module de risque qu'on ne peut pas contourner
Construis le module et prouve qu'il résiste, y compris à toi.
- Les tests ont été écrits **avant** l'implémentation et ont d'abord échoué
- Un stop deux fois plus large produit une position deux fois plus petite, vérifié par un test
- Le sizing lit l'equity courante : un test avec une equity dégradée le prouve
- Dépasser \`max_risk_pct\` lève une exception dédiée — pas un warning, pas une valeur tronquée
- Le plafond d'exposition corrélée refuse une position de trop, testé avec des corrélations forcées à 1
- Les cas limites passent : equity nulle, stop égal à l'entrée, ATR manquant
- Tu as lancé \`/code-review\` toi-même sur le module et lu le diff ligne à ligne
:::

:::memo
Q: Quelle est la seule variable réellement sous ton contrôle sur un trade ?
R: Combien tu perds s'il perd. Pas s'il gagne.
===
Q: En fixed-fractional, que devient la position quand le stop s'éloigne ?
R: Elle rétrécit. Le risque par trade reste constant.
===
Q: Pourquoi éviter le Kelly plein ?
R: Il suppose des probabilités connues exactement, ce qui est faux, et produit des drawdowns intenables.
===
Q: Un dépassement de plafond doit produire quoi ?
R: Une exception qui arrête le programme, jamais un simple avertissement.
===
Q: Qui déclenche la revue de code du module de risque depuis le 19 juillet 2026 ?
R: Toi. Claude Code ne lance plus /code-review tout seul ; /review en est devenu un alias le 6 août.
:::` +
        FOOTER,
    },
    {
      slug: "automatiser-la-recherche-et-garde-fous",
      title: "Automatiser la recherche : data, dashboards & garde-fous",
      description:
        "Faire construire par Claude Code un pipeline de données daté, un tableau de bord utile, déléguer la recherche à des sous-agents sans exploser la facture — et poser la ligne rouge : l'IA n'exécute jamais seule.",
      duration_min: 26,
      is_free_preview: false,
      content_md:
        `:::objectifs
- Assembler pipeline de données, backtest et module de risque en un système de recherche
- Garantir le *point-in-time* pour que tes résultats restent reproductibles
- Construire un tableau de bord qui sert à décider, pas à décorer
- Déléguer la recherche à des sous-agents en connaissant les limites et le coût réels
- Poser des garde-fous qui protègent le capital, et pas seulement la machine
:::

:::flash
La couche finale, c'est le système : données datées, dashboard, recherche déléguée à des sous-agents. Au 6 août 2026, Claude Code plafonne les sous-agents à une profondeur de 3, 20 en concurrence et 200 par session, et les workflows dynamiques sont limités à \`medium\` par défaut. La ligne rouge ne bouge pas : aucune connexion ne laisse un modèle passer un ordre réel. Rien ici n'est un conseil financier.
:::

## De l'outil isolé au système

Tu as un backtest honnête et un module de risque. La couche suivante consiste à **relier le tout** en un système de recherche que tu alimentes chaque semaine sans tout refaire à la main. Claude Code excelle à cet assemblage : c'est de la plomberie, et la plomberie, il connaît.

| Couche | Ce qu'elle produit | Ce qui la casse |
| --- | --- | --- |
| Pipeline de données | Un jeu de données daté et validé | Données révisées, trous, splits mal appliqués |
| Backtest | Une mesure reproductible | Look-ahead, coûts absents |
| Module de risque | Une taille de position | Plafond contournable |
| Tableau de bord | Une décision | Métriques flatteuses choisies après coup |
| Journal | Un apprentissage | Notes écrites après coup, biaisées |

## Un pipeline de données daté

La donnée est le fondement — et la source n°1 de biais. Fais construire un pipeline qui **ingère**, **stocke** localement (Parquet ou SQLite) pour la reproductibilité, **horodate** chaque enregistrement pour garantir le *point-in-time*, et **valide** avant tout usage.

:::etapes
1. Une seule fonction d'ingestion par source, qui écrit dans \`data/raw\` en append seulement — jamais d'écrasement.
2. À côté de chaque fichier, un manifeste : source, date de téléchargement, période couverte, ajustements appliqués.
3. Une étape de validation : trous de séance, doublons, splits et dividendes, valeurs aberrantes, timestamps hors fuseau.
4. Une couche « propre » dérivée, régénérable à volonté depuis le brut — le brut n'est jamais modifié.
5. Un rapport de santé écrit à chaque run, avec le nombre de lignes rejetées et pourquoi.
:::

:::piege Une validation qui corrige en silence
Un pipeline qui « répare » automatiquement une valeur aberrante ou comble un trou par interpolation te fabrique un backtest sur des données qui n'ont jamais existé. **À faire à la place** : demande explicitement une validation qui **échoue bruyamment**. Une donnée silencieusement fausse coûte infiniment plus cher qu'un pipeline qui plante.
:::

:::prompt Construire un pipeline de données daté
Construis un pipeline d'ingestion de données de marché dans ce dépôt.
Exigences :
- Écriture en append seulement dans data/raw ; le brut n'est jamais modifié ni écrasé.
- Chaque enregistrement porte la date à laquelle l'information était disponible, distincte de la date de la barre.
- Un manifeste JSON par fichier : source, date de téléchargement, période, ajustements appliqués.
- Une étape de validation qui lève une exception en cas de trou de séance, doublon, timestamp hors fuseau ou valeur aberrante. Aucune correction automatique, aucune interpolation.
- Un rapport de santé écrit à chaque exécution avec le nombre de lignes rejetées et le motif.
Écris d'abord la structure des dossiers et le format du manifeste, je valide avant que tu codes.
:::

:::maj 24 juillet 2026
**Opus 5** est le modèle Opus par défaut de Claude Code : **contexte de 1 million de tokens** et réflexion étendue activée par défaut. Concrètement, un long rapport de backtest ou un schéma de base complet passent dans une seule session d'analyse. À l'inverse, ce n'est pas une invitation à y déverser un an de données minute : le résumé produit par un script coûte cent fois moins cher que le fichier brut.
:::

## Un tableau de bord qui sert à décider

Une fois la donnée et le backtest en place, un dashboard transforme des chiffres en décisions. Demande à Claude Code un tableau — Streamlit fait très bien l'affaire — qui affiche :

- la courbe d'equity et surtout le **drawdown**, le vrai juge de paix ;
- l'exposition courante et le risque agrégé par actif et par panier corrélé ;
- la distribution des trades et les pires séries consécutives ;
- un onglet « santé des données » qui remonte les rejets du pipeline.

Claude Code génère l'ossature en quelques minutes. Ton travail, c'est d'itérer sur ce qui t'est *utile pour décider*, pas sur la déco.

:::piege Le dashboard qui ne montre que ce qui fait plaisir
Choisir ses métriques après avoir vu les résultats, c'est du surapprentissage appliqué à soi-même. **À faire à la place** : fige la liste des métriques **avant** de lancer la campagne de tests, drawdown maximum et pire série de pertes en tête. Une métrique qu'on ajoute parce qu'elle est flatteuse n'est plus une mesure.
:::

## Déléguer la recherche à des sous-agents

Explorer dix variantes d'une idée en parallèle, c'est exactement le genre de tâche que les sous-agents traitent bien. Encore faut-il connaître les limites — et le prix.

:::chiffres
3 | niveaux de profondeur maximum pour les sous-agents
20 | sous-agents en concurrence, 200 par session
7× | les tokens d'une session « agent teams », désactivée par défaut
:::

Depuis le 24 juillet 2026, les **workflows dynamiques** sont plafonnés par défaut à \`medium\` (moins de 15 agents) via le réglage \`workflowSizeGuideline\` ; les autres valeurs sont \`small\`, \`large\` et \`unrestricted\`. Tu peux tout désactiver avec \`disableWorkflows: true\`.

:::piege Lancer une campagne de backtests en éventail sans plafond
Vingt sous-agents qui relisent chacun le même jeu de données, c'est vingt fois le même contexte facturé. **À faire à la place** : fais produire un résumé chiffré par script, passe le résumé aux agents, et donne une consigne explicite de **périmètre** — Opus 5 a tendance à élargir la tâche et à déléguer plus volontiers qu'il ne faudrait. Laisse les agent teams désactivées tant qu'un besoin précis ne les justifie pas.
:::

:::astuce Encode tes vérifications en skills, pas en prompts
Les contrôles que tu répètes à chaque campagne — « le manifeste existe », « aucune correction automatique dans le pipeline », « les hypothèses sont écrites dans le fichier de résultats » — ont leur place dans \`.claude/skills/\`, avec un frontmatter \`name\`, \`description\` et \`allowed-tools\`. Un skill se déclenche, se relit et se versionne ; une phrase répétée dans un prompt, non.
:::

## Connecter Claude à tes données (MCP), prudemment

Claude Code peut se brancher à des outils et des sources via des serveurs **MCP** (Model Context Protocol) : interroger ta base, lire tes rapports, lancer une analyse. C'est puissant pour la **recherche** — résumer, repérer, recouper. Deux règles, et elles ne se négocient pas.

- **Lecture d'abord.** Accès en lecture pour l'analyse ; l'écriture seulement sur des actions réversibles et bien cadrées.
- **Jamais le carnet d'ordres.** Aucune connexion ne laisse un modèle passer un ordre réel sans validation humaine explicite. C'est la ligne rouge du parcours.

:::maj 28 juillet 2026
La spécification MCP a connu une révision majeure : suppression des sessions au niveau protocole et du handshake d'initialisation — **MCP devient stateless** — nouveau RPC \`server/discover\`, et dépréciation de Roots, Sampling et Logging. Côté Anthropic, le support « est en cours de déploiement » : **aucune date de bascule n'a été publiée** pour Claude Code. Si tu maintiens un serveur MCP maison, surveille le changelog avant de migrer.
:::

## Les garde-fous

C'est la partie la plus importante du parcours, et celle qui te protège surtout de toi-même.

- **Sépare outillage et décision.** L'IA prépare, calcule, alerte. Elle **n'engage jamais le capital**. Un humain valide chaque ordre, sans exception « juste cette fois ».
- **Logge tout.** Chaque signal, chaque taille, chaque décision, avec sa raison, écrite *avant* de connaître l'issue. Un journal rempli après coup ne t'apprend rien.
- **Méfie-toi de la fluidité.** Une réponse bien écrite *paraît* fiable. Recalcule les chiffres, surtout ceux qui t'arrangent.
- **Prévois un kill-switch.** Tout automate de recherche doit pouvoir être coupé instantanément et ne jamais agir hors des enveloppes de risque définies à l'avance.

:::piege Croire que le système de permissions de l'outil te protège
Entre le **18 juillet et le 6 août 2026**, au moins cinq contournements des permissions Bash ont été corrigés dans Claude Code — conditionnels regex zsh, guillemets PowerShell, hooks PreToolUse qui contournaient les restrictions d'outils, sessions worktree exécutant des commandes git destructrices, commandes masquant une partie d'elles-mêmes par tabulation ou Unicode invisible. **À faire à la place** : reste à jour (2.1.223 au 6 août 2026), considère ton allowlist comme de la **défense en profondeur** et non comme une frontière dure, et garde tes identifiants de courtier hors de portée du dépôt. Les garde-fous de l'éditeur protègent la machine ; les tiens protègent le capital.
:::

## La discipline qui fait la différence

:::cle Automatise la recherche, jamais le jugement
Automatise la **recherche** et la **surveillance**. Jamais le **jugement**. L'objectif n'est pas que l'IA trade à ta place — c'est qu'elle te rende plus rapide, plus rigoureux et plus honnête que tu ne le serais seul.
:::

Tu as désormais l'arsenal complet : cadrage, backtest honnête, risque codé, recherche automatisée, garde-fous. La suite, ce sont *tes* idées, passées dans une machine qui les teste sans complaisance.

*(Rappel : parcours éducatif et technique. Aucun conseil en investissement, aucune stratégie recommandée, aucun résultat garanti. Les performances passées ne préjugent en rien des performances futures. Tu restes responsable de chaque décision.)*

:::defi 60 min — Assembler le système
Relie les briques des trois leçons précédentes en un système que tu peux relancer d'une commande.
- Le pipeline écrit dans \`data/raw\` en append seulement, avec un manifeste par fichier
- Chaque enregistrement porte la date à laquelle l'information était disponible, distincte de la date de la barre
- La validation lève une exception au lieu de corriger : tu l'as prouvé en injectant une valeur aberrante
- Le tableau de bord affiche equity, drawdown, exposition agrégée et santé des données
- La liste des métriques a été figée **avant** de lancer les tests, et tu peux montrer où elle est écrite
- Un kill-switch coupe l'automate de recherche en une commande
- Aucun composant du système ne peut appeler une API de courtier — vérifie-le en cherchant dans tout le dépôt
- Ton journal contient au moins une entrée écrite avant de connaître l'issue
:::

:::memo
Q: Pourquoi horodater chaque enregistrement du pipeline ?
R: Pour garantir le point-in-time : savoir ce qui était connu, et à quel moment.
===
Q: Que doit faire l'étape de validation devant une donnée suspecte ?
R: Échouer bruyamment. Jamais corriger ni interpoler en silence.
===
Q: Quelles sont les limites des sous-agents dans Claude Code au 6 août 2026 ?
R: Profondeur 3, 20 en concurrence, 200 par session, et workflows dynamiques plafonnés à medium par défaut.
===
Q: Quelle est la ligne rouge d'une connexion MCP dans un projet de trading ?
R: Aucune connexion ne laisse un modèle passer un ordre réel sans validation humaine explicite.
===
Q: Une allowlist Bash est-elle une frontière de sécurité fiable ?
R: Non. C'est de la défense en profondeur : au moins cinq contournements ont été corrigés entre le 18 juillet et le 6 août 2026.
:::` +
        FOOTER,
    },
  ],
};
