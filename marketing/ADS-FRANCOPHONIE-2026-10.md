# Francophonie hors France : ouvrir la pub à la Suisse, la Belgique, le Luxembourg et le Canada

Décision du 9 octobre 2026. Zéro développement : le produit, les emails et le paiement marchent déjà pour ces pays. Il n'y a qu'un réglage Google Ads à passer, et deux choses à savoir sur le paiement.

## Pourquoi maintenant

- Sur 19 paiements réussis (Stripe, pays de facturation), 14 viennent de France. Les 5 autres : Espagne, Royaume-Uni, États-Unis, Nouvelle-Calédonie, et un pays inconnu. La demande internationale existe déjà, et elle parle français.
- Le site dit depuis juin « zone servie : France, Belgique, Suisse, Luxembourg, Canada » (fichier llms.txt), mais la campagne ne cible que la France.
- Le fondateur vit en Suisse : le cas restaurant du kit est un cas suisse.
- Coût du test : rien de plus que le budget actuel de 15 € par jour, réparti sur cinq pays au lieu d'un.

## Ce que tu fais (5 minutes, à la main)

L'agent n'a pas le droit d'écrire un script Google Ads, même pour toi : le réglage se fait dans l'interface, et il est court.

1. Google Ads > Campagnes > la campagne 24043755790 > Paramètres.
2. Zones géographiques > Modifier > saisir et ajouter, un par un : **Suisse**, **Belgique**, **Luxembourg**, **Canada**. La France reste.
3. Dans le même bloc, Options de ciblage > **« Présence : personnes se trouvant dans vos zones ciblées »** (voir plus bas).
4. Enregistrer. Ne touche ni au budget, ni aux enchères, ni aux mots clés, ni aux annonces : c'est le même test, élargi.

Retirer un pays plus tard prend une minute au même endroit.

## Deux réglages à vérifier dans la foulée

- **Langue** : la campagne doit cibler le français. Le script le lit et prévient si ce n'est pas le cas. Le Canada sans ciblage de langue, c'est 75 % d'anglophones qui cliquent sur une page en français.
- **Option de ciblage** : Paramètres > Zones géographiques > Options de ciblage > « Présence : personnes se trouvant dans vos zones ciblées ». Le défaut de Google (« présence ou intérêt ») diffuse aussi à des gens hors zone qui cherchent sur ces pays.

## Le paiement, pays par pays (vérifié le 9 octobre 2026 sur la documentation Stripe)

| Pays | Carte | Klarna à la caisse | Détail |
| --- | --- | --- | --- |
| Belgique | Oui | Oui, « payer plus tard » jusqu'à 1 500 € ; pas de 3 fois | Les clients belges voient Klarna, mais pas le 3 × 165,67 € |
| Suisse | Oui | Non avec nos prix en euros | Klarna exige la devise du client (CHF) ; nos prix sont en euros, donc Klarna n'apparaît pas pour un client suisse |
| Luxembourg | Oui | Non | Le Luxembourg n'est pas dans la liste des pays clients Klarna |
| Canada | Oui | Non | Pour une entreprise européenne, Klarna ne sert que les clients de l'EEE, de Suisse et du Royaume-Uni |

Conséquence : la mention « ou 3 × 165,67 € sans frais avec Klarna » de la page tarifs est vraie pour un client français, pas pour les autres. Un client suisse ou canadien verra la carte seule à la caisse. Ce n'est pas un bug, c'est Klarna. Si la Suisse convertit, la question d'un prix en CHF se posera, pas avant.

Stripe affiche Klarna selon le pays de l'adresse de facturation, puis l'adresse IP. Rien à régler côté code.

## TVA et seuils (à confirmer avec le comptable, selon le pays d'immatriculation de la société)

- Union européenne (Belgique, Luxembourg) : en dessous de 10 000 € de ventes B2C transfrontalières par an, la TVA du pays du vendeur s'applique ; au-dessus, guichet unique OSS.
- Suisse : la TVA suisse ne s'applique aux prestations électroniques B2C qu'au-delà de 100 000 CHF de chiffre d'affaires mondial.
- Canada : la TPS/TVH ne s'impose aux fournisseurs non résidents de services numériques qu'au-delà de 30 000 CAD de ventes canadiennes sur douze mois.

Aux volumes actuels, aucun seuil n'est approché.

## Comment lire le résultat (dans deux semaines)

- Google Ads > Campagne > Zones géographiques : clics, coût et taux de clic par pays. Un pays à plus de 3 € le clic sans lead en deux semaines sort du ciblage.
- Les leads par pays ne sont pas dans la base (pas de colonne pays dans `leads`). Lire le rapport Ads, pas le rapport du matin.
- Les ventes par pays : Stripe, adresse de facturation. La commande SQL du rapport du matin ne le montre pas ; c'est une lecture Stripe.
- Le compteur de clics du test en cours (verdict à 1 100 clics) continue de compter tous les pays ensemble. Le verdict reste valable : c'est la même offre, la même langue.

## Ce qui n'est pas fait, et pourquoi

- Pas de prix en CHF ni en CAD : Stripe convertirait l'affichage, mais la page tarifs, les CGV et les emails disent « € ». À faire seulement si la Suisse ou le Canada rapportent.
- Pas de campagne séparée par pays : à 15 € par jour, découper en cinq campagnes donne cinq campagnes qui n'apprennent rien.
- Pas de ciblage du seul Québec : Canada + langue française revient au même et évite une erreur d'identifiant de région.
