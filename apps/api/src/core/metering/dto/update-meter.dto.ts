import { ApiProperty } from '@nestjs/swagger';

export class UpdateMeterDto {
  @ApiProperty({ required: false })
  filter?: Record<string, unknown>;

  @ApiProperty({ required: false })
  aggregation?: Record<string, unknown>;

  @ApiProperty({ required: false })
  is_active?: boolean;
}
