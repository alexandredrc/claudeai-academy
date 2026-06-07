-- =========================================
-- ClaudeAI Academy — Migration 0002
-- Sécurise lessons.content_md : pas accessible via clés anon/authenticated.
--
-- Le pattern :
--   - lessons reste lisible (titre, durée, slug, etc.) par tous → catalogue
--   - content_md UNIQUEMENT via service_role (server-side)
--   - L'app fait le check user_has_tier() côté serveur avant de lire content_md
--
-- IMPORTANT : un GRANT SELECT au niveau table override les revoke column-level.
-- Il faut donc : REVOKE table-level, puis GRANT column-level uniquement sur les
-- colonnes meta. service_role bypass tout, donc reste intact.
-- =========================================

-- 1. Révoque le SELECT général (sinon, il couvre toutes les colonnes y compris content_md)
revoke select on public.lessons from anon;
revoke select on public.lessons from authenticated;

-- 2. Re-grant SELECT seulement sur les colonnes meta (toutes sauf content_md)
grant select (
  id, course_id, slug, title, description,
  display_order, duration_min, is_free_preview,
  created_at, updated_at
) on public.lessons to anon;

grant select (
  id, course_id, slug, title, description,
  display_order, duration_min, is_free_preview,
  created_at, updated_at
) on public.lessons to authenticated;

-- 3. Renomme la policy pour rester clean (mêmes droits row-level)
do $$
begin
  if exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'lessons'
      and policyname = 'anyone_read_lesson_meta'
  ) then
    alter policy "anyone_read_lesson_meta" on public.lessons rename to "anyone_read_lessons_meta";
  end if;
end$$;

comment on column public.lessons.content_md is
  'Markdown de la leçon. INACCESSIBLE via clés anon/authenticated (column GRANT revoké). Lecture exclusivement via le client service_role côté serveur, après vérification user_has_tier().';
