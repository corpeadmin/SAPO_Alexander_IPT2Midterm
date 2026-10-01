import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../services/api';
import StatsCards from '../components/StatsCards';

export default function LandingPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    bookService
      .getAll()
      .then((response) => {
        if (!active) return;
        setBooks(response.data.data);
        setError(false);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page">
      <header className="page-head">
        <span className="eyebrow">The Eldoria Library</span>
        <h1 className="page-head__title">The catalogue, open to you</h1>
        <p className="page-head__lede">
          Every volume the library holds, with shelf locations and current availability. Search it,
          narrow it by subject, author or stock, and keep it current as the collection changes.
        </p>
      </header>

      <div className="landing-actions">
        <Link className="btn btn--primary" to="/catalogue">
          Browse the catalogue
        </Link>
        <Link className="btn btn--ghost" to="/add">
          Add a book
        </Link>
      </div>

   
    </div>
  );
}
