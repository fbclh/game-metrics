'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { getSessionId } from '@/lib/session';
import { SubpageHeader } from '@/src/components/layout/SubpageHeader';
import {
  WATCHLIST_STATUS_LABELS,
  WATCHLIST_TABS,
  type WatchlistStatus,
} from '@/types/watchlist';

type PreviousClose = {
  c?: number;
};

type StockDetail = {
  ticker?: string;
  name?: string;
  market?: string;
  locale?: string;
  primary_exchange?: string;
  type?: string;
  description?: string;
  market_cap?: number;
  sic_description?: string;
  branding?: {
    logo_url?: string;
    icon_url?: string;
  };
  previousClose?: PreviousClose | null;
};

function getInitials(ticker: string): string {
  return ticker.slice(0, 2).toUpperCase();
}

function formatExchange(exchange: string): string {
  if (exchange === 'XNAS') return 'NASDAQ';
  if (exchange === 'XNYS') return 'NYSE';
  return exchange;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatMarketCap(value: number): string {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(1)}T`;
  }

  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(0)}B`;
  }

  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(0)}M`;
  }

  return formatCurrency(value);
}

export default function StockDetailPage({
  params,
}: {
  params: { ticker: string };
}) {
  const ticker = params.ticker.toUpperCase();
  const [stock, setStock] = useState<StockDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedStatus, setSavedStatus] = useState<WatchlistStatus | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [savingWatchlist, setSavingWatchlist] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStock() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/stocks/${encodeURIComponent(ticker)}`,
        );

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(
            payload?.message ??
              payload?.error ??
              `Failed to load ${ticker}.`,
          );
        }

        const data = (await response.json()) as StockDetail;

        if (!cancelled) {
          setStock(data);
        }
      } catch (err) {
        if (!cancelled) {
          setStock(null);
          setError(
            err instanceof Error ? err.message : `Failed to load ${ticker}.`,
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadStock();

    return () => {
      cancelled = true;
    };
  }, [ticker]);

  useEffect(() => {
    if (!stock?.ticker || !stock.name) {
      return;
    }

    fetch('/api/telemetry/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticker: stock.ticker,
        company_name: stock.name,
        session_id: getSessionId(),
      }),
    }).catch(() => {});
  }, [stock?.ticker, stock?.name]);

  useEffect(() => {
    let cancelled = false;

    async function loadSavedStatus() {
      try {
        const sessionId = getSessionId();
        const response = await fetch(
          `/api/watchlist?session_id=${encodeURIComponent(sessionId)}`,
        );
        const payload = await response.json();

        if (!response.ok || !payload.ok || cancelled) {
          return;
        }

        const match = (payload.data ?? []).find(
          (item: { ticker?: string; status?: WatchlistStatus }) =>
            item.ticker?.toUpperCase() === ticker,
        );

        if (match?.status && !cancelled) {
          setSavedStatus(match.status);
        }
      } catch {
        // Ignore watchlist preload errors on detail page.
      }
    }

    loadSavedStatus();

    return () => {
      cancelled = true;
    };
  }, [ticker]);

  useEffect(() => {
    if (!dropdownOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleSaveToWatchlist = async (status: WatchlistStatus) => {
    if (!stock?.ticker || !stock.name) {
      return;
    }

    setSavingWatchlist(true);
    setDropdownOpen(false);

    try {
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: stock.ticker,
          company_name: stock.name,
          logo_url: logoUrl,
          sector: stock.sic_description ?? null,
          status,
          session_id: getSessionId(),
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? 'Failed to save to watchlist.');
      }

      setSavedStatus(status);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save to watchlist.',
      );
    } finally {
      setSavingWatchlist(false);
    }
  };

  const logoUrl =
    stock?.branding?.logo_url ?? stock?.branding?.icon_url ?? null;
  const previousClose = stock?.previousClose?.c;

  return (
    <>
      <SubpageHeader />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-semibold text-[#e60012] transition hover:text-[#bf0010]"
        >
          ← Back to stocks
        </Link>

        {loading && (
          <p className="text-sm text-gray-600">Loading {ticker}…</p>
        )}

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && stock && (
          <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-[#111827]">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt={`${stock.name} logo`}
                    className="h-16 w-16 object-contain"
                  />
                ) : (
                  <span className="text-lg font-bold text-white">
                    {getInitials(stock.ticker ?? ticker)}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-3xl font-bold tracking-tight text-gray-900">
                  {stock.ticker ?? ticker}
                </p>
                <h1 className="mt-1 text-xl text-gray-700">{stock.name}</h1>

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold text-gray-500">Sector</dt>
                    <dd className="text-gray-900">—</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-500">Industry</dt>
                    <dd className="text-gray-900">
                      {stock.sic_description ?? '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-500">
                      Previous close
                    </dt>
                    <dd className="text-gray-900">
                      {typeof previousClose === 'number'
                        ? formatCurrency(previousClose)
                        : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-500">Market cap</dt>
                    <dd className="text-gray-900">
                      {typeof stock.market_cap === 'number'
                        ? formatMarketCap(stock.market_cap)
                        : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-500">Exchange</dt>
                    <dd className="text-gray-900">
                      {stock.primary_exchange
                        ? formatExchange(stock.primary_exchange)
                        : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-500">Market type</dt>
                    <dd className="capitalize text-gray-900">
                      {stock.market ?? '—'}
                      {stock.type ? ` · ${stock.type}` : ''}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {stock.description && (
              <div className="border-t border-gray-200 px-6 py-5">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  About
                </h2>
                <p className="text-sm leading-7 text-gray-700">
                  {stock.description}
                </p>
              </div>
            )}

            <div className="border-t border-gray-200 px-6 py-5">
              <div className="relative inline-block" ref={dropdownRef}>
                <button
                  type="button"
                  disabled={savingWatchlist}
                  onClick={() => setDropdownOpen((open) => !open)}
                  className="rounded-md bg-[#e60012] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#bf0010] disabled:opacity-60"
                >
                  {savingWatchlist
                    ? 'Saving…'
                    : savedStatus
                      ? `${WATCHLIST_STATUS_LABELS[savedStatus]} ✓`
                      : 'Save to Watchlist'}
                </button>

                {dropdownOpen && !savingWatchlist && (
                  <div className="absolute left-0 z-10 mt-2 min-w-[180px] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                    {WATCHLIST_TABS.map((tab) => (
                      <button
                        key={tab.status}
                        type="button"
                        onClick={() => handleSaveToWatchlist(tab.status)}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </article>
        )}
      </div>
    </>
  );
}
