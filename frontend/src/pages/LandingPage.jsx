import { useCallback, useEffect, useState } from 'react';
import { bookService } from '../services/api';
import SearchBar from '../components/SearchBar';
import BookTable from '../components/BookTable';
import StatsCards from '../components/StatsCards';
import ActivityFeed from '../components/ActivityFeed';
import BookModal from '../components/BookModal';

export default function LandingPage() {
  const [books, setBooks] = useState([]);
  const [results, setResults] = useState(null);
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

  const isFiltered = results !== null;
  const visible = isFiltered ? results : books;

  const openModal = (mode, book = null) => setModal({ mode, book });

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

  return (
    <div className="page">
      <header className="page-head">
        <span className="eyebrow">Eldoria — restricted collection</span>
        <h1 className="page-head__title">Catalogue</h1>
        <p className="page-head__lede">
          Every volume held by the library, with shelf locations and current availability.
        </p>
      </header>

      {error && (
        <p className="notice" role="alert">
          {error}
        </p>
      )}

      <StatsCards books={books} />

      <SearchBar onResults={handleResults} onClear={handleClear} />

      <section className="panel" aria-labelledby="catalogue-heading">
        <div className="panel__head">
          <h2 className="panel__title" id="catalogue-heading">
            Volumes
            <span className="panel__count">
              {visible.length} {visible.length === 1 ? 'entry' : 'entries'}
              {isFiltered ? ' matching' : ''}
            </span>
          </h2>
          <button className="btn btn--primary" type="button" onClick={() => openModal('add')}>
            Add a book
          </button>
        </div>

        {loading ? (
          <div className="loading" role="status" aria-label="Loading catalogue">
            <span className="loading__dot" />
          </div>
        ) : (
          <BookTable
            books={visible}
            isFiltered={isFiltered}
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
