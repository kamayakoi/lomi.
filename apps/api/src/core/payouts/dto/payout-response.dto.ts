import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePayoutResponseDto {
  @ApiProperty({ example: true, type: Boolean })
  success: boolean;

  @ApiPropertyOptional({ example: 'payout-uuid', type: String })
  payout_id?: string;

  @ApiPropertyOptional({
    example: 'withdrawal',
    enum: ['withdrawal', 'beneficiary'],
    type: String,
  })
  kind?: 'withdrawal' | 'beneficiary';

  @ApiPropertyOptional({ example: 'processing', type: String })
  status?: string;

  @ApiPropertyOptional({ type: String })
  message?: string;
}
