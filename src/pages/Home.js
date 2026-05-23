import { useEffect, useState } from 'react';
import { fetchGames } from '../api/API';
import { Games } from '../components/Games';
import { Header } from '../components/Header';
import { Pagination } from '../components/Pagination';

export const Home = () => {
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchGames()
      .then((response) => {
        if (cancelled) return;
        setGames(response.data.results);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        const message =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          'Failed to load games.';
        setError(message);
        setGames([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleOnChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(inputValue.trim());
    setInputValue('');
  };

  const displayGames = searchQuery
    ? games.filter((game) =>
        game.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : games;

  return (
    <>
      <Header
        characters={inputValue}
        handleOnChange={handleOnChange}
        handleSubmit={handleSubmit}
      />
      {loading && <p className="status">Loading games…</p>}
      {error && (
        <p className="status status--error" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && <Games games={displayGames} />}
      <Pagination />
    </>
  );
};
