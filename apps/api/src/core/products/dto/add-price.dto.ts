import { ApiProperty } from '@nestjs/swagger';

export class AddPriceDto {
  @ApiProperty({
    example: 10000.0,
    description:
      'Price amount. For standard/tiered: fixed unit price. For pay_what_you_want: suggested unit price pre-filled at checkout (defaults to minimum_amount if omitted).',
  })
  amount: number;

  @ApiProperty({
    example: 'XOF',
    description: 'Currency code',
    enum: ['XOF', 'USD', 'EUR'],
  })
  currency_code: string;

  @ApiProperty({
    example: 'month',
    description: 'Billing interval (must match product type)',
    enum: ['day', 'week', 'month', 'year'],
    required: false,
  })
  billing_interval?: string;

  @ApiProperty({
    example: 'standard',
    description: 'Pricing model',
    enum: ['standard', 'pay_what_you_want', 'tiered'],
    default: 'standard',
    required: false,
  })
  pricing_model?: string;

  @ApiProperty({
    example: 5000.0,
    description:
      'Lowest unit price the customer may pay. Required when pricing_model is pay_what_you_want.',
    required: false,
  })
  minimum_amount?: number;

  @ApiProperty({
    example: 50000.0,
    description:
      'Optional upper bound on unit price when pricing_model is pay_what_you_want.',
    required: false,
  })
  maximum_amount?: number;

  @ApiProperty({
    example: false,
    description: 'Whether to set as default price',
    default: false,
    required: false,
  })
  is_default?: boolean;

  @ApiProperty({
    example: { notes: 'Holiday special pricing' },
    description: 'Additional metadata',
    required: false,
  })
  metadata?: Record<string, any>;
}
