# Analyse DeepSeek de la page de vente, confrontée à la prod (16/10/2026)

Source : brief « Optimiser la page de vente » produit par DeepSeek, collé par Alexandre le 16/10/2026.
Méthode : texte de https://www.claudeai-academy.com/ relu le 16/10/2026 dans le navigateur, code de `main` (61ececb puis 8b88131), mémoire du dossier.

## Constat

Le brief reprend presque mot pour mot ce qui est déjà en ligne : le tableau « Mesuré, pas promis » (mêmes 6 tâches, mêmes temps, « 14 h 33 / 26 min », Noy et Zhang), les 4 profils « Pour qui c'est », « Le constat » et ses 4 blocs, le bonus audit 10 places, la ligne « si votre heure vaut 50 € ». DeepSeek a donc lu la page, puis l'a réécrite comme si rien n'existait.

## Les 10 « problèmes » du brief

| # | Problème annoncé | Verdict | Preuve |
|---|---|---|---|
| 1 | Dates 2026 non vérifiables | Faux | On est le 16/10/2026. DeepSeek a une date de coupure antérieure et lit 2026 comme le futur. |
| 2 | Preuve sociale quasi inexistante | Vrai | 1 avis payant (Julien, Starter août 2026), 12 avis contre accès offert, badgés. Se corrige en collectant, pas en écrivant. |
| 3 | Aucun tunnel de capture | Partiel | /kit + séquence de 13 emails existent depuis le 04/10. Mais l'accueil n'avait aucun formulaire : corrigé. |
| 4 | Offre trop large | Vrai en partie | 5 parcours sur 9 sont techniques et passaient avant ceux du public TPE : programme regroupé. |
| 5 | FAQ absente | Faux | 6 questions sur l'accueil, page /faq complète. 2 ajoutées. |
| 6 | Prix mal ancré | Faux | 3 paliers (47 / 497 / 1 497 €), calcul temps gagné, crédit d'ascension. |
| 7 | Ni vidéo ni étude de cas | Vrai | Rien à publier tant qu'aucun acheteur n'a fourni de résultat chiffré. |
| 8 | Pas de segmentation par métier | Faux | 4 profils + page /formation-ia-independants-tpe. Les packs « 20 prompts par métier » n'existent pas. |
| 9 | Pas d'urgence réelle | Partiel | Le bonus réel (10 places, 31/10) n'était visible que dans la carte Mastery : bandeau ajouté. |
| 10 | Pas d'affiliation | Vrai | Décision d'argent (30 % de commission) : à toi. |

## Refusé, avec la raison

| Demande du brief | Pourquoi non |
|---|---|
| H1 « Arrêtez de perdre 6 heures par semaine » | Chiffre faux selon tes propres mesures : 6 h 48 par mois à la main pour 3 tâches hebdo, 6 h 28 gagnées par mois. Et le H1 perd « Claude AI », requête où le site est 2ᵉ sur google.fr (audit SEO du 15/10). |
| « Mise à jour du [DATE_DU_JOUR] » | Une date qui change seule est une fausse preuve. La date affichée vient de `fraicheur.ts`, mise à jour à chaque veille réelle. |
| Badge « Le plus choisi (même si faux) » | Faux : 8 Starter pour 4 Mastery. Pratique commerciale trompeuse (Code de la consommation, art. L121-2). |
| « Valeur réelle : 2 400 € » | Valeur inventée, même règle. Décision du 15/10 : agressif oui, faux non. |
| Vidéos, photos, compteur d'élèves, page /resultats | Rien de réel à mettre dedans aujourd'hui. |
| Pop-up après 20 s | Google déclasse sur mobile les fenêtres qui masquent le contenu ; tranché le 21/09. Remplacé par un bloc dans la page. |
| « 1 h puis 20 min/semaine » | Incohérent : 22 h de pratique à 20 min/semaine = 66 semaines. La FAQ actuelle dit 2 à 3 mois. |
| « J'ai développé X applications », « 2 h/jour depuis X mois », « je réponds sous 24 h » | Faits que toi seul peux donner, et engagement de temps. |
| « Restaurant Manager en Suisse » | Ton CLAUDE.md dit « Directeur opérationnel ». Décision à prendre (déjà signalée le 15/10). |
| Séquence email de 7 jours | Existe déjà (13 emails). |

## Fait le 16/10 (branche `claude/page-vente-2026-10-16`)

1. Bandeau du bonus audit en tête de l'accueil et de /tarifs, compteur lu en base, disparaît seul le 01/11 ou à la 10ᵉ place.
2. Calculateur réglable (fréquences, taux horaire) sur tes temps mesurés.
3. Formulaire du kit gratuit dans l'accueil (source `accueil-kit`, mesurable à part).
4. Programme en deux blocs : 4 parcours du quotidien, puis 5 « pour aller plus loin ».
5. Sortie de « Le constat » vers la leçon gratuite (vérifiée lisible sans compte).
6. Dernier écran en résultat : « 6 h 28 rendues chaque mois », calculé depuis `mesures.ts`.
7. Date de relecture du contenu sous le bouton d'achat.
8. FAQ : « Est-ce que ça marche pour mon métier ? », « Que se passe-t-il après le paiement ? ».
9. Vérité : bibliothèque complète et Mentor marqués « Pass Mastery » dans la méthode ; « leader mondial » retiré.

## Ce qui reste à toi

1. Collecter 3 résultats chiffrés d'acheteurs réels (Julien en premier) : c'est le seul vrai trou de la page.
2. Décider : le Pass Starter contient Claude Code (technique) alors que Contenu et marketing et Stratégie (sans code) sont réservés au Mastery. Pour le public TPE, l'échange vaut d'être testé. C'est un changement d'offre.
3. Décider la fonction affichée (Restaurant Manager ou Directeur opérationnel).
4. Affiliation à 30 % : faisable sans code via l'attribution `?src=` déjà en place, paiement manuel mensuel.

## Limite honnête

La page de septembre (9 ventes) et celle d'octobre (0 vente au 15/10) avaient le même trafic (~20 visites/jour, GSC). Rien ne prouve que la page soit la cause du zéro : ces changements réduisent des frictions, ils ne remplacent pas le trafic. Les objectifs du brief (30 % d'emails, 4 à 7 % d'acheteurs) ne reposent sur aucune donnée : à 20 visites/jour, 10 ventes sur 30 jours demandent environ 1,7 % de conversion, le niveau de septembre.
