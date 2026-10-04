# Google Ads : relance d'octobre 2026, runbook à exécuter dans l'interface

Préparé le 4 octobre 2026. Compte 537-199-3441, campagne « Recherche - Formation Claude FR » (id 24043755790), en veille depuis le 16 septembre.

Pourquoi un runbook et pas une exécution : l'agent a tenté d'enregistrer les exclusions et de créer le groupe d'annonces depuis Chrome ; le classificateur de permissions de Claude Code a refusé les deux (modification de compte et dépense réelle). Tout ce qui suit est prêt à coller. Compter 35 à 45 minutes.

## Ce que le diagnostic du 21 septembre impose (rappel en quatre lignes)

1. 90 % des 373 clics achetés venaient de requêtes « academy », « certification » ou « gratuit » : des gens qui cherchaient les cours gratuits d'Anthropic. Exclusions au niveau du compte, pas de la campagne.
2. L'expression exacte sur les termes de marque laissait tout passer : on passe en mot clé exact (crochets) sur les termes de marque.
3. Trafic froid sur une grille tarifaire = 19 checkouts sur 20 abandonnés sans un caractère saisi. La landing a maintenant une deuxième sortie (kit gratuit par email), et le groupe « Agent IA » envoie vers un guide, pas vers les tarifs.
4. Un zéro n'est concluant qu'à 1 100 clics (borne haute 3/n = 0,27 % = seuil d'équilibre). Signal précoce à 150 clics : taux de saisie d'email au checkout, sous 20 % on coupe.

## Étape 1 : exclusions au niveau du compte (5 min)

Outils > Bibliothèque partagée > Listes d'exclusion > « Exclusions structurelles - diplomes, Anthropic, gratuit » (22 termes déjà présents, appliquée aux 2 campagnes). Cliquer « + », coller la liste ci-dessous, Enregistrer. Si l'onglet Chrome laissé ouvert par l'agent affiche encore la boîte remplie, il suffit de cliquer « Enregistrer ».

```
academy
académie
academie
claude academy
anthropic academy
certified
architect
examen
exam
emploi
salaire
recrutement
stage
alternance
officiel
official
login
connexion
se connecter
avis
pdf
reddit
youtube
wikipedia
définition
definition
c'est quoi
cpf
udemy
coursera
openclassrooms
télécharger
telecharger
download
```

Tous en requête large (le défaut), c'est voulu : une exclusion large bloque toute requête qui contient le mot.

Ne PAS exclure : « formation claude », « formation claude ai », « claude code », « agent ia », « openclaw », « hermes », « n8n ».

## Étape 2 : groupe d'annonces 1 « Formation Claude » (10 min)

### 2a. Mots clés à supprimer (les 21 actuels)

Campagne > Audiences, mots clés et contenu > Mots clés > cocher tout > Modifier > Supprimer.

- "apprendre claude ai"
- "formation claude anthropic" (bloquée de toute façon par l'exclusion « anthropic »)
- "se former a l'intelligence artificielle"
- "formation ia" (remplacée par [formation ia] en exact)
- "formation claude code"
- "formation claude ia"
- "claude ai formation"
- "prompt engineering"
- "cours claude ai"
- "formation claude ai"
- "apprendre l'ia"
- "formation intelligence artificielle"
- "cours intelligence artificielle"
- "formation ia entreprise"
- "formation ia debutant"
- "formation chatgpt"
- "cours chatgpt"
- "formation prompt engineering"
- "formation claude ai en ligne"
- "formation prompt engineering claude"
- [formation claude ai] (recréé à l'étape 2b, même libellé)

### 2b. Mots clés à ajouter, tous en MOT CLÉ EXACT (coller tel quel, crochets compris)

```
[formation claude]
[formation claude ai]
[formation claude ia]
[claude ai formation]
[formation ia claude]
[cours claude ai]
[cours claude]
[apprendre claude ai]
[formation claude code]
[claude code formation]
[formation claude en ligne]
[formation claude en français]
[se former à claude]
[meilleure formation claude]
[formation prompt engineering claude]
[formation prompt engineering]
[formation ia]
```

### 2c. Remplacer l'annonce responsive (elle dit encore « 8 parcours, 48 leçons »)

URL finale : `https://www.claudeai-academy.com/formation-claude-ai?utm_source=google&utm_medium=cpc&utm_campaign=formation-claude`
Chemin affiché : `formation` / `claude-ai`

Titres (12, limite 30 caractères) :

| # | Titre | Longueur |
|---|---|---|
| 1 | Formation Claude en français | 28/30 |
| 2 | 9 parcours, 57 leçons | 21/30 |
| 3 | Dès 47 €, accès à vie | 21/30 |
| 4 | Garantie 14 jours | 17/30 |
| 5 | Claude Code, prompts, agents | 28/30 |
| 6 | 170 prompts prêts à copier | 26/30 |
| 7 | Sans CPF ni dossier | 19/30 |
| 8 | Mentor IA inclus en Mastery | 27/30 |
| 9 | Première leçon en accès libre | 29/30 |
| 10 | À jour d'octobre 2026 | 21/30 |
| 11 | Par un formateur indépendant | 28/30 |
| 12 | Klarna 3 fois sans frais | 24/30 |

Épingler le titre 1 en position 1. Ne rien épingler d'autre.

Descriptions (4, limite 90 caractères) :

| # | Description | Longueur |
|---|---|---|
| 1 | Formation Claude AI en français : 9 parcours, 57 leçons, 170 prompts. À vie, dès 47 €. | 86/90 |
| 2 | Prompt engineering, Claude Code, agents IA, data, marketing. Garantie 14 jours. | 79/90 |
| 3 | Pas un cours gratuit en anglais : une méthode en français, vérifiée sur la documentation. | 89/90 |
| 4 | Lisez la première leçon avant de payer. Paiement unique, ou Klarna en 3 fois sans frais. | 88/90 |

## Étape 3 : nouveau groupe d'annonces « Agent IA » (12 min)

Campagne > Groupes d'annonces > « + » > nom `Agent IA` > CPC max par défaut 2,00 €.

### 3a. Mots clés, tous en MOT CLÉ EXACT

```
[comment créer un agent ia]
[créer un agent ia]
[creer un agent ia]
[créer son agent ia]
[construire un agent ia]
[formation agent ia]
[agent ia claude]
[créer un agent avec claude]
[claude agent sdk]
[agent ia personnel]
[installer openclaw]
[openclaw installation]
[openclaw claude]
[hermes agent installation]
[n8n claude]
[agent ia n8n]
[agent claude code]
[formation agent ia claude]
```

Pas de [openclaw] ni [hermes agent] seuls : 40 500 et 12 100 recherches par mois de gens qui veulent l'outil, pas une formation ; ils videraient le budget en une matinée.

### 3b. Annonce responsive

URL finale : `https://www.claudeai-academy.com/creer-un-agent-ia?utm_source=google&utm_medium=cpc&utm_campaign=agent-ia`
Chemin affiché : `agent-ia` / `guide`

Titres (12, limite 30) :

| # | Titre | Longueur |
|---|---|---|
| 1 | Comment créer un agent IA | 25/30 |
| 2 | Créer un agent IA avec Claude | 29/30 |
| 3 | Workflow ou agent : la méthode | 30/30 |
| 4 | OpenClaw, Hermes, n8n, SDK | 26/30 |
| 5 | 7 leçons, 195 minutes | 21/30 |
| 6 | Guide gratuit, puis parcours | 28/30 |
| 7 | La fiche agent d'une page | 25/30 |
| 8 | Sécurité et coûts inclus | 24/30 |
| 9 | En français, à jour 2026 | 24/30 |
| 10 | Accès à vie, garantie 14 j | 26/30 |
| 11 | Première leçon en accès libre | 29/30 |
| 12 | Claude Code, Agent SDK, n8n | 27/30 |

Épingler le titre 1 en position 1.

Descriptions (4, limite 90) :

| # | Description | Longueur |
|---|---|---|
| 1 | Workflow ou agent, les 6 façons de construire avec Claude, les coûts réels et les pièges. | 89/90 |
| 2 | OpenClaw, Hermes, Claude Code, n8n, Agent SDK, agents gérés : choisissez la bonne voie. | 87/90 |
| 3 | Le guide gratuit, puis le parcours : 7 leçons vérifiées sur la documentation officielle. | 88/90 |
| 4 | Formation en français, accès à vie, garantie 14 jours. Première leçon sans compte. | 82/90 |

## Étape 4 : composants (sitelinks) au niveau de la campagne (5 min)

| Texte du lien | Description 1 | Description 2 | URL |
|---|---|---|---|
| Formation Claude Code | 8 leçons, la première offerte | Incluse dans le Pass Starter | https://www.claudeai-academy.com/formation-claude-code |
| Créer un agent IA | Le guide : 6 façons de construire | OpenClaw, Hermes, n8n, SDK | https://www.claudeai-academy.com/creer-un-agent-ia |
| 170 prompts prêts | Classés par métier | À copier dans Claude | https://www.claudeai-academy.com/prompts |
| Tarifs et garantie | Starter 47 €, Mastery 497 € | Garantie 14 jours | https://www.claudeai-academy.com/tarifs |

Google ajoute automatiquement `gclid` : le site le lit déjà comme provenance « google / cpc » ; les `utm_*` servent à nommer le groupe dans le rapport « VENTES PAR CANAL ».

## Étape 5 : réglages de campagne, puis réactivation (5 min)

| Réglage | Valeur | Pourquoi |
|---|---|---|
| Réseaux | Recherche Google uniquement, partenaires décochés, Display décoché | inchangé depuis le 27/08 |
| Zones | France | inchangé |
| Langue | Français | inchangé |
| Enchères | Maximiser les clics, CPC max 2,00 € | 1,50 € ne touchait pas les requêtes commerciales (enchère haut de page 2 à 5 €) ; 2,00 € reste sous le seuil d'équilibre |
| Budget | 15 €/jour (456 €/mois plafonnés) | 1 100 clics à ~0,90 € = ~1 000 € : le verdict tombe en 60 à 70 jours. À 10 €/jour il faudrait 100 jours |
| Date de début | aucune (immédiat) | |

Réactiver : pastille d'état de la ligne de campagne (le point à gauche du nom) > Activer. Ne pas passer par le menu « Modifier » (il confond Mettre en veille et Supprimer).

Laisser la campagne crypto en veille.

## Étape 6 : le compteur (3 min)

Le script « Rapport quotidien Telegram » (Outils > Actions groupées > Scripts, id 11937896) compte les clics depuis `DEBUT_DU_TEST`. La version du dépôt (`pipeline/google-ads-script.js`) est à jour : début au 2026-10-05, alerte à 150 clics (lire le taux de saisie d'email), stop à 1 100. Si la réactivation a lieu un autre jour, changer la date en ligne 32 avant de coller. Coller avec `Get-Content -Raw -Encoding UTF8 | Set-Clipboard` puis Ctrl+A, Ctrl+V dans l'éditeur, Enregistrer, Aperçu.

## Les trois décisions, et quand elles tombent

| Clics cumulés (groupe académie) | Lecture | Décision |
|---|---|---|
| 150 | rapport de 8 h, section TUNNEL : % de checkouts avec email | < 20 % : couper, le trafic n'est pas acheteur. 40 % ou plus : continuer |
| 300 à 1 100 | ventes attribuées « google / cpc » | 1 vente Mastery = déjà rentable, ne rien toucher. 2 ventes = +5 €/jour |
| 1 100 | 0 vente | STOP définitif : le canal ne convertit pas, l'argent va au netlinking |

Ne jamais passer en « Maximiser les conversions » avant 15 conversions sur 30 jours.
