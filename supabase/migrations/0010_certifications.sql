-- =========================================
-- Migration : 0010_certifications
--
-- Une certification maison n'a de valeur que si elle atteste quelque chose de
-- vérifiable. Deux conditions, donc, et pas une seule :
--   1. toutes les leçons du niveau acheté sont marquées terminées
--   2. un examen final est réussi, corrigé côté serveur
--
-- Le point 2 est ce qui distingue ce certificat d'une attestation de présence.
-- Les QCM de leçon existants restent de l'auto-évaluation corrigée dans le
-- navigateur ; l'examen, lui, ne renvoie JAMAIS les bonnes réponses au client :
-- elles restent dans `exam_attempts.questions` côté serveur jusqu'à la
-- correction.
--
-- Ce qui n'est PAS fait ici, volontairement : aucune prétention à une
-- reconnaissance officielle. Le document délivré est un certificat de réussite
-- d'organisme privé, et les pages qui l'entourent le disent.
-- =========================================

-- 1. TENTATIVES D'EXAMEN
create table if not exists public.exam_attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,

  -- Niveau visé : détermine le périmètre des leçons tirées au sort.
  tier course_tier not null,

  -- Le sujet tiré, AVEC les bonnes réponses. Jamais exposé au client tel quel :
  -- l'API ne renvoie que l'énoncé et les options.
  -- Forme : [{ "lesson_slug": "...", "q": "...", "options": [...], "correct": 0 }]
  questions jsonb not null,

  total int not null,
  score int,
  passed boolean,

  started_at timestamptz not null default now(),
  submitted_at timestamptz
);

comment on table public.exam_attempts is 'Tentatives d''examen final. `questions` contient les bonnes réponses : ne jamais exposer cette colonne côté client.';

create index if not exists exam_attempts_user_idx on public.exam_attempts (user_id, started_at desc);

-- 2. CERTIFICATIONS DÉLIVRÉES
create table if not exists public.certifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,

  -- Identifiant public, court et lisible (imprimé sur le PDF, sert d'URL de
  -- vérification). Unique : c'est la clé que présentera un recruteur.
  code text unique not null,

  tier course_tier not null,

  -- Nom figé au moment de l'émission : un certificat ne doit pas changer de
  -- titulaire parce que le profil a été édité après coup.
  holder_name text not null,

  score int not null,
  total int not null,
  lessons_completed int not null,

  issued_at timestamptz not null default now(),
  -- Permet d'invalider sans supprimer : la page de vérification doit pouvoir
  -- répondre « ce certificat a été révoqué », ce qu'une ligne effacée ne peut
  -- pas faire (elle répondrait « inconnu », ce qui est ambigu).
  revoked_at timestamptz,

  -- Une seule certification par niveau et par personne.
  unique (user_id, tier)
);

comment on table public.certifications is 'Certificats de réussite délivrés par ClaudeAI Academy. Organisme privé : aucun titre reconnu par l''État.';
comment on column public.certifications.code is 'Identifiant public imprimé sur le PDF et utilisé par /certification/<code>';

create index if not exists certifications_code_idx on public.certifications (code);

-- 3. SÉCURITÉ
-- Les deux tables sont écrites et lues par le serveur (clé de service).
-- RLS active et AUCUNE politique permissive : rien n'est lisible depuis le
-- navigateur. La vérification publique passe par notre route serveur, qui
-- n'expose que ce qu'il faut — sinon le nom de chaque titulaire deviendrait
-- énumérable par n'importe qui avec la clé anonyme.
alter table public.exam_attempts enable row level security;
alter table public.certifications enable row level security;

-- Le titulaire peut relire ses propres certificats depuis son espace.
drop policy if exists "users_read_own_certifications" on public.certifications;
create policy "users_read_own_certifications"
  on public.certifications for select
  using (user_id = auth.uid());
