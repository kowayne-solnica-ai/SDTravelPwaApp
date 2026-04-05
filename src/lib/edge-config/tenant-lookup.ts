import type { TenantConfig } from "@/types/tenant"

// ---------------------------------------------------------------------------
// Edge Config — Tenant Lookup
// ---------------------------------------------------------------------------
// Reads tenant mapping from Vercel Edge Config at the network edge.
// In development (no EDGE_CONFIG), falls back to the default "www" tenant
// using environment variables.
// ---------------------------------------------------------------------------

const DEFAULT_TENANT: TenantConfig = {
  tenantId: "www",
  siteId: process.env.WIX_META_SITE_ID ?? process.env.WIX_SITE_ID ?? "",
  name: "Sand Diamonds Travel",
}

/**
 * Resolve a subdomain to its tenant config.
 *
 * - In production, reads from Vercel Edge Config (< 1 ms).
 * - In development or when Edge Config is unavailable, returns the default
 *   "www" tenant so the app still works without Vercel infrastructure.
 */
export async function lookupTenant(
  subdomain: string,
): Promise<TenantConfig | null> {
  // "www" or apex domain always resolves to the primary tenant
  if (!subdomain || subdomain === "www") {
    return DEFAULT_TENANT
  }

  // Try Edge Config in production
  if (process.env.EDGE_CONFIG) {
    try {
      const { get } = await import("@vercel/edge-config")
      const config = await get<TenantConfig>(subdomain)
      return config ?? null
    } catch (err) {
      console.error(`[Edge Config] Lookup failed for "${subdomain}":`, err)
      return null
    }
  }

  // Development fallback — no Edge Config available.
  // Allow local dev subdomains (e.g. tenant-a.localhost) to resolve as www.
  console.warn(
    `[Edge Config] EDGE_CONFIG not set — resolving "${subdomain}" as default tenant (dev mode).`,
  )
  return DEFAULT_TENANT
}

export { DEFAULT_TENANT }
