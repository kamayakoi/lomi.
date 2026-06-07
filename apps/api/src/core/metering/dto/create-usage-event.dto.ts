import { ApiProperty } from '@nestjs/swagger';

export class CreateUsageEventDto {
  @ApiProperty({
    example: 'evt_abc123',
    description: 'Idempotency key — unique per organization',
  })
  transaction_id: string;

  @ApiProperty({
    example: 'api_calls',
    description: 'Billable metric code (matches meter name)',
  })
  code: string;

  @ApiProperty({ description: 'Customer being billed' })
  customer_id: string;

  @ApiProperty({
    required: false,
    description: 'Optional usage subscription anchor',
  })
  subscription_id?: string;

  @ApiProperty({
    required: false,
    example: '2025-06-01T12:00:00Z',
    description: 'When usage occurred (defaults to now)',
  })
  timestamp?: string;

  @ApiProperty({
    required: false,
    example: 1,
    description: 'Usage units (defaults to 1)',
  })
  quantity?: number;

  @ApiProperty({
    required: false,
    example: { quantity: 5, region: 'sn' },
    description: 'Additional properties for sum aggregation',
  })
  properties?: Record<string, unknown>;
}

export class UsageEventResponseDto {
  @ApiProperty()
  event_id: string;

  @ApiProperty({ enum: ['pending', 'processed', 'failed'] })
  status: string;

  @ApiProperty({ required: false })
  meter_id?: string;

  @ApiProperty({ required: false })
  subscription_id?: string;

  @ApiProperty({ required: false })
  quantity_applied?: number;
}
