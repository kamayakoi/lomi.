import { ApiProperty } from '@nestjs/swagger';

export class InvoiceLineItemDto {
  @ApiProperty({ example: 'Monthly service', required: false })
  name?: string;

  @ApiProperty({ example: 'Monthly service', required: false })
  description?: string;

  @ApiProperty({ example: 1, default: 1 })
  quantity?: number;

  @ApiProperty({ example: 5000, required: false })
  price?: number;

  @ApiProperty({ example: 5000, required: false })
  unit_price?: number;

  @ApiProperty({ example: 5000, required: false })
  amount?: number;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  product_id?: string;

  @ApiProperty({ example: '321e4567-e89b-12d3-a456-426614174000', required: false })
  price_id?: string;

  @ApiProperty({ required: false, additionalProperties: true })
  metadata?: Record<string, unknown>;
}

export class CreateInvoiceDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  customer_id: string;

  @ApiProperty({ example: 10000 })
  amount?: number;

  @ApiProperty({ example: 'XOF', enum: ['XOF', 'USD', 'EUR'], default: 'XOF' })
  currency_code?: string;

  @ApiProperty({ example: '2026-06-30', required: false })
  due_date?: string;

  @ApiProperty({
    example: 'manual',
    enum: [
      'manual',
      'one_time_product',
      'recurring_subscription',
      'usage_billing',
      'failed_renewal',
    ],
    required: false,
  })
  origin?: string;

  @ApiProperty({ example: 'INV-2026-0001', required: false })
  invoice_number?: string;

  @ApiProperty({ example: 'Consulting services', required: false })
  description?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  product_id?: string;

  @ApiProperty({ example: '321e4567-e89b-12d3-a456-426614174000', required: false })
  price_id?: string;

  @ApiProperty({ example: '654e7890-e89b-12d3-a456-426614174000', required: false })
  subscription_id?: string;

  @ApiProperty({ type: [InvoiceLineItemDto], required: false })
  line_items?: InvoiceLineItemDto[];

  @ApiProperty({ required: false, additionalProperties: true })
  customer_details?: Record<string, unknown>;

  @ApiProperty({ required: false, additionalProperties: true })
  payment_details?: Record<string, unknown>;

  @ApiProperty({ required: false, additionalProperties: true })
  template?: Record<string, unknown>;

  @ApiProperty({ required: false, additionalProperties: true })
  metadata?: Record<string, unknown>;
}
