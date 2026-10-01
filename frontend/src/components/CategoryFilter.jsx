export default function CategoryFilter({ categories, value, onChange, disabled }) {
  return (
    <>
      <label className="visually-hidden" htmlFor="category-filter">
        Filter by subject
      </label>
      <select
        id="category-filter"
        className="select filters__select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        <option value="">All subjects</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </>
  );
}
