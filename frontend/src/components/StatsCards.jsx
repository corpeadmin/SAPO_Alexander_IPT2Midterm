export default function StatsCards({ books }) {
  const totalCopies = books.reduce((sum, book) => sum + (Number(book.copies_available) || 0), 0);
  const lowStock = books.filter((b) => b.copies_available > 0 && b.copies_available <= 2).length;
  const outOfStock = books.filter((b) => b.copies_available <= 0).length;
  const categories = new Set(books.map((b) => b.category)).size;

  const stats = [
    { label: 'Volumes', value: books.length },
    { label: 'Copies', value: totalCopies },
    { label: 'Subjects', value: categories },
    {
      label: 'Low stock',
      value: lowStock,
      tone: lowStock > 0 ? 'warn' : 'calm',
    },
    {
      label: 'Unavailable',
      value: outOfStock,
      tone: outOfStock > 0 ? 'warn' : 'calm',
    },
  ];

  return (
    <dl className="masthead" aria-label="Library totals">
      {stats.map((stat) => (
        <div className="masthead__cell" key={stat.label} data-tone={stat.tone}>
          <dt className="masthead__label eyebrow">{stat.label}</dt>
          <dd className="masthead__value">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
