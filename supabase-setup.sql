-- =========================================================
-- PJOK ARENA — DATABASE FINAL / RESET TOTAL
-- =========================================================
-- PERINGATAN: script ini menghapus akun Auth lama dan seluruh data
-- players + quiz_attempts. Semua siswa harus daftar ulang.
-- Jalankan SEKALI untuk instalasi/reset bersih.
-- Setelah itu: Authentication > Providers > Email > Confirm email OFF.
-- =========================================================

DROP TABLE IF EXISTS public.quiz_attempts CASCADE;
DROP TABLE IF EXISTS public.players CASCADE;

DELETE FROM auth.users;

CREATE TABLE public.players (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL,
  full_name text NOT NULL DEFAULT '',
  class_name text NOT NULL DEFAULT 'VII A',
  avatar_index integer NOT NULL DEFAULT 1,
  score bigint NOT NULL DEFAULT 0,
  correct integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  best_combo integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT players_avatar_index_check CHECK (avatar_index BETWEEN 1 AND 100),
  CONSTRAINT players_score_check CHECK (score >= 0),
  CONSTRAINT players_correct_check CHECK (correct >= 0),
  CONSTRAINT players_total_check CHECK (total >= 0),
  CONSTRAINT players_best_combo_check CHECK (best_combo >= 0)
);

CREATE UNIQUE INDEX players_username_lower_idx
ON public.players (lower(username));

CREATE TABLE public.quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score bigint NOT NULL DEFAULT 0,
  correct integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  best_combo integer NOT NULL DEFAULT 0,
  xp integer NOT NULL DEFAULT 0,
  mode text NOT NULL DEFAULT 'quick',
  category text NOT NULL DEFAULT 'Semua',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT quiz_attempts_score_check CHECK (score >= 0),
  CONSTRAINT quiz_attempts_correct_check CHECK (correct >= 0),
  CONSTRAINT quiz_attempts_total_check CHECK (total >= 0),
  CONSTRAINT quiz_attempts_best_combo_check CHECK (best_combo >= 0),
  CONSTRAINT quiz_attempts_xp_check CHECK (xp >= 0)
);

CREATE INDEX quiz_attempts_player_created_idx
ON public.quiz_attempts (player_id, created_at DESC);

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.players FROM anon;
REVOKE ALL ON public.quiz_attempts FROM anon;
GRANT SELECT, INSERT, UPDATE ON public.players TO authenticated;
GRANT SELECT, INSERT ON public.quiz_attempts TO authenticated;

CREATE POLICY "players_select_authenticated"
ON public.players FOR SELECT TO authenticated USING (true);

CREATE POLICY "players_insert_own"
ON public.players FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "players_update_own"
ON public.players FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "quiz_attempts_select_own"
ON public.quiz_attempts FOR SELECT TO authenticated
USING (auth.uid() = player_id);

CREATE POLICY "quiz_attempts_insert_own"
ON public.quiz_attempts FOR INSERT TO authenticated
WITH CHECK (auth.uid() = player_id);

-- =========================================================
-- SELESAI
-- =========================================================
