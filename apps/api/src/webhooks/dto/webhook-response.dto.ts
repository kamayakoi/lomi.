import { ApiProperty } from '@nestjs/swagger';

/** Explicit `type` on each field avoids bad inferred metadata from prototype keys. */
export class WebhookResponseDto {
  @ApiProperty({ example: 'string', type: String })
  authorized_events: string;

  @ApiProperty({ example: 'string', type: String })
  created_at: string;

  @ApiProperty({ example: 'string', type: String })
  created_by: string;

  @ApiProperty({ example: 'string', type: String })
  deleted_at: string;

  @ApiProperty({ example: 'string', type: String })
  environment: string;

  @ApiProperty({ example: true, type: Boolean })
  is_active: boolean;

  @ApiProperty({ example: {}, type: Object })
  last_payload: any;

  @ApiProperty({ example: 'string', type: String })
  last_response_body: string;

  @ApiProperty({ example: 123, type: Number })
  last_response_status: number;

  @ApiProperty({ example: 'string', type: String })
  last_triggered_at: string;

  @ApiProperty({ example: {}, type: Object })
  metadata: any;

  @ApiProperty({ example: 'string', type: String })
  organization_id: string;

  @ApiProperty({ example: 123, type: Number })
  retry_count: number;

  @ApiProperty({ example: 'string', type: String })
  spi_event_types: string;

  @ApiProperty({ example: true, type: Boolean })
  supports_spi: boolean;

  @ApiProperty({ example: 'string', type: String })
  updated_at: string;

  @ApiProperty({ example: 'string', type: String })
  url: string;

  @ApiProperty({ example: 'string', type: String })
  verification_token: string;

  @ApiProperty({ example: 'string', type: String })
  webhook_id: string;
}
