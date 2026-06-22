# Note à Hermès — Publication des visuels « prix » sur les réseaux

**De :** ClaudeAI Academy
**Objet :** Intégrer et programmer 4 visuels de vente (prix/jour) sur LinkedIn, Instagram (via Meta Business) et TikTok
**Statut :** Prêt à programmer — visuels rendus et versionnés dans le repo

---

## 1. Contexte

Quatre visuels « prix » sont prêts. Le principe : on met **le prix en avant** et une phrase ramène le coût **à la journée sur 365 jours** pour le rendre dérisoire. Ce sont des contenus de **vente directe**, à servir à une audience déjà chaude (abonnés, retargeting).

Ils ne remplacent pas le contenu de valeur habituel (qui pointe vers le Kit gratuit `/kit`) — ils viennent **en complément**, en bas du tunnel.

---

## 2. Les assets

Dossier : `marketing/visuels-prix/` — format **1080 × 1350 (4:5 portrait)**.

| Fichier | Angle | Prix affiché |
|---|---|---|
| `mastery-prix-par-jour.png` | Mastery ramené au jour | **1,36 €/jour** |
| `mastery-497-par-jour.png` | Mastery prix plein + /jour | **497 €** (< 1,40 €/jour) |
| `cafe-vs-formation.png` | Comparaison café vs formation | **547 € vs 497 €** |
| `starter-prix-par-jour.png` | Starter ramené au jour | **0,13 €/jour** |

---

## 3. Où ça pointe (liens + attribution)

Ces visuels visent la **conversion** → ils pointent vers la page **Tarifs**, pas le Kit.

- Lien principal : `https://www.claudeai-academy.com/tarifs`
- **Ajoute le paramètre d'attribution `?src=`** pour savoir quel réseau convertit :
  - LinkedIn → `https://www.claudeai-academy.com/tarifs?src=li-prix`
  - Instagram → `https://www.claudeai-academy.com/tarifs?src=ig-prix`
  - TikTok → `https://www.claudeai-academy.com/tarifs?src=tk-prix`

> Rappel : le lien n'est cliquable que **dans la bio / les stickers**, pas dans les légendes IG/TikTok. Mets le lien attribué dans la bio (ou en sticker Lien sur les stories) pendant la fenêtre de publication, et renvoie-y dans la légende (« lien en bio »).

---

## 4. Calendrier proposé (2 semaines, 1 réseau par jour évité)

| Jour | Réseau | Visuel |
|---|---|---|
| J1 | LinkedIn + Instagram | `cafe-vs-formation.png` (le plus accrocheur → ouvre la série) |
| J3 | Instagram + TikTok | `mastery-prix-par-jour.png` |
| J5 | LinkedIn | `mastery-497-par-jour.png` |
| J8 | Instagram + TikTok | `starter-prix-par-jour.png` |
| J10 | LinkedIn | `mastery-prix-par-jour.png` (recyclage, autre légende) |

Ajuste selon ton calendrier éditorial. Espace d'au moins 48 h deux visuels « prix » sur un même réseau pour ne pas saturer.

---

## 5. Légendes prêtes à coller

> Ton : tutoiement, direct. Adapte les emojis selon la charte de chaque réseau.

### LinkedIn

**Visuel `cafe-vs-formation.png`**
> Tu dépenses déjà plus que ça. En café. ☕
>
> Un café à 1,50 € chaque jour pendant un an : 547 €.
> Le Pass Mastery de ClaudeAI Academy : 497 €, une seule fois, accès à vie.
>
> 7 parcours, 40 leçons, 170 prompts pour enfin exploiter l'IA au quotidien — pour moins cher que ta routine caféine.
>
> 👉 Détails et accès : lien en commentaire.

**Visuel `mastery-497-par-jour.png`**
> 497 €. Une fois. Et plus jamais.
>
> Soit moins de 1,40 € par jour sur ta première année — ensuite, plus rien à payer, l'accès est à vie.
>
> Ce que ça t'ouvre : 7 parcours complets, 40 leçons, 170 prompts prêts à l'emploi. La maîtrise de l'IA, pas trois vidéos YouTube.
>
> 👉 Programme complet : lien en commentaire.

### Instagram (via Meta Business Suite)

**Visuel `mastery-prix-par-jour.png`**
> Maîtriser l'IA = 1,36 €/jour. 🤯
> 497 € une seule fois, réparti sur 365 jours. Moins qu'un café — et l'accès reste à vie.
> Lien en bio → /tarifs
>
> #IA #IntelligenceArtificielle #ClaudeAI #Productivité #FormationEnLigne #SeFormer

**Visuel `starter-prix-par-jour.png`**
> 0,13 € par jour pour t'y mettre. 👀
> Le Pass Starter, c'est 47 € — soit moins de 4 € par mois sur un an. Le ticket d'entrée pour arrêter de subir l'IA et commencer à l'utiliser.
> Lien en bio.
>
> #IA #ClaudeAI #DébuterEnIA #Productivité #Compétences2026 #FormationIA

### TikTok (post photo, ou en intro d'une vidéo)

**Visuel `mastery-prix-par-jour.png`**
> 1,36 €/jour pour maîtriser l'IA. Oui, moins qu'un café. ☕ La formation complète, payée une fois, accès à vie. Lien en bio 🔗
> #ia #intelligenceartificielle #claudeai #apprendreraviiktok #productivite #seformer

**Visuel `starter-prix-par-jour.png`**
> 13 centimes par jour. C'est le prix pour enfin comprendre comment utiliser l'IA au taf. Pass Starter, 47 €. Lien en bio 🔗
> #ia #claudeai #debutant #productivite #apprendresurtiktok

---

## 6. ⚠️ Point technique à régler avant TikTok / Stories / Reels

Les visuels sont en **4:5 (1080×1350)** : parfait pour le **feed LinkedIn et Instagram**, mais **pas optimal en plein écran vertical**.

- **Instagram Stories/Reels** et **TikTok** sont en **9:16 (1080×1920)**.
- En l'état, un visuel 4:5 posté sur TikTok/Story s'affichera avec des bandes (ou rognage).

**→ Action :** si on veut un rendu plein écran propre sur TikTok et les stories, il faut générer des **versions 9:16**. (Dis-le moi, je décline les 4 visuels au format 9:16.)

En attendant : pour TikTok, privilégier le **mode photo** (qui tolère le 4:5) ou intégrer le visuel comme **carte d'intro** dans une courte vidéo.

---

## 7. Récap des réseaux

- **Instagram** : via **Meta Business Suite** (programmation feed + stories). Possibilité de poster les 4 en **carrousel** unique.
- **Facebook** : si actif, Meta Business Suite publie en même temps que l'Instagram (même back-office).
- **TikTok** : **séparé de Meta** — à programmer via TikTok (ou le planificateur TikTok). Prévoir le 9:16.
- **LinkedIn** : séparé — publication native (les visuels 4:5 y performent le mieux).

---

## 8. Checklist Hermès

- [ ] Récupérer les 4 PNG dans `marketing/visuels-prix/`
- [ ] Régler la bio (lien `/tarifs?src=…` selon le réseau) pour la fenêtre de pub
- [ ] Programmer Instagram + Facebook via Meta Business Suite (légendes §5)
- [ ] Programmer LinkedIn (mettre le lien en **1er commentaire**, pas dans le post)
- [ ] Programmer TikTok (mode photo OU attendre les 9:16)
- [ ] Vérifier l'attribution `?src=` sur chaque lien
- [ ] (Optionnel) Demander les versions **9:16** pour stories/Reels/TikTok plein écran
