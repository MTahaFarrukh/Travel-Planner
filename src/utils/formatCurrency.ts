/** Formats a number as USD with $ prefix and no decimals. */
export function formatCurrency(amount: number): string {
  return `$${Math.round(amount).toLocaleString('en-US')}`
}
