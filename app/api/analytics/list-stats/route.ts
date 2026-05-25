import { NextResponse } from 'next/server';
import {
  analyticsErrorResponse,
  callAnalyticsRpc,
} from '@/lib/analytics';
import { defaultListStats, type ListStats } from '@/types/analytics';

type RpcRow = {
  want_to_play: number | string;
  playing: number | string;
  finished: number | string;
  total: number | string;
};

export async function GET() {
  try {
    const rows = await callAnalyticsRpc<RpcRow[]>('analytics_list_stats');
    const row = rows?.[0];

    const data: ListStats = row
      ? {
          want_to_play: Number(row.want_to_play),
          playing: Number(row.playing),
          finished: Number(row.finished),
          total: Number(row.total),
        }
      : defaultListStats;

    return NextResponse.json({ data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load list stats.';
    return analyticsErrorResponse(message);
  }
}
