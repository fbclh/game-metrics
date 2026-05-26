import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const apiKey = process.env.MASSIVE_API_KEY;

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

  const url = new URL('https://api.polygon.io/v3/reference/tickers');
  url.searchParams.set('apiKey', apiKey);
  url.searchParams.set('market', 'stocks');
  url.searchParams.set('active', 'true');
  url.searchParams.set('limit', '20');

  const search = request.nextUrl.searchParams.get('search');
  const cursor = request.nextUrl.searchParams.get('cursor');

  if (search) {
    url.searchParams.set('search', search);
  }

  if (cursor) {
    url.searchParams.set('cursor', cursor);
  }

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
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
