import { BadRequestException, ConflictException } from '@nestjs/common';

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
  throw new Error(message);
}
