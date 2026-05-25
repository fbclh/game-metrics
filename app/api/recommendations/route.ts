import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { PlayListStatus } from '@/types/playlist';

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

const GENRE_RECOMMENDATIONS: Record<string, string[]> = {
  zelda: ['Okami', 'Tunic', 'Hyper Light Drifter'],
  mario: ['Kirby and the Forgotten Land', 'Rayman Legends', "Yoshi's Crafted World"],
  metroid: ['Hollow Knight', 'Ori and the Blind Forest', 'Axiom Verge'],
  pokemon: ['Cassette Beasts', 'Temtem', 'Coromon'],
  halo: ['Destiny 2', 'Titanfall 2', 'Splitgate'],
  fifa: ['Rocket League', 'Mario Strikers', 'Captain Tsubasa'],
};

const DEFAULT_RECOMMENDATIONS = ['Hollow Knight', 'Celeste', 'Hades'];

const REASON_TEMPLATES: Record<string, string> = {
  zelda:
    'If you enjoyed {game}, you will appreciate the exploration and puzzle-driven adventure here.',
  mario:
    'Since {game} is in your library, this platformer matches that same playful, polished style.',
  metroid:
    'Your taste for {game} points toward this action-exploration game with tight movement and discovery.',
  pokemon:
    'With {game} on your list, this creature-collection RPG should feel like a natural next step.',
  halo: 'Given {game} in your library, this sci-fi shooter delivers similar fast-paced combat.',
  fifa: 'Because you have {game}, this competitive sports title fits your library well.',
  default:
    'Based on titles like {game} in your library, this acclaimed game is a strong match for you.',
};

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

function isInLibrary(candidate: string, libraryNames: Set<string>): boolean {
  const normalized = normalizeName(candidate);
  for (const name of Array.from(libraryNames)) {
    if (name === normalized || name.includes(normalized) || normalized.includes(name)) {
      return true;
    }
  }
  return false;
}

function findMatchingFranchise(gameName: string): string | null {
  const lower = gameName.toLowerCase();
  for (const franchise of Object.keys(GENRE_RECOMMENDATIONS)) {
    if (lower.includes(franchise)) {
      return franchise;
    }
  }
  return null;
}

function buildRecommendations(playlist: PlaylistRow[]): Recommendation[] {
  const libraryNames = new Set(playlist.map((game) => normalizeName(game.game_name)));
  const franchiseToSourceGame = new Map<string, string>();

  for (const game of playlist) {
    const franchise = findMatchingFranchise(game.game_name);
    if (franchise && !franchiseToSourceGame.has(franchise)) {
      franchiseToSourceGame.set(franchise, game.game_name);
    }
  }

  const candidates: { name: string; franchise: string; sourceGame: string }[] =
    [];

  if (franchiseToSourceGame.size > 0) {
    for (const [franchise, sourceGame] of Array.from(franchiseToSourceGame.entries())) {
      for (const name of GENRE_RECOMMENDATIONS[franchise]) {
        candidates.push({ name, franchise, sourceGame });
      }
    }
  } else {
    const sourceGame = playlist[0].game_name;
    for (const name of DEFAULT_RECOMMENDATIONS) {
      candidates.push({ name, franchise: 'default', sourceGame });
    }
  }

  const recommendations: Recommendation[] = [];
  const seen = new Set<string>();

  for (const candidate of candidates) {
    const key = normalizeName(candidate.name);
    if (seen.has(key) || isInLibrary(candidate.name, libraryNames)) {
      continue;
    }

    seen.add(key);
    const template =
      REASON_TEMPLATES[candidate.franchise] ?? REASON_TEMPLATES.default;

    recommendations.push({
      name: candidate.name,
      reason: template.replace('{game}', candidate.sourceGame),
    });

    if (recommendations.length >= 3) {
      break;
    }
  }

  return recommendations;
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

    const recommendations = buildRecommendations(playlist as PlaylistRow[]);

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
