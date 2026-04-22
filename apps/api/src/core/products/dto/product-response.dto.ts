import { ApiProperty } from '@nestjs/swagger';
import { PriceResponseDto } from './price-response.dto';

/** Explicit `type` on each field avoids bad inferred metadata from prototype keys. */
export class ProductResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique product identifier',
    type: String,
  })
  product_id: string;

  @ApiProperty({
    example: '789e0123-e89b-12d3-a456-426614174000',
    description: 'Organization ID',
    type: String,
  })
  organization_id: string;

  @ApiProperty({
    example: 'Premium Subscription',
    description: 'Product name',
    type: String,
  })
  name: string;

  @ApiProperty({
    example: 'Access to all premium features',
    description: 'Product description',
    nullable: true,
    type: String,
  })
  description: string | null;

  @ApiProperty({
    example: 'recurring',
    description: 'Product type',
    enum: ['one_time', 'recurring', 'usage_based'],
    type: String,
  })
  product_type: string;

  @ApiProperty({
    example: ['https://example.com/image.png'],
    description: 'Product images URLs',
    nullable: true,
    type: String,
    isArray: true,
  })
  images: string[] | null;

  @ApiProperty({
    example: true,
    description: 'Whether the product is active',
    type: Boolean,
  })
  is_active: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether to display on storefront',
    type: Boolean,
  })
  display_on_storefront: boolean;

  @ApiProperty({
    example: { category: 'subscription' },
    description: 'Additional metadata',
    nullable: true,
    type: Object,
  })
  metadata: Record<string, any> | null;

  @ApiProperty({
    example: 'pause',
    description: 'Action to take on failed payment',
    enum: ['pause', 'cancel', 'retry'],
    nullable: true,
    type: String,
  })
  failed_payment_action: string | null;

  @ApiProperty({
    example: 1,
    description: 'Day of month to charge (1-31)',
    nullable: true,
    type: Number,
  })
  charge_day: number | null;

  @ApiProperty({
    example: 'initial',
    description: 'When to charge first payment',
    enum: ['initial', 'non_initial', 'prorated'],
    nullable: true,
    type: String,
  })
  first_payment_type: string | null;

  @ApiProperty({
    example: false,
    description: 'Whether trial is enabled',
    type: Boolean,
  })
  trial_enabled: boolean;

  @ApiProperty({
    example: 14,
    description: 'Trial period in days',
    nullable: true,
    type: Number,
  })
  trial_period_days: number | null;

  @ApiProperty({
    example: 'sum',
    description: 'Usage aggregation method',
    enum: ['sum', 'max', 'last_during_period', 'last_ever'],
    nullable: true,
    type: String,
  })
  usage_aggregation: string | null;

  @ApiProperty({
    example: 'api_calls',
    description: 'Unit of usage measurement',
    nullable: true,
    type: String,
  })
  usage_unit: string | null;

  @ApiProperty({
    example: 'live',
    description: 'Environment',
    enum: ['test', 'live'],
    type: String,
  })
  environment: string;

  @ApiProperty({
    type: () => PriceResponseDto,
    isArray: true,
    description: 'Product prices',
  })
  prices: PriceResponseDto[];

  @ApiProperty({
    example: [],
    description: 'Associated fees',
    isArray: true,
    type: Object,
  })
  fees: any[];

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'When the product was created',
    type: String,
  })
  created_at: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'When the product was last updated',
    type: String,
  })
  updated_at: string;
}
