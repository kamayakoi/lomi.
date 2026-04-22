import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentRequestDto {
  @ApiProperty({
    example: 10000.0,
    description: 'Amount to request',
  })
  amount: number;

  @ApiProperty({
    example: 'XOF',
    description: 'Currency code',
    enum: ['XOF', 'USD', 'EUR'],
  })
  currency_code: string;

  @ApiProperty({
    example: 'Invoice #INV-2024-001',
    description: 'Description of the payment request',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Customer ID',
    required: false,
  })
  customer_id?: string;

  @ApiProperty({
    example: '2024-12-31T23:59:59Z',
    description: 'Expiration date/time for the payment request',
  })
  expiry_date: string;

  @ApiProperty({
    example: 'INV-2024-001',
    description: 'Payment reference (invoice number, order ID, etc.)',
    required: false,
  })
  payment_reference?: string;

  @ApiProperty({
    example: { invoice_id: 'INV-2024-001', customer_ref: 'CUST-123' },
    description: 'Additional metadata',
    required: false,
  })
  metadata?: Record<string, any>;
}
