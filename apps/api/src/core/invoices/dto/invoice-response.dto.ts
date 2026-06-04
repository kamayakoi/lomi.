import { ApiProperty } from '@nestjs/swagger';

export class InvoiceResponseDto {
  @ApiProperty()
  customer_invoice_id: string;

  @ApiProperty()
  organization_id: string;

  @ApiProperty({ nullable: true })
  customer_id: string | null;

  @ApiProperty({ nullable: true })
  invoice_number: string | null;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  amount_due: number;

  @ApiProperty()
  amount_remaining: number;

  @ApiProperty()
  currency_code: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  origin: string;

  @ApiProperty({ nullable: true })
  payment_url: string | null;
}
