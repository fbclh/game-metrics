import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type ViewTelemetryBody = {
  game_id?: unknown;
  game_name?: unknown;
  session_id?: unknown;
};

export async function POST(request: Request) {
  let body: ViewTelemetryBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const gameId = body.game_id;
  const gameName = typeof body.game_name === 'string' ? body.game_name.trim() : '';
  const sessionId =
    typeof body.session_id === 'string' ? body.session_id.trim() : '';

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

  if (!sessionId) {
    return NextResponse.json(
      { ok: false, error: 'session_id is required.' },
      { status: 400 },
    );
  }

  const { error } = await supabase.from('game_views').insert({
    session_id: sessionId,
    game_id: gameId,
    game_name: gameName,
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
