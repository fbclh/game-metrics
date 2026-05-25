import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type SearchTelemetryBody = {
  query?: unknown;
  session_id?: unknown;
};

export async function POST(request: Request) {
  let body: SearchTelemetryBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const query = typeof body.query === 'string' ? body.query.trim() : '';
  const sessionId =
    typeof body.session_id === 'string' ? body.session_id.trim() : '';

  if (!query) {
    return NextResponse.json(
      { ok: false, error: 'query must be a non-empty string.' },
      { status: 400 },
    );
  }

  if (!sessionId) {
    return NextResponse.json(
      { ok: false, error: 'session_id is required.' },
      { status: 400 },
    );
  }

  const { error } = await supabase.from('search_events').insert({
    session_id: sessionId,
    query,
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
