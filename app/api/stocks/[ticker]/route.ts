import { NextRequest, NextResponse } from 'next/server';

type RouteContext = {
  params: { ticker: string };
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const apiKey = process.env.MASSIVE_API_KEY;
  const ticker = params.ticker?.trim().toUpperCase();

  if (!apiKey) {
    return NextResponse.json(
      {
        status: 'ERROR',
        message:
          'Massive API key is not set. Add MASSIVE_API_KEY in your environment settings.',
      },
      { status: 500 },
    );
  }

  if (!ticker) {
    return NextResponse.json(
      { status: 'ERROR', message: 'Ticker is required.' },
      { status: 400 },
    );
  }

  const tickerUrl = new URL(
    `https://api.polygon.io/v3/reference/tickers/${encodeURIComponent(ticker)}`,
  );
  tickerUrl.searchParams.set('apiKey', apiKey);

  const prevUrl = new URL(
    `https://api.polygon.io/v2/aggs/ticker/${encodeURIComponent(ticker)}/prev`,
  );
  prevUrl.searchParams.set('apiKey', apiKey);

  try {
    const [tickerResponse, prevResponse] = await Promise.all([
      fetch(tickerUrl.toString()),
      fetch(prevUrl.toString()),
    ]);

    const tickerData = await tickerResponse.json();
    const prevData = await prevResponse.json();

    if (!tickerResponse.ok) {
      return NextResponse.json(tickerData, { status: tickerResponse.status });
    }

    if (!prevResponse.ok) {
      return NextResponse.json(prevData, { status: prevResponse.status });
    }

    const tickerDetails = tickerData.results ?? {};
    const aggResults = Array.isArray(prevData.results) ? prevData.results : [];

    return NextResponse.json({
      ...tickerDetails,
      previousClose: aggResults[0] ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
