# Liens traqués : un lien par emplacement, jamais un lien nu

> Règle : chaque lien publié vers le site porte un `?src=` qui nomme l'EMPLACEMENT (pas juste le réseau). Le site traduit `src` en `utm_*` pour GA4, pose un cookie de provenance, le recopie dans le paiement Stripe, et l'écrit dans la base à la vente. Résultat : le rapport Telegram du matin et `marketing/suivi-ventes-canaux.md` disent quel lien a rapporté quoi.
>
> Un lien sans `?src=` est compté « direct » ou « referral » : on sait d'où vient le visiteur en gros, jamais quel post ou quelle bio a travaillé.

## Liens à copier tels quels

| Emplacement | Lien | Ce que le rapport affichera |
|---|---|---|
| Bio Instagram | `https://www.claudeai-academy.com/kit?src=instagram-bio` | instagram / bio |
| Réponse automatique ManyChat (DM) | `https://www.claudeai-academy.com/kit?src=instagram-dm` | instagram / dm |
| Story Instagram (sticker lien) | `https://www.claudeai-academy.com/kit?src=instagram-story` | instagram / story |
| Post LinkedIn (1er commentaire) | `https://www.claudeai-academy.com/kit?src=linkedin-post` | linkedin / post |
| Section Infos du profil LinkedIn | `https://www.claudeai-academy.com/kit?src=linkedin-profil` | linkedin / referral (campagne `linkedin-profil`) |
| Newsletter / séquence email | `https://www.claudeai-academy.com/tarifs?src=email` | email / newsletter |
| Bio TikTok | `https://www.claudeai-academy.com/kit?src=tiktok` | tiktok / social |
| Description YouTube | `https://www.claudeai-academy.com/kit?src=youtube` | youtube / social |
| Page Facebook | `https://www.claudeai-academy.com/kit?src=facebook` | facebook / social |
| Fiche Google Business | `https://www.claudeai-academy.com/?src=google-business` | google / referral (campagne `google-business`) |
| Signature email | `https://www.claudeai-academy.com/?src=signature` | signature / referral |
| Carte de visite, QR code | `https://www.claudeai-academy.com/?src=qr` | qr / referral |
| Google Ads, groupe « Formation Claude » (URL finale) | `https://www.claudeai-academy.com/formation-claude-ai?utm_source=google&utm_medium=cpc&utm_campaign=formation-claude` | google / cpc (campagne `formation-claude`) |
| Google Ads, groupe « Agent IA » (URL finale) | `https://www.claudeai-academy.com/creer-un-agent-ia?utm_source=google&utm_medium=cpc&utm_campaign=agent-ia` | google / cpc (campagne `agent-ia`) |
| Landing Ads, lien kit sous les boutons | `https://www.claudeai-academy.com/kit?src=ads-formation-claude` | ads / referral (campagne `ads-formation-claude`) |
| Page /formation-claude-code, bouton kit | `https://www.claudeai-academy.com/kit?src=guide-claude-code` | guide / referral (campagne `guide-claude-code`) |

Un `src` qui n'est pas dans la liste n'est jamais perdu : il apparaît sous son propre nom. Pour un nouvel emplacement, inventer un nom court en minuscules avec des tirets (`webinaire-oct`, `podcast-x`) et l'utiliser partout pareil.

## Ce qui est mesuré sans rien faire

- Arrivées depuis Google, Bing, DuckDuckGo : `google / organic`, etc.
- Arrivées depuis ChatGPT, Perplexity, Claude, Gemini, Copilot : `chatgpt / ia`, `perplexity / ia`… C'est la mesure GEO : savoir si les moteurs génératifs citent le site et si ces visiteurs achètent.
- Arrivées depuis LinkedIn, Instagram, Facebook, X, TikTok, YouTube, Threads, Reddit sans `?src=` : `linkedin / social`, etc. On sait le réseau, pas l'emplacement.
- Clic Google Ads sans utm : `google / cpc`.
- Tout le reste : `direct`.

## Où lire le résultat

- **Telegram, chaque matin à 08:00** : section « VENTES PAR CANAL » (7 j, 30 j, cumul) et « CHECKOUTS PAR CANAL » (combien ont ouvert le paiement, combien ont payé, par canal).
- **Alerte de vente instantanée** : la ligne « Canal : … » dit d'où venait l'acheteur.
- **`marketing/suivi-ventes-canaux.md`** (dossier par défaut) : tableau complet, vente par vente, régénéré chaque matin.
- **À la main** : `node pipeline/ventes_par_canal.mjs --md`.

## Règle de décision

Le canal à pousser est celui qui produit des **ventes**, pas des clics ni des leads. Avant de conclure sur un canal : au moins 30 jours et au moins 200 visiteurs mesurés (GA4) sur ce canal. En dessous, c'est du bruit.
