/**
 * Shared environment helpers for MCP runtime (stdio + HTTP).
 */

export function getLomiApiBaseUrl(): string {
  const u =
    process.env.LOMI_API_BASE_URL ??
    process.env.LOMI_API_URL ??
    'https://api.lomi.africa';
  const trimmed = u.replace(/\/$/, '');
  assertOutboundHostnameAllowed(trimmed);
  return trimmed;
}

function assertOutboundHostnameAllowed(baseUrl: string): void {
  const raw = process.env.LOMI_API_BASE_URL_ALLOWLIST?.trim();
  if (!raw) return;
  const allowed = new Set(
    raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  );
  let hostname: string;
  try {
    hostname = new URL(baseUrl).hostname;
  } catch {
    throw new Error(
      `Invalid LOMI_API_BASE_URL for outbound calls: "${baseUrl}"`,
    );
  }
  if (!allowed.has(hostname)) {
    throw new Error(
      `Outbound API hostname "${hostname}" not allowed by LOMI_API_BASE_URL_ALLOWLIST`,
    );
  }
}

/** Cached merchant API key once resolved (never caches absence). */
let cachedPositiveMerchantKey: string | undefined;

/** Reads merchant REST API key from env (empty/absent returns null). */
export function getOptionalMerchantApiKey(): string | null {
  if (cachedPositiveMerchantKey !== undefined) {
    return cachedPositiveMerchantKey;
  }
  const key =
    process.env.LOMI_API_KEY ??
    process.env.X_API_KEY ??
    process.env.LOMI_SECRET_KEY;
  if (!key || key.trim() === '') {
    return null;
  }
  cachedPositiveMerchantKey = key.trim();
  return cachedPositiveMerchantKey;
}

export type McpTransportMode = 'stdio' | 'http';

export function getTransportMode(): McpTransportMode {
  const t = (process.env.LOMI_MCP_TRANSPORT ?? 'stdio').toLowerCase();
  if (t === 'http' || t === 'stdio') return t as McpTransportMode;
  throw new Error(
    `Invalid LOMI_MCP_TRANSPORT="${process.env.LOMI_MCP_TRANSPORT}". Use "stdio" or "http".`,
  );
}

export function listenHostOptions(): {
  host: string;
  allowedHosts?: string[];
} {
  // HTTP entrypoint should be reachable by platform health checks even when
  // LOMI_MCP_TRANSPORT is unset (e.g. start:http deployments on Railway).
  const host = process.env.LOMI_MCP_HTTP_HOST?.trim() || '0.0.0.0';
  const raw = process.env.LOMI_MCP_ALLOWED_HOSTS?.trim();
  if (!raw) {
    return { host };
  }
  const allowedHosts = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return { host, allowedHosts };
}

export function httpListenPort(): number {
  const p = Number(process.env.PORT ?? process.env.LOMI_MCP_HTTP_PORT ?? '3333');
  if (!Number.isFinite(p) || p < 0 || p > 65535) {
    throw new Error(
      `Invalid PORT / LOMI_MCP_HTTP_PORT: "${process.env.PORT ?? process.env.LOMI_MCP_HTTP_PORT}"`,
    );
  }
  return p;
}

export function mcpHttpBasePath(): string {
  const p =
    process.env.LOMI_MCP_HTTP_PATH?.trim() ||
    process.env.MCP_HTTP_PATH?.trim() ||
    '/mcp';
  return p.startsWith('/') ? p : `/${p}`;
}

/** Optional Bearer gate for hosted MCP HTTP (recommended in production). */
export function getMcpHttpBearerToken(): string | null {
  const t = process.env.LOMI_MCP_BEARER_TOKEN?.trim();
  return t && t.length > 0 ? t : null;
}
