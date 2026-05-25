import { NextRequest, NextResponse } from 'next/server';

type RouteContext = {
  params: { id: string };
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const apiKey = process.env.RAWG_API_KEY;
  const { id } = params;

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

  if (!/^\d+$/.test(id)) {
    return NextResponse.json(
      { code: 'InvalidId', message: 'Game id must be a number.' },
      { status: 400 },
    );
  }

  const gameUrl = `https://api.rawg.io/api/games/${id}?key=${apiKey}`;
  const screenshotsUrl = `https://api.rawg.io/api/games/${id}/screenshots?key=${apiKey}`;

  try {
    const [gameResponse, screenshotsResponse] = await Promise.all([
      fetch(gameUrl),
      fetch(screenshotsUrl),
    ]);

    const gameData = await gameResponse.json();
    const screenshotsData = await screenshotsResponse.json();

    if (!gameResponse.ok) {
      return NextResponse.json(gameData, { status: gameResponse.status });
    }

    if (!screenshotsResponse.ok) {
      return NextResponse.json(screenshotsData, {
        status: screenshotsResponse.status,
      });
    }

    return NextResponse.json({
      ...gameData,
      screenshots: screenshotsData.results ?? [],
    });
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
