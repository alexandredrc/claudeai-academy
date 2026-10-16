-- 0015 : quota d'emails des formulaires publics (audit global du 16/10/2026, point 2).
--
-- Resend gratuit = 100 emails par jour pour tout le site, lien d'accès des
-- acheteurs compris. /signup, /acces et /api/lead envoient un email à
-- n'importe quelle adresse : un script pouvait vider le quota. Chaque envoi
-- issu d'un de ces formulaires consomme ici une ligne, et la fonction refuse
-- au-delà de trois seuils glissants sur 24 h : par IP, par adresse, global.
--
-- Les envois serveur (webhook Stripe, crons) ne passent jamais par ici.
--
-- Ni IP ni adresse en clair : des empreintes SHA-256 tronquées, calculées par
-- le serveur. Les lignes de plus de 48 h sont effacées à chaque appel.
--
-- Additive et rejouable. Table et fonction réservées au rôle service.

create table if not exists public.quota_emails (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  formulaire text not null check (formulaire in ('signup', 'acces', 'lead')),
  ip_empreinte text not null,
  email_empreinte text not null
);

create index if not exists quota_emails_created_idx on public.quota_emails (created_at);
create index if not exists quota_emails_ip_idx on public.quota_emails (ip_empreinte, created_at);
create index if not exists quota_emails_email_idx on public.quota_emails (email_empreinte, created_at);

alter table public.quota_emails enable row level security;

-- Renvoie 'ok' (la ligne est consommée, l'email peut partir) ou le seuil
-- atteint : 'ip', 'email' ou 'global' (rien n'est consommé). Un seuil null
-- n'est pas contrôlé. Le global ne compte que les formulaires de
-- p_formulaires_globaux, pour que le kit (plafonné à part) et les formulaires
-- d'accès aient chacun leur budget.
create or replace function public.consommer_quota_email(
  p_formulaire text,
  p_ip_empreinte text,
  p_email_empreinte text,
  p_max_ip integer,
  p_max_email integer,
  p_max_global integer,
  p_formulaires_globaux text[]
) returns text
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_depuis timestamptz := now() - interval '24 hours';
  v_n integer;
begin
  -- Sérialise les appels concurrents : sans verrou, dix requêtes simultanées
  -- liraient toutes le même compte et passeraient toutes.
  perform pg_advisory_xact_lock(hashtext('consommer_quota_email'));

  delete from public.quota_emails where created_at < now() - interval '48 hours';

  if p_max_ip is not null then
    select count(*) into v_n from public.quota_emails
      where ip_empreinte = p_ip_empreinte and created_at >= v_depuis;
    if v_n >= p_max_ip then return 'ip'; end if;
  end if;

  if p_max_email is not null then
    select count(*) into v_n from public.quota_emails
      where email_empreinte = p_email_empreinte and created_at >= v_depuis;
    if v_n >= p_max_email then return 'email'; end if;
  end if;

  if p_max_global is not null then
    select count(*) into v_n from public.quota_emails
      where formulaire = any(p_formulaires_globaux) and created_at >= v_depuis;
    if v_n >= p_max_global then return 'global'; end if;
  end if;

  insert into public.quota_emails (formulaire, ip_empreinte, email_empreinte)
    values (p_formulaire, p_ip_empreinte, p_email_empreinte);
  return 'ok';
end;
$$;

revoke execute on function public.consommer_quota_email(text, text, text, integer, integer, integer, text[])
  from public, anon, authenticated;
grant execute on function public.consommer_quota_email(text, text, text, integer, integer, integer, text[])
  to service_role;
