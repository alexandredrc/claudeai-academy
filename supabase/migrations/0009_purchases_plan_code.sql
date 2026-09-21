-- =========================================
-- Migration : 0009_purchases_plan_code
--
-- Contexte : le catalogue commercial se dédouble. Le Pass Accompagnement
-- (1 497 €) donne EXACTEMENT le même accès au contenu que le Pass Mastery —
-- ce qu'il ajoute, c'est du temps humain : séances individuelles, audit de
-- consignes, accès direct. Ce n'est donc pas un niveau d'accès de plus.
--
-- La tentation serait d'ajouter une valeur à l'énumération `course_tier`.
-- C'est précisément ce qu'il ne faut pas faire : `course_tier` est lu par
-- `user_has_tier()` et par les politiques RLS de quatre tables, et la colonne
-- `purchases.tier` porte en plus une contrainte CHECK. L'étendre reviendrait
-- à toucher au chemin d'accès de tous les clients existants pour un besoin
-- purement commercial.
--
-- On sépare donc les deux notions :
--   purchases.tier      -> le NIVEAU D'ACCÈS ('starter' | 'mastery'), inchangé
--   purchases.plan_code -> l'OFFRE VENDUE ('starter' | 'mastery' | 'elite')
--
-- Rien à rétro-remplir de façon risquée : pour tous les achats antérieurs,
-- l'offre vendue était identique au niveau d'accès.
-- =========================================

alter table public.purchases
  add column if not exists plan_code text;

comment on column public.purchases.plan_code is
  'Offre commerciale vendue (starter | mastery | elite). Peut différer de `tier`, qui est le niveau d''accès au contenu : l''offre elite donne l''accès mastery.';

-- Historique : l'offre vendue valait le niveau d'accès.
update public.purchases
set plan_code = tier::text
where plan_code is null;

-- Volontairement PAS de contrainte NOT NULL : un paiement arrivé par une voie
-- détournée (lien de paiement créé à la main pour dépanner un client) doit
-- pouvoir s'enregistrer même sans code d'offre. Priver quelqu'un qui a payé de
-- son accès pour un champ d'analyse manquant serait absurde.

create index if not exists purchases_plan_code_idx on public.purchases (plan_code);
