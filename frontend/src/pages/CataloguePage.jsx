import { useCallback, useEffect, useState } from 'react';
import { bookService } from '../services/api';
import SearchBar from '../components/SearchBar';
import SelectFilter from '../components/SelectFilter';
import { matchesStock, STOCK_STATUSES } from '../lib/stock';
import BookTable from '../components/BookTable';
import StatsCards from '../components/StatsCards';
import ActivityFeed from '../components/ActivityFeed';
import BookModal from '../components/BookModal';

export default function LandingPage() {
  const [books, setBooks] = useState([]);
  const [results, setResults] = useState(null);
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [stock, setStock] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await bookService.getAll();
      setBooks(response.data.data);
      setError(null);
    } catch {
      setError(
        'Could not reach the library catalogue. Check that the backend is running and the database is reachable.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Stable identities: passing fresh arrow functions into SearchBar would
  // retrigger its search effect on every render of this component.
  const handleResults = useCallback((data) => setResults(data), []);
  const handleClear = useCallback(() => setResults(null), []);

  const isSearching = results !== null;
  const hasCategory = category !== '';
  const hasAuthor = author !== '';
  const hasStock = stock !== '';

  // Options come from the full catalogue so they don't shift while searching.
  const uniqueSorted = (field) =>
    [...new Set(books.map((book) => book[field]))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({ value, label: value }));

  const subjectOptions = uniqueSorted('category');
  const authorOptions = uniqueSorted('author');

  // Dropdowns apply on top of the text search, so every active filter must match.
  const base = isSearching ? results : books;
  const visible = base.filter(
    (book) =>
      (!hasCategory || book.category === category) &&
      (!hasAuthor || book.author === author) &&
      matchesStock(book.copies_available, stock),
  );

  const stockLabel = STOCK_STATUSES.find((s) => s.value === stock)?.label ?? '';

  const openModal = (mode, book = null) => setModal({ mode, book });

  // Picks from whatever is currently on screen, so the filters are respected.
  const handleSurprise = useCallback(() => {
    if (visible.length === 0) return;
    setModal({ mode: 'view', book: visible[Math.floor(Math.random() * visible.length)] });
  }, [visible]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key.toLowerCase() !== 'r') return;
      // Never hijack typing, and stay out of the way while a dialog is open.
      if (modal) return;

      const el = event.target;
      if (el?.isContentEditable) return;
      if (el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA' || el?.tagName === 'SELECT') return;

      event.preventDefault();
      handleSurprise();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleSurprise, modal]);

  const handleSubmit = async (formData) => {
    if (modal.mode === 'edit') {
      await bookService.update(modal.book.id, formData);
    } else {
      await bookService.create(formData);
    }
    setResults(null);
    await load();
  };

  const handleDelete = async (book) => {
    const ok = window.confirm(`Delete “${book.title}” from the catalogue? This cannot be undone.`);
    if (!ok) return;

    try {
      await bookService.delete(book.id);
      setResults(null);
      await load();
    } catch {
      window.alert('Could not delete that book. Please try again.');
    }
  };

  // Flat description of what the reader is actually filtering on.
  const activeFilters = [
    isSearching && 'the search term',
    hasCategory && category,
    hasAuthor && author,
    hasStock && stockLabel,
  ].filter(Boolean);

  const hasFilters = activeFilters.length > 0;

  const emptyState = hasFilters
    ? {
        title: 'No matching books',
        hint: `Nothing matches ${activeFilters.join(' and ')}. Try broadening the filters.`,
      }
    : {
        title: 'The catalogue is empty',
        hint: 'Add a volume to begin building the collection.',
      };

  return (
    <div className="page">
      <header className="page-head">
        <span className="eyebrow">The Eldoria Library</span>
        <h1 className="page-head__title">Catalogue</h1>
        <p className="page-head__lede">
          Search by title, author, subject or shelf, then narrow further by subject, author or
          stock. Every filter you set has to match for a book to appear.
        </p>
      </header>

      {error && (
        <p className="notice" role="alert">
          {error}
        </p>
      )}

      <StatsCards books={books} />

      <div className="filters">
        <SearchBar onResults={handleResults} onClear={handleClear} />
        <SelectFilter
          id="subject-filter"
          label="Filter by subject"
          allLabel="All subjects"
          options={subjectOptions}
          value={category}
          onChange={setCategory}
          disabled={subjectOptions.length === 0}
        />
        <SelectFilter
          id="author-filter"
          label="Filter by author"
          allLabel="All authors"
          options={authorOptions}
          value={author}
          onChange={setAuthor}
          disabled={authorOptions.length === 0}
        />
        <SelectFilter
          id="stock-filter"
          label="Filter by stock"
          allLabel="Any stock level"
          options={STOCK_STATUSES}
          value={stock}
          onChange={setStock}
        />
      </div>

      <section className="panel" aria-labelledby="catalogue-heading">
        <div className="panel__head">
          <h2 className="panel__title" id="catalogue-heading">
            Volumes
            <span className="panel__count">
              {visible.length} {visible.length === 1 ? 'entry' : 'entries'}
              {hasFilters ? ' matching' : ''}
            </span>
          </h2>
          <div className="panel__actions">
            <button
              className="btn btn--ghost"
              type="button"
              onClick={handleSurprise}
              disabled={visible.length === 0}
              aria-label="Show a random book from the current results (press R)"
            >
              Surprise me <kbd className="kbd">R</kbd>
            </button>
            <button className="btn btn--primary" type="button" onClick={() => openModal('add')}>
              Add a book
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading" role="status" aria-label="Loading catalogue">
            <span className="loading__dot" />
          </div>
        ) : (
          <BookTable
            books={visible}
            emptyState={emptyState}
            onView={(book) => openModal('view', book)}
            onEdit={(book) => openModal('edit', book)}
            onDelete={handleDelete}
          />
        )}
      </section>

      <ActivityFeed />

      {modal && (
        <BookModal
          mode={modal.mode}
          book={modal.book}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
