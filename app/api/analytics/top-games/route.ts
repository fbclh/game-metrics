import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import type { TopGameItem } from '@/types/analytics';

type RpcRow = {
  game_id: number | string;
  game_name: string;
  count: number | string;
};

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase.rpc('analytics_top_games');

  if (error) {
    console.error('Analytics error:', JSON.stringify(error));
    return NextResponse.json({ data: null }, { status: 500 });
  }

  const result: TopGameItem[] = ((data ?? []) as RpcRow[]).map((row) => ({
    game_id: Number(row.game_id),
    game_name: row.game_name,
    count: Number(row.count),
  }));

  return NextResponse.json({ data: result });
}
