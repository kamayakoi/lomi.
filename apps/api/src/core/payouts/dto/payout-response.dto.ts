import { ApiProperty } from '@nestjs/swagger';

export class PayoutResponseDto {
  @ApiProperty({ example: 'string', type: String })
  account_id: string;

  @ApiProperty({ example: 123, type: Number })
  amount: number;

  @ApiProperty({ example: 'string', type: String })
  created_at: string;

  @ApiProperty({ example: 'string', type: String })
  created_by: string;

  @ApiProperty({ example: 'string', type: String })
  currency_code: string;

  @ApiProperty({ example: 'string', type: String })
  environment: string;

  @ApiProperty({ example: {}, type: Object })
  metadata: any;

  @ApiProperty({ example: 'string', type: String })
  organization_id: string;

  @ApiProperty({ example: 'string', type: String })
  payout_id: string;

  @ApiProperty({ example: 'string', type: String })
  payout_method_id: string;

  @ApiProperty({ example: 'string', type: String })
  provider_code: string;

  @ApiProperty({ example: 'string', type: String })
  status: string;

  @ApiProperty({ example: 'string', type: String })
  updated_at: string;
}
