import { useEffect, useState } from 'react';
import { fetchComics } from '../api/API';
import { Comics } from '../components/Comics';
import { Header } from '../components/Header';
import { Pagination } from '../components/Pagination';

export const Home = () => {
  const [comics, setComics] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchComics()
      .then((response) => {
        if (cancelled) return;
        setComics(response.data.data.results);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        const message =
          err.response?.data?.message ||
          err.response?.data?.code ||
          err.message ||
          'Failed to load comics.';
        setError(message);
        setComics([]);
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

  const displayComics = searchQuery
    ? comics.filter((comic) =>
        comic.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : comics;

  return (
    <>
      <Header
        characters={inputValue}
        handleOnChange={handleOnChange}
        handleSubmit={handleSubmit}
      />
      {loading && <p className="status">Loading comics…</p>}
      {error && (
        <p className="status status--error" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && <Comics comics={displayComics} />}
      <Pagination />
    </>
  );
};
