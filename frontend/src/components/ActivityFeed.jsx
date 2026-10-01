import { useEffect, useState } from 'react';
import { bookService } from '../services/api';

const MAX_ITEMS = 5;

function stamp(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ActivityFeed() {
  const [recent, setRecent] = useState(null);

  useEffect(() => {
    let active = true;

    bookService
      .getRecent()
      .then((response) => {
        if (active) setRecent(response.data.data);
      })
      .catch(() => {
        if (active) setRecent([]);
      });

    return () => {
      active = false;
    };
  }, []);

  if (recent === null) {
    return (
      <div className="loading" role="status" aria-label="Loading recent activity">
        <span className="loading__dot" />
      </div>
    );
  }

  return (
    <section className="panel" aria-labelledby="activity-heading">
      <div className="panel__head">
        <h2 className="panel__title" id="activity-heading">
          Recently amended
        </h2>
      </div>

      {recent.length === 0 ? (
        <p className="empty">No entries have been recorded yet.</p>
      ) : (
        <ul className="feed">
          {recent.slice(0, MAX_ITEMS).map((book) => (
            <li className="feed__item" key={book.id}>
              <p className="feed__title">{book.title}</p>
              <time className="feed__time" dateTime={book.updated_at}>
                {stamp(book.updated_at)}
              </time>
              <p className="feed__meta">
                {book.author} — {book.category}, shelf {book.shelf_number}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
