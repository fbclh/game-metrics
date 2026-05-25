import { NextResponse } from 'next/server';
import {
  analyticsErrorResponse,
  callAnalyticsRpc,
} from '@/lib/analytics';
import type { TrendingItem } from '@/types/analytics';

type RpcRow = { query: string; count: number | string };

export async function GET() {
  try {
    const rows = await callAnalyticsRpc<RpcRow[]>('analytics_trending');
    const data: TrendingItem[] = (rows ?? []).map((row) => ({
      query: row.query,
      count: Number(row.count),
    }));

    return NextResponse.json({ data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load trending searches.';
    return analyticsErrorResponse(message);
  }
}
