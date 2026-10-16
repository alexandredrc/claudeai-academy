# Finalisation v4 : collecte, FAQ, /resultats, acquisition

> Rédigé le 16/10/2026 au soir, à partir du brief « version 4 » d'Alexandre. Chaque point du brief a été confronté au site en ligne (HTML de www.claudeai-academy.com relu le 16/10/2026) et au code de la branche `main` (806ee7b).
> Code : branche `claude/finalisation-v4-2026-10-16`. Rien n'est en ligne avant ton « go merge ».
> Livrables précédents (A1 acheteurs, cas fondateur, séquence de hausse) : `marketing/PACK-PREUVE-FAQ-RESULTATS-EMAILS-2026-10-16.md`.

---

## 0. Le brief v4 confronté au site (16/10/2026)

| Point du brief | Réalité vérifiée | Suite donnée |
|---|---|---|
| FAQ « inutilisable : réponses sans questions, pas d'accordéon, pas de CTA » | **Faux.** /faq : 18 questions en accordéon (19 `aria-expanded`), CTA « Une autre question ? Nous contacter » en bas. Accueil et /tarifs : tes 15 questions, dans ton ordre, en prod depuis la PR #25. Un robot de lecture voit les réponses repliées comme du texte nu : c'est ce qui a trompé l'outil qui a écrit le brief. | Rien à refaire. Une seule correction : délai de réponse (voir F3). |
| Emplacement photo sur /a-propos | **Faux.** `alexandre.jpg` affichée sur /a-propos et sur l'accueil. | CTA final corrigé (E6). |
| Prix sur les pages parcours | **Déjà là.** « Débloque ce parcours avec le Pass Starter (47 €) », lien « Tous les parcours » en haut. | Rien. |
| Résumé en haut de /changelog | **Déjà là.** 99 notes, 43 leçons sur 58, première note 7 juillet, dernière relecture 16 octobre. | Filtres non faits (E7). |
| /prompts : CTA vers les 146 prompts restants | **Déjà là.** « 24 sont en accès libre », 146 marqués « Débloquer avec Mastery ». 8 filtres par domaine. | Filtre par métier non fait (E4). |
| /tarifs : bloc « Ce que vous obtenez » | **Déjà là.** « Ce que contient le Pass Mastery », 7 lignes. | Rien. |
| Page /kit : « 1 email par semaine » | **Faux dans les faits.** Le kit envoie 5 emails les 10 premiers jours, puis 1 par semaine pendant 8 semaines. La mention actuelle « un usage par semaine » était déjà inexacte. | Corrigée : « 5 emails les 10 premiers jours, puis un cas concret par semaine ». |
| Politique de confidentialité : changer la date | **Plus grave que la date.** Le texte daté du 9 juin ne mentionne ni les leads du kit, ni les emails de prospection, ni Google Analytics, ni **Microsoft Clarity (actif en prod depuis le 11/10, enregistrement des visites)**, ni Telegram. | Réécrite sur le fond, datée du 16/10 (F1). |
| Statut des avis (« transparence totale ») | Contraire à ta décision du 16/10 de le retirer. Ton brief v4 le redemande. | **Rétabli** sur la branche : badge « Client vérifié » sur Julien, « Accès offert en contrepartie d'un avis » sur les autres, paragraphe « Comment ces avis sont recueillis ». Conforme à L111-7-2 et D111-10 du Code de la consommation. |
| Page /resultats | **Vrai** : 404 en prod. | Créée (C1). |
| Formulaire de témoignage | **Vrai** : n'existait pas. | Créé : /temoignage + table `temoignages` (A3). |

---

## LIVRABLE A. Collecte de témoignages réels

### A1. Email de collecte aux leads (demain matin)

**Déjà codé et programmé** (PR #25, en prod) : `lead_collecte`, 48 leads le 17/10 à 9 h 30 UTC (11 h 30 à Paris), 41 le 18/10. Objet « Une faveur qui prend 3 minutes », tutoiement, 3 questions, accord écrit en 3 choix, option anonyme (« seulement avec mon métier »), signé Alexandre.

**Ce que la branche ajoute** : une ligne avec un lien vers le formulaire, « Tu préfères un formulaire ? Les mêmes questions ici, en 2 minutes. » Si la branche n'est pas en ligne avant 11 h 30 le 17/10, la première salve part sans ce lien, ce qui ne pose aucun problème.

**Contrepartie : non, décision prise à ta place.** Trois raisons :
1. Les 6 acheteurs ont reçu leur email le 16/10 sans contrepartie. En ajouter une maintenant crée deux régimes pour le même avis.
2. Un avis obtenu contre un avantage doit afficher cette contrepartie (D111-10). Avec « Accès offert en échange d'un avis » sous chaque retour, on retombe dans le cas des 11 avis actuels, qui pèsent peu face à une objection de prix.
3. Le « parcours bonus » n'existe pas. Un « appel » prend ton temps de DO. Le « Mentor IA » revient à offrir le Mastery (497 €) contre une ligne de texte.

Version courte de A1 (pour un relais à la main, SMS ou DM Instagram) :

> Bonjour {prénom}, tu as téléchargé mon kit Claude. Une question rapide : quelle tâche fais-tu avec, et combien de temps elle prend avant et après ? Une ligne suffit. Je ne publie rien sans ton accord. Alexandre

### A2. Relance des non-répondeurs (J+3) : codée

`lead_collecte_relance`, partie le 20/10 pour la salve du 17, le 21/10 pour celle du 18. Elle **ne part pas** à qui a rempli /temoignage. Une réponse par email ne se voit pas d'ici, d'où la phrase « si tu m'as déjà répondu ».

> **Objet :** Une ligne suffit
>
> Bonjour {prénom},
>
> Je te relance une seule fois, au sujet de mon email d'il y a trois jours.
>
> Une ligne me suffit : ton métier, et une tâche que tu fais (ou pas) avec Claude. Réponds directement à cet email.
>
> [Répondre en 2 minutes]
>
> Si tu m'as déjà répondu, merci : ignore ce message. Et si tu n'as pas le temps, aucun souci, tu ne recevras pas d'autre rappel.
>
> Alexandre

79 mots. Partage le plafond de 48 envois par matin avec la collecte (Resend gratuit = 100 emails par jour).

### A3. Formulaire de collecte : codé

Page **/temoignage** (hors index Google, liée depuis les deux emails et depuis /resultats). Champs : prénom (facultatif), email (obligatoire, jamais publié), métier, ville, tâche, minutes avant, minutes après, retour libre, choix de publication en 3 options, case d'accord (obligatoire si publication), pot de miel anti-robot.

- **Le statut est calculé par le serveur**, jamais déclaré : « acheteur » si l'email a un achat payé, « kit » si c'est un lead, « inconnu » sinon.
- Stockage : table Supabase `temoignages` (migration 0014, déjà appliquée en base le 16/10, vide). RLS active, lecture par toi seulement.
- Alerte Telegram à chaque envoi : métier, statut, choix de publication, minutes. Jamais l'email ni le texte.
- Limites : 3 envois par adresse et 60 en tout par 24 h.

**Testé le 16/10 en local, contre la base de prod :** envoi complet en 375 px (message « Merci, c'est bien reçu »), statut « inconnu » sur une adresse de test, statut « kit » sur un lead de test, refus HTTP 400 sans case d'accord. Lignes de test supprimées ensuite (requête de suppression : 2 témoignages, 1 lead). **Non testé :** le statut « acheteur » (il faudrait l'email d'un vrai client).

### A4. Modèle de témoignage, une fois les vrais retours reçus

Sur le site, un résultat est une entrée typée dans `src/lib/resultats/membres.ts` (convention du projet : données statiques en code typé). La page /resultats l'affiche avec son badge.

```ts
{
  prenom: "[PRÉNOM]",            // retirer la ligne si « métier seulement »
  metier: "[MÉTIER]",
  ville: "[VILLE]",              // retirer si non donnée ou si anonyme
  categorie: "artisans",         // artisans | commerces | consultants | dirigeants
  situation: "[SITUATION, avec ses mots, 2 à 4 lignes]",
  apprentissage: "[LEÇONS OU PARCOURS CITÉS]",
  tache: "[TÂCHE]",
  minutesAvant: 0,               // [RÉSULTAT CHIFFRÉ] avant
  minutesApres: 0,               // [RÉSULTAT CHIFFRÉ] après
  citation: "[CITATION exacte, orthographe corrigée seulement]",
  statut: "acheteur",            // [STATUT] acheteur | kit | acces_offert
  mois: "octobre 2026",
},
```

Badges affichés : « A payé sa formation », « A utilisé le kit gratuit, n'a pas acheté », « Accès offert en échange d'un avis ».

Équivalent HTML, si tu en as besoin ailleurs (grille 1 colonne en mobile, 3 en desktop) :

```html
<section aria-labelledby="retours" class="resultats">
  <h2 id="retours">Résultats des membres</h2>
  <div class="grille"><!-- grid-template-columns: 1fr; à partir de 1024px : repeat(3, 1fr) -->
    <article class="carte">
      <p class="badge">[STATUT]</p>
      <h3>[TÂCHE]</h3>
      <p><s>[AVANT] min</s> → <strong>[APRÈS] min</strong>, mesuré par [PRÉNOM]</p>
      <blockquote><p>« [CITATION] »</p></blockquote>
      <p class="auteur">[PRÉNOM], [MÉTIER], [VILLE] · [MOIS]</p>
    </article>
  </div>
</section>
```

**Pas de balisage schema.org Review**, contrairement au brief. Google exclut des extraits enrichis les avis qu'un site recueille sur lui-même. Les baliser n'apporte rien et expose à une action manuelle. C'est déjà la règle écrite dans `testimonials.tsx`.

---

## LIVRABLE B. FAQ

**Rien à réécrire.** Les 15 questions, dans l'ordre exact de ton brief, sont en ligne sur l'accueil et /tarifs depuis la PR #25 (le 16/10 à 20 h 40). La première est ouverte par défaut. Chaque question est un bouton avec `aria-expanded`. /faq porte 18 autres questions, regroupées en 4 thèmes, avec un CTA vers /contact.

- **B2 (CTA « Une autre question ? »)** : déjà sur /faq, lien vers /contact, « On répond sous 48 h ouvrées ».
- **B3 (liens vers la FAQ)** : accueil et /tarifs ont « Voir toutes les questions » ; le pied de page de toutes les pages a « FAQ et objections ». Pages parcours : non ajouté, le pied de page suffit.
- **Corrigé** : la FAQ de l'accueil promettait « je réponds sous 24 h ouvrées » alors que /contact et /faq disent 48 h. Aligné sur 48 h.

---

## LIVRABLE C. Page /resultats

### C1. Codée

- En-tête « Résultats mesurés, pas promis », date « Mis à jour le 16 octobre 2026 ».
- Note en haut : « Cette page se remplit au fur et à mesure des retours. La collecte a commencé le 16 octobre 2026. [...] nous préférons une page vide à une page fausse. » **Je n'ai pas écrit « premiers cas courant novembre »** : c'est une promesse de date qui dépend des réponses. Avec 0 réponse fin novembre, la page mentirait.
- Section « Résultats des membres » : vide aujourd'hui, avec un lien vers /temoignage.
- **Filtres par métier** (artisans, commerces, consultants, dirigeants) : codés en liens `?metier=`, sans JavaScript. Ils n'apparaissent qu'à partir de 4 résultats publiés. Filtrer une liste vide n'a pas de sens.
- **Pas de 4 études de cas vides affichées** : des cartes « [NOM] [MÉTIER] » en ligne feraient amateur. Le gabarit vit dans le code (A4).
- Section « Les mesures du fondateur » : les 10 tâches de `mesures.ts`, avec l'avertissement « Ce ne sont pas des résultats de membres ». Total recalculé : 873 min = 14 h 33 à la main, 26 min avec Claude, identique à l'accueil.
- CTA final : « Voir les tarifs, dès 47 € » + « Lire une leçon gratuite ».
- Liée depuis le pied de page (« Résultats mesurés ») et ajoutée au sitemap.

### C2. Transformer un retour en résultat publié

1. **Lire** la table `temoignages` (Supabase, tableau de bord) ou la réponse arrivée dans contact@.
2. **Vérifier l'accord** : `publication` doit valoir `prenom_metier_ville` ou `metier_seul`. Par email, la phrase d'accord doit être écrite noir sur blanc. `non` = jamais publié.
3. **Vérifier le statut** : `statut` calculé par le serveur. Pour une réponse par email, chercher l'adresse dans Stripe (achat) ou dans `leads` (kit).
4. **Vérifier la mesure** : minutes avant et après données par la personne. Sans chiffre, le retour peut aller dans les avis, pas dans /resultats.
5. **Ne rien réécrire** : orthographe et ponctuation seulement. Aucune phrase ajoutée.
6. **Remplir** une entrée dans `src/lib/resultats/membres.ts` (modèle A4), mettre à jour `RESULTATS_MIS_A_JOUR`.
7. **Publier** : branche, PR, « go merge ». Puis noter la date dans `publie_le` de la ligne.
8. **Retrait** : sur demande, retirer l'entrée sous 48 h et remplir `retire_le`.

Checklist avant publication : accord écrit gardé ✓, statut exact ✓, chiffre donné par la personne ✓, citation non retouchée ✓, aucun nom de famille ni email ✓, retour négatif publié s'il est mesuré et autorisé ✓.

---

## LIVRABLE D. Séquence de 7 jours

**Pas réécrite. Raisons :**

1. **Elle existe déjà, en mieux** : le kit est suivi de 13 emails en prod depuis le 04/10 (A1 à A5 sur 10 jours, puis B1 à B8, un cas par semaine). La séquence de 7 jours du brief la remplacerait et ferait perdre 8 semaines de suivi.
2. **Ta décision du 16/10** : ne pas réécrire de séquence avant d'avoir reçu tes prompts de rédaction.
3. **J7 « bonus expire le 31 octobre »** : déjà rédigé dans la séquence de hausse du 25 au 31/10 (document du 16/10, livrable D), qui attend ton feu vert.

Correspondance entre ton brief et l'existant :

| Brief | Existant en prod |
|---|---|
| J1 Bienvenue + kit + leçon gratuite | `lead_magnet` « Ton kit : 15 prompts Claude prêts à l'emploi » |
| J2 Le mythe « l'IA c'est compliqué » | `lead_a1` « Tu n'utilises pas Claude. Tu le sous-utilises. » |
| J3 Étude de cas | `lead_a2` (études mesurées), puis B1 à B7 (7 cas sourcés) |
| J4 3 erreurs de prompt | Absent en email. Le post LinkedIn G1-2 ci-dessous peut le devenir. |
| J5 Pass Starter 47 € | `lead_a4` et `lead_a5` |
| J6 Objections | `lead_a3` « Je trouverai bien sur YouTube » |
| J7 Dernière chance 31/10 | Séquence de hausse J7, non envoyée |

---

## LIVRABLE E. Pages existantes

| Page | Demande | Fait sur la branche | Non fait, et pourquoi |
|---|---|---|---|
| /tarifs | FAQ paiement, bloc « ce que vous obtenez », pas de doublon du calculateur | Rien : FAQ de 15 questions (dont 5 sur paiement et garantie), bloc « Ce que contient le Pass Mastery » déjà présents | Retirer le calculateur de /tarifs : non. C'est la page où le visiteur décide, et le calculateur y est la seule preuve chiffrée réglable. |
| /courses | « Par où commencer », CTA tarifs, regroupement | Bloc « Par où commencer » : 3 leçons, 60 min lues en base (20 + 18 + 22), la 3e gratuite. CTA « Voir les tarifs » déjà présent | Bandeau « 4 essentiels / pour aller plus loin » : non. Le Starter couvre 3 parcours, pas 4. Un bandeau « 4 essentiels » contredirait l'offre. |
| Parcours | Prix + lien autres parcours | Rien : déjà présents | |
| /prompts | Filtres métier, CTA 146 prompts | Rien : CTA et 8 filtres par domaine déjà là | Filtre par métier : les 170 prompts sont classés par domaine, pas par métier. Il faudrait étiqueter 170 prompts à la main. Gain non mesurable avec ~20 visites par jour. |
| /kit | Formulaire, mention emails, aperçu | Mention corrigée (voir 0). Formulaire testé en prod le 09/10 (alerte Telegram reçue) | Aperçu visuel du kit : non fait. Faisable, mais c'est un visuel marketing (HTML vers PNG), pas une correction. |
| /a-propos | Photo, CTA, « Pourquoi me faire confiance » | Bouton final : il disait « Découvrir les parcours » mais menait à /tarifs. Remplacé par « Voir les tarifs, dès 47 € » | Photo déjà là. « Pourquoi me faire confiance » = les 3 preuves de la PR #26, déjà en ligne. |
| /changelog | Résumé, filtres, CTA | Rien : résumé déjà là, chaque note mène à sa leçon | Filtres par parcours : 99 notes, une page. Utile plus tard. |
| /contact | Formulaire | Rien | Un formulaire ajoute du spam et une panne possible (Resend gratuit, 100 emails par jour, partagés avec les accès acheteurs). Le lien email et Instagram suffisent à 20 visites par jour. |

---

## LIVRABLE F. Corrections techniques et incohérences

### F1. Politique de confidentialité : réécrite sur le fond

Date : 16 octobre 2026. Ajouts, chacun vérifié dans le code :
- **Kit gratuit** : email, prénom, page d'inscription (`api/lead/route.ts`).
- **Emails de prospection** : base légale = consentement, rythme réel décrit, désinscription en un clic.
- **Témoignages** : données du formulaire, statut calculé, consentement explicite et retirable.
- **Clics dans les emails** : suivi des clics Resend, activé le 04/10.
- **Google Analytics** (`G-FK32149QFK`), **Microsoft Clarity** (`NEXT_PUBLIC_CLARITY_ID` présent en prod, vu dans `vercel env ls` le 16/10), Google Ads : avec consentement par la bannière.
- **Telegram** : alerte interne, prénom, métier et page d'origine au plus, jamais l'email.
- **Durées** : leads jusqu'à désinscription (adresse gardée ensuite pour ne plus écrire), témoignage non publié supprimé sur demande et au plus tard 3 ans après réception, Google Analytics 14 mois au plus.

**Engagement que tu prends en publiant ce texte :** supprimer à la main les retours non publiés de plus de 3 ans. Rien ne le fait automatiquement. **Non vérifié :** la durée de conservation réglée dans ton compte Google Analytics (2 ou 14 mois). Avocat ou délégué à la protection des données : utile si un client exerce ses droits ou si la CNIL écrit, pas indispensable pour ce texte.

### F2. Pied de page

Vérifié dans le HTML de prod le 16/10 : mentions légales, confidentialité, CGV, FAQ, journal des mises à jour, à propos, contact, tous présents. Ajouté : « Résultats mesurés ».

### F3. Cohérence globale

| Contrôle | Résultat |
|---|---|
| Délai de réponse | **Incohérent, corrigé** : 24 h (FAQ accueil) contre 48 h (/contact, /faq). Aligné sur 48 h. L'Accompagnement garde ses « 24 h ouvrées », offre différente. |
| Rythme des emails du kit | **Promesse inexacte, corrigée** (voir 0). |
| Bouton /a-propos | **Libellé trompeur, corrigé** (voir E). |
| Statut des avis | **Rétabli** (voir 0). |
| Faux avis | Aucun ajouté. 13 avis : Julien (achat Stripe du 04/08/2026) et 12 accès offerts, prénoms fournis par toi les 24/08 (7) et 29/08 (5), comptés dans `testimonials.tsx`. |
| Dates | 497 € jusqu'au 31/10, 697 € le 01/11 : cohérent sur /, /tarifs, /faq, /courses. CGV 16/10, confidentialité 16/10 sur la branche. |
| Starter et Claude Code | **Incohérence restante, non corrigée** : la FAQ dit « Quatre parcours vont plus loin (Claude Code, données, trading, GitHub) : ils sont facultatifs », alors que Claude Code fait partie des 3 parcours du Starter. Décision déjà en attente depuis le 16/10 (Starter technique, Marketing et Stratégie en Mastery). |
| Fonction affichée | **Toujours non tranché** : « Restaurant Manager en Suisse » sur le site, « directeur opérationnel » dans ton profil. |

---

## LIVRABLE G. Acquisition hors site

### G1. Trois posts LinkedIn (profil perso)

Règle de la banque LinkedIn du projet : lien en premier commentaire, jamais dans le post. Aucun chiffre sans source : tous viennent de `mesures.ts` (chronométré le 15/10/2026).

**Post 1. Retour d'expérience**

> Une fiche technique chiffrée, c'est le coût exact d'un plat, ingrédient par ingrédient.
>
> 8 ingrédients, les prix fournisseurs, les grammages, le coefficient.
> À la main, il me fallait 3 h 10.
>
> Le 15 octobre, je l'ai refaite avec Claude.
> Conversation vierge, chronomètre lancé, relecture comprise.
> 2 minutes.
>
> Ce qui a changé, ce n'est pas l'outil.
> C'est la demande.
>
> Avant, j'écrivais « calcule le coût de mon plat ».
> Maintenant, je donne mes prix, mes grammages, mon format de tableau.
> Une fois. Puis je réutilise.
>
> 20 ans en hôtellerie-restauration.
> Je ne suis pas développeur.
> Si je peux le faire entre deux services, un artisan ou un commerçant peut le faire aussi.
>
> J'ai mis ma méthode et 15 demandes prêtes à copier dans un kit gratuit.
> Lien en commentaire.

**Post 2. Les 3 erreurs de prompt**

> Trois erreurs font perdre du temps avec Claude. Je les ai toutes faites.
>
> 1. Donner la consigne sans le contexte.
> « Écris une relance. » Claude ne sait pas qui est le client, ni depuis combien de temps il doit payer.
> Résultat : un texte générique, à réécrire.
>
> 2. Ne pas montrer d'exemple.
> Vous avez un ton. Claude ne le devine pas.
> Collez une relance que vous avez déjà envoyée et qui a marché.
>
> 3. Ne pas dire la forme attendue.
> Un email ? Trois messages de plus en plus fermes ? Un SMS ?
> Si vous ne le dites pas, vous corrigez après.
>
> Ma relance d'impayé en 3 messages : 37 minutes à la main, 2 minutes avec ces trois règles.
>
> Lien vers le kit gratuit en commentaire.

**Post 3. Le calcul avant/après**

> J'ai chronométré trois tâches de la semaine, avant et après Claude.
>
> Relancer un impayé (3 messages) : 37 min → 2 min
> Rédiger le compte rendu d'une réunion d'une heure : 41 min → 2 min
> Répondre à un client qui conteste une facture : 24 min → 1 min
>
> Total : 102 minutes à la main, 5 minutes avec Claude.
> 97 minutes rendues chaque semaine.
> Sur 4 semaines : 6 h 28.
>
> Ce sont mes temps, pas les vôtres.
> Faites le calcul avec vos tâches et votre taux horaire : le calculateur est sur le site.
>
> Lien en commentaire.

Calculs refaits : 37 + 41 + 24 = 102 ; 2 + 2 + 1 = 5 ; 97 × 4 = 388 min = 6 h 28.

### G2. Douze groupes Facebook (vérifiés le 16/10/2026)

Chiffres lus sur la page « À propos » de chaque groupe, sans connexion, le 16/10/2026. Aucun chiffre de blog. **Règle commune : pas de lien, pas de mention de la formation. Un retour d'expérience utile, et le lien seulement si quelqu'un le demande en commentaire.**

| # | Groupe | Membres | Statut | Règles lues | Angle |
|---|---|---|---|---|---|
| 1 | La Communauté des auto-entrepreneurs (facebook.com/groups/communaute.autoentrepreneurs) | 97 989 | Privé | Pas d'autopromo. « Retour d'expérience, méthode ou info utile » accepté | Comment je fais rédiger mes relances d'impayés, 3 niveaux de ton, texte complet |
| 2 | Entraide Auto/Micro-entrepreneurs, Hello My Business (groups/633636863472853) | 59 083 | Privé | Autopromo interdite. Présentation le lundi dans le post dédié | Transformer une demande client floue en devis structuré |
| 3 | Entrepreneurs & Freelances FR (groups/entrepreneurfreelancefrance) | 112 344 | Public | Pub seulement dans « L'instant Promo » | 3 demandes pour relancer un impayé sans froisser |
| 4 | Les Pros du Bâtiment, Entraide & Conseils (groups/lesprosdubtp) | 1 254 | Public | Sujets bâtiment uniquement | Un devis clair et une relance de devis non signé en 5 minutes |
| 5 | Artisans, Professionnels, Prestataires BTP / HABITAT (groups/APPEP) | 5 620 | Public | Non affichées | Répondre à un avis Google négatif après un chantier |
| 6 | Groupe d'entraide des restaurateurs indépendants (groups/511904731051293) | 1 127 | Public | Non affichées | Ton cas de DO : fiche technique et réponses aux avis |
| 7 | Les indépendants et entrepreneurs de la Suisse romande (groups/273372903827276) | 10 941 | Public | Localité visible sur le profil | Retour d'expérience local, en CHF |
| 8 | Réseau d'entrepreneurs, Entraide, Réseautage, Conseils (groups/193641293521639) | 31 532 | Public | Autopromo interdite, même « contactez-moi en MP » | Question ouverte « quelles tâches admin avez-vous déléguées à l'IA ? » |
| 9 | Club d'entraide pour dirigeant(e)s de TPE (groups/4966076173508742) | 2 000 | Public | Pas de promo. Animé par Axonaut | Facturation + IA pour les relances |
| 10 | Le Barman Vous Ecoute, Entraide en Restauration (groups/209241173074465) | 16 870 | Privé | Questions métier uniquement | Fiche technique et coût matière d'un cocktail. Peu actif : 7 publications le mois dernier |
| 11 | Groupe d'entraide et de réflexion des commerçants indépendants (groups/1103387653348881) | 32 283 | Public | Seuls les commerçants assujettis à la TVA publient | Commentaires utiles seulement (tu y serais visiteur) |
| 12 | L'entraide des entrepreneurs, Wikipreneurs (groups/entraideentrepreneurs) | 7 085 | Privé | Autopromo interdite | Réponses aux questions de rédaction, Belgique |

Écartés après lecture : Claude Ai Community (2,9 M, en anglais), ChatGPT Francophone (4 publications le mois dernier), groupes de restaurateurs sans entraide, groupes d'annonces BTP.

**Ordre recommandé** : 1, 2 et 4 la première semaine, un post par groupe, puis mesurer (clics `?src=fb-<groupe>` vers /kit).

### G3. Message aux partenaires (experts-comptables, CMA, syndicats)

**Ce que je n'y mets pas** : un webinaire (exclu par ton brief), une commission pour un expert-comptable (sa déontologie encadre les rémunérations reçues de tiers, **non vérifié**, à lire dans le code de déontologie de l'Ordre avant de proposer quoi que ce soit), une réduction (changement d'offre, c'est ta décision).

> **Objet :** Une fiche pratique gratuite pour vos adhérents
>
> Bonjour {prénom},
>
> Je dirige un restaurant en Suisse et j'enseigne l'usage de Claude, l'assistant d'IA d'Anthropic, aux indépendants et aux TPE.
>
> Vos adhérents passent leurs soirées sur l'administratif : relances, devis, réponses aux clients. J'ai chronométré ces tâches. Une relance d'impayé en 3 messages : 37 minutes à la main, 2 minutes avec Claude.
>
> Je vous propose une fiche pratique de 2 pages, gratuite, sans publicité : 5 demandes prêtes à copier pour la relance, le devis et la réponse à un avis client. Vous la diffusez à vos adhérents sous votre nom ou le mien, comme vous préférez.
>
> Rien à payer, aucun engagement. Si la fiche leur sert, nous verrons ensuite s'il y a plus à faire.
>
> Puis-je vous l'envoyer ?
>
> Alexandre Dos Reis Caetano
> ClaudeAI Academy · claudeai-academy.com

La fiche de 2 pages est à créer (les demandes existent dans le kit). La prospection des 30 TPE du Chablais (CSV du 15/10) reste en attente d'envoi.

### G4. Affiliation à 30 %

**Pas codée, décision à toi** : verser 30 % d'une vente est un engagement d'argent et un changement d'offre.

| Point | Proposition |
|---|---|
| Commission | 30 % du montant payé : 14,10 € par Starter, 149,10 € par Mastery à 497 €, 209,10 € à 697 € |
| Suivi | Lien `?src=aff-<prénom>`. Déjà enregistré jusqu'à la vente (`purchases.utm_*`, cookie 90 jours). Aucun code à écrire pour suivre. |
| Paiement | Virement mensuel, pour les ventes de plus de 30 jours (garantie de 14 jours + délai bancaire). Une vente remboursée ne paie rien. |
| Obligations de l'affilié | Mention visible « lien affilié » ou « collaboration commerciale » (loi n° 2023-451 du 9 juin 2023 sur l'influence commerciale, **à faire valider**). L'affilié déclare ses revenus lui-même. |
| Interdits | Pas de publicité payante sur « claude » ou « claudeai academy », pas de faux avis, pas de promesse de revenu. |
| Page /affiliation | À créer après ta décision. Texte ci-dessous. |

Texte de la page :

> **Recommandez la formation, recevez 30 %.**
> Vous avez suivi ClaudeAI Academy et elle vous a servi ? Recommandez-la avec votre lien personnel. Pour chaque achat, vous recevez 30 % du montant payé : 14,10 € pour un Pass Starter, 149,10 € pour un Pass Mastery.
> Le paiement se fait par virement chaque mois, pour les achats de plus de 30 jours. Un achat remboursé ne donne pas lieu à commission.
> Votre seule obligation : dire clairement que votre lien est un lien affilié.
> Pour recevoir votre lien : contact@claudeai-academy.com.

Message de recrutement, aux **7 acheteurs actifs** d'abord (ceux qui ont fini au moins une leçon), jamais à Gwenn tant que son remboursement est en cours :

> **Objet :** Si la formation vous a servi
>
> Bonjour {prénom},
>
> Une proposition simple. Si ClaudeAI Academy vous a servi, vous pouvez la recommander avec un lien personnel. Pour chaque achat, vous recevez 30 % : 14,10 € pour un Starter, 149,10 € pour un Mastery.
>
> Aucun engagement, aucun minimum. Vous dites simplement que c'est un lien affilié.
>
> Si ça vous intéresse, répondez « oui » et je vous envoie votre lien.
>
> Alexandre

**Argument contraire le plus fort** : avec 13 acheteurs, dont 7 actifs, le réservoir d'affiliés est minuscule. Un affilié qui ne vend rien ne coûte rien, mais la page et le suivi des virements prennent ton temps. À lancer seulement si 2 acheteurs au moins répondent « oui » au message ci-dessus.

---

## Ce qui reste de ton côté

1. **« go merge »** de la PR, idéalement avant le 17/10 à 11 h 30 (Paris) pour que la première salve porte le lien du formulaire. Merger = la relance part le 20 et le 21/10.
2. **Décider** l'affiliation (G4) : oui ou non.
3. **Rejoindre** les groupes Facebook 1, 2 et 4, publier le premier retour d'expérience dans le n° 1.
4. **Publier** les 3 posts LinkedIn, lien en commentaire.
5. **Trancher** les deux décisions en attente : Claude Code dans le Starter, fonction affichée.
