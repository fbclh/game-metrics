import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export function analyticsErrorResponse(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export async function callAnalyticsRpc<T>(rpcName: string): Promise<T> {
  const { data, error } = await supabase.rpc(rpcName);

  if (error) {
    throw new Error(error.message);
  }

  return data as T;
}
