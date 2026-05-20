import { BadRequestException } from '@nestjs/common';
import { assertCardChargeReconciliationInput } from './assert-card-charge-reconciliation';

describe('assertCardChargeReconciliationInput', () => {
  it('allows customer_id alone', () => {
    expect(() =>
      assertCardChargeReconciliationInput({
        customer_id: '550e8400-e29b-41d4-a716-446655440000',
      }),
    ).not.toThrow();
  });

  it('allows email + name', () => {
    expect(() =>
      assertCardChargeReconciliationInput({
        customer_email: 'a@b.com',
        customer_name: 'A',
      }),
    ).not.toThrow();
  });

  it('throws when missing all identifiers', () => {
    expect(() => assertCardChargeReconciliationInput({})).toThrow(
      BadRequestException,
    );
  });

  it('throws when only email', () => {
    expect(() =>
      assertCardChargeReconciliationInput({
        customer_email: 'a@b.com',
      }),
    ).toThrow(BadRequestException);
  });

  it('throws when customer_id is not UUID v4', () => {
    expect(() =>
      assertCardChargeReconciliationInput({
        customer_id: 'not-a-uuid',
      }),
    ).toThrow(BadRequestException);
  });
});
