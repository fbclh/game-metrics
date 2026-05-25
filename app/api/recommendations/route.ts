import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PLAYLIST_STATUS_LABELS, type PlayListStatus } from '@/types/playlist';

type RecommendationsBody = {
  session_id?: unknown;
};

type PlaylistRow = {
  game_name: string;
  status: PlayListStatus;
};

type Recommendation = {
  name: string;
  reason: string;
};

function parseRecommendations(text: string): Recommendation[] {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleaned) as Recommendation[];

  if (!Array.isArray(parsed)) {
    throw new Error('Gemini response was not a JSON array.');
  }

  return parsed;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RecommendationsBody;
    const sessionId =
      typeof body.session_id === 'string' ? body.session_id.trim() : '';

    if (!sessionId) {
      return NextResponse.json(
        { recommendations: [], error: 'session_id is required.' },
        { status: 400 },
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data: playlist, error: dbError } = await supabase
      .from('play_list')
      .select('game_name, status')
      .eq('session_id', sessionId);

    if (dbError) {
      return NextResponse.json(
        { recommendations: [], error: dbError.message },
        { status: 500 },
      );
    }

    if (!playlist || playlist.length === 0) {
      return NextResponse.json({
        recommendations: [],
        message: 'Add some games to your list first',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { recommendations: [], error: 'GEMINI_API_KEY is not configured.' },
        { status: 500 },
      );
    }

    const libraryLines = (playlist as PlaylistRow[])
      .map(
        (game) =>
          `- ${game.game_name} (${PLAYLIST_STATUS_LABELS[game.status]})`,
      )
      .join('\n');

    const prompt = `The user has these games in their library:
${libraryLines}
Based on their taste, recommend 3 games they might enjoy next.
For each recommendation provide: name, reason (2 sentences max).
Respond only with a JSON array, no markdown, no backticks:
[{ "name": string, "reason": string }]`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );

    const geminiData = await geminiResponse.json();

    if (!geminiResponse.ok) {
      const message =
        geminiData.error?.message ||
        geminiData.message ||
        'Gemini API request failed.';
      return NextResponse.json(
        { recommendations: [], error: message },
        { status: 500 },
      );
    }

    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (typeof text !== 'string') {
      return NextResponse.json(
        { recommendations: [], error: 'Gemini returned an empty response.' },
        { status: 500 },
      );
    }

    const recommendations = parseRecommendations(text);

    return NextResponse.json({ recommendations });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to generate recommendations.';
    return NextResponse.json(
      { recommendations: [], error: message },
      { status: 500 },
    );
  }
}
