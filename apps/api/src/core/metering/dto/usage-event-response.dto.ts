import { ApiProperty } from '@nestjs/swagger';

export class UsageEventListItemDto {
  @ApiProperty()
  event_id: string;

  @ApiProperty()
  transaction_id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  customer_id: string;

  @ApiProperty({ required: false })
  subscription_id?: string | null;

  @ApiProperty({ required: false })
  meter_id?: string | null;

  @ApiProperty()
  quantity: number;

  @ApiProperty({ enum: ['pending', 'processed', 'failed'] })
  processing_status: string;

  @ApiProperty({ required: false })
  error_message?: string | null;

  @ApiProperty()
  occurred_at: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty({ required: false })
  total_count?: number;
}
