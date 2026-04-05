import "server-only";
import { createClient, OAuthStrategy, ApiKeyStrategy } from "@wix/sdk";
import { bookings } from "@wix/bookings";
import { availabilityCalendar } from "@wix/bookings";
import { items } from "@wix/data";
import { members } from "@wix/members";
import { products } from "@wix/stores";
import { submissions, forms } from "@wix/forms";
import { contacts, submittedContact } from "@wix/crm";
import { conversations, messages } from "@wix/inbox";

// ---------------------------------------------------------------------------
// Wix Headless SDK — Multi-Tenant Client Factory (SOW §6.2)
// ---------------------------------------------------------------------------
// wixClient(siteId?)    → OAuth client; per-tenant when siteId provided
// wixAdminClient(siteId?) → API-key client; per-tenant when siteId provided
//
// IMPORTANT: These modules must only be imported in server contexts.
// ---------------------------------------------------------------------------

/** Standard CMS modules shared by all tenant clients. */
const CMS_MODULES = {
  bookings,
  availabilityCalendar,
  items,
  members,
  products,
  submissions,
  forms,
  contacts,
  submittedContact,
  conversations,
  messages,
} as const;

/** Admin-only modules (CRM, Inbox). */
const ADMIN_MODULES = {
  contacts,
  submittedContact,
  conversations,
  messages,
} as const;

function buildOAuthClient(siteId: string | undefined) {
  const clientId = process.env.WIX_CLIENT_ID;
  const clientSecret = process.env.WIX_CLIENT_SECRET;

  // Fall back to env-based siteId when none provided (backward compat / www)
  const resolvedSiteId =
    siteId ||
    process.env.WIX_META_SITE_ID ||
    process.env.WIX_SITE_ID ||
    process.env.NEXT_PUBLIC_WIX_SITE_ID;

  if (!clientId) {
    console.warn(
      "[Wix Client] Missing WIX_CLIENT_ID — Wix Headless client will not be initialized",
    );
    return null;
  }

  if (!clientSecret) {
    console.warn(
      "[Wix Client] WIX_CLIENT_SECRET is not set — OAuth may fail for protected collections",
    );
  }

  if (resolvedSiteId && resolvedSiteId === clientId) {
    console.warn(
      "[Wix Client] siteId equals WIX_CLIENT_ID — these should be different values.",
    );
  }

  const authConfig: Record<string, string> = { clientId };
  if (clientSecret) authConfig.clientSecret = clientSecret;
  if (resolvedSiteId && resolvedSiteId !== clientId) authConfig.siteId = resolvedSiteId;

  return createClient({
    modules: CMS_MODULES,
    auth: OAuthStrategy(authConfig as any),
  });
}

function buildAdminClient(siteId: string | undefined) {
  const apiKey = process.env.WIX_API_KEY;
  const accountId = process.env.WIX_ACCOUNT_ID;
  const resolvedSiteId = siteId || process.env.WIX_META_SITE_ID || undefined;

  if (!apiKey || !accountId) {
    return null;
  }

  return createClient({
    modules: ADMIN_MODULES,
    auth: ApiKeyStrategy({
      apiKey,
      accountId,
      ...(resolvedSiteId ? { siteId: resolvedSiteId } : {}),
    }),
  });
}

// ── Singleton cache for the default (www) tenant ───────────────────────────
let _defaultClient: ReturnType<typeof buildOAuthClient> | undefined;
let _defaultAdminClient: ReturnType<typeof buildAdminClient> | undefined;

// ── Per-tenant client cache (avoids re-creating on every request) ──────────
const _tenantClients = new Map<string, ReturnType<typeof buildOAuthClient>>();
const _tenantAdminClients = new Map<string, ReturnType<typeof buildAdminClient>>();

/**
 * Get a Wix OAuth client. When `siteId` is provided, returns a tenant-specific
 * client (cached). Without `siteId`, returns the default singleton (www).
 */
export function wixClient(siteId?: string) {
  if (!siteId) {
    if (_defaultClient === undefined) {
      _defaultClient = buildOAuthClient(undefined);
    }
    return _defaultClient;
  }

  if (!_tenantClients.has(siteId)) {
    _tenantClients.set(siteId, buildOAuthClient(siteId));
  }
  return _tenantClients.get(siteId)!;
}

/**
 * Get a Wix Admin client. When `siteId` is provided, returns a tenant-specific
 * client (cached). Without `siteId`, returns the default singleton (www).
 */
export function wixAdminClient(siteId?: string) {
  if (!siteId) {
    if (_defaultAdminClient === undefined) {
      _defaultAdminClient = buildAdminClient(undefined);
    }
    return _defaultAdminClient;
  }

  if (!_tenantAdminClients.has(siteId)) {
    _tenantAdminClients.set(siteId, buildAdminClient(siteId));
  }
  return _tenantAdminClients.get(siteId)!;
}

export type WixClient = NonNullable<ReturnType<typeof wixClient>>;
export type WixAdminClient = NonNullable<ReturnType<typeof wixAdminClient>>;
