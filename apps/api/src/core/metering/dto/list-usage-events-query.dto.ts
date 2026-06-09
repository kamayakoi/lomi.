import { ApiProperty } from '@nestjs/swagger';

export class ListUsageEventsQueryDto {
  @ApiProperty({ required: false, default: 1 })
  page?: number;

  @ApiProperty({ required: false, default: 50 })
  page_size?: number;

  @ApiProperty({ required: false })
  customer_id?: string;

  @ApiProperty({ required: false })
  code?: string;

  @ApiProperty({
    required: false,
    enum: ['pending', 'processed', 'failed'],
  })
  status?: string;
}
