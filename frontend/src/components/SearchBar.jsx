import { useEffect, useState } from 'react';
import { bookService } from '../services/api';

const DEBOUNCE_MS = 250;

export default function SearchBar({ onResults, onClear }) {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const term = debounced.trim();

    if (term === '') {
      onClear();
      return undefined;
    }

    let active = true;
    setPending(true);

    bookService
      .search(term)
      .then((response) => {
        if (active) onResults(response.data.data);
      })
      .catch(() => {
        if (active) onResults([]);
      })
      .finally(() => {
        if (active) setPending(false);
      });

    return () => {
      active = false;
    };
  }, [debounced, onResults, onClear]);

  return (
    <form className="search" role="search" onSubmit={(event) => event.preventDefault()}>
      <label className="visually-hidden" htmlFor="catalogue-search">
        Search the catalogue
      </label>
      <span className="search__icon" aria-hidden>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="7" cy="7" r="4.5" />
          <path d="M10.5 10.5 14 14" strokeLinecap="round" />
        </svg>
      </span>
      <input
        id="catalogue-search"
        className="search__input"
        type="search"
        placeholder="Search by title, author, subject or shelf…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        autoComplete="off"
      />
      {pending && <span className="visually-hidden">Searching…</span>}
    </form>
  );
}
