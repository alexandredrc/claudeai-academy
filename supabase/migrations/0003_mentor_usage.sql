-- =========================================
-- ClaudeAI Academy — Migration 0003
-- Rate-limiting du Mentor IA (coût API Claude).
--
-- Une ligne par (utilisateur, jour). Incrément atomique via RPC
-- security definer (FOR UPDATE) pour éviter les races sous concurrence.
-- =========================================

create table public.mentor_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_date date not null default current_date,
  message_count int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, usage_date)
);

comment on table public.mentor_usage is
  'Compteur quotidien d''appels au Mentor IA par utilisateur (garde-fou coût API).';

alter table public.mentor_usage enable row level security;

-- L'utilisateur peut lire sa propre conso (affichage "il te reste X").
create policy "users_read_own_mentor_usage"
  on public.mentor_usage for select
  using (auth.uid() = user_id or public.is_admin());

-- Pas de policy insert/update pour authenticated : seule la RPC
-- security definer (ou service_role) écrit.

-- Incrémente la conso du jour si sous la limite. Atomique.
-- Retourne (allowed, new_count).
create or replace function public.increment_mentor_usage(
  p_user_id uuid,
  p_daily_limit int
)
returns table (allowed boolean, new_count int)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_count int;
begin
  insert into public.mentor_usage (user_id, usage_date, message_count)
  values (p_user_id, current_date, 0)
  on conflict (user_id, usage_date) do nothing;

  select message_count into current_count
  from public.mentor_usage
  where user_id = p_user_id and usage_date = current_date
  for update;

  if current_count >= p_daily_limit then
    return query select false, current_count;
  else
    update public.mentor_usage
      set message_count = message_count + 1,
          updated_at = now()
      where user_id = p_user_id and usage_date = current_date;
    return query select true, current_count + 1;
  end if;
end;
$$;

comment on function public.increment_mentor_usage is
  'Incrément atomique du compteur Mentor IA. Retourne (allowed, new_count).';
