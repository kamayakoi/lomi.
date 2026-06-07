import { ApiProperty } from '@nestjs/swagger';

export class MeterResponseDto {
  @ApiProperty()
  meter_id: string;

  @ApiProperty()
  organization_id: string;

  @ApiProperty({ required: false })
  product_id?: string | null;

  @ApiProperty()
  name: string;

  @ApiProperty()
  filter: Record<string, unknown>;

  @ApiProperty()
  aggregation: Record<string, unknown>;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}

export class MeterBalanceResponseDto {
  @ApiProperty()
  balance_id: string;

  @ApiProperty()
  meter_id: string;

  @ApiProperty()
  customer_id: string;

  @ApiProperty()
  consumed_units: number;

  @ApiProperty()
  credited_units: number;

  @ApiProperty()
  balance: number;

  @ApiProperty({ required: false })
  last_event_id?: string | null;

  @ApiProperty()
  updated_at: string;
}
