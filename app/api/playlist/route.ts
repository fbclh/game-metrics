import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  isPlayListStatus,
  type PlayListItem,
} from '@/types/playlist';

type PlaylistPostBody = {
  game_id?: unknown;
  game_name?: unknown;
  cover_url?: unknown;
  status?: unknown;
  session_id?: unknown;
};

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id')?.trim();

  if (!sessionId) {
    return NextResponse.json(
      { ok: false, error: 'session_id is required.' },
      { status: 400 },
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data, error } = await supabase
    .from('play_list')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, data: data as PlayListItem[] });
}

export async function POST(request: Request) {
  let body: PlaylistPostBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const gameId = body.game_id;
  const gameName =
    typeof body.game_name === 'string' ? body.game_name.trim() : '';
  const coverUrl =
    body.cover_url == null
      ? null
      : typeof body.cover_url === 'string'
        ? body.cover_url
        : undefined;
  const sessionId =
    typeof body.session_id === 'string' ? body.session_id.trim() : '';
  const status = body.status;

  if (typeof gameId !== 'number' || !Number.isFinite(gameId)) {
    return NextResponse.json(
      { ok: false, error: 'game_id must be a number.' },
      { status: 400 },
    );
  }

  if (!gameName) {
    return NextResponse.json(
      { ok: false, error: 'game_name is required.' },
      { status: 400 },
    );
  }

  if (coverUrl === undefined) {
    return NextResponse.json(
      { ok: false, error: 'cover_url must be a string or null.' },
      { status: 400 },
    );
  }

  if (!sessionId) {
    return NextResponse.json(
      { ok: false, error: 'session_id is required.' },
      { status: 400 },
    );
  }

  if (!isPlayListStatus(status)) {
    return NextResponse.json(
      { ok: false, error: 'status must be want_to_play, playing, or finished.' },
      { status: 400 },
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data, error } = await supabase
    .from('play_list')
    .upsert(
      {
        session_id: sessionId,
        game_id: gameId,
        game_name: gameName,
        cover_url: coverUrl,
        status,
      },
      { onConflict: 'session_id,game_id' },
    )
    .select('*')
    .single();

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, data: data as PlayListItem });
}
