/*
  Run the following SQL in the Supabase dashboard SQL editor:

  -- search_events
  create table search_events (
    id          uuid primary key default gen_random_uuid(),
    session_id  text not null,
    query       text not null,
    created_at  timestamptz default now()
  );

  -- game_views
  create table game_views (
    id          uuid primary key default gen_random_uuid(),
    session_id  text not null,
    game_id     integer not null,
    game_name   text not null,
    created_at  timestamptz default now()
  );

  -- play_list
  create table play_list (
    id          uuid primary key default gen_random_uuid(),
    session_id  text not null,
    game_id     integer not null,
    game_name   text not null,
    cover_url   text,
    status      text not null check (status in ('want_to_play','playing','finished')),
    created_at  timestamptz default now()
  );

  alter table play_list
    add constraint play_list_session_game_unique unique (session_id, game_id);

  -- RLS policies (required for anonymous telemetry inserts)
  alter table search_events enable row level security;
  create policy "anon insert search_events"
    on search_events for insert to anon with check (true);

  alter table game_views enable row level security;
  create policy "anon insert game_views"
    on game_views for insert to anon with check (true);

  -- RLS policies (required for play list CRUD via anon key)
  alter table play_list enable row level security;
  create policy "anon select play_list"
    on play_list for select to anon using (true);
  create policy "anon insert play_list"
    on play_list for insert to anon with check (true);
  create policy "anon update play_list"
    on play_list for update to anon using (true);
  create policy "anon delete play_list"
    on play_list for delete to anon using (true);

  -- Analytics RPC functions (Step 4 — run after tables exist)
  create or replace function analytics_top_searches()
  returns table (query text, count bigint)
  language sql
  security definer
  set search_path = public
  as $$
    select query, count(*) as count
    from search_events
    group by query
    order by count desc
    limit 10;
  $$;

  create or replace function analytics_top_games()
  returns table (game_id integer, game_name text, count bigint)
  language sql
  security definer
  set search_path = public
  as $$
    select game_id, game_name, count(*) as count
    from game_views
    group by game_id, game_name
    order by count desc
    limit 10;
  $$;

  create or replace function analytics_search_volume()
  returns table (date text, count bigint)
  language sql
  security definer
  set search_path = public
  as $$
    select
      to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as date,
      count(*) as count
    from search_events
    where created_at >= now() - interval '30 days'
    group by date_trunc('day', created_at)
    order by date_trunc('day', created_at) asc;
  $$;

  create or replace function analytics_trending()
  returns table (query text, count bigint)
  language sql
  security definer
  set search_path = public
  as $$
    select query, count(*) as count
    from search_events
    where created_at >= now() - interval '7 days'
    group by query
    order by count desc
    limit 10;
  $$;

  create or replace function analytics_list_stats()
  returns table (
    want_to_play bigint,
    playing bigint,
    finished bigint,
    total bigint
  )
  language sql
  security definer
  set search_path = public
  as $$
    select
      count(*) filter (where status = 'want_to_play') as want_to_play,
      count(*) filter (where status = 'playing') as playing,
      count(*) filter (where status = 'finished') as finished,
      count(*) as total
    from play_list;
  $$;

  grant execute on function analytics_top_searches() to anon;
  grant execute on function analytics_top_games() to anon;
  grant execute on function analytics_search_volume() to anon;
  grant execute on function analytics_trending() to anon;
  grant execute on function analytics_list_stats() to anon;
*/

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

let supabaseClient: SupabaseClient | null = null;

function initSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    if (!supabaseClient) {
      supabaseClient = initSupabaseClient();
    }
    return Reflect.get(supabaseClient, prop, receiver);
  },
});
