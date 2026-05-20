import { ApiProperty } from '@nestjs/swagger';

/** Explicit `type` on each field avoids bad inferred metadata from prototype keys. */
export class PortalLaunchSessionResponseDto {
  @ApiProperty({
    example: '2d8f4f8b-1ea8-4de9-9fd8-f52f743bb265',
    description: 'Customer UUID',
    type: String,
  })
  customer_id: string;

  @ApiProperty({
    example: 'f8b15d6f-901f-4e7c-a0ab-1ce9e8d2a1ba',
    description: 'Organization UUID',
    type: String,
  })
  organization_id: string;

  @ApiProperty({
    example: '7d3d5f0f0f124d18b96d3f013dea5e408f86e7b0f66a7e09c7f29bcf9244cc4e',
    description: 'One-time launch token (returned once)',
    type: String,
  })
  launch_token: string;

  @ApiProperty({
    example:
      'https://customers.lomi.africa/launch?token=7d3d5f0f0f124d18b96d3f013dea5e408f86e7b0f66a7e09c7f29bcf9244cc4e',
    description: 'Hosted customer portal launch URL',
    type: String,
  })
  launch_url: string;

  @ApiProperty({
    example: 900,
    description: 'Launch session TTL in seconds',
    type: Number,
  })
  expires_in_seconds: number;

  @ApiProperty({
    example: 'portal_home',
    enum: ['portal_home', 'subscription_cancel', 'subscription_manage'],
    description: 'Requested customer-portal flow type',
    type: String,
  })
  flow_type: 'portal_home' | 'subscription_cancel' | 'subscription_manage';

  @ApiProperty({
    example: null,
    nullable: true,
    description: 'Target subscription ID when flow_type=subscription_cancel',
    type: String,
  })
  flow_subscription_id: string | null;

  @ApiProperty({
    example: 'https://merchant.example.com/account',
    nullable: true,
    description: 'Merchant return URL shown in the portal header/footer',
    type: String,
  })
  return_url: string | null;

  @ApiProperty({
    example: 'https://merchant.example.com/account/subscription-cancelled',
    nullable: true,
    description:
      'Redirect destination after successful completion of deep-link flow',
    type: String,
  })
  flow_after_completion_url: string | null;
}
