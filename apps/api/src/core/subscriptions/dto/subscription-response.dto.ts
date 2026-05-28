import { ApiProperty } from '@nestjs/swagger';

/** Explicit `type` on each field avoids bad inferred metadata from prototype keys. */
export class SubscriptionResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique subscription identifier',
    type: String,
  })
  subscription_id: string;

  @ApiProperty({
    example: '789e0123-e89b-12d3-a456-426614174000',
    description: 'Organization ID',
    type: String,
  })
  organization_id: string;

  @ApiProperty({
    example: '456e7890-e89b-12d3-a456-426614174000',
    description: 'Product ID (recurring product)',
    type: String,
  })
  product_id: string;

  @ApiProperty({
    example: '321e4567-e89b-12d3-a456-426614174000',
    description: 'Price ID used for this subscription',
    nullable: true,
    type: String,
  })
  price_id: string | null;

  @ApiProperty({
    example: '654e7890-e89b-12d3-a456-426614174000',
    description: 'Customer ID',
    type: String,
  })
  customer_id: string;

  @ApiProperty({
    example: 'active',
    description: 'Subscription status',
    enum: [
      'pending',
      'active',
      'past_due',
      'cancelled',
      'trial',
      'paused',
      'expired',
    ],
    type: String,
  })
  status: string;

  @ApiProperty({
    example: '2024-01-15',
    description: 'Subscription start date',
    type: String,
  })
  start_date: string;

  @ApiProperty({
    example: '2024-12-31',
    description: 'Subscription end date (set when cancelled)',
    nullable: true,
    type: String,
  })
  end_date: string | null;

  @ApiProperty({
    example: '2024-02-15',
    description: 'Next billing date (system-managed)',
    nullable: true,
    type: String,
  })
  next_billing_date: string | null;

  @ApiProperty({
    example: { notes: 'Premium plan' },
    description: 'Additional metadata as JSON',
    nullable: true,
    type: Object,
  })
  metadata: Record<string, any> | null;

  @ApiProperty({
    example: 'live',
    description: 'Environment (test or live)',
    enum: ['test', 'live'],
    type: String,
  })
  environment: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'When the subscription was created',
    type: String,
  })
  created_at: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'When the subscription was last updated',
    type: String,
  })
  updated_at: string;
}
