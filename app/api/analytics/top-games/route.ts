import { NextResponse } from 'next/server';
import {
  analyticsErrorResponse,
  callAnalyticsRpc,
} from '@/lib/analytics';
import type { TopGameItem } from '@/types/analytics';

type RpcRow = {
  game_id: number | string;
  game_name: string;
  count: number | string;
};

export async function GET() {
  try {
    const rows = await callAnalyticsRpc<RpcRow[]>('analytics_top_games');
    const data: TopGameItem[] = (rows ?? []).map((row) => ({
      game_id: Number(row.game_id),
      game_name: row.game_name,
      count: Number(row.count),
    }));

    return NextResponse.json({ data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load top games.';
    return analyticsErrorResponse(message);
  }
}
