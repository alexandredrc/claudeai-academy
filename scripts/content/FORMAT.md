# Format des leçons — blocs pédagogiques

Le contenu des leçons reste du **Markdown** dans `content_md`. En plus du Markdown
standard (titres `##`, listes, tableaux, `code`, liens), on dispose de **blocs typés**
rendus par de vrais composants React.

Syntaxe : une ligne d'ouverture `:::type` (avec un titre optionnel après le type),
le corps en Markdown, une ligne de fermeture `:::`.

```
:::piege Ne collez jamais de données client
Le plan gratuit **peut** servir à améliorer les modèles. Anonymisez avant.
:::
```

Règles d'implémentation (`src/lib/lessons/blocks.ts`) :

- Un bloc non fermé ou d'un type inconnu retombe en Markdown : rien ne casse jamais.
- Un `:::` à l'intérieur d'une fence de code ` ``` ` n'ouvre pas de bloc.
- Le séparateur interne des blocs à plusieurs volets est une ligne contenant `===`.

---

## Les 12 blocs

### `:::objectifs` — ouverture de leçon

Liste à puces. Rendu : carte blanche « À la fin de cette leçon », puces cochées coral.
**Une par leçon, tout en haut.** Formuler en verbes d'action, pas en thèmes.

```
:::objectifs
- Choisir entre Opus 5, Sonnet 5 et Haiku 4.5 sans hésiter
- Régler le niveau d'effort selon la tâche
:::
```

### `:::flash` — le résumé de 30 secondes

Rendu : bloc sombre en tête de leçon. 2 à 4 phrases, la substance de la leçon pour
quelqu'un qui n'aurait que 30 secondes. **Une par leçon, juste après `:::objectifs`.**

```
:::flash
Opus 5 réfléchit par défaut : le levier n'est plus « activer la réflexion » mais
« régler l'effort ». Commencez à `medium`, montez si la réponse manque de rigueur.
:::
```

### `:::cle` — à retenir

Rendu : cartouche coral 🔑. L'idée qu'on garde six mois après. Titre optionnel.

### `:::piege` — erreur classique

Rendu : cartouche ambre ⚠️. Une erreur que le lecteur *va* commettre. Dire l'erreur,
puis quoi faire à la place.

### `:::astuce` — astuce de praticien

Rendu : cartouche verte 💡. Le raccourci qu'on n'apprend qu'en pratiquant.

### `:::prompt` — prompt prêt à copier

Rendu : carte à bouton **Copier**, texte monospace sur fond sombre. Le corps est copié
**tel quel** : pas de commentaire dedans, pas de balisage Markdown, juste le prompt.
Le titre décrit l'usage.

```
:::prompt Auditer un texte avant publication
Tu es relecteur pour un média B2B français...
:::
```

### `:::avant-apres` — comparaison

Deux volets séparés par `===` : le raté, puis le bon. Libellés par défaut
« Ce qu'on écrit spontanément » / « Ce qui marche vraiment », remplaçables par un titre
`avant | après`.

```
:::avant-apres Prompt vague | Prompt cadré
Écris-moi un texte sur le marketing.
===
Tu es rédacteur B2B. Rédige 300 mots pour...
:::
```

### `:::etapes` — procédure

Liste numérotée. Rendu : cartes numérotées en pastilles coral. Pour les manipulations
(installer, configurer, cliquer). Une action par étape.

### `:::defi` — exercice cochable

Texte d'intro, puis une liste à puces = les critères de réussite. Rendu : carte avec
cases à cocher persistées en local, compteur, et félicitation à 100 %.
**Une par leçon, à la fin.** Remplace la section « Exercice » en texte.

```
:::defi 15 min — Ton premier projet
Crée un projet Claude pour un dossier réel de ton travail.
- Le projet a un nom et une description en une phrase
- Tu y as déposé au moins deux documents de référence
- Tu as écrit des instructions personnalisées
:::
```

### `:::memo` — cartes de révision

Paires `Q:` / `R:` séparées par `===`. Rendu : paquet de cartes à retourner, une par une.
**Une par leçon, tout à la fin, 3 à 5 cartes.** Texte simple, pas de Markdown : question
courte, réponse en une ou deux phrases. C'est du rappel actif, pas un résumé.

```
:::memo
Q: Sur Opus 5, comment désactiver la réflexion étendue ?
R: On ne peut pas dans l'application. Via l'API, uniquement à effort `high` ou moins.
===
Q: Quel est le premier réglage à ajuster quand une réponse manque de rigueur ?
R: Le niveau d'effort.
:::
```

### `:::maj` — nouveauté datée

Rendu : badge vert « Nouveau » + date. Pour signaler ce qui a changé récemment dans
l'écosystème. **Le titre est la date** (« 24 juillet 2026 »).

```
:::maj 24 juillet 2026
Claude Opus 5 remplace Opus 4.8 comme modèle Opus par défaut.
:::
```

### `:::chiffres` — statistiques

Lignes `valeur | libellé`, 2 à 4 maximum.

```
:::chiffres
1M | tokens de contexte sur Opus 5
80 % | du system prompt de Claude Code supprimé sans perte de performance
:::
```

---

## Structure type d'une leçon

```
:::objectifs
…
:::

:::flash
…
:::

## Premier vrai titre
Du texte. Deux ou trois paragraphes maximum d'affilée, puis un bloc.

:::cle
…
:::

## Deuxième titre
…

:::defi
…
:::

:::memo
…
:::
```

## Règles de rythme

- **Jamais plus de 3 paragraphes d'affilée sans un bloc, un tableau ou une liste.**
  C'est la règle qui tue le mur de texte.
- 4 à 8 titres `##` par leçon : ils alimentent le sommaire latéral.
- Les blocs sont des **respirations**, pas de la décoration : un `:::cle` doit contenir
  une idée que le texte ne dit pas déjà mot pour mot.
- Ne pas empiler deux cartouches de suite (`:::cle` puis `:::astuce`) : du texte entre.
- Tutoiement, comme le reste du site.

## Règles de fond

- **Dater tout ce qui bouge** : prix, versions, limites d'usage. « Au 6 août 2026, … ».
- **Ne jamais affirmer ce qui n'est pas vérifié.** Les rapports de veille
  (`scripts/veille/reports/`) marquent explicitement le non vérifié : ce qui y est marqué
  ainsi ne doit pas apparaître comme un fait dans une leçon.
- Liens de doc : `platform.claude.com/docs/en/…` (plus `docs.claude.com`),
  `code.claude.com/docs/en/…` pour Claude Code.
