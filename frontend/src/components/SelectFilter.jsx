/*
 * One dropdown, reused for every list filter (subject, author, stock).
 * `options` is a list of { value, label }.
 */
export default function SelectFilter({ id, label, allLabel, options, value, onChange, disabled }) {
  return (
    <>
      <label className="visually-hidden" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="select filters__select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}
