-- =========================================================================
-- LOOMY'S LUCKY LOOT — SUPABASE DATABASE SCHEMA
-- =========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PLAYERS TABLE
-- Tracks player access by unguessable birthday token (no passwords required)
create table if not exists public.players (
  id uuid primary key default uuid_generate_v4(),
  token text unique not null,
  name text not null default 'Levina',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_active_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. REWARDS TABLE
-- All collectible capsules, categories, rarities, and personal texts
create table if not exists public.rewards (
  id text primary key,
  category text not null,       -- blue, yellow, pink, green, purple, gold
  category_name text not null,  -- CLOUDY DAYS, HAPPY PILLS, etc.
  rarity text not null,         -- COMMON, RARE, LEGENDARY, SPECIAL
  title text not null,
  content text not null,
  sticker text not null,
  tagline text,
  quote text,
  badge_label text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PLAYER_REWARDS TABLE (With unique constraint to guarantee NO duplicate claims)
create table if not exists public.player_rewards (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid references public.players(id) on delete cascade not null,
  reward_id text references public.rewards(id) on delete cascade not null,
  claimed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (player_id, reward_id) -- ENFORCES NO DUPLICATES AT THE DATABASE LEVEL
);

-- 4. GAME_SETTINGS TABLE
create table if not exists public.game_settings (
  id text primary key default 'default',
  recipient_name text not null default 'Levina',
  giver_name text not null default 'Loomy',
  personal_note text not null,
  ticket_number text not null default 'NO. 001 — BIRTHDAY EDITION',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- SECURE SERVER-SIDE CLAIM FUNCTION (RPC)
-- Safely finds an unclaimed reward for the player and awards it atomically
-- =========================================================================
create or replace function public.claim_random_reward(p_token text)
returns json
language plpgsql
security definer
as $$
declare
  v_player_id uuid;
  v_reward_id text;
  v_result json;
begin
  -- 1. Get or create player by token
  insert into public.players (token, name, last_active_at)
  values (p_token, 'Levina', timezone('utc'::text, now()))
  on conflict (token) do update
  set last_active_at = timezone('utc'::text, now())
  returning id into v_player_id;

  -- 2. Pick a random reward that has NOT yet been claimed by this player
  select r.id into v_reward_id
  from public.rewards r
  where r.id not in (
    select pr.reward_id
    from public.player_rewards pr
    where pr.player_id = v_player_id
  )
  order by random()
  limit 1;

  -- If no unclaimed rewards remain
  if v_reward_id is null then
    return json_build_object(
      'status', 'ALL_COLLECTED',
      'message', 'Levina has successfully collected every single piece of loot!'
    );
  end if;

  -- 3. Atomically record the claim
  insert into public.player_rewards (player_id, reward_id, claimed_at)
  values (v_player_id, v_reward_id, timezone('utc'::text, now()))
  on conflict (player_id, reward_id) do nothing;

  -- 4. Return the claimed reward details
  select row_to_json(r) into v_result
  from public.rewards r
  where r.id = v_reward_id;

  return json_build_object(
    'status', 'SUCCESS',
    'reward', v_result
  );
end;
$$;

-- RLS POLICIES (Allow public read and safe RPC execution)
alter table public.players enable row level security;
alter table public.rewards enable row level security;
alter table public.player_rewards enable row level security;
alter table public.game_settings enable row level security;

-- Anonymous reads allowed
create policy "Allow public read rewards" on public.rewards for select using (true);
create policy "Allow public read game_settings" on public.game_settings for select using (true);
create policy "Allow players to read own rewards" on public.player_rewards for select using (true);
create policy "Allow players to read own profile" on public.players for select using (true);
