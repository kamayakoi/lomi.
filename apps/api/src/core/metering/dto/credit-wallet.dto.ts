import { ApiProperty } from '@nestjs/swagger';

export class CreditWalletDto {
  @ApiProperty()
  meter_id: string;

  @ApiProperty()
  customer_id: string;

  @ApiProperty({ example: 100 })
  units: number;

  @ApiProperty({ required: false })
  reason?: string;
}
