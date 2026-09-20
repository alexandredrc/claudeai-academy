-- =========================================
-- ClaudeAI Academy — Acheteurs qui n'ont jamais ouvert leur accès
-- Migration : 0007_acheteurs_sans_acces
--
-- But : rendre actionnable ce que `funnel_health` ne faisait que constater.
--
--   Le 17/09/2026, un Pass Mastery à 497 € est payé depuis une adresse qui
--   ne recevra jamais rien. Le compte est créé, l'accès est valide en base,
--   et son propriétaire ne s'y connecte pas. Deux jours plus tard, la même
--   société repaie 497 € depuis une autre adresse. Le rapport quotidien
--   signalait bien « 1 client payant sans accès » — mais signaler ne fait
--   entrer personne. Il fallait un envoi, pas une ligne de plus.
--
--   Cette fonction est la liste de travail du cron /api/cron/acces : les
--   acheteurs dont le compte n'a JAMAIS servi (`last_sign_in_at is null`),
--   passé un délai de grâce. Elle ne regarde pas `lesson_progress` — on ne
--   parle pas ici de quelqu'un qui traîne à commencer, mais de quelqu'un qui
--   n'a pas pu entrer.
-- =========================================

create or replace function public.acheteurs_sans_acces(min_heures int default 24)
returns table (
  user_id uuid,
  email text,
  tier text,
  paid_at timestamptz,
  jours int,
  amount_total int
)
language sql
security definer
set search_path to 'public', 'auth'
as $$
  select distinct on (p.user_id)
    p.user_id,
    pr.email,
    p.tier::text,
    p.paid_at,
    floor(extract(epoch from (now() - p.paid_at)) / 86400)::int as jours
  from public.purchases p
  join public.profiles pr on pr.id = p.user_id
  join auth.users au on au.id = p.user_id
  where p.status = 'paid'
    and au.last_sign_in_at is null
    and p.paid_at < now() - make_interval(hours => min_heures)
    -- Comptes de test et de démonstration : jamais de relance.
    and pr.email not like 'qa-%'
    and pr.email not like '%@example.com'
    and pr.email not like '%adrc-academy.local'
  -- Un client qui a acheté deux fois n'est relancé qu'une fois, sur son
  -- achat le plus récent (celui dont il attend l'accès).
  order by p.user_id, p.paid_at desc;
$$;

comment on function public.acheteurs_sans_acces is
  'Acheteurs (payants ou sièges offerts) dont le compte n''a jamais été utilisé — liste de travail du cron de relance d''accès.';

-- Fonction serveur uniquement : le cron l'appelle avec la clé service_role.
revoke all on function public.acheteurs_sans_acces(int) from public, anon, authenticated;
