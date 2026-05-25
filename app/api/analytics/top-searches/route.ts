import { NextResponse } from 'next/server';
import {
  analyticsErrorResponse,
  callAnalyticsRpc,
} from '@/lib/analytics';
import type { TopSearchItem } from '@/types/analytics';

type RpcRow = { query: string; count: number | string };

export async function GET() {
  try {
    const rows = await callAnalyticsRpc<RpcRow[]>('analytics_top_searches');
    const data: TopSearchItem[] = (rows ?? []).map((row) => ({
      query: row.query,
      count: Number(row.count),
    }));

    return NextResponse.json({ data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load top searches.';
    return analyticsErrorResponse(message);
  }
}
