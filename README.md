# ClaudeAI Academy

Site e-learning francophone dédié à la maîtrise de Claude AI (prompt engineering, Claude Code, automatisation, IA business).

## Stack

- **Frontend** : Next.js 16 (App Router) · TypeScript · Tailwind CSS 4
- **Backend** : Supabase (Postgres + Auth + Storage + RLS)
- **Paiement** : Stripe Checkout + Customer Portal + Stripe Tax
- **Email transactionnel** : Resend
- **Hébergement** : Vercel (frontend) + Supabase Cloud (backend) + Cloudflare (DNS/CDN)
- **Domaine** : claudeai-academy.com

## Pré-requis

- Node.js >= 20
- Compte Supabase, Stripe, Resend, Vercel, GitHub
- Domaine `claudeai-academy.com` (déjà acheté chez OVH, à pointer vers Cloudflare)

## Setup local

```bash
# 1. Installer les dépendances
npm install

# 2. Copier les variables d'environnement
cp .env.example .env.local

# 3. Remplir .env.local avec tes valeurs Supabase / Stripe / Resend

# 4. Appliquer les migrations Supabase
# Soit via le dashboard Supabase (SQL Editor → coller supabase/migrations/0001_initial_schema.sql)
# Soit via la CLI Supabase si installée : supabase db push

# 5. Lancer le serveur de dev
npm run dev
```

Le site est accessible sur http://localhost:3000.

## Structure du projet

```
src/
├── app/                    # Routes Next.js (App Router)
│   ├── layout.tsx          # Layout racine (polices, metadata)
│   ├── page.tsx            # Landing page
│   └── globals.css         # Tailwind + variables charte
├── lib/
│   └── supabase/           # Helpers Supabase
│       ├── client.ts       # Client navigateur
│       ├── server.ts       # Client server components
│       └── proxy.ts        # Refresh session côté proxy (Next.js 16)
└── proxy.ts                # Refresh auth sur chaque requête

supabase/
└── migrations/
    └── 0001_initial_schema.sql   # Schema initial (profiles, courses, lessons, subscriptions, …)

public/                     # Assets statiques
```

## Charte graphique

| Token | Valeur |
|---|---|
| Crème (background) | `#F5F1EB` |
| Corail (accent) | `#D97757` |
| Encre (texte) | `#1F1F1E` |
| Vert (succès) | `#2A9D8F` |
| Police titre | Fraunces |
| Police texte | Inter |

Les variables sont définies dans `src/app/globals.css` via `@theme` (Tailwind 4).

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — build production
- `npm run start` — serveur de production (après build)
- `npm run lint` — vérification ESLint

## Déploiement

Push sur `main` → Vercel build & deploy automatique.

Variables d'environnement à configurer côté Vercel (toutes celles du `.env.example`).
