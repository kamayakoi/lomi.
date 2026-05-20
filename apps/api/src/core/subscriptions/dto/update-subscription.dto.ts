import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSubscriptionDto {
  @ApiPropertyOptional({
    example: 'paused',
    enum: [
      'pending',
      'active',
      'paused',
      'cancelled',
      'expired',
      'past_due',
      'trial',
    ],
  })
  status?: string;

  @ApiPropertyOptional({ type: String })
  start_date?: string;

  @ApiPropertyOptional({ type: String })
  end_date?: string;

  @ApiPropertyOptional({ type: String })
  next_billing_date?: string;

  @ApiPropertyOptional({ type: Object })
  metadata?: Record<string, unknown>;
}
