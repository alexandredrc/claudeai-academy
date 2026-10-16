-- Témoignages reçus par le formulaire /temoignage (octobre 2026).
--
-- Additive et idempotente. Lecture et écriture réservées au rôle service
-- (RLS active, aucune policy) : la route /api/temoignage écrit, le fondateur
-- lit depuis le tableau de bord Supabase. Rien n'est publié automatiquement.
--
-- `statut` est calculé par le serveur au moment de l'envoi, jamais déclaré
-- par la personne : « acheteur » si l'email a un achat payé, « kit » si
-- l'email est un lead du kit gratuit, « inconnu » sinon. C'est ce statut qui
-- s'affiche à côté d'un avis publié (art. D111-10 du Code de la consommation).
--
-- `publication` garde l'accord écrit (RGPD, art. 6.1.a) : ce que la personne
-- accepte de voir publié. « non » = retour privé, jamais affiché.

create table if not exists public.temoignages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  prenom text,
  metier text not null,
  ville text,
  tache text not null,
  minutes_avant integer check (minutes_avant is null or (minutes_avant between 0 and 6000)),
  minutes_apres integer check (minutes_apres is null or (minutes_apres between 0 and 6000)),
  citation text not null,
  publication text not null check (publication in ('prenom_metier_ville', 'metier_seul', 'non')),
  statut text not null check (statut in ('acheteur', 'kit', 'inconnu')),
  source text,
  publie_le timestamptz,
  retire_le timestamptz
);

create index if not exists temoignages_email_idx on public.temoignages (lower(email));

alter table public.temoignages enable row level security;
