-- =========================================
-- Migration : 0012_purchases_attribution
--
-- Contexte : au 02/10/2026, douze ventes réelles en base et aucune ne pouvait
-- être rattachée au canal qui l'avait amenée. Le webhook Stripe écrit la vente
-- sans rien savoir du navigateur ; GA4 connaît la session mais pas l'achat ;
-- et 73 leads sur 81 sont en « kit-direct », c'est-à-dire d'origine inconnue.
-- La question « est-ce que la stratégie de com rapporte ? » n'avait donc pas
-- de réponse mesurable.
--
-- Le site pose désormais un cookie de provenance (première partie, sans
-- identifiant) à la première visite ; le checkout le recopie dans la metadata
-- Stripe ; le webhook l'écrit ici. Colonnes purement additives, toutes
-- nullables : une vente sans provenance (lien de paiement créé à la main,
-- cookie refusé, achat antérieur à cette migration) s'enregistre exactement
-- comme avant.
-- =========================================

alter table public.purchases
  add column if not exists utm_source   text,
  add column if not exists utm_medium   text,
  add column if not exists utm_campaign text,
  add column if not exists src          text,
  add column if not exists landing_path text,
  add column if not exists referrer     text,
  add column if not exists first_seen_at date;

comment on column public.purchases.utm_source   is 'Canal qui a amené l''acheteur (instagram, linkedin, google, direct…). Null = vente antérieure au 02/10/2026 ou provenance inconnue.';
comment on column public.purchases.utm_medium   is 'Support du canal (bio, dm, post, organic, cpc, ia, referral, none).';
comment on column public.purchases.utm_campaign is 'Campagne ou lien précis (instagram-bio, linkedin-post, google-organic…).';
comment on column public.purchases.src          is 'Le ?src= d''origine du lien publié, quand il y en avait un.';
comment on column public.purchases.landing_path is 'Première page vue par l''acheteur (chemin seul).';
comment on column public.purchases.referrer     is 'Hôte du site référent de la première visite, quand il y en avait un.';
comment on column public.purchases.first_seen_at is 'Jour de la première visite (début du cycle d''achat).';

create index if not exists purchases_utm_source_idx on public.purchases (utm_source);

-- Vue de lecture pour le rapport et les requêtes à la main. Quand le checkout
-- n'a pas porté de provenance, on retombe sur la source du lead portant la
-- même adresse : c'est moins précis (le lead peut dater) mais mieux
-- qu'« inconnu ». La colonne `attribution` dit laquelle des deux a servi.
create or replace view public.v_ventes_canal
with (security_invoker = true) as
select
  p.id,
  p.paid_at,
  p.status,
  p.tier,
  p.plan_code,
  p.amount_total,
  p.stripe_session_id,
  p.user_id,
  pr.email,
  coalesce(p.utm_source,
           case when l.source is not null and l.source <> 'kit-direct' then split_part(l.source, '-', 1) end,
           case when l.source = 'kit-direct' then 'kit' end,
           'inconnu') as source,
  coalesce(p.utm_medium,
           case when l.source is not null then 'lead' end,
           'inconnu') as medium,
  coalesce(p.utm_campaign, l.source, 'inconnu') as campaign,
  case when p.utm_source is not null then 'checkout'
       when l.source is not null then 'lead'
       else 'aucune' end as attribution,
  p.landing_path,
  p.referrer,
  p.first_seen_at,
  l.created_at as lead_depuis
from public.purchases p
left join public.profiles pr on pr.id = p.user_id
left join public.leads l on lower(l.email) = lower(pr.email);

comment on view public.v_ventes_canal is 'Chaque achat avec le canal de com qui l''a amené (checkout, sinon lead, sinon inconnu). Lecture serveur uniquement.';

-- La vue porte des emails : jamais exposée aux clés publiques.
revoke all on public.v_ventes_canal from anon, authenticated;
