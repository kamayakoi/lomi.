import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEnum,
  IsArray,
  IsDateString,
  Min,
  Max,
  ValidateIf,
} from 'class-validator';

export class CreateDiscountCouponDto {
  @ApiProperty({
    example: 'SAVE20',
    description: 'Unique coupon code (will be uppercased)',
  })
  @IsString()
  code: string;

  @ApiProperty({
    example: 'percentage',
    description: 'Type of discount',
    enum: ['percentage', 'fixed'],
    default: 'percentage',
  })
  @IsEnum(['percentage', 'fixed'])
  @IsOptional()
  discount_type?: string;

  @ApiProperty({
    example: 20.0,
    description:
      'Discount percentage (required if discount_type is percentage, must be between 0 and 100)',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @ValidateIf((o) => o.discount_type === 'percentage')
  @IsOptional()
  discount_percentage?: number;

  @ApiProperty({
    example: 1000.0,
    description:
      'Fixed discount amount (required if discount_type is fixed, must be positive)',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @ValidateIf((o) => o.discount_type === 'fixed')
  @IsOptional()
  discount_fixed_amount?: number;

  @ApiProperty({
    example: 'all',
    description: 'Customer type this coupon applies to',
    enum: ['all', 'new', 'existing'],
    default: 'all',
    required: false,
  })
  @IsEnum(['all', 'new', 'existing'])
  @IsOptional()
  customer_type?: string;

  @ApiProperty({
    example: 'total',
    description: 'Usage frequency limit type',
    enum: ['total', 'per_customer', 'per_customer_per_product'],
    default: 'total',
    required: false,
  })
  @IsEnum(['total', 'per_customer', 'per_customer_per_product'])
  @IsOptional()
  usage_frequency_limit?: string;

  @ApiProperty({
    example: 1,
    description:
      'Usage limit value (required if usage_frequency_limit is not "total")',
    required: false,
  })
  @IsNumber()
  @Min(1)
  @ValidateIf((o) => o.usage_frequency_limit !== 'total')
  @IsOptional()
  usage_limit_value?: number;

  @ApiProperty({
    example: '20% off all products',
    description: 'Coupon description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the coupon is active',
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    example: 100,
    description: 'Maximum number of times this coupon can be used',
    required: false,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  max_uses?: number;

  @ApiProperty({
    example: 5,
    description: 'Maximum quantity allowed per use',
    required: false,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  max_quantity_per_use?: number;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: 'When the coupon becomes valid',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  valid_from?: string;

  @ApiProperty({
    example: '2024-12-31T23:59:59Z',
    description: 'When the coupon expires',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  expires_at?: string;

  @ApiProperty({
    example: 'organization_wide',
    description: 'Scope of the coupon',
    enum: ['organization_wide', 'specific_products', 'specific_prices'],
    default: 'organization_wide',
    required: false,
  })
  @IsEnum(['organization_wide', 'specific_products', 'specific_prices'])
  @IsOptional()
  scope_type?: string;

  @ApiProperty({
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    description:
      'Product IDs this coupon applies to (only used if scope_type is specific_products or specific_prices)',
    required: false,
    type: String,
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  product_ids?: string[];
}
