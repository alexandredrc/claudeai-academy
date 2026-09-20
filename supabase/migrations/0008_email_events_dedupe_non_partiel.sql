-- =========================================
-- ClaudeAI Academy — Réparation du dédoublonnage des évènements email
-- Migration : 0008_email_events_dedupe_non_partiel
--
-- La table `email_events` est restée vide depuis sa création le 29/08/2026.
-- On a d'abord cru à une configuration manquante côté Resend. C'était un bug
-- chez nous, et il aurait rejeté 100 % des évènements même une fois Resend
-- correctement branché.
--
--   L'index de dédoublonnage était PARTIEL (`where resend_id is not null`).
--   Or Postgres refuse d'utiliser un index partiel comme cible d'un
--   ON CONFLICT tant que la requête ne répète pas le prédicat de l'index — et
--   PostgREST, qui traduit `onConflict: "..."`, n'en émet aucun. Chaque
--   évènement repartait donc en 500 :
--     « there is no unique or exclusion constraint matching the
--       ON CONFLICT specification »
--
--   Le seul moyen de le voir était d'envoyer une requête réellement signée :
--   la signature était bonne, l'écriture échouait juste après.
--
-- L'index non partiel a exactement la même sémantique ici : dans un index
-- unique, Postgres considère deux NULL comme distincts, donc les lignes sans
-- `resend_id` ne se dédoublonnent pas — ce que le prédicat cherchait à dire.
-- =========================================

drop index if exists public.email_events_dedupe_key;

create unique index email_events_dedupe_key
  on public.email_events (resend_id, event_type, occurred_at);
