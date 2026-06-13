-- =========================================
-- ClaudeAI Academy — Journal des emails cycle de vie
-- Migration : 0004_email_log
-- But : idempotence des envois nurture (un seul J+1 et un seul J+7 par user).
--   Le cron /api/cron/nurture lit cette table pour ne jamais ré-envoyer.
-- =========================================

create table public.email_log (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,

  -- Type d'email cycle de vie : 'nurture_d1', 'nurture_d7' (extensible).
  kind text not null,

  -- Achat à l'origine de la séquence (info ; on garde l'historique si l'achat saute).
  purchase_id uuid references public.purchases(id) on delete set null,

  sent_at timestamptz not null default now(),

  -- Un seul email de chaque type par utilisateur.
  unique (user_id, kind)
);

comment on table public.email_log is 'Journal des emails cycle de vie (nurture) — garantit l''idempotence des envois.';
comment on column public.email_log.kind is 'Type d''email : nurture_d1, nurture_d7, …';

create index email_log_user_idx on public.email_log (user_id);

-- RLS : table 100 % serveur (écrite/lue par le service_role via le cron).
-- Aucune policy pour 'authenticated' → invisible côté client, seul service_role passe.
alter table public.email_log enable row level security;
