import { STOCK_STATUSES } from '../lib/stock';

export default function StockFilter({ value, onChange }) {
  return (
    <>
      <label className="visually-hidden" htmlFor="stock-filter">
        Filter by stock
      </label>
      <select
        id="stock-filter"
        className="select filters__select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Any stock level</option>
        {STOCK_STATUSES.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
    </>
  );
}
