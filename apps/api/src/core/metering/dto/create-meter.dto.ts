import { ApiProperty } from '@nestjs/swagger';

export class CreateMeterDto {
  @ApiProperty({
    example: 'api_calls',
    description: 'Unique meter code (slug) per organization',
  })
  name: string;

  @ApiProperty({
    required: false,
    description: 'Optional usage_based product this meter bills against',
  })
  product_id?: string;

  @ApiProperty({
    required: false,
    example: { code: 'api_calls' },
    description: 'Event matching filter',
  })
  filter?: Record<string, unknown>;

  @ApiProperty({
    required: false,
    example: { type: 'sum', property: 'quantity' },
    description:
      'Aggregation config: sum, count, max, last_during_period, last_ever',
  })
  aggregation?: Record<string, unknown>;
}
