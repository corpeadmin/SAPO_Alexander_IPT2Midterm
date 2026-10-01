/*
 * Stock thresholds live in one place. The table, the totals strip and the
 * stock filter all read from here so they cannot drift apart.
 */

export const LOW_STOCK_MAX = 2;

export const STOCK_STATUSES = [
  { value: 'ok', label: 'In stock' },
  { value: 'low', label: 'Low stock' },
  { value: 'out', label: 'Out of stock' },
];

export function classifyStock(copies) {
  const count = Number(copies) || 0;
  if (count <= 0) return 'out';
  if (count <= LOW_STOCK_MAX) return 'low';
  return 'ok';
}

export function matchesStock(copies, status) {
  return status === '' || classifyStock(copies) === status;
}
