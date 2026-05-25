'use client';

import { useEffect, useState } from 'react';
import { fetchGames, GAMES_PAGE_SIZE, type Game } from '../api/API';
import { getSessionId } from '@/lib/session';
import { Games } from '../components/Games';
import { Header } from '../components/Header';
import { Pagination } from '../components/Pagination';
import styles from '../styles/Home.module.css';

export const Home = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageCount = Math.max(1, Math.ceil(totalCount / GAMES_PAGE_SIZE));
  const hasPrevious = page > 1;
  const hasNext = page < pageCount;

  useEffect(() => {
    let cancelled = false;

    setLoading(true);

    fetchGames({
      search: activeSearch || undefined,
      page,
      pageSize: GAMES_PAGE_SIZE,
    })
      .then((response) => {
        if (cancelled) return;
        setGames(response.results);
        setTotalCount(response.count || 0);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch((err) => {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : 'Failed to load games.';
        setError(message);
        setGames([]);
        setTotalCount(0);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeSearch, page]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = inputValue.trim();
    setPage(1);
    setActiveSearch(query);

    if (query) {
      fetch('/api/telemetry/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          session_id: getSessionId(),
        }),
      }).catch(() => {});
    }
  };

  const handlePageSelect = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handlePrevious = () => {
    setPage((current) => Math.max(1, current - 1));
  };

  const handleNext = () => {
    setPage((current) => Math.min(pageCount, current + 1));
  };

  return (
    <>
      <Header
        characters={inputValue}
        handleOnChange={handleOnChange}
        handleSubmit={handleSubmit}
      />
      {loading && games.length === 0 && (
        <p className="status">
          {activeSearch ? `Searching for “${activeSearch}”…` : 'Loading games…'}
        </p>
      )}
      {error && (
        <p className="status status--error" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && games.length === 0 && (
        <p className="status">
          {activeSearch
            ? `No games found for “${activeSearch}”.`
            : 'No games found.'}
        </p>
      )}
      {!error && games.length > 0 && (
        <div className={styles.layout}>
          <Games games={games} />
          <Pagination
            page={page}
            pageCount={pageCount}
            onPageSelect={handlePageSelect}
            onPrevious={handlePrevious}
            onNext={handleNext}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            disabled={loading}
          />
        </div>
      )}
    </>
  );
};

export default Home;
