import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isPlayListStatus } from '@/types/playlist';

type RouteContext = {
  params: { game_id: string };
};

type PlaylistPatchBody = {
  status?: unknown;
  session_id?: unknown;
};

function parseGameId(rawId: string): number | null {
  const gameId = Number(rawId);
  if (!Number.isFinite(gameId) || !Number.isInteger(gameId)) {
    return null;
  }
  return gameId;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const gameId = parseGameId(params.game_id);

  if (gameId == null) {
    return NextResponse.json(
      { ok: false, error: 'game_id must be a number.' },
      { status: 400 },
    );
  }

  let body: PlaylistPatchBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const sessionId =
    typeof body.session_id === 'string' ? body.session_id.trim() : '';
  const status = body.status;

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

  const { error } = await supabase
    .from('play_list')
    .update({ status })
    .eq('session_id', sessionId)
    .eq('game_id', gameId);

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const gameId = parseGameId(params.game_id);

  if (gameId == null) {
    return NextResponse.json(
      { ok: false, error: 'game_id must be a number.' },
      { status: 400 },
    );
  }

  const sessionId = request.nextUrl.searchParams.get('session_id')?.trim();

  if (!sessionId) {
    return NextResponse.json(
      { ok: false, error: 'session_id is required.' },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from('play_list')
    .delete()
    .eq('session_id', sessionId)
    .eq('game_id', gameId);

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
