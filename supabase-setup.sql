-- PJOK ARENA — AUTH USERNAME + PASSWORD + PROFILE + LEADERBOARD
-- Jalankan SEKALI di Supabase SQL Editor.
-- Setelah itu buka Authentication > Providers > Email dan MATIKAN Confirm email.
-- Website memakai username sebagai identitas siswa dan membuat email internal
-- username@pjokarena.local untuk Supabase Auth. Siswa tidak perlu memasukkan email.

create table if not exists public.players (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  full_name text not null default '',
  class_name text not null default 'VII A',
  avatar_index integer not null default 1 check (avatar_index between 1 and 100),
  score bigint not null default 0 check (score >= 0),
  correct integer not null default 0,
  total integer not null default 0,
  best_combo integer not null default 0,
  updated_at timestamptz not null default now()
);

create unique index if not exists players_username_lower_idx on public.players (lower(username));

alter table public.players enable row level security;
revoke all on public.players from anon;
grant select, insert, update on public.players to authenticated;

drop policy if exists "players_select_authenticated" on public.players;
drop policy if exists "players_insert_own" on public.players;
drop policy if exists "players_update_own" on public.players;

create policy "players_select_authenticated"
on public.players for select to authenticated
using (true);

create policy "players_insert_own"
on public.players for insert to authenticated
with check (auth.uid() = id);

create policy "players_update_own"
on public.players for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
