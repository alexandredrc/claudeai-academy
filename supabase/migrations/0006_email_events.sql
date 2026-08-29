-- =========================================
-- ClaudeAI Academy — Événements de délivrabilité des emails
-- Migration : 0006_email_events
-- But : savoir ce que deviennent les emails partis.
--
--   Au 27/08/2026, 218 emails de séquence avaient été envoyés à 45 prospects
--   pour zéro vente attribuable — sans qu'aucune ouverture ni aucun clic ne
--   soit enregistré nulle part. Impossible, dans ces conditions, de
--   distinguer un problème de délivrabilité (on n'arrive pas dans la boîte)
--   d'un problème d'objet (on n'est pas ouvert) ou d'offre (on est ouvert et
--   on n'intéresse pas). Trois causes, trois remèdes opposés.
--
--   Resend émet un webhook par événement ; `/api/resend/webhook` les dépose
--   ici. Le `kind` reprend le tag posé à l'envoi (nurture_d1, lead_a3,
--   activation_j10…), ce qui permet de calculer un taux d'ouverture et de
--   clic par étape de séquence.
-- =========================================

create table public.email_events (
  id uuid primary key default uuid_generate_v4(),

  -- Identifiant du message chez Resend : recolle tous les événements d'un
  -- même envoi (sent → delivered → opened → clicked).
  resend_id text,

  -- 'email.sent', 'email.delivered', 'email.delivery_delayed', 'email.opened',
  -- 'email.clicked', 'email.bounced', 'email.complained'.
  event_type text not null,

  email text,

  -- Étape de séquence, reprise du tag d'envoi. Null pour les emails
  -- transactionnels non tagués.
  kind text,

  -- URL cliquée (événement 'email.clicked' uniquement).
  link text,

  -- Horodatage de l'événement chez Resend (pas celui de la réception).
  occurred_at timestamptz not null default now(),

  created_at timestamptz not null default now()
);

comment on table public.email_events is 'Événements Resend (envoi, remise, ouverture, clic, rejet) — mesure des séquences email.';
comment on column public.email_events.kind is 'Étape de séquence issue du tag d''envoi : nurture_d1, lead_a3, activation_j10, …';

-- Idempotence : Resend rejoue un webhook non acquitté. Un même message ne
-- peut produire qu'un exemplaire de chaque événement daté.
create unique index email_events_dedupe_key
  on public.email_events (resend_id, event_type, occurred_at)
  where resend_id is not null;

-- Les deux lectures utiles : « taux d'ouverture de l'étape X » et
-- « que devient l'adresse Y ».
create index email_events_kind_idx on public.email_events (kind, event_type);
create index email_events_email_idx on public.email_events (email);

-- RLS : table 100 % serveur, écrite par le webhook via le service_role.
-- Aucune policy 'authenticated' → invisible côté client.
alter table public.email_events enable row level security;
