function Stock({ copies }) {
  const count = Number(copies) || 0;

  if (count <= 0) {
    return (
      <span className="stock stock--out">
        <span className="stock__dot" aria-hidden />
        Out of stock
      </span>
    );
  }

  if (count <= 2) {
    return (
      <span className="stock stock--low">
        <span className="stock__dot" aria-hidden />
        Low — <span className="stock--n">{count}</span> left
      </span>
    );
  }

  return (
    <span className="stock stock--ok">
      <span className="stock__dot" aria-hidden />
      <span className="stock--n">{count}</span> available
    </span>
  );
}

export default function BookTable({ books, emptyState, onView, onEdit, onDelete }) {
  if (books.length === 0) {
    return (
      <div className="empty">
        <p className="empty__title">{emptyState.title}</p>
        <p>{emptyState.hint}</p>
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Author</th>
            <th scope="col">Subject</th>
            <th scope="col">Stock</th>
            <th scope="col">Shelf</th>
            <th scope="col">
              <span className="visually-hidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td className="table__title">{book.title}</td>
              <td className="table__author">{book.author}</td>
              <td className="table__category">{book.category}</td>
              <td>
                <Stock copies={book.copies_available} />
              </td>
              <td className="shelf">{book.shelf_number}</td>
              <td>
                <div className="row-actions">
                  <button className="row-action" type="button" onClick={() => onView(book)}>
                    View
                  </button>
                  <button className="row-action" type="button" onClick={() => onEdit(book)}>
                    Edit
                  </button>
                  <button
                    className="row-action row-action--danger"
                    type="button"
                    onClick={() => onDelete(book)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
