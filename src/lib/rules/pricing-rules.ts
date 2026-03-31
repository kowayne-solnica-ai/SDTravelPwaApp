/**
 * Calculate total price. This is the ONLY place where price math lives.
 */
export function calculateTotalPrice(
  guests: number,
  pricePerPerson: number,
): number {
  return guests * pricePerPerson
}
