-- =========================================
-- Migration : 0011_app_state
--
-- Un simple magasin clé/valeur pour l'état des tâches planifiées.
--
-- Premier usage : le relevé de la boîte support. Sans mémoire, chaque passage
-- renotifierait les mêmes messages non lus jusqu'à ce qu'ils soient ouverts —
-- autrement dit une alerte toutes les quinze minutes pour un seul mail. On
-- garde donc le dernier identifiant traité.
--
-- Pourquoi ne PAS s'appuyer sur le drapeau « lu » d'IMAP à la place : marquer
-- les messages comme lus pour s'en souvenir priverait le destinataire de son
-- seul repère visuel dans sa boîte.
-- =========================================

create table if not exists public.app_state (
  cle text primary key,
  valeur text,
  updated_at timestamptz not null default now()
);

comment on table public.app_state is 'Mémoire des tâches planifiées (clé/valeur). Écrit uniquement par le serveur.';

-- Table de service : rien n'est lisible depuis le navigateur.
alter table public.app_state enable row level security;
