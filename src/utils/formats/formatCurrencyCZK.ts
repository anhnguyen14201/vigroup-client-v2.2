/**
 * Luôn format số thành tiền tệ CZK
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}
