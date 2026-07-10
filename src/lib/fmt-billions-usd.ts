/** Format a USD value stored in billions (e.g. 1.5 → "$1.5B", 1200 → "$1.20T"). */
export function fmtBillionsUsd(b: number): string {
  if (b >= 1000) return `$${(b / 1000).toFixed(2)}T`;
  if (b >= 10) return `$${Math.round(b)}B`;
  if (b >= 1) return `$${b.toFixed(1)}B`;
  if (b >= 0.001) return `$${Math.round(b * 1000)}M`;
  return `$${b.toFixed(2)}B`;
}
