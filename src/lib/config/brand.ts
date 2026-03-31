export const BRAND = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME ?? "Sand Diamonds Travel",
  logo: process.env.NEXT_PUBLIC_BRAND_LOGO ?? "/icons/icon-192.png",
  tagline: process.env.NEXT_PUBLIC_BRAND_TAGLINE ?? "Curated luxury travel experiences",
  supportEmail: process.env.NEXT_PUBLIC_BRAND_SUPPORT_EMAIL ?? "concierge@sanddiamondstravel.com",
} as const
