import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const apiKey = process.env.RAWG_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        code: 'MissingConfiguration',
        message:
          'RAWG API key is not set. Add RAWG_API_KEY in your environment settings.',
      },
      { status: 500 },
    );
  }

  const url = new URL('https://api.rawg.io/api/games');
  url.searchParams.set('key', apiKey);

  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

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
        code: 'ProxyError',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
