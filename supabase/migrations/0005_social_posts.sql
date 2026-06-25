-- Social publication queue.
-- Powers the /admin/dashboard pipeline view (read) and the daily auto-publish cron (write).
-- Applied to prod via MCP on 2026-06-25; this file documents it for migration history.

create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  scheduled_date date not null,
  slot smallint not null check (slot between 1 and 3),
  networks text[] not null default '{}',
  formation text,
  hook text not null,
  caption_instagram text,
  caption_facebook text,
  caption_tiktok text,
  caption_linkedin text,
  visual_key text,
  visual_url text,
  visual_url_vertical text,
  target_url text,
  src_param text,
  status text not null default 'pending'
    check (status in ('pending','queued','sent','posted','failed','skipped')),
  make_execution_id text,
  error text,
  posted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (scheduled_date, slot)
);

alter table public.social_posts enable row level security;

-- Read-only access for admins / the owner. Writes happen via the service-role key (cron), which bypasses RLS.
drop policy if exists "admins read social_posts" on public.social_posts;
create policy "admins read social_posts"
  on public.social_posts for select
  using (public.is_admin() or (auth.jwt() ->> 'email') = 'adrc13820@gmail.com');

create index if not exists social_posts_scheduled_idx on public.social_posts (scheduled_date, slot);
create index if not exists social_posts_status_idx on public.social_posts (status);
