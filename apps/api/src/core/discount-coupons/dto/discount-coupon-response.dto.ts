import { ApiProperty } from '@nestjs/swagger';

/** Explicit `type` on each field avoids bad inferred metadata from prototype keys. */
export class DiscountCouponResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique coupon identifier',
    type: String,
  })
  coupon_id: string;

  @ApiProperty({
    example: '789e0123-e89b-12d3-a456-426614174000',
    description: 'Organization ID the coupon belongs to',
    type: String,
  })
  organization_id: string;

  @ApiProperty({
    example: 'SAVE20',
    description: 'Unique coupon code',
    type: String,
  })
  code: string;

  @ApiProperty({
    example: 'percentage',
    description: 'Type of discount',
    enum: ['percentage', 'fixed'],
    type: String,
  })
  discount_type: string;

  @ApiProperty({
    example: 20.0,
    description: 'Discount percentage (if discount_type is percentage)',
    nullable: true,
    type: Number,
  })
  discount_percentage: number | null;

  @ApiProperty({
    example: 1000.0,
    description: 'Fixed discount amount (if discount_type is fixed)',
    nullable: true,
    type: Number,
  })
  discount_fixed_amount: number | null;

  @ApiProperty({
    example: 'all',
    description: 'Customer type this coupon applies to',
    enum: ['all', 'new', 'existing'],
    type: String,
  })
  customer_type: string;

  @ApiProperty({
    example: true,
    description: 'Whether the coupon is currently active',
    type: Boolean,
  })
  is_active: boolean;

  @ApiProperty({
    example: 100,
    description: 'Maximum number of times this coupon can be used',
    nullable: true,
    type: Number,
  })
  max_uses: number | null;

  @ApiProperty({
    example: 5,
    description: 'Maximum quantity allowed per use',
    nullable: true,
    type: Number,
  })
  max_quantity_per_use: number | null;

  @ApiProperty({
    example: 25,
    description: 'Current number of times this coupon has been used',
    type: Number,
  })
  current_uses: number;

  @ApiProperty({
    example: 'total',
    description: 'Usage frequency limit type',
    enum: ['total', 'per_customer', 'per_customer_per_product'],
    type: String,
  })
  usage_frequency_limit: string;

  @ApiProperty({
    example: 1,
    description: 'Usage limit value (for per_customer limits)',
    nullable: true,
    type: Number,
  })
  usage_limit_value: number | null;

  @ApiProperty({
    example: '2024-12-31T23:59:59Z',
    description: 'When the coupon expires',
    nullable: true,
    type: String,
  })
  expires_at: string | null;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: 'When the coupon becomes valid',
    nullable: true,
    type: String,
  })
  valid_from: string | null;

  @ApiProperty({
    example: '20% off all products',
    description: 'Coupon description',
    nullable: true,
    type: String,
  })
  description: string | null;

  @ApiProperty({
    example: 'organization_wide',
    description: 'Scope of the coupon',
    enum: ['organization_wide', 'specific_products', 'specific_prices'],
    type: String,
  })
  scope_type: string;

  @ApiProperty({
    example: ['one_time', 'recurring'],
    description: 'Product types this coupon applies to',
    nullable: true,
    type: String,
    isArray: true,
  })
  applies_to_product_types: string[] | null;

  @ApiProperty({
    example: 'live',
    description: 'Environment (test or live)',
    enum: ['test', 'live'],
    type: String,
  })
  environment: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'When the coupon was created',
    type: String,
  })
  created_at: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'When the coupon was last updated',
    type: String,
  })
  updated_at: string;
}
