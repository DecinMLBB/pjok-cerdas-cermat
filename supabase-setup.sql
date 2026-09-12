-- PJOK ARENA — RESET TOTAL DATABASE
-- Jalankan SEKALI di Supabase SQL Editor.
-- PERINGATAN: menghapus akun Auth lama + data public.players.

delete from auth.users;
drop table if exists public.players cascade;

create table public.players (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  full_name text not null default '',
  class_name text not null default 'VII A',
  avatar_index integer not null default 1,
  score bigint not null default 0,
  correct integer not null default 0,
  total integer not null default 0,
  best_combo integer not null default 0,
  updated_at timestamptz not null default now(),
  constraint players_avatar_index_check check (avatar_index between 1 and 100),
  constraint players_score_check check (score >= 0),
  constraint players_correct_check check (correct >= 0),
  constraint players_total_check check (total >= 0),
  constraint players_best_combo_check check (best_combo >= 0)
);

create unique index players_username_lower_idx
on public.players (lower(username));

alter table public.players enable row level security;
revoke all on public.players from anon;
grant select, insert, update on public.players to authenticated;

drop policy if exists "players_select_authenticated" on public.players;
create policy "players_select_authenticated"
on public.players for select to authenticated using (true);

drop policy if exists "players_insert_own" on public.players;
create policy "players_insert_own"
on public.players for insert to authenticated
with check (auth.uid() = id);

drop policy if exists "players_update_own" on public.players;
create policy "players_update_own"
on public.players for update to authenticated
using (auth.uid() = id) with check (auth.uid() = id);
