# Pack preuve sociale, FAQ, page résultats, séquence 7 jours

> Rédigé le 16/10/2026 à partir d'un brief collé par Alexandre. Chaque chiffre porte sa source.
> Base de données lue le 16/10/2026 (Supabase `claudeai-academy-prod`). Pages Anthropic relues le 16/10/2026.
> Rien n'est en ligne ni envoyé. Mise sur le site et envois = « go » d'Alexandre.

---

## 0. Le brief confronté à la prod (16/10/2026)

| Affirmation du brief | Réalité vérifiée | Preuve |
|---|---|---|
| « Les autres retours » vide | **Faux.** 12 avis + 1 avis mis en avant | HTML de www.claudeai-academy.com : « Carrossier » et « Mathilde » présents, `testimonials.tsx` |
| FAQ vide | **Faux.** 8 Q/R sur l'accueil, 18 sur /faq | Réponses présentes dans le HTML, repliées par défaut (un robot de lecture ne les voit pas ouvertes) |
| Pas de séquence email | **Faux.** Kit + 13 emails (A1 à A5, B1 à B8), en prod depuis le 04/10 | `src/lib/email/lead-magnet.ts`, `marketing/SEQUENCE-EMAILS-LEADS.md` |
| Pas de photo du fondateur | **Faux.** Photo en ligne depuis le 10/10 | `public/alexandre.jpg`, 17 occurrences dans le HTML |
| Dates incohérentes | **Partiel.** Chaque carte porte déjà « Mis à jour le », mais aucune phrase ne l'explique | 36 occurrences de « Mis à jour le » sur l'accueil |
| Pas de blog SEO | **Partiel.** 14 pages thématiques, pas de rubrique /blog | `src/app/` |
| Pas d'avis tiers, de vidéo, de compteur, de /resultats, de LinkedIn, de webinaire | **Vrai** | Aucune occurrence de « linkedin » ni de « /resultats » dans le HTML |

**Contradiction à trancher.** Le brief exige « Transparence totale (statut des avis) ». Ta décision du 16/10/2026 retire ce statut du site. Les deux ne tiennent pas ensemble. Le bloc A2 est prêt si tu changes d'avis.

**Chiffres réels au 16/10/2026** (table `purchases`, sessions `cs_live_` à montant non nul) :

| Indicateur | Valeur |
|---|---|
| Ventes payées depuis le 10/07/2026 | 13 (9 Starter à 47 €, 4 Mastery à 497 €) |
| Encaissé | 2 411 € (9 × 47 + 4 × 497), hors Starter remboursé le 13/06 |
| Ventes d'octobre | 1 : Starter, 16/10/2026, venue de Google Ads (`utm_source=google`) |
| Accès Mastery offerts (0 €) | 4 |
| Acheteurs payants ayant terminé au moins une leçon | 7 sur 13 (53 leçons terminées) |
| Leads actifs non acheteurs | 95 sur 97 |
| Places du bonus audit prises | 0 sur 10 (aucun Mastery payé depuis le 15/10) |

Ces chiffres ne se publient pas tels quels : « 13 membres » affaiblit plus qu'il ne rassure. Voir A4.

---

## LIVRABLE A. Pack preuve sociale

Le vrai trou n'est pas l'affichage des avis. C'est l'absence de **résultat mesuré chez un acheteur**. Dans l'équation de valeur de Hormozi (*$100M Offers*, 2021), c'est la « probabilité perçue » qui manque. Le pack sert donc d'abord à **récolter**, ensuite à afficher.

### A1. Email de collecte aux 13 acheteurs (depuis contact@, un par un)

**Objet :** 3 questions sur ton usage de Claude (5 minutes)

> Bonjour {prénom},
>
> Tu as rejoint ClaudeAI Academy le {date}. Merci.
>
> Je cherche à mesurer ce que la formation change vraiment. Pas des compliments : des faits.
>
> Trois questions, réponds directement à cet email :
>
> 1. Quel est ton métier, et dans quelle ville ?
> 2. Quelle tâche fais-tu maintenant avec Claude ? Combien de temps prenait-elle avant, combien maintenant ?
> 3. En une phrase : qu'est-ce qui t'a le plus servi ?
>
> Si tu es d'accord, je publierai ta réponse sur le site avec ton prénom, ton métier et ta ville. Jamais ton nom de famille ni ton email. Dis-moi simplement « oui, tu peux publier » ou « non ».
>
> Si rien n'a changé pour toi, dis-le aussi. Ça m'aide autant.
>
> Alexandre
> ClaudeAI Academy

**Règles :**
- Aucune contrepartie (ni bonus, ni réduction). Sinon la contrepartie doit être affichée à côté de l'avis (art. D111-10 du Code de la consommation).
- Le consentement écrit (« oui, tu peux publier ») est gardé dans la boîte contact@. C'est ta preuve en cas de contrôle.
- Envoyer aux 13, pas seulement aux actifs. Trier les réponses est permis, trier les destinataires fausse l'échantillon.

**Relance unique à J+4 :**

> Bonjour {prénom},
>
> Je relance une seule fois. Une ligne suffit : ton métier et une tâche que tu fais avec Claude.
>
> Alexandre

### A2. Bloc « Comment ces avis sont recueillis » (à coller seulement si tu reviens sur ta décision du 16/10)

> **Comment ces avis sont recueillis.** Les retours de cette page viennent des premiers utilisateurs de la formation. Certains ont acheté leur accès, d'autres l'ont reçu gratuitement pour tester le programme avant son ouverture. Aucun avis n'a été rémunéré. Nous publions tous les retours reçus, positifs ou non, après accord écrit de leur auteur. Chaque avis porte le mois où il a été donné.

Base légale (droit français) : art. L111-7-2 et D111-10 du Code de la consommation. Sanction : amende administrative (L131-4), montant NON VÉRIFIÉ le 16/10/2026 (Légifrance bloque la lecture automatique). Plafond le plus souvent cité : 75 000 € pour une personne physique, 375 000 € pour une personne morale, à confirmer sur Légifrance. Un avocat en droit de la consommation tranche si un contrôle arrive.

### A3. Format d'un témoignage publié (dès la première réponse reçue)

> « {citation exacte, corrigée à l'orthographe seulement} »
>
> **{Prénom}**, {métier}, {ville}
> {Tâche} : {temps avant} → {temps après}, mesuré par {prénom}
> Membre depuis {mois année}

Exemple de forme (aucune donnée réelle, ne pas publier) :

> **Prénom**, plombier, Annecy
> Devis type : 25 min → 6 min, mesuré par Prénom
> Membre depuis septembre 2026

### A4. Compteur d'élèves : recommandation

| Option | Texte | Avis |
|---|---|---|
| **Garder « premiers membres » (recommandé)** | Phrase actuelle : « Vous faites partie des premiers membres » | Vrai, et transforme le petit nombre en avantage |
| Compteur exact | « 13 membres depuis juillet 2026 » | Vrai, mais signale une offre qui ne prend pas |
| Compteur d'activité | « 53 leçons terminées par les membres » | Vrai, mais petit et invérifiable pour le lecteur |

Seuil proposé pour afficher un compteur : 50 acheteurs payants. Argument contraire le plus fort : un chiffre bas mais exact rassure certains acheteurs méfiants des formations IA « à 10 000 élèves ». Non mesurable avec 1 vente par mois.

### A5. Avis tiers

| Plateforme | Faisable | Comment | Statut |
|---|---|---|---|
| **Trustpilot** | Oui, compte entreprise gratuit | Inviter **tous** les acheteurs, pas une sélection. Lien affiché en pied de page une fois 5 avis reçus | Règle « pas d'invitation sélective » : supposé, à relire dans les règles Trustpilot avant envoi |
| Google (fiche d'établissement) | Probablement non | Google réserve les fiches aux entreprises qui rencontrent leurs clients en personne | Supposé, à vérifier dans les consignes Google Business Profile |

À ne lancer qu'après A1 : un profil Trustpilot vide ou à 1 avis fait pire que pas de profil.

### A6. Vidéo témoignage : consigne à envoyer à un acheteur qui a dit oui

> Merci pour ton retour. Si tu es d'accord, une vidéo de 45 à 60 secondes au téléphone, en format vertical. Trois phrases suffisent :
> 1. « Je m'appelle {prénom}, je suis {métier} à {ville}. »
> 2. « Avant, {tâche} me prenait {temps}. Maintenant, {temps}. »
> 3. « Ce qui m'a servi le plus : {une chose}. »
> Pas besoin de sourire ni de tout dire. Le naturel compte plus que la qualité.

Consentement à faire signer avant publication : droit à l'image (art. 9 du Code civil) et RGPD (art. 6.1.a, consentement retirable à tout moment).

### A7. Fondateur

**LinkedIn.** Ajouter un second encart sous Instagram dans `founder.tsx`. Il me faut l'URL exacte de ton profil.

> **LinkedIn**
> Mon parcours professionnel, vérifiable. Vingt ans dans l'hôtellerie-restauration, aujourd'hui en poste en Suisse.

**Script de vidéo de présentation (60 secondes, face caméra, téléphone).** Seulement des faits vérifiables :

> Je m'appelle Alexandre. Je dirige un restaurant en Suisse.
> Je ne viens pas de la tech. J'utilise Claude tous les jours dans mon métier.
> Une fiche technique chiffrée me prenait plus de trois heures. Avec Claude, deux minutes, relecture comprise.
> J'ai construit cette formation pour les gens comme moi : artisans, commerçants, indépendants.
> Pas de jargon. Vous donnez votre contexte une fois, Claude écrit le premier jet, vous décidez.
> La première leçon de chaque parcours est gratuite. Commencez par là.

**Décision en attente depuis le 16/10 :** le site dit « Restaurant Manager en Suisse », ton CLAUDE.md dit « directeur opérationnel ». Le script ci-dessus dit « je dirige un restaurant », vrai dans les deux cas.

### A8. Phrase sur les dates (sous le programme)

> Chaque parcours porte sa propre date de mise à jour. Un parcours change quand son sujet change : une nouvelle version de Claude Code ne touche pas la leçon sur les prompts. Le détail de chaque changement est dans le [journal des mises à jour](/changelog).

---

## LIVRABLE B. FAQ (15 questions)

Écrite pour le public décidé le 15/10/2026 : indépendants et TPE non techniques. Colonne « Où » : **E** = existe déjà sur le site (texte resserré ici), **N** = nouvelle.

| # | Question | Où |
|---|---|---|
| 1 | Je n'y connais rien en informatique. C'est pour moi ? | E |
| 2 | Est-ce que ça marche pour mon métier ? | E |
| 3 | Combien de temps faut-il y consacrer ? | E |
| 4 | Faut-il payer un abonnement Claude en plus ? | N |
| 5 | Puis-je mettre les données de mes clients dans Claude ? | N |
| 6 | Starter ou Mastery : lequel choisir ? | E |
| 7 | Pourquoi le Pass Mastery passe-t-il à 697 € ? | N |
| 8 | Comment marche le bonus audit vidéo ? | N |
| 9 | J'ai pris le Starter. Puis-je passer au Mastery ? | N |
| 10 | Puis-je payer en plusieurs fois ? | N |
| 11 | Et si ça ne me convient pas ? | E |
| 12 | Le contenu sera-t-il dépassé dans 6 mois ? | E |
| 13 | Est-ce une formation officielle d'Anthropic ? | N |
| 14 | Ça marche sur mon téléphone, mon Mac ou mon PC ? | N |
| 15 | J'ai besoin d'une facture pour mon entreprise. | E |

**1. Je n'y connais rien en informatique. C'est pour moi ?**
Oui. Le parcours « Bien démarrer avec Claude » part de zéro : créer son compte, installer, paramétrer. Aucun code n'est demandé dans les parcours prompts, contenu et stratégie. Quatre parcours vont plus loin techniquement : Claude Code, Data et SQL, Trading, Skills et GitHub. Chacun démarre par l'essentiel.

**2. Est-ce que ça marche pour mon métier ?**
Oui, si votre travail passe par l'écrit : devis, relances, emails, publications, procédures. La méthode est la même partout. Vous donnez une fois votre contexte à Claude, il écrit le premier jet, vous relisez et vous décidez. Pour juger, lisez la leçon gratuite sur Claude dans Word, Excel et Outlook, sans inscription.

**3. Combien de temps faut-il y consacrer ?**
Une heure pour commencer à vous en servir, avec les trois leçons conseillées. Le programme complet compte 58 leçons, une dizaine d'heures de lecture. Comptez environ 22 heures avec la mise en pratique. Vous gardez l'accès à vie, rien ne presse.

**4. Faut-il payer un abonnement Claude en plus ?**
Non, le plan gratuit de Claude suffit pour démarrer. Il a des limites d'usage. Le plan Pro coûte 17 $ par mois en annuel, 20 $ en mensuel, selon la page tarifs d'Anthropic. Il devient utile si vous vous servez de Claude chaque jour. La formation montre quand passer au Pro, et quand ce n'est pas nécessaire.

**5. Puis-je mettre les données de mes clients dans Claude ?**
Pas sans précaution. Ne collez jamais de données personnelles d'un client sans les anonymiser : remplacez le nom par « Client A ». C'est une règle de métier, quel que soit le plan. L'usage de vos conversations pour l'entraînement dépend de vos réglages de confidentialité. La formation montre où les trouver.

**6. Starter ou Mastery : lequel choisir ?**
Le Starter (47 €) donne 3 parcours et 24 leçons : démarrer, bien rédiger ses demandes, Claude Code. Le Mastery (497 € jusqu'au 31 octobre) donne les 9 parcours, les 58 leçons et le Mentor IA. Prenez le Starter pour tester. Prenez le Mastery si vous voulez traiter le contenu, le marketing et la stratégie de votre activité.

**7. Pourquoi le Pass Mastery passe-t-il à 697 € ?**
Le prix du Mastery passe de 497 € à 697 € le 1er novembre 2026, à minuit, heure de Paris. Ceux qui achètent avant paient 497 € et gardent l'accès à vie. Les mises à jour restent incluses pour eux, sans supplément. Rien d'autre ne change dans l'offre.

**8. Comment marche le bonus audit vidéo ?**
Les 10 premiers Pass Mastery payés du 15 au 31 octobre 2026 le reçoivent. Vous m'envoyez vos demandes à Claude. J'enregistre une vidéo de 15 minutes qui les corrige, sous 7 jours après votre envoi. Le compteur de places restantes sur le site est lu en direct dans nos ventes.

**9. J'ai pris le Starter. Puis-je passer au Mastery ?**
Oui. Les 47 € déjà payés sont déduits automatiquement. Le passage coûte 450 € jusqu'au 31 octobre, puis 650 € à partir du 1er novembre.

**10. Puis-je payer en plusieurs fois ?**
Oui, en 3 fois sans frais avec Klarna : 3 × 165,67 € pour le Mastery jusqu'au 31 octobre. Klarna décide de l'accord au moment du paiement. Le paiement en 3 fois est proposé en France et en Belgique, pas en Suisse.

**11. Et si ça ne me convient pas ?**
Garantie 14 jours, satisfait ou remboursé. Écrivez à contact@claudeai-academy.com dans les 14 jours suivant l'achat. Le remboursement est intégral, sans justification à fournir.

**12. Le contenu sera-t-il dépassé dans 6 mois ?**
C'est le risque numéro un d'une formation sur l'IA. Une veille surveille les sources officielles et signale chaque leçon qu'un changement rend fausse. Les leçons portent 99 notes de mise à jour datées depuis juillet 2026, toutes visibles dans le journal public. Les mises à jour sont incluses, sans supplément.

**13. Est-ce une formation officielle d'Anthropic ?**
Non. ClaudeAI Academy est un organisme indépendant, sans lien avec Anthropic, l'éditeur de Claude. Anthropic propose ses propres cours gratuits, en anglais. Nous proposons un programme en français, tourné vers les usages des indépendants et des TPE.

**14. Ça marche sur mon téléphone, mon Mac ou mon PC ?**
Oui. Les leçons se lisent dans un navigateur, sur téléphone comme sur ordinateur. Claude existe sur le web, en application Windows et Mac, et sur iPhone et Android. Claude Code se pratique plus confortablement sur ordinateur.

**15. J'ai besoin d'une facture pour mon entreprise.**
Vous saisissez vos coordonnées de facturation au moment du paiement. La facture arrive automatiquement par email. TVA non applicable, article 293 B du CGI : le prix affiché est le prix payé.

**À vérifier avant mise en ligne :** n° 10, accès Klarna par pays (mémoire du 10/10 : Belgique oui, Suisse, Luxembourg et Canada non) ; n° 4, tarif Pro relu par la veille du 16/10 en dollars, le prix affiché en euros peut différer selon le pays.

---

## LIVRABLE C. Page /resultats et 4 études de cas

Règle de la page : **rien n'y entre sans mesure ni source**. Aujourd'hui aucun acheteur n'a transmis de résultat mesuré. La page le dit, au lieu de le cacher. Elle se remplit avec les réponses à A1.

### Texte de la page

**Titre (H1) :** Résultats mesurés, pas promis

**Chapeau :**
Ici, chaque chiffre a une source. Vous savez qui a mesuré, quand, et comment. Quand une donnée vient d'ailleurs que de nos membres, nous le disons.

**Encart « Ce que vous ne trouverez pas ici » :**
- Aucun chiffre de revenu promis.
- Aucun témoignage sans prénom, métier et ville.
- Aucune étude présentée comme portant sur Claude si elle porte sur un autre outil.

### Étude de cas 1. Restaurant : le fondateur

**Qui :** Alexandre, fondateur de ClaudeAI Academy, direction d'un restaurant en Suisse.
**Mesure :** temps « sans » chronométrés autrefois sur de vraies tâches. Temps « avec » chronométrés le 15/10/2026, conversation Claude vierge, demande et relecture comprises.
**Limite :** mesures de l'auteur de la formation. À lire comme un ordre de grandeur, pas comme une moyenne.

| Tâche | Sans Claude | Avec Claude |
|---|---|---|
| Fiche technique chiffrée d'un plat (8 ingrédients) | 3 h 10 | 2 min |
| Prix de la carte après une hausse fournisseur (20 plats) | 6 h 05 | 3 min |
| Réponse à un avis Google négatif | 15 min | 2 min |
| Descriptions de 5 plats pour la carte | 25 min | 2 min |

**Ce qui fait la différence :** le contexte donné une fois (fournisseurs, grammages, coefficient), puis réutilisé. La leçon correspondante : « Personnaliser Claude », parcours Bien démarrer.

### Étude de cas 2. Indépendant ou TPE : l'administratif du soir

**Qui :** mêmes conditions de mesure que le cas 1, sur six tâches types d'une petite entreprise.

| Tâche | Sans Claude | Avec Claude |
|---|---|---|
| Relance d'une facture impayée (3 messages) | 37 min | 2 min |
| Réponse à un client qui conteste une facture | 24 min | 1 min |
| Compte rendu d'une réunion d'une heure | 41 min | 2 min |
| Publication Instagram d'un produit | 19 min | 3 min |
| Fiche de poste pour un recrutement | 1 h 19 | 4 min |
| Procédure d'ouverture ou de fermeture | 1 h 18 | 5 min |

**Le calcul, si vous faites les trois premières chaque semaine :** 102 min sans, 5 min avec. Soit 97 min gagnées par semaine, 6 h 28 sur 4 semaines. À 50 € de l'heure : 323 € de temps par mois. Ce n'est pas une promesse : refaites le calcul avec vos tâches dans le calculateur.

Source : `src/lib/offre/mesures.ts`, fichier `marketing/MESURE-GAINS-CLAUDE-2026-10.xlsx`.

### Étude de cas 3. Indépendants et banque en ligne : Qonto

**Ce cas ne concerne pas un membre de ClaudeAI Academy.** Il est publié par Anthropic, relu le 16/10/2026.

- Les clients de Qonto passent jusqu'à 8 heures par mois sur l'administratif financier, selon une analyse de Forrester pour Qonto.
- Avec les outils intégrant Claude, un entrepreneur seul récupère une demi-journée d'administratif par mois.
- La création d'une facture client prend 3 fois moins de temps, selon Qonto.

**Ce que vous pouvez en tirer sans Qonto :** les relances, les factures et les réponses aux clients sont les tâches qui rendent le plus de temps. Ce sont les étapes du cas 2.

Source : [claude.com/customers/qonto](https://claude.com/customers/qonto)

### Étude de cas 4. Créateurs et commerces sur Instagram : ChatPlace

**Ce cas ne concerne pas un membre de ClaudeAI Academy.** Il est publié par Anthropic, relu le 16/10/2026.

- Les créateurs actifs déclarent gagner 15 à 20 heures par semaine sur le contenu et les messages privés.
- Ils déclarent une hausse de revenus de 15 à 40 %. Cause avancée : publier plus souvent, répondre plus vite.

**Notre lecture :** ce sont les chiffres de l'éditeur sur ses propres clients, déclarés, pas mesurés par un tiers. Prenez-les comme un signal. Divisez-les par trois pour une hypothèse prudente : 5 heures par semaine.

Source : [claude.com/customers/chatplace](https://claude.com/customers/chatplace)

### Section « Résultats de nos membres »

> **Résultats de nos membres : en cours de collecte.**
> Nous avons demandé à chaque acheteur ce que la formation a changé, chiffres à l'appui. Les premières réponses seront publiées ici, avec prénom, métier, ville et mesure. Aucune ne l'est encore : nous préférons une page vide à une page fausse.

**Cas à ajouter ensuite (déjà documentés par Anthropic, relus le 16/10/2026) :**
- Pat Miller, fondateur d'une communauté de patrons de petites entreprises : « plus de 21 heures par semaine » économisées avec Cowork.
- Rebel Cheese : environ 180 000 $ de surfacturations de transport récupérés.
- Liberty Trailers : des tableaux de bord construits « en un jour ou deux » au lieu de semaines.
Source : [claude.com/solutions/small-business](https://claude.com/solutions/small-business)

**Contre-épreuve :** une page /resultats sans résultat de membre peut décevoir le visiteur qui clique. Option prudente : ne pas créer de lien dans le menu avant 3 cas de membres. La lier seulement depuis la section « Mesuré, pas promis ».

---

## LIVRABLE D. Séquence de 7 jours : fin du prix à 497 €

### Pourquoi celle-ci et pas une autre

La séquence d'accueil existe déjà (kit + 13 emails sur 63 jours). Ce qui manque : **aucun email ne parle de la hausse du 1er novembre ni du bonus audit.** Les 95 leads actifs n'ont jamais reçu de date limite. La structure suit le « cart close » de Jeff Walker (*Launch*, 2014) : ouverture, preuve, objections, dernier jour.

### Cible, dates, contraintes

| Point | Réglage |
|---|---|
| Cible | 95 leads actifs non acheteurs. Variante pour les 9 acheteurs Starter (passage à 450 €) |
| Dates | Du dimanche 25/10 au samedi 31/10/2026, 1 email par jour, 11 h 30 heure de Paris |
| Conflit | Mettre en pause la séquence d'accueil sur ces 7 jours pour les mêmes leads (1 email par jour maximum) |
| Limite Resend | Plan gratuit : 100 emails par jour. **Décision d'Alexandre le 16/10/2026 : deux salves par email** (environ 48 leads chacune, à au moins une heure d'écart), Resend reste gratuit |
| Chiffres dynamiques | Places du bonus lues en base au moment de l'envoi, jamais écrites à la main |
| Lien de suivi | `?src=email-hausse-j1` à `j7` |
| Désinscription | Lien en bas de chaque email + en-têtes List-Unsubscribe, comme la séquence actuelle |

### J1, dimanche 25/10

**Objet :** Le 1er novembre, le Pass Mastery passe à 697 €
**Aperçu :** Ce qui change, ce qui ne change pas.

> Bonjour {prénom},
>
> Une information datée, sans détour.
>
> Le Pass Mastery coûte 497 € jusqu'au samedi 31 octobre, minuit, heure de Paris. Le 1er novembre, il passe à 697 €.
>
> Ce qui ne change pas : l'accès à vie, les mises à jour incluses, la garantie de 14 jours.
>
> Ce qui s'ajoute jusqu'au 31 octobre : les 10 premiers acheteurs reçoivent un audit vidéo de 15 minutes. J'y corrige leurs demandes à Claude, une par une. Places restantes ce matin : {places}/10.
>
> Dans les six prochains jours, je t'envoie de quoi décider. Pas de pression : des faits.
>
> [Voir le Pass Mastery](https://www.claudeai-academy.com/tarifs?src=email-hausse-j1)
>
> Alexandre

### J2, lundi 26/10

**Objet :** 24 minutes, puis 1 minute
**Aperçu :** Mes temps mesurés, sur des tâches de petite entreprise.

> Bonjour {prénom},
>
> J'ai chronométré mes propres tâches. Avant Claude, puis avec Claude, relecture comprise.
>
> - Répondre à un client qui conteste une facture : 24 min avant, 1 min avec.
> - Relancer une facture impayée en 3 messages : 37 min avant, 2 min avec.
> - Rédiger le compte rendu d'une réunion d'une heure : 41 min avant, 2 min avec.
>
> Si tu fais ces trois tâches chaque semaine : 6 h 28 gagnées sur 4 semaines.
>
> Ce sont mes mesures, pas une promesse. Ton gain dépend de tes tâches. Le calculateur du site te donne le tien en 30 secondes.
>
> [Faire mon calcul](https://www.claudeai-academy.com/tarifs?src=email-hausse-j2)
>
> Alexandre

### J3, mardi 27/10

**Objet :** « Je n'ai pas le temps de suivre une formation »
**Aperçu :** Une heure suffit pour commencer.

> Bonjour {prénom},
>
> C'est l'objection que j'entends le plus. Elle est juste : tu n'as pas 22 heures devant toi.
>
> Tu n'en as pas besoin. Trois leçons suffisent pour commencer, une heure en tout :
>
> 1. Personnaliser Claude : tu lui donnes ton contexte une fois.
> 2. Être clair et direct : la demande qui donne un bon premier jet.
> 3. Claude dans Word, Excel et Outlook : là où tu travailles déjà.
>
> La troisième est gratuite, sans inscription. Lis-la ce soir. Tu sauras si la méthode te va.
>
> [Lire la leçon gratuite](https://www.claudeai-academy.com/?src=email-hausse-j3)
>
> Alexandre

**À faire avant l'envoi :** remplacer le lien par l'URL exacte de la leçon gratuite.

### J4, mercredi 28/10

**Objet :** Ce que tu risques vraiment avec 497 €
**Aperçu :** 14 jours pour changer d'avis.

> Bonjour {prénom},
>
> Faisons le compte du risque.
>
> - Garantie 14 jours : un email à contact@claudeai-academy.com et tu es remboursé en entier. Sans justification.
> - Paiement en 3 fois sans frais avec Klarna : 3 × 165,67 €, si Klarna l'accepte.
> - Accès à vie : pas d'abonnement, pas de renouvellement.
>
> Le seul coût qui ne se rembourse pas, c'est attendre. Le 1er novembre, le même accès coûte 200 € de plus.
>
> [Voir le Pass Mastery](https://www.claudeai-academy.com/tarifs?src=email-hausse-j4)
>
> Alexandre

### J5, jeudi 29/10

**Objet :** L'audit vidéo : comment ça se passe
**Aperçu :** {places} places restantes sur 10.

> Bonjour {prénom},
>
> Le bonus audit, concrètement.
>
> 1. Tu prends le Pass Mastery avant le 31 octobre.
> 2. Tu réponds à l'email de bienvenue avec 3 à 5 demandes que tu fais à Claude.
> 3. Sous 7 jours, je t'envoie une vidéo de 15 minutes. Je reprends chaque demande et je la réécris devant toi.
>
> Réservé aux 10 premiers acheteurs. Places restantes ce matin : {places}/10. Le compteur du site est lu en direct.
>
> [Prendre une place](https://www.claudeai-academy.com/tarifs?src=email-hausse-j5)
>
> Alexandre

### J6, vendredi 30/10

**Objet :** Starter ou Mastery : la réponse honnête
**Aperçu :** Parfois, le Starter suffit.

> Bonjour {prénom},
>
> Je préfère te vendre la bonne formule que la plus chère.
>
> **Prends le Starter (47 €)** si tu veux tester Claude sur tes emails et tes documents. 3 parcours, 24 leçons.
>
> **Prends le Mastery (497 € jusqu'à demain soir)** si tu veux traiter aussi ton contenu, ton marketing et ta stratégie. 9 parcours, 58 leçons, et le Mentor IA qui répond sur ton cas.
>
> Si tu prends le Starter maintenant, tes 47 € seront déduits du Mastery plus tard. Mais après demain, le Mastery coûtera 697 €.
>
> [Comparer les deux pass](https://www.claudeai-academy.com/tarifs?src=email-hausse-j6)
>
> Alexandre

### J7, samedi 31/10

**Objet :** Ce soir minuit : 497 €, puis 697 €
**Aperçu :** Dernier email sur le sujet.

> Bonjour {prénom},
>
> Dernier rappel, et je n'en reparlerai plus.
>
> Ce soir à minuit, heure de Paris, le Pass Mastery passe de 497 € à 697 €. Le bonus audit s'arrête au même moment. Places restantes ce matin : {places}/10.
>
> Si tu hésites encore, garde ceci en tête : la garantie de 14 jours reste valable. Tu peux tester et changer d'avis.
>
> [Prendre le Pass Mastery à 497 €](https://www.claudeai-academy.com/tarifs?src=email-hausse-j7)
>
> Dès demain, tu reçois de nouveau un cas concret par semaine, comme avant.
>
> Alexandre

### Variante pour les 9 acheteurs Starter (J1, J4 et J7 seulement)

Remplacer le paragraphe du prix par :

> Tes 47 € du Starter sont déduits automatiquement. Passer au Mastery te coûte 450 € jusqu'au 31 octobre, puis 650 € à partir du 1er novembre.

Et retirer J3 (ils ont déjà accès aux trois leçons) et J6 (ils ont déjà choisi le Starter).

### Contrôles avant envoi

1. Si les 10 places sont prises avant J7, retirer la ligne du bonus et dire « Le bonus est complet ».
2. Si la décision de prix change, aucun email ne part.
3. J7 ne part pas après 20 h, heure de Paris : un acheteur doit avoir le temps de payer.
4. Envoyer d'abord J1 à adrc13820@gmail.com et contrôler le rendu sur iPhone.

---

## Ce qui reste de ton côté

1. **Décider** : bloc A2 (statut des avis) oui ou non.
2. **Envoyer** l'email A1 aux 13 acheteurs depuis contact@ (je peux préparer les 13 brouillons dans Roundcube, tu cliques Envoyer).
3. **Me donner** l'URL de ton profil LinkedIn.
4. **Décider** pour la séquence D : passage de Resend en payant pour octobre, ou envoi en deux vagues.
