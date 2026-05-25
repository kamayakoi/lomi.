import { ApiProperty } from '@nestjs/swagger';

/** Explicit `type` on each field avoids bad inferred metadata from prototype keys. */
export class PriceResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique price identifier',
    type: String,
  })
  price_id: string;

  @ApiProperty({
    example: 10000.0,
    description:
      'Price amount. For standard/tiered: fixed unit price. For pay_what_you_want: suggested unit price pre-filled at checkout.',
    type: Number,
  })
  amount: number;

  @ApiProperty({
    example: 'XOF',
    description: 'Currency code',
    enum: ['XOF', 'USD', 'EUR'],
    type: String,
  })
  currency_code: string;

  @ApiProperty({
    example: 'month',
    description: 'Billing interval for recurring products',
    enum: ['day', 'week', 'month', 'year'],
    nullable: true,
    type: String,
  })
  billing_interval: string | null;

  @ApiProperty({
    example: 'standard',
    description: 'Pricing model',
    enum: ['standard', 'pay_what_you_want', 'tiered'],
    type: String,
  })
  pricing_model: string;

  @ApiProperty({
    example: 5000.0,
    description:
      'Lowest unit price the customer may pay (pay_what_you_want only).',
    nullable: true,
    type: Number,
  })
  minimum_amount: number | null;

  @ApiProperty({
    example: 50000.0,
    description:
      'Optional upper bound on unit price (pay_what_you_want only).',
    nullable: true,
    type: Number,
  })
  maximum_amount: number | null;

  @ApiProperty({
    example: true,
    description: 'Whether this price is active',
    type: Boolean,
  })
  is_active: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether this is the default price',
    type: Boolean,
  })
  is_default: boolean;

  @ApiProperty({
    example: { notes: 'Early bird pricing' },
    description: 'Additional metadata',
    nullable: true,
    type: Object,
  })
  metadata: Record<string, any> | null;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'When the price was created',
    type: String,
  })
  created_at: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'When the price was last updated',
    type: String,
  })
  updated_at: string;
}
