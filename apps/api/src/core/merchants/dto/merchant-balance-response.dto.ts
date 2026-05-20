import { ApiProperty } from '@nestjs/swagger';

export class MerchantBalanceResponseDto {
  @ApiProperty({ type: String })
  merchant_id: string;

  @ApiProperty({ example: 'XOF', type: String })
  currency_code: string;

  @ApiProperty({ type: Number })
  balance: number;

  @ApiProperty({ type: String })
  as_of_date: string;
}
