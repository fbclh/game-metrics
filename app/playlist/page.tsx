'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { getSessionId } from '@/lib/session';
import {
  PLAYLIST_STATUS_LABELS,
  PLAYLIST_TABS,
  type PlayListItem,
  type PlayListStatus,
} from '@/types/playlist';
import { SubpageHeader } from '@/src/components/layout/SubpageHeader';

type PlaylistResponse = {
  ok: boolean;
  data?: PlayListItem[];
  error?: string;
};

type Recommendation = {
  name: string;
  reason: string;
};

type RecommendationsResponse = {
  recommendations: Recommendation[];
  message?: string;
  error?: string;
};

export default function PlaylistPage() {
  const [items, setItems] = useState<PlayListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<PlayListStatus>('want_to_play');
  const [pendingRemoveId, setPendingRemoveId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [recommendationsMessage, setRecommendationsMessage] = useState<
    string | null
  >(null);

  const loadPlaylist = useCallback(async () => {
    setLoading(true);
    try {
      const sessionId = getSessionId();
      const response = await fetch(
        `/api/playlist?session_id=${encodeURIComponent(sessionId)}`,
      );
      const result = (await response.json()) as PlaylistResponse;
      if (result.ok && result.data) {
        setItems(result.data);
      }
    } catch {
      // Ignore fetch errors in UI
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlaylist();
  }, [loadPlaylist]);

  useEffect(() => {
    let cancelled = false;

    async function loadRecommendations() {
      setRecommendationsLoading(true);
      setRecommendationsMessage(null);

      try {
        const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: getSessionId() }),
        });
        const result = (await response.json()) as RecommendationsResponse;

        if (cancelled) return;

        setRecommendations(result.recommendations ?? []);
        setRecommendationsMessage(result.message ?? null);
      } catch {
        if (!cancelled) {
          setRecommendations([]);
        }
      } finally {
        if (!cancelled) {
          setRecommendationsLoading(false);
        }
      }
    }

    loadRecommendations();

    return () => {
      cancelled = true;
    };
  }, []);

  const tabItems = items.filter((item) => item.status === activeTab);

  const handleStatusChange = async (gameId: number, status: PlayListStatus) => {
    setUpdatingId(gameId);
    try {
      const response = await fetch(`/api/playlist/${gameId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          session_id: getSessionId(),
        }),
      });
      const result = await response.json();
      if (result.ok) {
        setItems((current) =>
          current.map((item) =>
            item.game_id === gameId ? { ...item, status } : item,
          ),
        );
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (gameId: number) => {
    if (pendingRemoveId !== gameId) {
      setPendingRemoveId(gameId);
      return;
    }

    try {
      const sessionId = getSessionId();
      const response = await fetch(
        `/api/playlist/${gameId}?session_id=${encodeURIComponent(sessionId)}`,
        { method: 'DELETE' },
      );
      const result = await response.json();
      if (result.ok) {
        setItems((current) => current.filter((item) => item.game_id !== gameId));
        setPendingRemoveId(null);
      }
    } catch {
      setPendingRemoveId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#e5e7eb] text-gray-900">
      <SubpageHeader />
      <div className="mx-auto max-w-6xl px-4 py-8 pb-12 md:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              My Play List
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Track games you want to play, are playing, or have finished.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-gray-900"
          >
            <span aria-hidden="true">←</span>
            Back to Games
          </Link>
        </div>

        <div className="mb-8 flex flex-wrap gap-2 border-b border-gray-300 pb-4">
          {PLAYLIST_TABS.map((tab) => {
            const count = items.filter((item) => item.status === tab.status).length;
            const isActive = activeTab === tab.status;

            return (
              <button
                key={tab.status}
                type="button"
                onClick={() => {
                  setActiveTab(tab.status);
                  setPendingRemoveId(null);
                }}
                className={`rounded px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#e60012] text-white shadow-sm'
                    : 'bg-white text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50'
                }`}
              >
                {tab.label}
                {!loading && count > 0 && (
                  <span className="ml-2 text-xs opacity-80">({count})</span>
                )}
              </button>
            );
          })}
        </div>

        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Recommended for You
          </h2>

          {recommendationsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-lg bg-gray-100 p-4"
                >
                  <div className="mb-2 h-4 w-1/3 rounded bg-gray-200" />
                  <div className="h-3 w-full rounded bg-gray-200" />
                  <div className="mt-2 h-3 w-2/3 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : !loading && items.length === 0 ? (
            <p className="text-sm text-gray-600">
              Save some games to your list to get recommendations
            </p>
          ) : recommendations.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {recommendations.map((item) => (
                <article
                  key={item.name}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                >
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {item.reason}
                  </p>
                  <Link
                    href={`/?search=${encodeURIComponent(item.name)}`}
                    className="mt-3 inline-block text-sm font-medium text-[#e60012] transition hover:text-[#bf0010]"
                  >
                    Search for this game
                  </Link>
                </article>
              ))}
            </div>
          ) : recommendationsMessage ? (
            <p className="text-sm text-gray-600">{recommendationsMessage}</p>
          ) : (
            <p className="text-sm text-gray-600">
              Save some games to your list to get recommendations
            </p>
          )}
        </section>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-lg bg-white p-3 shadow-sm ring-1 ring-gray-200"
              >
                <div className="mb-3 aspect-[190/274] rounded bg-gray-200" />
                <div className="mb-2 h-4 rounded bg-gray-200" />
                <div className="h-8 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : tabItems.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-lg text-gray-800">
              No games in{' '}
              {PLAYLIST_STATUS_LABELS[activeTab].toLowerCase()} yet.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Browse the catalog and save games from their detail page.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded bg-[#e60012] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#bf0010]"
            >
              Find games
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {tabItems.map((item) => (
              <article
                key={item.id}
                className="flex flex-col rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
              >
                <Link href={`/games/${item.game_id}`} className="block">
                  {item.cover_url ? (
                    <img
                      src={item.cover_url}
                      alt={item.game_name}
                      className="mb-3 aspect-[190/274] w-full rounded object-cover"
                    />
                  ) : (
                    <div className="mb-3 flex aspect-[190/274] items-center justify-center rounded bg-gray-500 px-2 text-center text-sm font-medium text-white">
                      {item.game_name}
                    </div>
                  )}
                  <h2 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
                    {item.game_name}
                  </h2>
                </Link>

                <span className="mb-3 inline-flex w-fit rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                  {PLAYLIST_STATUS_LABELS[item.status]}
                </span>

                <div className="mt-auto flex flex-col gap-2">
                  <select
                    value={item.status}
                    disabled={updatingId === item.game_id}
                    onChange={(event) =>
                      handleStatusChange(
                        item.game_id,
                        event.target.value as PlayListStatus,
                      )
                    }
                    className="rounded border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-800"
                  >
                    {PLAYLIST_TABS.map((tab) => (
                      <option key={tab.status} value={tab.status}>
                        Move to {tab.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleRemove(item.game_id)}
                    className={`rounded px-2 py-1.5 text-xs font-medium transition ${
                      pendingRemoveId === item.game_id
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'border border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600'
                    }`}
                  >
                    {pendingRemoveId === item.game_id
                      ? 'Confirm remove'
                      : 'Remove'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
