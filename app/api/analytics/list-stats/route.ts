import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { defaultListStats, type ListStats } from '@/types/analytics';

type RpcRow = {
  want_to_play: number | string;
  playing: number | string;
  finished: number | string;
  total: number | string;
};

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data, error } = await supabase.rpc('analytics_list_stats');
  if (error) {
    console.error('list-stats error:', JSON.stringify(error));
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
