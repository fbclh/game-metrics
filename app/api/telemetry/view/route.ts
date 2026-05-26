import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type ViewTelemetryBody = {
  ticker?: unknown;
  company_name?: unknown;
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

  const ticker = typeof body.ticker === 'string' ? body.ticker.trim() : '';
  const companyName =
    typeof body.company_name === 'string' ? body.company_name.trim() : '';
  const sessionId =
    typeof body.session_id === 'string' ? body.session_id.trim() : '';

  if (!ticker) {
    return NextResponse.json(
      { ok: false, error: 'ticker is required.' },
      { status: 400 },
    );
  }

  if (!companyName) {
    return NextResponse.json(
      { ok: false, error: 'company_name is required.' },
      { status: 400 },
    );
  }

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

  const { error } = await supabase.from('asset_views').insert({
    session_id: sessionId,
    ticker,
    company_name: companyName,
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
