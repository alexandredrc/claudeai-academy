-- 0013 : durcissement après l'audit du 11/10/2026.
--
-- 1. profiles.email n'est plus modifiable par un utilisateur. Le webhook Stripe
--    retrouve l'acheteur « pay-first » par cet email : un inscrit gratuit qui y
--    mettait l'adresse d'un futur acheteur récupérait son achat. Aucun code du
--    site ne modifie un profil côté utilisateur (vérifié) ; on ne rend que les
--    colonnes d'affichage.
-- 2. Un email = un profil (aucun doublon au 11/10, vérifié).
-- 3. increment_mentor_usage(p_user_id, …) était appelable par anon avec
--    n'importe quel identifiant : épuisement du quota Mentor d'un client. La
--    route /api/mentor l'appelle avec la clé service, qui garde le droit.
--    handle_new_user est une fonction de trigger, jamais appelée directement.
-- 4. search_path figé sur les fonctions qui ne l'avaient pas.
--
-- Additive et rejouable.

revoke update on public.profiles from anon, authenticated;
grant update (first_name, last_name, avatar_url) on public.profiles to authenticated;

create unique index if not exists profiles_email_lower_key
  on public.profiles (lower(email));

revoke execute on function public.increment_mentor_usage(uuid, integer) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
-- Le droit venait de PUBLIC : la clé service doit le garder explicitement.
grant execute on function public.increment_mentor_usage(uuid, integer) to service_role;
grant execute on function public.handle_new_user() to service_role;

alter function public.is_admin() set search_path = public;
alter function public.user_has_tier(public.course_tier) set search_path = public;
alter function public.set_updated_at() set search_path = public;
