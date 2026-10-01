import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService } from '../services/api';
import BookForm from '../components/BookForm';

export default function AddBookPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setError(null);
    try {
      await bookService.create(formData);
      navigate('/catalogue');
    } catch {
      setError('Could not add that book. Please check the details and try again.');
    }
  };

  return (
    <div className="page">
      <header className="page-head">
        <span className="eyebrow">The Eldoria Library</span>
        <h1 className="page-head__title">Add a book</h1>
        <p className="page-head__lede">
          Record a new volume in the catalogue. All fields are required.
        </p>
      </header>

      {error && (
        <p className="notice" role="alert">
          {error}
        </p>
      )}

      <section className="panel" style={{ maxWidth: '34rem' }} aria-label="New book details">
        <BookForm
          submitLabel="Add to library"
          onSubmit={handleSubmit}
          onCancel={() => navigate('/catalogue')}
        />
      </section>
    </div>
  );
}
