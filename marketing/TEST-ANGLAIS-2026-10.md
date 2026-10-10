# Test anglophone : mesurer la demande avant de traduire quoi que ce soit

Décision du 9 octobre 2026. Une page anglaise du kit gratuit, un email anglais, une campagne de 10 $ par jour sur deux semaines, un seuil écrit à l'avance. Rien d'autre n'est traduit : le produit payant reste en français et la page le dit.

## Ce qui est en ligne (après merge)

| Élément | Adresse | Ce qu'il fait |
| --- | --- | --- |
| Page de capture | `/en/kit` (`?src=google-en` pour la pub) | Même structure que `/kit`, en anglais. La source du lead commence toujours par `en-` |
| Page de remerciement | `/en/kit/thanks` | Après inscription |
| Le kit | `/en/kit/resources` | Les 15 prompts traduits, le cas du restaurant, la frontière prompt / Claude Code, et UNE question à la fin : « should it exist in English? » avec un mailto |
| Email de livraison | `lead_magnet` en anglais | Un seul email. La séquence française de 13 emails ignore toute source `en-%` |
| Désinscription | `/desinscription?...&lang=en` | Même mécanisme, textes anglais |

Ce que les leads anglais ne reçoivent pas : la séquence française, les offres en euros, les relances.

## Ce que tu fais côté Google Ads (15 minutes, une fois)

Le classificateur bloque l'écriture Ads par l'agent : c'est toi qui crées la campagne. Paramètres :

- **Type** : Recherche. Réseau Google uniquement, pas de partenaires, pas de Display.
- **Zones** : États-Unis, Royaume-Uni. Option « Présence » (pas « présence ou intérêt »).
- **Langue** : anglais.
- **Budget** : 10 $ par jour (le compte est en euros : 9 €). Deux semaines, soit environ 130 €.
- **Enchères** : maximiser les clics, plafond 1,50 €. Les clics sur « claude ai » coûtent plus cher qu'en France ; si le plafond bloque la diffusion, passer à 2 € et noter la date.
- **Page de destination** : `https://www.claudeai-academy.com/en/kit?src=google-en`
- **Mots clés** (expression exacte et requête large, un seul groupe) : `claude ai prompts`, `how to use claude ai`, `claude ai for business`, `claude ai tutorial`, `claude prompts for work`, `claude code for non developers`, `learn claude ai`.
- **Exclusions** (mots clés à exclure) : `anthropic`, `login`, `download`, `free api`, `api key`, `reddit`, `vs chatgpt`, `jobs`, `salary`, `academy`, `certification`, `udemy`, `coursera`.
- **Annonce** (responsive) :
  - Titres (30 caractères max) : `15 Claude Prompts, Free` · `How To Use Claude AI` · `Claude AI For Real Work` · `Prompts By Job, Ready To Copy` · `Written By A Restaurant Owner` · `No Card, Instant Access`
  - Descriptions (90 caractères max) : `15 working Claude prompts sorted by job, plus what Claude Code does in a real workday.` · `Restaurants, freelancers, developers, data, marketing. Free kit, one email, no spam.`
- **Pas de suivi de conversion Google** à créer : le tag Google est inactif sur le site. La mesure se fait dans la base (ci-dessous).

## Le seuil, écrit avant de lancer

Au bout de 14 jours de diffusion :

| Mesure | Comment la lire | Vert | Rouge |
| --- | --- | --- | --- |
| Leads anglais | `select count(*) from leads where source like 'en-%' and created_at >= '<date de lancement>'` | 40 ou plus | moins de 20 |
| Coût par lead | dépense Ads / leads | sous 5 $ | plus de 10 $ |
| Réponses à la question | emails reçus sur contact@ avec « English course » en objet | 5 ou plus, avec un usage décrit | 0 ou 1 |

Vert sur les trois : on traduit le produit (compter une à deux semaines : 58 leçons, 170 prompts, QCM, Mentor, emails, CGV, prix en dollars, Stripe Tax, support en anglais).
Rouge sur deux : on arrête, la page reste en ligne sans pub, et le sujet est clos pour six mois.
Entre les deux : on prolonge deux semaines avec les titres d'annonce qui ont le meilleur taux de clic, pas plus.

## Ce que ce test ne dit pas

- Si les gens paieraient 497 $ : il mesure l'intérêt pour un kit gratuit, pas un achat. Un lead à 5 $ ne vaut une traduction que si les réponses à la question décrivent un vrai usage professionnel.
- Si l'anglais sera rentable face à Claude Academy (gratuit, en anglais, signé Anthropic) : c'est la question suivante, qu'on ne se pose que si ce test est vert.

## Ce qui a été vérifié avant la mise en ligne

- Inscription de test depuis `/en/kit` : lead créé avec la source `en-kit`, email anglais reçu, lien de désinscription anglais fonctionnel, aucun email français envoyé ensuite (le cron exclut `en-%`).
- La page `/en/kit` porte `lang="en"`, une balise canonique et les alternates `fr` / `en`.
