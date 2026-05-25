import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import type { SearchVolumeItem } from '@/types/analytics';

type RpcRow = { date: string; count: number | string };

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase.rpc('analytics_search_volume');

  if (error) {
    console.error('Analytics error:', JSON.stringify(error));
    return NextResponse.json({ data: null }, { status: 500 });
  }

  const result: SearchVolumeItem[] = ((data ?? []) as RpcRow[]).map((row) => ({
    date: row.date,
    count: Number(row.count),
  }));

  return NextResponse.json({ data: result });
}
