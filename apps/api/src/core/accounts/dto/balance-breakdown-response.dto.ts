import { ApiProperty } from '@nestjs/swagger';

export class BalanceBreakdownResponseDto {
  @ApiProperty({ example: 'XOF', description: 'Currency code', type: String })
  currency_code: string;

  @ApiProperty({
    example: 100000.0,
    description: 'Available balance',
    type: Number,
  })
  available_balance: number;

  @ApiProperty({
    example: 5000.0,
    description: 'Pending balance',
    type: Number,
  })
  pending_balance: number;

  @ApiProperty({
    example: 105000.0,
    description: 'Total balance (available + pending)',
    type: Number,
  })
  total_balance: number;

  @ApiProperty({
    example: 165.0,
    description: 'Converted available balance',
    required: false,
    type: Number,
  })
  converted_available_balance?: number;

  @ApiProperty({
    example: 8.25,
    description: 'Converted pending balance',
    required: false,
    type: Number,
  })
  converted_pending_balance?: number;

  @ApiProperty({
    example: 173.25,
    description: 'Converted total balance',
    required: false,
    type: Number,
  })
  converted_total_balance?: number;

  @ApiProperty({
    example: 'USD',
    description: 'Target currency for conversion',
    type: String,
  })
  target_currency: string;
}
