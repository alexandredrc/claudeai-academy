# Séquence emails des leads du kit gratuit

> Réécrite le 4 octobre 2026. Code : `src/lib/email/lead-magnet.ts` (contenu) et `src/app/api/cron/lead-nurture/route.ts` (planning : chaque jour à 9 h 30 UTC, soit 11 h 30 à Paris en été). Relecture : `node scripts/preview-lead-emails.mjs` puis ouvrir `.preview/emails-leads/index.html`.

## Planning

Un lead reçoit l'email suivant quand il a l'âge indiqué **et** que son dernier email date d'au moins l'écart indiqué. Jamais plus d'un email par jour et par personne. Un lead qui achète sort de la séquence ; un lead désinscrit aussi.

| Email | Âge | Écart | Objet | Ce qu'il montre | Offre |
|---|---|---|---|---|---|
| Kit | J0 | | Ton kit : 15 prompts Claude prêts à l'emploi | Livraison, un seul prompt à appliquer | |
| A1 | J+2 | 1 j | Tu n'utilises pas Claude. Tu le sous-utilises. | Les 3 habitudes : contexte, procédures, vérification | |
| A2 | J+3 | 1 j | 40 % de temps en moins : ce que les études mesurent vraiment | Science, Harvard/BCG, Anthropic ; 2 h gagnées ≈ 47 € | Starter |
| A3 | J+5 | 2 j | « Je trouverai bien sur YouTube » | Contenu à jour : date, notes de mise à jour, sources surveillées | Starter |
| A4 | J+7 | 2 j | Ce qu'il y a derrière les 47 € | Les 3 parcours et 23 leçons du Starter | Starter |
| A5 | J+10 | 2 j | 47 €, rentabilisés en 2 heures (ou moins) | 47 € = 34 min de dev, 45 min de rédaction, 2 h de salaire | Starter, Mastery |
| B1 | J+14 | 4 j | Cas n° 1 : la demi-journée d'admin que Qonto rend aux indépendants | Admin des indépendants (cas français) | Starter |
| B2 | J+21 | 7 j | Cas n° 2 : un outil sur mesure, sans être développeur | Tableaux de bord en 1 ou 2 jours, Claude Code | Starter |
| B3 | J+28 | 7 j | Cas n° 3 : plus de contenu, sans perdre ta voix | Créateurs solo, pack contenu pour TPE | Mastery |
| B4 | J+35 | 7 j | Cas n° 4 : 21 heures par semaine rendues à un dirigeant | Agents, automatisation à vendre aux PME | Mastery |
| B5 | J+42 | 7 j | Cas n° 5 : 180 000 $ retrouvés dans des factures | Data, audit de factures | Mastery |
| B6 | J+49 | 7 j | Cas n° 6 : 8 à 15 heures de rédaction ramenées à 30 minutes | Rédaction experte ; les débutants gagnent le plus | Starter |
| B7 | J+56 | 7 j | Cas n° 7 : trois façons réalistes de gagner de l'argent avec Claude | Métier accéléré, service productisé, petit outil | Mastery |
| B8 | J+63 | 7 j | Les 7 cas en une page (et la suite) | Récapitulatif, les deux pass, garantie | Starter, Mastery |

**Au premier passage après la mise en production :** 71 des 83 leads (ceux qui ont fini l'ancienne séquence) sont dus pour B1. Plafond de 40 envois par passage : ils le reçoivent sur deux matins, les nouveaux leads passent en priorité.

## Règles de contenu tenues

- Chaque chiffre a sa source en lien dans l'email. Sources ouvertes et relues le 04/10/2026.
- Les études Science, Harvard/BCG et QJE portent sur ChatGPT ou GPT-4 : l'email le dit.
- Les cas clients viennent des pages d'Anthropic : chiffres déclarés par les entreprises, dits comme tels (ChatPlace : « selon l'éditeur »).
- Chaque calcul de gain est présenté comme un ordre de grandeur, avec ses hypothèses, et la mention « pas une promesse de revenu ».
- Repères de valeur du temps : Malt (tarifs jour moyens affichés, août 2026) et INSEE (salaire moyen du privé 2024).
- Pas de tiret cadratin (contrôlé par le script de prévisualisation).

## Suivi

- Chaque lien vers le site porte `?src=email-lead-xx` : une vente venue d'un email apparaît en « email / newsletter » avec l'email exact en campagne, dans le rapport du matin.
- Ouvertures et clics par email : table `email_events` (webhook Resend). Au 04/10, **0 clic enregistré sur tous les emails de leads, y compris la livraison du kit** : le suivi des clics est très probablement désactivé chez Resend (Domains → claudeai-academy.com → Click tracking).
- Désinscription en un clic : lien en bas de chaque email + bouton natif « Se désabonner » de Gmail et Apple Mail (en-têtes List-Unsubscribe). Page `/desinscription`, confirmation obligatoire (les antivirus de messagerie ouvrent les liens avant l'humain).
