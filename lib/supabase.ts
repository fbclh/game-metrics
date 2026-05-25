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

  -- RLS policies (required for anonymous telemetry inserts)
  alter table search_events enable row level security;
  create policy "anon insert search_events"
    on search_events for insert to anon with check (true);

  alter table game_views enable row level security;
  create policy "anon insert game_views"
    on game_views for insert to anon with check (true);
*/

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

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
