'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { getSessionId } from '@/lib/session';
import type { GameDetailData } from '@/src/types/game-detail';

type GameDetailProps = {
  game: GameDetailData;
};

export function GameDetail({ game }: GameDetailProps) {
  useEffect(() => {
    fetch('/api/telemetry/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        game_id: game.id,
        game_name: game.name,
        session_id: getSessionId(),
      }),
    }).catch(() => {});
  }, [game.id, game.name]);

  const genres = game.genres?.map((genre) => genre.name).join(', ');
  const screenshots = game.screenshots ?? [];

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white">
      {game.background_image && (
        <div className="relative w-full">
          <img
            src={game.background_image}
            alt={game.name}
            className="h-72 w-full object-cover md:h-96"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14] to-transparent" />
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 py-6 md:px-6">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-300 transition hover:text-white"
        >
          <span aria-hidden="true">←</span>
          Back to games
        </Link>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">{game.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-300">
              {game.released && <span>{game.released}</span>}
              {game.metacritic != null && game.metacritic > 0 && (
                <span className="rounded bg-[#6c9a2c] px-2 py-0.5 font-bold text-white">
                  {game.metacritic}
                </span>
              )}
              {genres && <span>{genres}</span>}
            </div>
          </div>

          <button
            type="button"
            className="shrink-0 rounded border border-[#e60012] bg-[#e60012] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#bf0010]"
          >
            Save to List
          </button>
        </div>

        {game.description_raw && (
          <section className="mb-10">
            <h2 className="mb-3 text-lg font-semibold">About</h2>
            <p className="whitespace-pre-line leading-relaxed text-gray-300">
              {game.description_raw}
            </p>
          </section>
        )}

        {screenshots.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-semibold">Screenshots</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {screenshots.map((shot) => (
                <img
                  key={shot.id}
                  src={shot.image}
                  alt={`${game.name} screenshot`}
                  className="w-full rounded object-cover"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
