export type StockResult = {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  active: boolean;
  logo_url?: string;
  description?: string;
};

export type SearchStocksParams = {
  query?: string;
  cursor?: string;
};

export type SearchStocksResponse = {
  results: StockResult[];
  total: number;
  nextCursor?: string;
};

type MassiveTicker = {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  active: boolean;
};

type MassiveTickersResponse = {
  results?: MassiveTicker[];
  count?: number;
  next_url?: string;
  status?: string;
  message?: string;
};

function parseCursor(nextUrl?: string): string | undefined {
  if (!nextUrl) {
    return undefined;
  }

  try {
    return new URL(nextUrl).searchParams.get('cursor') ?? undefined;
  } catch {
    return undefined;
  }
}

function mapTicker(ticker: MassiveTicker): StockResult {
  return {
    ticker: ticker.ticker,
    name: ticker.name,
    market: ticker.market,
    locale: ticker.locale,
    primary_exchange: ticker.primary_exchange,
    type: ticker.type,
    active: ticker.active,
  };
}

export async function searchStocks({
  query,
  cursor,
}: SearchStocksParams = {}): Promise<SearchStocksResponse> {
  const params = new URLSearchParams();

  if (query?.trim()) {
    params.set('search', query.trim());
  }

  if (cursor) {
    params.set('cursor', cursor);
  }

  const queryString = params.toString();
  const response = await fetch(
    queryString ? `/api/stocks?${queryString}` : '/api/stocks',
  );
  const data = (await response.json()) as MassiveTickersResponse;

  if (!response.ok) {
    const message =
      data.message || data.status || 'Failed to load stocks.';
    throw new Error(message);
  }

  return {
    results: (data.results ?? []).map(mapTicker),
    total: data.count ?? data.results?.length ?? 0,
    nextCursor: parseCursor(data.next_url),
  };
}
