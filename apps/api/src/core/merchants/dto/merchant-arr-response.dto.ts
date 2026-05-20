import { ApiProperty } from '@nestjs/swagger';

export class MerchantArrResponseDto {
  @ApiProperty({ type: String })
  merchant_id: string;

  @ApiProperty({ type: Number })
  arr: number;

  @ApiProperty({ example: 'XOF', type: String })
  currency_code: string;

  @ApiProperty({ type: String })
  as_of_date: string;
}
