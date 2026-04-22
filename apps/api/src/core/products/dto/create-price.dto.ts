import { ApiProperty } from '@nestjs/swagger';

export class CreatePriceDto {
  @ApiProperty({
    example: 10000.0,
    description: 'Price amount',
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
    description: 'Billing interval (required for recurring products)',
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
    description: 'Minimum amount (required for pay_what_you_want)',
    required: false,
  })
  minimum_amount?: number;

  @ApiProperty({
    example: 50000.0,
    description: 'Maximum amount (optional for pay_what_you_want)',
    required: false,
  })
  maximum_amount?: number;

  @ApiProperty({
    example: true,
    description: 'Whether this is the default price',
    default: false,
    required: false,
  })
  is_default?: boolean;

  @ApiProperty({
    example: { notes: 'Early bird pricing' },
    description: 'Additional metadata',
    required: false,
  })
  metadata?: Record<string, any>;
}
