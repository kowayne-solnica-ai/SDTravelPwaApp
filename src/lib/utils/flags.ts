export const FLAGS = {
  ENABLE_PAYMENTS: process.env.NEXT_PUBLIC_FF_PAYMENTS === "true",
  ENABLE_REVIEWS: process.env.NEXT_PUBLIC_FF_REVIEWS === "true",
} as const

export function isEnabled(flag: keyof typeof FLAGS): boolean {
  return FLAGS[flag]
}
