import { ApiProperty } from '@nestjs/swagger';

export class AccountBalanceResponseDto {
  @ApiProperty({ example: 'XOF', description: 'Currency code', type: String })
  currency_code: string;

  @ApiProperty({ example: 100000.0, description: 'Account balance', type: Number })
  balance: number;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: 'Last updated timestamp',
    type: String,
  })
  last_updated: string;
}
