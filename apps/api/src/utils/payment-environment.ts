export type LomiPaymentEnvironment = 'live' | 'test';

/** Normalize DB / API / payload values to ledger environment (default live). */
export function normalizePaymentEnvironment(
  value: unknown,
): LomiPaymentEnvironment {
  return typeof value === 'string' &&
    value.toLowerCase().trim() === 'test'
    ? 'test'
    : 'live';
}

/** Pick merchant webhook URLs from outbound transaction/event payload. */
export function resolveMerchantWebhookRelayEnvironment(
  data: unknown,
): LomiPaymentEnvironment {
  if (data && typeof data === 'object' && 'environment' in data) {
    return normalizePaymentEnvironment(
      (data as { environment?: unknown }).environment,
    );
  }
  return 'live';
}
