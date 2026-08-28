# Rapport de reprise — Campagne marketing ClaudeAI Academy

> Document de passation pour reprendre le chantier dans une nouvelle session.
> Dernière mise à jour : **2026-08-28**. Précédente : 2026-06-14 (périmée, ~10 semaines de retard).

## 0. Objectif
Générer **5 000 €+/mois** via le tunnel : contenu social → lead magnet `/kit` → email → vente Pass Starter (47 €) → ascension Pass Mastery (497 €). Idée maîtresse : « Les 80 % que tu n'exploites pas ».

## 1. ⚠️ État réel du chantier (À LIRE EN PREMIER)

**La campagne sociale est à l'arrêt depuis mi-juin.** Le produit, lui, a continué d'avancer jusqu'au 24/08.

- Dernier commit marketing utile : `ef5f39c` (04/07, story IG récap). Avant ça, `0bd55c3` (15/06).
- Les 4 posts LinkedIn programmés (2, 5, 6, 7) sont sortis les **15–18/06/2026**. Depuis : **rien de programmé** côté dépôt.
- ⚠️ **À confirmer avec le user** : a-t-il publié à la main sur LinkedIn / IG / TikTok depuis juillet ? Le dépôt ne peut pas le savoir. Idem pour l'état réel de la liste `leads` (volume, sources) — à lire dans Supabase avant toute décision.

### Environnement technique
- **Ce dépôt** : branche de travail = `origin/main` (pas de worktree Windows dans les sessions distantes). L'ancien chemin `C:\Users\adrc1\...\worktrees\peaceful-swanson-4b00df` du doc précédent n'a plus lieu d'être ici.
- **Flux de déploiement** : commit → `git push -u origin <branche>` → merge dans `main` = déploiement Vercel PROD. Alias prod : `www.claudeai-academy.com`.
- **Vercel** : projet `prj_HoyblMXegU8qqzyygGzVG6SCLm5D`, team `team_9N8eO0Qfa5ofrkCCcYI6meOV`.
- **Supabase PROD** : projet `rjthvbhdcktiioxpipqy` (`claudeai-academy-prod`). Tables campagne : `leads`, `lead_email_log` (RLS verrouillé, serveur-only). Ne faire que de l'additif.
- **Email** : Resend (clé sur Vercel, VIDE en local → `emailSent:false` en local, normal).
- **Build** : `npm run build` (Next 16 + Turbopack) et `npx tsc --noEmit`. Toujours vérifier avant de pousser sur `main`.

## 2. ✅ FAIT et EN LIGNE (production)

### Tunnel d'acquisition
- `/kit` (capture) + `/kit/ressources` (15 prompts chartés) + `/kit/merci`.
- **Attribution de source** : `/kit?src=xxx` (ou `?utm_source=`) → `leads.source` (défaut `kit-direct`). Sanitize a-z0-9_-, 40 char.
- API `/api/lead` : validation, upsert idempotent (unique sur `email`), honeypot, envoi du magnet. Testé live.

### Séquences email (`src/lib/email/`)
| Séquence | Emails | Cron |
|---|---|---|
| A — leads → Starter | `lead_magnet`, `lead_a1`→`lead_a5` (J+2→J+10) | `/api/cron/lead-nurture`, 9h30 |
| B — clients → ascension | `nurture_d1`, `d7`, `d14`, `d21`, `d30` | `/api/cron/nurture`, 9h00 |
| Transactionnel | `confirm-signup`, `welcome`, `login-link`, `checkout-recovery` | à l'événement |

Les crons sont déclarés dans `vercel.json`. La séquence B est allée plus loin que ce que décrivait l'ancien doc (d21 et d30 ajoutés).

### Social
- **LinkedIn** : bio « Infos » créée (pont HORECA + IA, lien `/kit`). Post 1 publié le 14/06 (texte seul, ~34 impressions). **Posts 2, 5, 6, 7 programmés puis sortis les 15–18/06** avec visuels.
- **Bios Instagram + TikTok** : rédigées → `marketing/bios-instagram-tiktok.md`.

### Produit / SEO (nouveau depuis l'ancien doc, utile à la campagne)
- 4 pages SEO de fond : `/formation-intelligence-artificielle` (pilier), `/prompt-engineering`, `/formation-ia-obligatoire-ai-act`, `/claude-vs-chatgpt`. Plus `/formation-claude-ai`, `/tarifs`, `/faq`, `/prompts`, `/mentor`.
- **Citabilité IA** : `llms.txt`, `robots.ts` ouvert aux crawlers IA, JSON-LD (`src/lib/seo/jsonld.ts`), sitemap étendu.
- 7 témoignages avec visages sur la landing.
- Rattrapage des paniers Stripe abandonnés (`checkout-recovery`), fiche client + facture à l'achat.
- **Veille** : registre de faits périssables (`scripts/veille/facts.mjs`) + vérificateur (`check-facts.mjs`). À lancer avant toute campagne pour éviter de publier un chiffre mort.

## 3. 📦 PRÊT mais PAS publié/programmé
- **Banque LinkedIn** : `linkedin-content-bank.md` — 16 posts + 3 carrousels + calendrier 4 semaines. **Posts 3, 4, 8 à 16 jamais publiés.**
- **Visuels LinkedIn** : `linkedin-visuals.html` → PNG dans `exports/linkedin/`. Régénérer : `npm run render:linkedin`.
  - Posts : `post-1, 2, 5, 6, 7, 10, 12, 13`.
  - Carrousels : couvertures `cover-1/2/3` **+ slides internes `c1-2→c1-7`, `c2-2→c2-7`, `c3-2→c3-6`** (faits le 15/06, l'ancien doc les disait manquants).
- **Plan Instagram** : `instagram-plan.md` — 20 posts / 4 semaines + 8 Reels sans visage scriptés + highlights/hashtags.
- **Kit IG** : `instagram-lancement.md` + visuels HTML (carrousel, stories, reel-cover, story récap 8 parcours) + exports PNG.
- **TikTok** : logo prêt (`tiktok-logo.html` → `exports/tiktok/`).

## 4. ❌ PAS FAIT / TODO
1. **Reprendre la cadence de publication** — c'est LE déblocage. Semaine 1 LinkedIn est sortie mi-juin, les semaines 2 à 4 de la banque n'ont jamais été programmées.
2. **Instagram** : compte Business/Creator + page FB liée + bio + première publication.
3. **TikTok** : compte + bio + publication (les 8 scripts Reels existent déjà).
4. **Reels/TikTok** : vidéos à **tourner** (screen recordings de Claude) — tâche du user, rien ne peut avancer sans.
5. **Mesure** : aucun bilan des `leads` par `source` n'a été fait. À sortir de Supabase avant de rejouer la même stratégie à l'aveugle.
6. Smoke test des séquences A/B : se déclenchent au cron, non testables tant que des leads n'ont pas vieilli.

## 5. 🚧 Blockers réels (besoin du user ou préalable)
1. **Publication LinkedIn : « go » du user requis par post.** Contenu public = sa réputation.
2. **Instagram auto-publish** : impossible sans compte Business/Creator + page Facebook (API Meta).
3. **TikTok** : lien cliquable en bio réservé aux 1 000+ abonnés ; en dessous, URL en texte.
4. **Reels/TikTok** : vidéos à tourner avant toute publication vidéo.

> ~~« Le planificateur LinkedIn gèle l'extension Chrome »~~ — **faux, démenti le 15/06**. Le gel est transitoire (~30 s) : re-capturer l'écran et le modal répond. Les 4 posts ont été programmés de bout en bout en automatique. Procédure complète : `RECETTE-PROGRAMMATION-LINKEDIN.md`.

## 6. ▶️ PROCHAINE ACTION proposée
Avant de produire quoi que ce soit de neuf, **reprendre pied** :
- **A) Bilan chiffré** : lire `leads` dans Supabase (volume total, répartition par `source`, conversions). Sans ça, on rejoue une stratégie non validée.
- **B) Relancer LinkedIn** : programmer la semaine 2 depuis `linkedin-content-bank.md` (visuels `post-10`, `post-12`, `post-13` déjà rendus ; en rendre d'autres si besoin), procédure dans `RECETTE-PROGRAMMATION-LINKEDIN.md`, « go » du user par post.
- **C) Vérifier les faits** avant publication : `node scripts/veille/check-facts.mjs` — la copie sociale cite des chiffres produit qui ont bougé.

### Liens d'attribution (à ne jamais retirer)
- LinkedIn : `https://www.claudeai-academy.com/kit?src=linkedin`
- Instagram bio : `?src=instagram-bio` · stories : `?src=instagram-stories`
- TikTok : `?src=tiktok`

## 7. Marque & garde-fous
- **Voix** : tutoiement, phrases courtes, verbes actifs, exemples concrets. **ZÉRO** hype, « secrets », « révolutionner », timer, faux témoignage. **PAS d'em dashes** dans la copie publiée.
- **Charte** : crème #F5F1EB, coral #D97757 (accent unique), ink #1F1F1E, vert #2A9D8F (garantie only), serif Fraunces (titres + mots-clés en italique coral), Inter (corps).
- **Sécurité** : jamais de secret saisi en dashboard ; jamais cliquer un bouton public irréversible sans accord explicite du user, action par action.
- **Compte LinkedIn** : profil perso `linkedin.com/in/alexandredosreiscaetano`, ~1962 abonnés, #OpenToWork actif (HORECA) → ne pas casser le positionnement HORECA (ne pas toucher au titre).

## 8. ⚠️ Faits canoniques — CORRIGÉS le 28/08
L'ancien doc annonçait « 7 parcours, 40 leçons » et « 3×179 € ». **C'est faux aujourd'hui.** Valeurs vérifiées dans le code :

| Fait | Valeur actuelle | Source |
|---|---|---|
| Parcours | **8** | `scripts/content/*.mjs`, `layout.tsx` |
| Leçons | **48** | `layout.tsx`, `faq.tsx`, `tarifs` |
| Prompts (offre) | **170** | `layout.tsx`, `tarifs` |
| Prompts (lead magnet) | **15** | `/kit` |
| Pass Starter | **47 €** — 3 parcours fondateurs (Bien démarrer + Prompt Engineering pro + Claude Code), **21 leçons** | `pricing-teaser.tsx` |
| Pass Mastery | **497 €**, ou **3× sans frais via Klarna** (plus « 3×179 € ») | `tarifs`, `pricing-teaser.tsx` |
| Garantie | 14 jours, accès à vie | `guarantee.tsx` |

Toute copie sociale écrite avant le 28/08 cite potentiellement les anciens chiffres : **relire `linkedin-content-bank.md` et `instagram-plan.md` avant de publier.**

## 9. Maths cible (rappel)
~8 Mastery (3 976 €) + ~25 Starter (1 175 €) = ~5 151 €/mois. Starter = tripwire ; la marge est dans l'ascension Mastery. Le contenu social ne vend pas : il remplit la liste ; la liste vend.
