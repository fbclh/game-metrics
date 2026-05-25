'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { getSessionId } from '@/lib/session';
import type { GameDetailData } from '@/src/types/game-detail';
import {
  PLAYLIST_STATUS_LABELS,
  PLAYLIST_TABS,
  type PlayListItem,
  type PlayListStatus,
} from '@/types/playlist';

type GameDetailProps = {
  game: GameDetailData;
};

type PlaylistResponse = {
  ok: boolean;
  data?: PlayListItem[];
};

type SaveResponse = {
  ok: boolean;
  data?: PlayListItem;
};

export function GameDetail({ game }: GameDetailProps) {
  const [savedStatus, setSavedStatus] = useState<PlayListStatus | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const sessionId = getSessionId();
    fetch(`/api/playlist?session_id=${encodeURIComponent(sessionId)}`)
      .then((response) => response.json())
      .then((result: PlaylistResponse) => {
        if (!result.ok || !result.data) return;
        const existing = result.data.find((item) => item.game_id === game.id);
        if (existing) {
          setSavedStatus(existing.status);
        }
      })
      .catch(() => {});
  }, [game.id]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleSave = async (status: PlayListStatus) => {
    setSaving(true);
    try {
      const response = await fetch('/api/playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_id: game.id,
          game_name: game.name,
          cover_url: game.background_image ?? null,
          status,
          session_id: getSessionId(),
        }),
      });
      const result = (await response.json()) as SaveResponse;
      if (result.ok) {
        setSavedStatus(status);
        setMenuOpen(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const buttonLabel = saving
    ? 'Saving…'
    : savedStatus
      ? `${PLAYLIST_STATUS_LABELS[savedStatus]} ✓`
      : 'Save to List';

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

          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              disabled={saving}
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded border border-[#e60012] bg-[#e60012] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#bf0010] disabled:cursor-wait disabled:opacity-70"
            >
              {buttonLabel}
            </button>

            {menuOpen && !saving && (
              <div className="absolute right-0 z-10 mt-2 min-w-[11rem] overflow-hidden rounded border border-gray-700 bg-[#161622] shadow-lg">
                {PLAYLIST_TABS.map((tab) => (
                  <button
                    key={tab.status}
                    type="button"
                    onClick={() => handleSave(tab.status)}
                    className={`block w-full px-4 py-2.5 text-left text-sm transition hover:bg-gray-800 ${
                      savedStatus === tab.status
                        ? 'bg-gray-800/80 text-white'
                        : 'text-gray-200'
                    }`}
                  >
                    {tab.label}
                    {savedStatus === tab.status && (
                      <span className="ml-1 text-[#e60012]">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
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
