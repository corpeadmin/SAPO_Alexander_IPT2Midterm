import { useState } from 'react';

const CATEGORIES = [
  'Fantasy', 'History', 'Magic', 'Warfare', 'Nature', 'Science',
  'Dark Magic', 'Religion', 'Biography', 'Poetry', 'Philosophy', 'Other',
];

const EMPTY = {
  title: '',
  author: '',
  category: '',
  copies_available: '1',
  shelf_number: '',
};

function validate(values) {
  const errors = {};

  if (!values.title.trim()) errors.title = 'Title is required';
  if (!values.author.trim()) errors.author = 'Author is required';
  if (!values.category) errors.category = 'Choose a category';

  const copies = Number(values.copies_available);
  if (values.copies_available === '' || !Number.isInteger(copies) || copies < 0) {
    errors.copies_available = 'Enter a whole number of 0 or more';
  }

  if (!values.shelf_number.trim()) errors.shelf_number = 'Shelf number is required';

  return errors;
}

export default function BookForm({ initialValues, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const found = validate(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ...values,
        title: values.title.trim(),
        author: values.author.trim(),
        shelf_number: values.shelf_number.trim(),
        copies_available: Number(values.copies_available),
      });
    } catch {
      setSubmitting(false);
    }
  };

  const field = (name) => ({
    id: `book-${name}`,
    name,
    value: values[name],
    onChange: handleChange,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `book-${name}-error` : undefined,
  });

  const error = (name) =>
    errors[name] ? (
      <p className="field__error" id={`book-${name}-error`}>
        {errors[name]}
      </p>
    ) : null;

  return (
    <form className="form-grid" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label className="field__label" htmlFor="book-title">
          Title <span className="field__req">*</span>
        </label>
        <input className="input" type="text" placeholder="The Chronicles of Eldoria" {...field('title')} />
        {error('title')}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="book-author">
          Author <span className="field__req">*</span>
        </label>
        <input className="input" type="text" placeholder="Merlin the Wise" {...field('author')} />
        {error('author')}
      </div>

      <div className="form-grid form-grid--2">
        <div className="field">
          <label className="field__label" htmlFor="book-category">
            Category <span className="field__req">*</span>
          </label>
          <select className="select" {...field('category')}>
            <option value="">Unclassified</option>
            {CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {error('category')}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="book-copies_available">
            Copies <span className="field__req">*</span>
          </label>
          <input className="input num" type="number" min="0" step="1" inputMode="numeric" {...field('copies_available')} />
          {error('copies_available')}
        </div>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="book-shelf_number">
          Shelf number <span className="field__req">*</span>
        </label>
        <input className="input" type="text" placeholder="A-001" {...field('shelf_number')} />
        {error('shelf_number')}
      </div>

      <div className="form-actions">
        {onCancel && (
          <button className="btn btn--ghost" type="button" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
        <button className="btn btn--primary" type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
