import { ApiProperty } from '@nestjs/swagger';

/** Explicit `type` on each field avoids bad inferred metadata from prototype keys. */
export class WebhookDeliveryLogResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique log identifier',
    type: String,
  })
  log_id: string;

  @ApiProperty({
    example: '789e0123-e89b-12d3-a456-426614174000',
    description: 'Webhook ID',
    type: String,
  })
  webhook_id: string;

  @ApiProperty({
    example: '456e7890-e89b-12d3-a456-426614174000',
    description: 'Organization ID',
    type: String,
  })
  organization_id: string;

  @ApiProperty({
    example: 'transaction.completed',
    description: 'Event type that triggered the webhook',
    type: String,
  })
  event_type: string;

  @ApiProperty({
    example: {
      transaction_id: '123e4567-e89b-12d3-a456-426614174000',
      amount: 10000,
    },
    description: 'Webhook payload sent',
    type: Object,
  })
  payload: Record<string, any>;

  @ApiProperty({
    example: 200,
    description: 'HTTP response status code',
    nullable: true,
    type: Number,
  })
  response_status: number | null;

  @ApiProperty({
    example: '{"status":"success"}',
    description: 'Response body from the webhook endpoint',
    nullable: true,
    type: String,
  })
  response_body: string | null;

  @ApiProperty({
    example: 1,
    description: 'Attempt number (for retries)',
    type: Number,
  })
  attempt_number: number;

  @ApiProperty({
    example: true,
    description: 'Whether the webhook delivery was successful',
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    example: '192.168.1.1',
    description: 'IP address of the webhook endpoint',
    nullable: true,
    type: String,
  })
  ip_address: string | null;

  @ApiProperty({
    example: 'Mozilla/5.0',
    description: 'User agent from the webhook response',
    nullable: true,
    type: String,
  })
  user_agent: string | null;

  @ApiProperty({
    example: { 'content-type': 'application/json' },
    description: 'Request headers sent with the webhook',
    nullable: true,
    type: Object,
  })
  headers: Record<string, any> | null;

  @ApiProperty({
    example: 150,
    description: 'Request duration in milliseconds',
    nullable: true,
    type: Number,
  })
  request_duration_ms: number | null;

  @ApiProperty({
    example: 'SPI-TX-123456',
    description: 'SPI transaction ID (for SPI webhooks)',
    nullable: true,
    type: String,
  })
  spi_tx_id: string | null;

  @ApiProperty({
    example: '221771234567',
    description: 'Payer account number (for SPI webhooks)',
    nullable: true,
    type: String,
  })
  compte_payeur: string | null;

  @ApiProperty({
    example: '221779876543',
    description: 'Payee account number (for SPI webhooks)',
    nullable: true,
    type: String,
  })
  compte_paye: string | null;

  @ApiProperty({
    example: 1000000,
    description: 'Transaction amount in centimes (for SPI webhooks)',
    nullable: true,
    type: Number,
  })
  amount: number | null;

  @ApiProperty({
    example: 'PAIEMENT_RECU',
    description: 'SPI webhook event code (for SPI webhooks)',
    nullable: true,
    type: String,
  })
  spi_event_code: string | null;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'When the webhook was delivered',
    type: String,
  })
  created_at: string;
}
