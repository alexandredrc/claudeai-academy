# Rapport de reprise — Campagne marketing ClaudeAI Academy

> Document de passation pour reprendre le chantier dans une nouvelle session.
> Dernière mise à jour : 2026-06-14 (~17h CEST).

## 0. Objectif
Générer **5 000 €+/mois** via le tunnel : contenu social → lead magnet `/kit` → email → vente Pass Starter (47 €) → ascension Pass Mastery (497 €). Idée maîtresse : « Les 80 % que tu n'exploites pas ».

## 1. ⚠️ Environnement technique (À LIRE EN PREMIER)
- **Travailler dans le worktree** : `C:\Users\adrc1\Desktop\claudeai-academy\.claude\worktrees\peaceful-swanson-4b00df`
  Le répertoire par défaut (`C:\Users\adrc1\Desktop\claudeai-academy`) est **PÉRIMÉ** (main local en retard). Le vrai code = branche `claude/peaceful-swanson-4b00df` = `origin/main`.
- **Flux de déploiement** (depuis le worktree) :
  ```
  git add <fichiers>; git commit -m "..."
  git push origin claude/peaceful-swanson-4b00df      # branche
  git push origin HEAD:main                            # fast-forward main => déploiement Vercel PROD
  ```
  Vérifier le déploiement via le MCP Vercel (projet `prj_HoyblMXegU8qqzyygGzVG6SCLm5D`, team `team_9N8eO0Qfa5ofrkCCcYI6meOV`). Alias prod : `www.claudeai-academy.com`.
- **Supabase PROD** : projet `rjthvbhdcktiioxpipqy` (`claudeai-academy-prod`). Tables campagne : `leads`, `lead_email_log` (RLS verrouillé, serveur-only). Ne faire que de l'additif.
- **Email** : Resend (clé sur Vercel, VIDE en local → `emailSent:false` en local, normal). `EMAIL_FROM` ok.
- **Build** : `npm run build` (Next 16 + Turbopack). `npx tsc --noEmit` pour typecheck. Toujours vérifier avant de pousser sur main.

## 2. ✅ FAIT et EN LIGNE (production)
- Tunnel `/kit` : page capture + `/kit/ressources` (15 prompts chartés) + `/kit/merci`.
- **Attribution de source** : `/kit?src=xxx` (ou `?utm_source=`) → stocké dans `leads.source` (défaut `kit-direct`). Sanitize a-z0-9_-, 40 char. Commit `ec4c8bd`.
- API `/api/lead` : validation, upsert idempotent (contrainte unique `leads_email_key` sur colonne email), honeypot, envoi magnet. Testé live OK (vrai email reçu par le user).
- **Séquence A** (vente Starter) : emails `lead_magnet` + `lead_a1..a5` (J+2→J+10), `src/lib/email/lead-magnet.ts`, cron `/api/cron/lead-nurture` (9h30, skip clients/désinscrits).
- **Séquence B** (ascension Starter→Mastery) : `nurture_d14` dans `src/lib/email/nurture.ts`, cron `/api/cron/nurture` avec `onlyTier:"starter"` + exclusion des upgraders. (Complète l'upsell soft déjà présent à d7.)
- Bienvenue + nurture d1/d7 : préexistant, live.
- **Bio LinkedIn** : section « Infos » créée (Pont HORECA+IA : ClaudeAI Academy + « IA pour entreprises/freelances/retail » + lien /kit). Titre + #OpenToWork préservés.
- **Post LinkedIn n°1** : PUBLIÉ (texte seul — fait avant les visuels ; LinkedIn n'autorise pas d'ajouter une image à un post déjà publié). ~34 impressions.
- Commits clés : `c8983b3` (tunnel), `d515435` (séquence B), `90631ec` (docs LinkedIn+IG), `3c89746` (visuels LinkedIn, branche), `ec4c8bd` (attribution source).

## 3. 📦 PRÊT mais PAS publié/programmé
- **Banque LinkedIn** : `marketing/linkedin-content-bank.md` — 16 posts + 3 carrousels + calendrier 4 sem.
- **Visuels LinkedIn** : `marketing/linkedin-visuals.html` (11 cartes 1080×1350) → PNG dans `marketing/exports/linkedin/` (post-1,2,5,6,7,10,12,13 + cover-1,2,3). Régénérer : `npm run render:linkedin`. **Tous vérifiés visuellement, charte OK, zéro em dash** (le « À COPIER » est une barre coral CSS, pas un tiret).
- **Plan Instagram** : `marketing/instagram-plan.md` — 20 posts/4 sem + 8 Reels sans visage scriptés + bio/highlights/hashtags.
- **Kit IG existant** : `marketing/instagram-lancement.md` + visuels HTML (carrousel/stories/reel-cover) + exports PNG (sessions précédentes).

## 4. ❌ PAS FAIT / TODO
- **Aucun post programmé** (sauf Post 1 publié). C'est LE déblocage prioritaire.
- Slides INTERNES des carrousels LinkedIn (seules les couvertures cover-1/2/3 existent ; les 5-7 slides de chaque carrousel restent à créer).
- Instagram : compte Business/Creator + page FB liée + bio + publication.
- TikTok : compte + bio + publication (réutiliser les 8 scripts Reels de `instagram-plan.md`).
- Reels/TikTok : **vidéos à TOURNER** (screen recordings de Claude) — tâche du user.
- Bios Instagram + TikTok : à rédiger (même angle que LinkedIn).
- Smoke test des emails A/B : se déclenchent sur le cron, non testables avant que des leads vieillissent.

## 5. 🚧 Blockers (besoin du user ou préalable)
1. Publication LinkedIn : « go » du user requis par post. **Le planificateur natif GÈLE l'extension Chrome** → contournement : ouvrir un **ONGLET NEUF** (le profil se charge alors correctement).
2. Instagram auto-publish : impossible sans compte Business/Creator + page Facebook (API Meta).
3. TikTok : lien cliquable en bio réservé aux **1 000+ abonnés** ; en dessous, URL en texte.
4. Reels/TikTok : vidéos à tourner avant toute publication vidéo.

## 6. ▶️ PROCHAINE ACTION (le user a validé l'option « C »)
Faire **A puis B** :
- **A) Programmer la semaine 1 LinkedIn (Posts 2 à 5) AVEC leurs visuels**, via le planificateur natif (onglet neuf). Suggestion de créneaux (CEST) : Post 2 → lun 08:00, Post 5 → mar 08:00, Post 6 → mer 08:00, Post 7 → jeu 08:00. Visuels : `marketing/exports/linkedin/post-2.png`, `post-5.png`, `post-6.png`, `post-7.png`. Le user valide chaque « Programmer ».
- **B) Préparer** : bios Instagram + TikTok + les slides manquants des carrousels LinkedIn.

### Workflow publication LinkedIn (extension Chrome `mcp__Claude_in_Chrome__*`)
1. Onglet neuf (`tabs_create_mcp`) → `navigate` vers `https://www.linkedin.com/feed/` (évite le gel).
2. Clic « Commencer un post » → clic zone texte → `type` le post (depuis `linkedin-content-bank.md`).
3. Joindre l'image : clic icône média → utiliser `mcp__Claude_in_Chrome__file_upload` avec le chemin du PNG (NE PAS passer par le dialogue OS). Valider l'éditeur d'image LinkedIn (Suivant/Terminé).
4. Programmer : clic icône **horloge** → régler date+heure → « Programmer ».
5. **Lien en commentaire** : impossible à l'avance sur un post programmé. Soit le user ajoute le commentaire `https://www.claudeai-academy.com/kit?src=linkedin` quand le post sort, soit on l'accepte (le visuel affiche déjà l'URL). Pré-écrire le texte du commentaire pour lui.
6. **Toujours** : screenshot de vérif après chaque étape ; ne jamais cliquer « Publier/Programmer » sans le « go » du user (contenu public = sa réputation).

### Liens d'attribution à utiliser (pour mesurer les canaux)
- LinkedIn : `https://www.claudeai-academy.com/kit?src=linkedin`
- Instagram bio : `?src=instagram-bio` · stories : `?src=instagram-stories`
- TikTok : `?src=tiktok`

## 7. Marque & garde-fous
- **Voix** : tutoiement, phrases courtes, verbes actifs, exemples concrets. **ZÉRO** hype, « secrets », « révolutionner », timer, faux témoignage. **PAS d'em dashes** dans la copie publiée.
- **Charte** : crème #F5F1EB, coral #D97757 (accent unique), ink #1F1F1E, vert #2A9D8F (garantie only), serif Fraunces (titres + mots-clés en italique coral), Inter (corps).
- **Faits canoniques** : 7 parcours, 40 leçons, 170 prompts, Mentor IA. Starter 47 € (2 parcours), Mastery 497 € ou 3×179 € (tout). Accès à vie, garantie 14 j.
- **Sécurité** : jamais de secret saisi en dashboard ; jamais cliquer un bouton public irréversible sans accord explicite du user par action.
- **Compte LinkedIn** : profil perso `linkedin.com/in/alexandredosreiscaetano` (Alexandre Dos Reis Caetano), ~1962 abonnés, #OpenToWork actif (HORECA) → ne pas casser le positionnement HORECA.

## 8. Maths cible (rappel)
~8 Mastery (3 976 €) + ~25 Starter (1 175 €) = ~5 151 €/mois. Starter = tripwire ; la marge est dans l'ascension Mastery. Le contenu social ne vend pas : il remplit la liste ; la liste vend.
