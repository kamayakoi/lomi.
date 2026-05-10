/**
 * Must match ThrottlerModule `ttl` in app.module and open-api-export.module (milliseconds).
 * Used for Retry-After and agent-facing rate limit documentation.
 */
export const THROTTLE_TTL_MS = 900_000;
export const THROTTLE_LIMIT = 5000;

/**
 * Stricter window for Tier-1 write routes (checkout / payment-requests) via @Throttle().
 * Must stay in sync with those controller decorators.
 */
export const WRITE_THROTTLE_TTL_MS = 60_000;
export const WRITE_THROTTLE_LIMIT = 120;

export function throttleRetryAfterSeconds(): number {
  return Math.max(1, Math.ceil(THROTTLE_TTL_MS / 1000));
}

export function writeThrottleRetryAfterSeconds(): number {
  return Math.max(1, Math.ceil(WRITE_THROTTLE_TTL_MS / 1000));
}
