import { ApiProperty } from '@nestjs/swagger';

export class CreateUsageSubscriptionDto {
  @ApiProperty({ description: 'Customer to enroll' })
  customer_id: string;

  @ApiProperty({ description: 'usage_based product id' })
  product_id: string;

  @ApiProperty({ required: false, description: 'Price id (defaults to product default price)' })
  price_id?: string;

  @ApiProperty({ required: false })
  metadata?: Record<string, unknown>;
}

export class UsageSubscriptionResponseDto {
  @ApiProperty()
  subscription_id: string;
}
