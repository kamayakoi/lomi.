import { ApiProperty } from '@nestjs/swagger';

export class MerchantMrrResponseDto {
  @ApiProperty({ type: String })
  merchant_id: string;

  @ApiProperty({ type: Number })
  mrr: number;

  @ApiProperty({ example: 'XOF', type: String })
  currency_code: string;

  @ApiProperty({ type: String })
  as_of_date: string;
}
