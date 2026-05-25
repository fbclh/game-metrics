import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import type { TrendingItem } from '@/types/analytics';

type RpcRow = { query: string; count: number | string };

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase.rpc('analytics_trending');

  if (error) {
    console.error('Analytics error:', JSON.stringify(error));
    return NextResponse.json({ data: null }, { status: 500 });
  }

  const result: TrendingItem[] = ((data ?? []) as RpcRow[]).map((row) => ({
    query: row.query,
    count: Number(row.count),
  }));

  return NextResponse.json({ data: result });
}
