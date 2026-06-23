# 🔗 Note de liaison — reprise en session LOCALE (Windows)

> Colle cette note en **premier message** dans la nouvelle fenêtre Claude Code lancée **en local sur Windows**. Elle contient tout le contexte pour reprendre sans rien réexpliquer.

---

## 0. Topo en une phrase
On a créé des **visuels de vente (prix)** + une **note de publication pour Hermès** dans la session *cloud* ; ils sont sur GitHub mais **pas encore sur le bureau Windows**. Ta mission en local : **les faire descendre dans le dossier que surveille Hermès**, proprement, sans casser le dépôt local.

## 1. Qui / quoi
- **Projet** : ClaudeAI Academy — site Next.js qui vend une formation Claude AI.
- **Dépôt** : `alexandredrc/claudeai-academy`.
- **Dossier local (Windows)** : `C:\Users\adrc1\Desktop\claudeai-academy`
- **Branche où est TOUT le travail** : `claude/france-travail-folder-59b5y4` (poussée sur origin).
- **Offre / chiffres clés** : Pass Starter **47 €**, Pass Mastery **497 €** (ou 3×179 €), **accès à vie**, **garantie 14 jours**, 7 parcours · 40 leçons · 170 prompts.
- **Charte** : palette crème/corail, polices Fraunces (serif) + Inter ; ton = **tutoiement**.
- **Liens** : ventes → `https://www.claudeai-academy.com/tarifs?src=…` ; contenu froid → `/kit`.

## 2. Ce qui a été produit (sur la branche ci-dessus)
- `marketing/neuromarketing-visuals.html` — gabarit. Cartes **nm-1…nm-4** (feed 4:5, 1080×1350) + **st-1…st-4** (story/TikTok 9:16, 1080×1920).
- `scripts/render-neuromarketing.mjs` — rend les 2 formats. Commande : `npm run render:neuromarketing` → sort dans `marketing/exports/neuromarketing/` (ignoré par git).
- `marketing/visuels-prix/` — **8 PNG finaux versionnés** :
  - `mastery-prix-par-jour.png` / `-9x16.png` → **1,36 €/jour**
  - `mastery-497-par-jour.png` / `-9x16.png` → **497 €** (< 1,40 €/jour)
  - `cafe-vs-formation.png` / `-9x16.png` → **547 € vs 497 €**
  - `starter-prix-par-jour.png` / `-9x16.png` → **0,13 €/jour**
- `marketing/note-hermes-publication.md` — **brief de publication** pour Hermès (LinkedIn, Instagram via Meta Business, TikTok) : légendes par réseau, liens `?src=`, calendrier, formats, checklist.

⚠️ **IMPORTANT sur le style** : l'utilisateur ne veut **PAS** de visuels qui *expliquent* le neuromarketing à ses clients. Il veut de la **vente directe** : prix en gros + phrase qui ramène le coût à la journée (sur 365 j). Les 8 PNG actuels sont déjà dans ce bon format. (Le nom du fichier HTML dit « neuromarketing » mais c'est juste la stratégie interne — aucun texte visible ne le mentionne.)

## 3. Hermès (le destinataire)
- C'est un **agent IA 100 % autonome** avec des **providers branchés** (peut publier seul sur TikTok / Meta / LinkedIn).
- Il **lit un dossier local** sur le bureau. **À CONFIRMER avec l'utilisateur** : quel dossier exactement ? Candidats vus dans le clone local :
  - `…\claudeai-academy\marketing\`
  - `…\claudeai-academy\CLAUDE IA\` (dossier non suivi, avec un espace — possiblement le dossier d'Hermès)
- Il lui faut **les 8 images + la note** dans ce dossier pour publier.

## 4. 🎯 Tâches à exécuter en LOCAL
1. **Confirmer** avec l'utilisateur le dossier surveillé par Hermès (`marketing\` ou `CLAUDE IA\`).
2. **Récupérer le travail de la branche** `claude/france-travail-folder-59b5y4` dans le clone local (les 8 PNG + la note) — voir §5 pour la méthode prudente.
3. **Placer** `visuels-prix/` (8 PNG) + `note-hermes-publication.md` dans le dossier d'Hermès.
4. **Vérifier** qu'Hermès les détecte (et, si possible, lui faire générer des **brouillons** avant publication réelle — garde-fou).

## 5. ⚠️ État du dépôt LOCAL — à manipuler avec PRÉCAUTION
`git status` local (constaté côté utilisateur) :
- Sur la branche **`main`**, **en retard de 36 commits** sur `origin/main` (fast-forward possible).
- **Modifs non commitées** : `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx` → **NE PAS LES PERDRE**.
- **Fichiers non suivis** : `.claude/`, `.stfolder/`, `.stignore`, `AGENTS.md`, `CLAUDE IA/`, une capture d'écran, `DESIGN.md`, `PRODUCT.md`, `marketing/`, `pipeline/`, `src/app/tarifs/`, `src/components/`.
- 🔴 **`.stfolder` / `.stignore` = Syncthing** : ce dossier est aussi synchronisé par Syncthing. Attention aux interactions.
- 🔴 `marketing/` est **non suivi en local** alors qu'il est **suivi sur origin** → un `git pull` brut va probablement **échouer** (« untracked working tree files would be overwritten ») ou risquer d'écraser du travail local.

**Conséquence** : NE PAS faire un `git pull` aveugle. Méthode recommandée, dans l'ordre :
1. Commencer par **sauvegarder l'état local** : `git stash` (pour les fichiers suivis) + **copier ailleurs** les dossiers non suivis sensibles (`marketing\`, `CLAUDE IA\`, `pipeline\`, `src\components\`, `src\app\tarifs\`) avant toute manip.
2. Demander à l'utilisateur ce qu'il veut garder de son `marketing/` local (il diffère peut-être de celui d'origin).
3. **Option la moins risquée pour livrer Hermès tout de suite** : ne PAS toucher au git, et simplement **télécharger/copier les 8 PNG + la note** depuis la branche (ou depuis le ZIP déjà fourni à l'utilisateur) directement dans le dossier d'Hermès. Le git « propre » peut se faire après, séparément.
4. Si l'utilisateur veut vraiment réaligner le git : récupérer les fichiers ciblés depuis la branche sans tout fusionner, p.ex. `git fetch origin claude/france-travail-folder-59b5y4` puis `git checkout origin/claude/france-travail-folder-59b5y4 -- marketing/visuels-prix marketing/note-hermes-publication.md`.

## 6. Pour régénérer les visuels si besoin
`npm run render:neuromarketing` (nécessite Chrome/Edge installé — la version locale Windows l'aura). Modifier les textes/prix dans `marketing/neuromarketing-visuals.html` puis relancer.

## 7. Points ouverts à valider avec l'utilisateur
- [ ] Dossier exact surveillé par Hermès.
- [ ] Le témoignage de la preuve sociale (si on réutilise l'ancienne série) — placeholder à remplacer.
- [ ] Faut-il fusionner la branche dans `main` (PR) une fois le local sécurisé ?
- [ ] Référence prix de la carte « café » (1,50 €) à garder ou ajuster.

---
*Fin de la note de liaison. Reprends à partir de §4 une fois le dossier d'Hermès confirmé.*
