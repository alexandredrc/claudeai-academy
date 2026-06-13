# Emails d'authentification chartés — Resend en SMTP custom dans Supabase

Objectif : que les emails d'auth (validation d'inscription, lien magique, reset mot de passe, changement d'email) **partent de `claudeai-academy.com`** et **portent la charte du site**, au lieu d'être envoyés par Supabase avec son branding.

Trois étapes, dans cet ordre. L'étape 1 est le prérequis qui débloque tout.

---

## Étape 1 — Vérifier le domaine d'envoi chez Resend (prérequis)

Sans domaine vérifié, ni l'email de bienvenue ni le SMTP custom ne partent.

1. [resend.com](https://resend.com) → **Domains** → **Add Domain**.
   - Recommandé : un **sous-domaine d'envoi** dédié, ex. `send.claudeai-academy.com` (isole la réputation de délivrabilité du domaine principal). Sinon `claudeai-academy.com` marche aussi.
2. Resend affiche une liste d'enregistrements DNS à créer : **MX**, **TXT (SPF)**, **2–3 CNAME (DKIM)**, et un **TXT (DMARC)**.
3. Ces enregistrements vont dans la **zone DNS OVH** (`manager.eu.ovhcloud.com` → claudeai-academy.com → Zone DNS) — exactement comme le TXT Google posé pour Search Console.
   - 👉 **Je peux poser ces enregistrements OVH pour toi** (comme le TXT Google) : connecte-toi à OVH dans l'onglet du groupe Claude, ouvre la page Domains de Resend, et dis-moi « go DNS Resend » — je lis les enregistrements affichés et je les ajoute un par un.
4. Reviens sur Resend, attends le statut **Verified** (vert). Quelques minutes en général.

> ⚠️ Note : `EMAIL_FROM` (l'email de bienvenue) doit utiliser **ce même domaine vérifié**. Si l'email de bienvenue ne t'est pas arrivé après l'achat, c'est très probablement parce que le domaine n'était pas encore vérifié — cette étape le corrige aussi.

---

## Étape 2 — Brancher Resend en SMTP custom dans Supabase

Supabase → ton projet → **Authentication** → **Emails** (onglet **SMTP Settings**) → active **Enable Custom SMTP**.

| Champ | Valeur |
|---|---|
| Host | `smtp.resend.com` |
| Port | `465` (SSL) — ou `587` si bloqué |
| Username | `resend` |
| **Password** | **ta clé API Resend** (`re_…`) — 🔒 **c'est toi qui la colles, je ne saisis jamais de secret dans un dashboard** |
| Sender email | `no-reply@claudeai-academy.com` (ou `@send.claudeai-academy.com` si tu as pris le sous-domaine) — **doit être sur le domaine vérifié à l'étape 1** |
| Sender name | `ClaudeAI Academy` |

Enregistre. À partir de là, l'expéditeur n'est plus « Supabase ».

> Génère la clé Resend dans Resend → **API Keys** (permission *Sending access* suffit). C'est la même clé que `RESEND_API_KEY` côté Vercel — tu peux réutiliser celle-là.

---

## Étape 3 — Coller les templates chartés

Supabase → **Authentication** → **Email Templates**. Pour chaque template, remplace le HTML par le fichier correspondant et mets le sujet conseillé :

| Template Supabase | Fichier | Sujet conseillé |
|---|---|---|
| **Confirm signup** | `confirm-signup.html` | `Confirme ton adresse — ClaudeAI Academy` |
| **Magic Link** | `magic-link.html` | `Ton lien de connexion — ClaudeAI Academy` |
| **Reset Password** | `reset-password.html` | `Réinitialise ton mot de passe — ClaudeAI Academy` |
| **Change Email Address** | `change-email.html` | `Confirme ta nouvelle adresse — ClaudeAI Academy` |

Les templates utilisent uniquement `{{ .ConfirmationURL }}`, la variable standard de Supabase — **le flux de confirmation existant (`/auth/callback`) reste intact**, on ne change que l'habillage et l'expéditeur.

---

## Étape 4 — Tester

1. Crée un compte de test avec une adresse jetable (ou ta propre adresse secondaire).
2. Vérifie que l'email de validation : **(a)** part de `…@claudeai-academy.com`, **(b)** porte la charte crème/coral, **(c)** le lien « Confirmer mon adresse » connecte bien le compte.
3. Pour le reset : depuis `/login`, demande une réinitialisation et vérifie le rendu.

---

### Ce que je peux faire / pas faire

- ✅ Préparer les templates (faits), poser les enregistrements DNS Resend chez OVH (sur ton « go »), te guider.
- ❌ Coller la clé API Resend dans le dashboard Supabase, ni dans Resend SMTP — **secret dans un dashboard = toi**.
