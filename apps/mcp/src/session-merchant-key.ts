import type { Request } from 'express';

import { getMcpHttpBearerToken } from './env-config.js';

export function firstHeaderValue(
  value: string | string[] | undefined,
): string | null {
  if (!value) return null;
  if (Array.isArray(value)) return value[0]?.trim() || null;
  return value.trim() || null;
}

/** True for keys issued by our flows (REST secret keys, CLI/MCP connect tokens). */
export function looksLikeLomiApiCredential(token: string): boolean {
  const t = token.trim();
  return t.startsWith('lomi_') && t.length >= 16;
}

/**
 * Resolves the merchant REST credential for this MCP HTTP session.
 *
 * Precedence:
 * 1. `x-lomi-api-key` / `x-api-key`
 * 2. `Authorization: Bearer <credential>` only when it is **not** the hosted MCP
 *    transport secret (`LOMI_MCP_BEARER_TOKEN`) and looks like a `lomi_*` API credential.
 *
 * When `LOMI_MCP_BEARER_TOKEN` is set, clients should prefer headers for the merchant key
 * because `Authorization` is reserved for the MCP transport gate.
 */
export function extractSessionMerchantApiKey(req: Request): string | null {
  const headerKey =
    firstHeaderValue(req.headers['x-lomi-api-key']) ??
    firstHeaderValue(req.headers['x-api-key']);
  if (headerKey && headerKey.length > 0) return headerKey;

  const transportToken = getMcpHttpBearerToken();
  const auth = firstHeaderValue(req.headers.authorization);
  if (!auth?.startsWith('Bearer ')) return null;
  const bearer = auth.slice('Bearer '.length).trim();
  if (!bearer) return null;
  if (transportToken && bearer === transportToken) return null;
  if (looksLikeLomiApiCredential(bearer)) return bearer;
  return null;
}
