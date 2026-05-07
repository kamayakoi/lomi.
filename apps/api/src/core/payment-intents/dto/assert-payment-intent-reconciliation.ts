import { BadRequestException } from '@nestjs/common';

/** UUID v4 pattern (relaxed case). */
export const PAYMENT_INTENT_UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const EMAIL_LIKE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function assertPaymentIntentReconciliationInput(dto: {
  customer_id?: string;
  customer_email?: string;
  customer_name?: string;
}): void {
  const id = dto.customer_id?.trim();
  if (id) {
    if (!PAYMENT_INTENT_UUID_V4.test(id)) {
      throw new BadRequestException('customer_id must be a UUID v4');
    }
    return;
  }

  const email = dto.customer_email?.trim();
  const name = dto.customer_name?.trim();

  if (!email || !EMAIL_LIKE.test(email)) {
    throw new BadRequestException(
      'Provide customer_id, or customer_email and customer_name with a valid email.',
    );
  }
  if (!name) {
    throw new BadRequestException(
      'Provide customer_id, or both customer_email and customer_name so the payment can be reconciled.',
    );
  }
}

export function assertOptionalUuid(field: string, value?: string): void {
  const v = value?.trim();
  if (!v) return;
  if (!PAYMENT_INTENT_UUID_V4.test(v)) {
    throw new BadRequestException(`${field} must be a UUID v4`);
  }
}
