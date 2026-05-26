'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getSessionId } from '@/lib/session';
import { SubpageHeader } from '@/src/components/layout/SubpageHeader';
import {
  WATCHLIST_STATUS_LABELS,
  WATCHLIST_TABS,
  type WatchlistItem,
  type WatchlistStatus,
} from '@/types/watchlist';

function WatchlistSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-xl border border-gray-200 bg-white p-4"
        >
          <div className="mb-3 h-5 w-16 rounded bg-gray-200" />
          <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
          <div className="mb-4 h-3 w-1/2 rounded bg-gray-200" />
          <div className="h-8 w-full rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [activeTab, setActiveTab] = useState<WatchlistStatus>('watchlist');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingTicker, setPendingTicker] = useState<string | null>(null);
  const [confirmRemoveTicker, setConfirmRemoveTicker] = useState<string | null>(
    null,
  );

  const loadWatchlist = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const sessionId = getSessionId();
      const response = await fetch(
        `/api/watchlist?session_id=${encodeURIComponent(sessionId)}`,
      );
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? 'Failed to load watchlist.');
      }

      setItems(payload.data ?? []);
    } catch (err) {
      setItems([]);
      setError(
        err instanceof Error ? err.message : 'Failed to load watchlist.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWatchlist();
  }, [loadWatchlist]);

  const filteredItems = items.filter((item) => item.status === activeTab);

  const handleStatusChange = async (ticker: string, status: WatchlistStatus) => {
    setPendingTicker(ticker);

    try {
      const response = await fetch(
        `/api/watchlist/${encodeURIComponent(ticker)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status,
            session_id: getSessionId(),
          }),
        },
      );
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? 'Failed to update status.');
      }

      setItems((current) =>
        current.map((item) =>
          item.ticker === ticker ? { ...item, status } : item,
        ),
      );
      setActiveTab(status);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update status.',
      );
    } finally {
      setPendingTicker(null);
    }
  };

  const handleRemove = async (ticker: string) => {
    setPendingTicker(ticker);

    try {
      const sessionId = getSessionId();
      const response = await fetch(
        `/api/watchlist/${encodeURIComponent(ticker)}?session_id=${encodeURIComponent(sessionId)}`,
        { method: 'DELETE' },
      );
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? 'Failed to remove stock.');
      }

      setItems((current) => current.filter((item) => item.ticker !== ticker));
      setConfirmRemoveTicker(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to remove stock.',
      );
    } finally {
      setPendingTicker(null);
    }
  };

  return (
    <>
      <SubpageHeader />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Watchlist</h1>

        <div className="mb-6 flex flex-wrap gap-2">
          {WATCHLIST_TABS.map((tab) => (
            <button
              key={tab.status}
              type="button"
              onClick={() => setActiveTab(tab.status)}
              className={
                activeTab === tab.status
                  ? 'rounded-md bg-[#e60012] px-4 py-2 text-sm font-semibold text-white'
                  : 'rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50'
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <WatchlistSkeleton />
        ) : filteredItems.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-600">
              No stocks in {WATCHLIST_STATUS_LABELS[activeTab]} yet.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm font-semibold text-[#e60012] transition hover:text-[#bf0010]"
            >
              Discover stocks →
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <Link
                  href={`/stocks/${encodeURIComponent(item.ticker)}`}
                  className="block no-underline"
                >
                  <p className="text-lg font-bold text-gray-900">{item.ticker}</p>
                  <p className="mt-1 text-sm text-gray-700">{item.company_name}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {item.sector ?? '—'}
                  </p>
                </Link>
                <span className="mt-3 inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                  {WATCHLIST_STATUS_LABELS[item.status]}
                </span>

                <div className="mt-4 flex flex-col gap-2">
                  <select
                    value={item.status}
                    disabled={pendingTicker === item.ticker}
                    onChange={(event) =>
                      handleStatusChange(
                        item.ticker,
                        event.target.value as WatchlistStatus,
                      )
                    }
                    className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700"
                  >
                    {WATCHLIST_TABS.map((tab) => (
                      <option key={tab.status} value={tab.status}>
                        {tab.label}
                      </option>
                    ))}
                  </select>

                  {confirmRemoveTicker === item.ticker ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={pendingTicker === item.ticker}
                        onClick={() => handleRemove(item.ticker)}
                        className="flex-1 rounded-md bg-[#e60012] px-3 py-2 text-sm font-semibold text-white"
                      >
                        Confirm remove
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmRemoveTicker(null)}
                        className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={pendingTicker === item.ticker}
                      onClick={() => setConfirmRemoveTicker(item.ticker)}
                      className="rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
