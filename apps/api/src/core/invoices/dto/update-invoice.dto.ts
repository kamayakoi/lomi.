import { ApiProperty } from '@nestjs/swagger';
import { InvoiceLineItemDto } from './create-invoice.dto';

export class UpdateInvoiceDto {
  @ApiProperty({ example: '2026-06-30', required: false })
  due_date?: string;

  @ApiProperty({
    example: 'sent',
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    required: false,
  })
  status?: string;

  @ApiProperty({ example: 'Updated invoice note', required: false })
  description?: string;

  @ApiProperty({ example: 10000, required: false })
  amount?: number;

  @ApiProperty({ example: 10000, required: false })
  amount_due?: number;

  @ApiProperty({ type: [InvoiceLineItemDto], required: false })
  line_items?: InvoiceLineItemDto[];

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  customer_id?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  product_id?: string;

  @ApiProperty({
    example: '321e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  price_id?: string;

  @ApiProperty({
    example: '654e7890-e89b-12d3-a456-426614174000',
    required: false,
  })
  subscription_id?: string;

  @ApiProperty({ required: false, additionalProperties: true })
  metadata?: Record<string, unknown>;
}
