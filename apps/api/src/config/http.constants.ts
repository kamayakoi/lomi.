/**
 * Must match ThrottlerModule `ttl` in app.module and open-api-export.module (milliseconds).
 * Used for Retry-After and agent-facing rate limit documentation.
 */
export const THROTTLE_TTL_MS = 900_000;
export const THROTTLE_LIMIT = 5000;

export function throttleRetryAfterSeconds(): number {
  return Math.max(1, Math.ceil(THROTTLE_TTL_MS / 1000));
}
