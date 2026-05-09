-- =========================================
-- ClaudeAI Academy — Schema initial
-- Migration : 0001_initial_schema
-- Modèle économique : achats one-shot via Stripe Checkout
--   Pass Starter (47 €)  → tier 'starter'
--   Pass Mastery (497 €) → tier 'mastery' (superset, donne accès à 'starter')
-- =========================================

-- Extensions nécessaires
create extension if not exists "uuid-ossp";

-- =========================================
-- 1. PROFILES (extension de auth.users)
-- =========================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  email text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Profils utilisateurs (étend auth.users de Supabase)';

-- Trigger : créer un profil automatiquement à l'inscription
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================
-- 2. COURSES
-- =========================================
create type course_tier as enum ('free', 'starter', 'mastery');

create table public.courses (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  description text,
  tier_required course_tier not null default 'mastery',
  display_order int not null default 0,
  total_lessons int not null default 0,
  estimated_duration_min int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.courses is 'Parcours de formation (Prompt Engineering, Claude Code, etc.)';

-- =========================================
-- 3. LESSONS
-- =========================================
create table public.lessons (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references public.courses(id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  content_md text,
  display_order int not null default 0,
  duration_min int,
  is_free_preview boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, slug)
);

comment on table public.lessons is 'Leçons individuelles d''un parcours';
comment on column public.lessons.is_free_preview is 'Si true, la leçon est lisible par tous (aperçu gratuit) même sans achat';

create index lessons_course_id_idx on public.lessons (course_id, display_order);

-- =========================================
-- 4. PURCHASES (achats one-shot via Stripe Checkout)
-- =========================================
create type purchase_status as enum (
  'pending',     -- Session Checkout créée, paiement non encore confirmé
  'paid',        -- Webhook checkout.session.completed reçu, paiement validé
  'refunded',    -- Remboursé (garantie 14 j ou refund manuel)
  'failed'       -- Paiement échoué (carte refusée, etc.)
);

create table public.purchases (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,

  -- Tier acheté ('starter' ou 'mastery' uniquement — 'free' n'est pas un produit)
  tier course_tier not null check (tier in ('starter', 'mastery')),

  -- Identifiants Stripe
  stripe_customer_id text not null,
  stripe_session_id text unique not null,
  stripe_payment_intent_id text,

  -- Montant (en cents) et devise
  amount_total int not null,
  currency text not null default 'eur',

  -- État
  status purchase_status not null default 'pending',

  -- Horodatages métier
  paid_at timestamptz,
  refunded_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.purchases is 'Achats one-shot via Stripe Checkout (Pass Starter 47 €, Pass Mastery 497 €)';
comment on column public.purchases.stripe_session_id is 'ID unique de la session Checkout — sert à l''idempotence des webhooks';

create index purchases_user_id_idx on public.purchases (user_id);
create index purchases_status_idx on public.purchases (status);
create index purchases_stripe_customer_idx on public.purchases (stripe_customer_id);

-- =========================================
-- 5. LESSON_PROGRESS (progression des apprenants)
-- =========================================
create table public.lesson_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

comment on table public.lesson_progress is 'Une ligne par (user, leçon complétée)';

create index lesson_progress_user_idx on public.lesson_progress (user_id);

-- =========================================
-- 6. ADMIN_USERS (whitelist admin)
-- =========================================
create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  granted_at timestamptz not null default now(),
  granted_by uuid references auth.users(id),
  notes text
);

comment on table public.admin_users is 'Liste blanche des comptes ayant accès au dashboard admin';

-- Helper : l'utilisateur courant est-il admin ?
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

-- =========================================
-- 7. HELPER : l'utilisateur a-t-il accès au tier requis ?
--    Mastery contient Starter (hiérarchie d'accès).
-- =========================================
create or replace function public.user_has_tier(required course_tier)
returns boolean
language sql
security definer
stable
as $$
  select case
    when required = 'free' then true
    when required = 'starter' then exists (
      select 1 from public.purchases
      where user_id = auth.uid()
        and status = 'paid'
        and tier in ('starter', 'mastery')
    )
    when required = 'mastery' then exists (
      select 1 from public.purchases
      where user_id = auth.uid()
        and status = 'paid'
        and tier = 'mastery'
    )
    else false
  end;
$$;

comment on function public.user_has_tier is
  'Retourne true si l''utilisateur courant possède le tier requis (Mastery > Starter > Free).';

-- =========================================
-- RLS — Row Level Security
-- =========================================
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.purchases enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.admin_users enable row level security;

-- PROFILES : chacun voit / met à jour son propre profil. Admin voit tout.
create policy "users_read_own_profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "users_update_own_profile"
  on public.profiles for update
  using (auth.uid() = id);

-- COURSES : catalogue public en lecture. Seul admin écrit.
create policy "anyone_read_courses"
  on public.courses for select
  using (true);

create policy "admin_write_courses"
  on public.courses for all
  using (public.is_admin())
  with check (public.is_admin());

-- LESSONS : la liste des leçons (titre, durée) est publique.
-- Le contenu (content_md) est filtré applicativement via user_has_tier().
create policy "anyone_read_lesson_meta"
  on public.lessons for select
  using (true);

create policy "admin_write_lessons"
  on public.lessons for all
  using (public.is_admin())
  with check (public.is_admin());

-- PURCHASES : user lit ses propres achats. Seul service_role écrit (via webhook Stripe).
create policy "users_read_own_purchases"
  on public.purchases for select
  using (auth.uid() = user_id or public.is_admin());

-- (pas de policy insert/update/delete pour role authenticated
--  → seul service_role contourne RLS et écrit via le webhook Stripe)

-- LESSON_PROGRESS : user lit/écrit sa propre progression.
create policy "users_read_own_progress"
  on public.lesson_progress for select
  using (auth.uid() = user_id or public.is_admin());

create policy "users_insert_own_progress"
  on public.lesson_progress for insert
  with check (auth.uid() = user_id);

create policy "users_delete_own_progress"
  on public.lesson_progress for delete
  using (auth.uid() = user_id);

-- ADMIN_USERS : seul un admin existant peut lire et accorder des droits admin.
create policy "admin_read_admin_list"
  on public.admin_users for select
  using (public.is_admin());

create policy "admin_grant_admin"
  on public.admin_users for insert
  with check (public.is_admin());

create policy "admin_revoke_admin"
  on public.admin_users for delete
  using (public.is_admin());

-- =========================================
-- TRIGGER : updated_at automatique
-- =========================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger courses_updated_at before update on public.courses
  for each row execute procedure public.set_updated_at();
create trigger lessons_updated_at before update on public.lessons
  for each row execute procedure public.set_updated_at();
create trigger purchases_updated_at before update on public.purchases
  for each row execute procedure public.set_updated_at();
