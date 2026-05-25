import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data, error } = await supabase.rpc('analytics_search_volume');
  if (error) {
    console.error('search-volume error:', JSON.stringify(error));
    return NextResponse.json({ data: null }, { status: 500 });
  }
  return NextResponse.json({ data });
}
