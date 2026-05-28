import { BadRequestException, ConflictException } from '@nestjs/common';

const LINE_ITEM_ERROR_CODES = [
  'line_items_recurring_not_supported',
  'line_items_pwyw_not_supported',
  'line_items_usage_based_not_supported',
  'line_items_mixed_product_types',
] as const;

/** Maps Postgres RPC sentinel messages to Nest HTTP exceptions. */
export function throwMappedSupabaseRpcError(message: string): never {
  if (message.includes('idempotency_key_conflict')) {
    throw new ConflictException(
      'Idempotency-Key was reused with a different request payload',
    );
  }
  if (message.includes('idempotency_fingerprint_required')) {
    throw new BadRequestException(
      'Invalid idempotency fingerprint for Idempotency-Key header',
    );
  }

  for (const code of LINE_ITEM_ERROR_CODES) {
    if (message.includes(code)) {
      throw new BadRequestException({
        message: `Checkout line_items rejected: ${code.replace(/^line_items_/, '').replace(/_/g, ' ')}`,
        code,
      });
    }
  }

  throw new Error(message);
}
