# Profil Instagram @official_claude_ai_academy

> État au 4 octobre 2026 au soir. Bio, photo et 5 liens en ligne, vérifiés sur le profil public. Les liens ont été collés depuis le téléphone : Instagram bloque leur modification sur le web (« disponible uniquement sur mobile »). Reste : le nom affiché et le lien court `/ig` (ci-dessous).

## Bio (en ligne depuis le 04/10/2026, v2)

```
Fais bosser Claude pour toi : prompts, agents IA
Formation dès 47 € par @alexandre_dosreiscaetano
🎁 Kit offert 👇
```

114 / 150 au compteur Instagram, affichée en entier sur le profil public (vérifié). Accroche, mots-clés (Claude, prompts, agents IA, formation), prix d'appel, fondateur et appel à l'action tiennent dans 3 lignes : sur le web, Instagram coupe au-delà de 3 lignes ou d'environ 119 caractères (« … plus »), mesuré sur ce profil sur trois versions. Instagram ne documente aucune règle de coupure.

**Nom affiché, à poser depuis le téléphone** (l'Espace Comptes refuse la saisie depuis un onglet piloté) : `ClaudeAI Academy · Formation IA`. C'est le champ que la recherche Instagram indexe ; il est vide aujourd'hui. Limite : 2 changements de nom par 14 jours.

**Lien 1 à remplacer par le lien court** une fois la branche `claude/alertes-kit-sequence-cas-concrets` en production : `https://www.claudeai-academy.com/ig`. Instagram affiche l'adresse brute du premier lien sous la bio ; `/ig` redirige vers `/kit?src=instagram-academy-kit`, le suivi est identique.

## Liens à coller sur le téléphone

Profil → Modifier le profil → Liens → Ajouter un lien externe. Garder cet ordre : le premier lien est celui qu'Instagram affiche sous la bio.

1. Titre : `Kit gratuit : 15 prompts`
```
https://www.claudeai-academy.com/kit?src=instagram-academy-kit
```
2. Titre : `La formation : 9 parcours`
```
https://www.claudeai-academy.com/?src=instagram-academy-site
```
3. Titre : `Tarifs : dès 47 €`
```
https://www.claudeai-academy.com/tarifs?src=instagram-academy-tarifs
```
4. Titre : `Créer ton agent IA`
```
https://www.claudeai-academy.com/creer-un-agent-ia?src=instagram-academy-agent
```
5. Titre : `Certification Claude`
```
https://www.claudeai-academy.com/certification-claude-ai?src=instagram-academy-certif
```

Les 5 liens testés le 04/10 : redirection 307 qui ajoute `utm_source=instagram&utm_medium=referral&utm_campaign=<le src>`, puis page 200. Dans le rapport du matin et `ventes_par_canal`, ce compte apparaît en **instagram / referral**, séparé du compte perso (**instagram / bio**). La campagne (`instagram-academy-kit`, `-tarifs`…) dit quel lien a travaillé.

## Photo de profil

`marketing/exports/instagram/logo-1.png` (1080 × 1080, en ligne). Monogramme Fraunces : C crème + a italique coral sur fond encre. Source : `marketing/instagram-logo.html`, rendu : `node scripts/render-instagram-logo.mjs`. Variante fond crème : `logo-2.png`.

Contrôles faits : a centré dans l'ouverture du C (38 px d'air, aucun contact), ensemble centré au pixel, rien hors du cercle de coupe, lisible à 32 px. Fond encre choisi parce que le crème se fond dans le blanc d'Instagram en mode clair, et parce qu'un fond coral rappellerait l'icône de l'app Claude.

## Reste à décider

- **Nom affiché vide.** C'est la ligne en gras au-dessus de la bio, et la recherche Instagram l'indexe. Proposition : `ClaudeAI Academy · Formation Claude`. Le nom affiché n'a pas à être unique : « ClaudeAI Academy » est possible même si le @ est pris. Instagram limite à 2 changements de nom par 14 jours.
- **Compte personnel → professionnel** (Créateur, catégorie Éducation) : statistiques, catégorie affichée sous le nom, bouton contact.
- **« official » dans le @** : avec « Claude » dedans, peut se lire comme le compte officiel d'Anthropic, ce qui expose à un signalement pour usurpation. La bio (« Par @alexandre_dosreiscaetano ») et un nom affiché sans « Official » limitent ce risque.
- Ajouter `@official_claude_ai_academy` dans la bio du compte perso pour y renvoyer son audience.
