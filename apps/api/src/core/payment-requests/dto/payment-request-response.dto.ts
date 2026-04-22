import { ApiProperty } from '@nestjs/swagger';

/** Explicit `type` on each field avoids bad inferred metadata from prototype keys. */
export class PaymentRequestResponseDto {
  @ApiProperty({ example: 123, type: Number })
  amount: number;

  @ApiProperty({ example: 'string', type: String })
  created_at: string;

  @ApiProperty({ example: 'string', type: String })
  created_by: string;

  @ApiProperty({ example: 'string', type: String })
  currency_code: string;

  @ApiProperty({ example: 'string', type: String })
  customer_id: string;

  @ApiProperty({ example: 'string', type: String })
  description: string;

  @ApiProperty({ example: 'string', type: String })
  environment: string;

  @ApiProperty({ example: 'string', type: String })
  expiry_date: string;

  @ApiProperty({ example: 'string', type: String })
  organization_id: string;

  @ApiProperty({ example: 'string', type: String })
  payment_link: string;

  @ApiProperty({ example: 'string', type: String })
  payment_reference: string;

  @ApiProperty({ example: 'string', type: String })
  request_id: string;

  @ApiProperty({ example: 'string', type: String })
  spi_account_number: string;

  @ApiProperty({ example: 'string', type: String })
  spi_bulk_instruction_id: string;

  @ApiProperty({ example: true, type: Boolean })
  spi_confirmation: boolean;

  @ApiProperty({ example: 'string', type: String })
  spi_date_envoi: string;

  @ApiProperty({ example: 'string', type: String })
  spi_date_irrevocabilite: string;

  @ApiProperty({ example: 'string', type: String })
  spi_date_limite_paiement: string;

  @ApiProperty({ example: 'string', type: String })
  spi_date_limite_reponse: string;

  @ApiProperty({ example: 'string', type: String })
  spi_date_rejet: string;

  @ApiProperty({ example: true, type: Boolean })
  spi_debit_differe: boolean;

  @ApiProperty({ example: 'string', type: String })
  spi_end2end_id: string;

  @ApiProperty({ example: 'string', type: String })
  spi_payeur_alias: string;

  @ApiProperty({ example: 'string', type: String })
  spi_payeur_nom: string;

  @ApiProperty({ example: 'string', type: String })
  spi_payeur_pays: string;

  @ApiProperty({ example: 'string', type: String })
  spi_ref_doc_numero: string;

  @ApiProperty({ example: 123, type: Number })
  spi_remise_amount: number;

  @ApiProperty({ example: 123, type: Number })
  spi_remise_rate: number;

  @ApiProperty({ example: 'string', type: String })
  spi_tx_id: string;

  @ApiProperty({ example: 'string', type: String })
  status: string;

  @ApiProperty({ example: 'string', type: String })
  updated_at: string;
}
