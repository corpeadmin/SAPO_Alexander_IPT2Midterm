import { useEffect, useRef } from 'react';
import BookForm from './BookForm';

function stockBadge(copies) {
  const c = Number(copies) || 0;

  if (c <= 0) {
    return (
      <span className="stock stock--out">
        <span className="stock__dot" aria-hidden />
        Out of stock
      </span>
    );
  }

  if (c <= 2) {
    return (
      <span className="stock stock--low">
        <span className="stock__dot" aria-hidden />
        Low stock <span className="stock--n">({c})</span>
      </span>
    );
  }

  return (
    <span className="stock stock--ok">
      <span className="stock__dot" aria-hidden />
      Available <span className="stock--n">({c})</span>
    </span>
  );
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

function BookModal({ book, mode, onClose, onSubmit }) {
  const panelRef = useRef(null);

  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const title = isView ? 'Book details' : isEdit ? 'Edit book' : 'Add a book';

  useEffect(() => {
    const previouslyFocused = document.activeElement;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const handleSubmit = async (data) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-modal-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal" ref={panelRef} tabIndex={-1}>
        <div className="modal__head">
          <h3 id="book-modal-title">{title}</h3>
        </div>

        {isView ? (
          <div className="modal__body">
            <dl className="records">
              <div className="records__row">
                <dt className="eyebrow">Title</dt>
                <dd className="records__value">{book.title}</dd>
              </div>
              <div className="records__row">
                <dt className="eyebrow">Author</dt>
                <dd className="records__value">{book.author}</dd>
              </div>
              <div className="records__row">
                <dt className="eyebrow">Category</dt>
                <dd>{book.category}</dd>
              </div>
              <div className="records__row">
                <dt className="eyebrow">Copies available</dt>
                <dd>{stockBadge(book.copies_available)}</dd>
              </div>
              <div className="records__row">
                <dt className="eyebrow">Shelf number</dt>
                <dd className="shelf">{book.shelf_number}</dd>
              </div>
              <div className="records__row">
                <dt className="eyebrow">Recorded</dt>
                <dd>{formatDate(book.created_at)}</dd>
              </div>
              {book.updated_at && book.updated_at !== book.created_at && (
                <div className="records__row">
                  <dt className="eyebrow">Last updated</dt>
                  <dd>{formatDate(book.updated_at)}</dd>
                </div>
              )}
            </dl>
            <div className="modal__footer">
              <button className="btn btn--ghost" type="button" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="modal__body">
            <BookForm
              initialValues={book}
              submitLabel={isEdit ? 'Save changes' : 'Add to library'}
              onSubmit={handleSubmit}
              onCancel={onClose}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default BookModal;
