# Recette — Programmer les posts LinkedIn (semaine 1)

> **MISE À JOUR 15/06/2026 — entièrement automatisable.** L'ancienne croyance (« le planificateur gèle l'extension de façon non récupérable ») est **fausse**. Le gel à l'ouverture du modal « Programmer un post » est **transitoire (~30 s)** : il suffit de re-capturer l'écran après et le modal répond. De même, le passage du modal date/heure au composeur (clic « Suivant ») a un délai transitoire — attendre 3-4 s puis re-capturer. Les 4 posts 2/5/6/7 ont été programmés ainsi de bout en bout (texte + visuel + date/heure + Programmer), sans intervention manuelle.
>
> **Astuce visuel sans dialogue Windows** : charger le PNG dans le presse-papiers en image via PowerShell, puis Ctrl+V dans le composeur :
> ```powershell
> Add-Type -AssemblyName System.Windows.Forms; Add-Type -AssemblyName System.Drawing
> $img=[System.Drawing.Image]::FromFile("C:\Users\adrc1\Documents\Claude\post-5.png")
> [System.Windows.Forms.Clipboard]::SetDataObject($img,$true); $img.Dispose()
> ```
> L'extension Chrome ne pilote que son **propre groupe d'onglets** : recomposer chaque post à neuf dans l'onglet MCP (les onglets pré-remplis ouverts à la main ne sont pas accessibles).

## Astuce clé découverte
Pour joindre l'image **sans passer par le dialogue Windows** (qui gèle aussi) : copie le PNG dans le presse-papiers et **colle-le (Ctrl+V)** directement dans le composeur. LinkedIn l'attache comme média. (C'est ce que j'utilisais en auto, ça marche parfaitement.)

## Visuels prêts
- `marketing/exports/linkedin/post-2.png`, `post-5.png`, `post-6.png`, `post-7.png`
- Copies aussi dans `C:\Users\adrc1\Documents\Claude\` (pour upload manuel rapide via le bouton Photo).

## Calendrier semaine 1 (créneaux 08:00 CEST)
| Post | Date | Heure | Visuel | Texte (source) |
|------|------|-------|--------|----------------|
| Post 2 | lun 15/06/2026 | 08:00 | post-2.png | `linkedin-content-bank.md` § Post 2 |
| Post 5 | mar 16/06/2026 | 08:00 | post-5.png | § Post 5 |
| Post 6 | mer 17/06/2026 | 08:00 | post-6.png | § Post 6 |
| Post 7 | jeu 18/06/2026 | 08:00 | post-7.png | § Post 7 |

## Pas-à-pas (par post)
1. Fil LinkedIn → **Commencer un post**.
2. Colle le **texte** (depuis `linkedin-content-bank.md`).
3. Ajoute le **visuel** : soit Ctrl+V si le PNG est dans le presse-papiers, soit bouton **Photo** → choisir le fichier dans `Documents\Claude`.
4. Clique l'icône **horloge** (en bas à droite) → **Programmer un post**.
5. **Date** : clique le champ → choisis le jour dans le calendrier (15, 16, 17, 18 juin).
6. **Heure** : clique le champ → choisis **08:00** dans la liste.
7. **Suivant** → puis **Programmer**.
8. **Lien en commentaire** (à faire quand le post sort, ou pré-noter) :
   ```
   Le Kit gratuit (15 prompts pros, classés par métier) :
   https://www.claudeai-academy.com/kit?src=linkedin
   ```

## Vérif
Menu **Vous → Posts → Programmés** (ou « Voir tous les posts programmés » dans le modal) pour confirmer les 4 entrées.

## Important
- Ne jamais publier sans relire (profil perso = réputation).
- Garder le positionnement HORECA du profil intact (ne pas toucher au titre / #OpenToWork).
- Post 1 est déjà publié (texte seul).
