import { ApiProperty } from '@nestjs/swagger';

export class CreateBeneficiaryPayoutDto {
  @ApiProperty({
    example: 5000.0,
    description: 'Amount to pay beneficiary',
  })
  amount: number;

  @ApiProperty({
    example: 'XOF',
    description: 'Currency code',
    enum: ['XOF', 'USD', 'EUR'],
  })
  currency_code: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Payout method ID (beneficiary bank account or mobile money)',
    required: false,
  })
  payout_method_id?: string;

  @ApiProperty({
    example: 'WAVE',
    description: 'Provider code',
    enum: ['WAVE', 'SPI'],
    default: 'WAVE',
    required: false,
  })
  provider_code?: string;

  @ApiProperty({
    example: 'MOBILE_MONEY',
    description: 'Payment method code',
    enum: ['MOBILE_MONEY', 'BANK_TRANSFER'],
    default: 'MOBILE_MONEY',
    required: false,
  })
  payment_method_code?: string;

  @ApiProperty({
    example: { recipient_name: 'John Doe', reference: 'INV-001' },
    description: 'Additional metadata',
    required: false,
  })
  metadata?: Record<string, any>;
}
