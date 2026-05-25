import { NextResponse } from 'next/server';
import {
  analyticsErrorResponse,
  callAnalyticsRpc,
} from '@/lib/analytics';
import type { SearchVolumeItem } from '@/types/analytics';

type RpcRow = { date: string; count: number | string };

export async function GET() {
  try {
    const rows = await callAnalyticsRpc<RpcRow[]>('analytics_search_volume');
    const data: SearchVolumeItem[] = (rows ?? []).map((row) => ({
      date: row.date,
      count: Number(row.count),
    }));

    return NextResponse.json({ data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load search volume.';
    return analyticsErrorResponse(message);
  }
}
