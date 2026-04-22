import { ApiProperty } from '@nestjs/swagger';

export class RefundResponseDto {
  @ApiProperty({ example: 123, type: Number })
  amount: number;

  @ApiProperty({ example: 'string', type: String })
  created_at: string;

  @ApiProperty({ example: 'string', type: String })
  environment: string;

  @ApiProperty({ example: 123, type: Number })
  fee_amount: number;

  @ApiProperty({ example: {}, type: Object })
  metadata: any;

  @ApiProperty({ example: 'string', type: String })
  reason: string;

  @ApiProperty({ example: 'string', type: String })
  refund_id: string;

  @ApiProperty({ example: 123, type: Number })
  refunded_amount: number;

  @ApiProperty({ example: 'string', type: String })
  spi_account_number: string;

  @ApiProperty({ example: 'string', type: String })
  spi_end2end_id: string;

  @ApiProperty({ example: 'string', type: String })
  spi_retour_date_demande: string;

  @ApiProperty({ example: 'string', type: String })
  spi_retour_date_irrevocabilite: string;

  @ApiProperty({ example: 'string', type: String })
  spi_tx_id: string;

  @ApiProperty({ example: 'string', type: String })
  status: string;

  @ApiProperty({ example: 'string', type: String })
  transaction_id: string;

  @ApiProperty({ example: 'string', type: String })
  updated_at: string;
}
