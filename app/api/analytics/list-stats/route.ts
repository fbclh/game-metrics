import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { defaultListStats, type ListStats } from '@/types/analytics';

type RpcRow = {
  want_to_play: number | string;
  playing: number | string;
  finished: number | string;
  total: number | string;
};

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase.rpc('analytics_list_stats');

  if (error) {
    console.error('Analytics error:', JSON.stringify(error));
    return NextResponse.json({ data: null }, { status: 500 });
  }

  const row = (data as RpcRow[] | null)?.[0];
  const result: ListStats = row
    ? {
        want_to_play: Number(row.want_to_play),
        playing: Number(row.playing),
        finished: Number(row.finished),
        total: Number(row.total),
      }
    : defaultListStats;

  return NextResponse.json({ data: result });
}
