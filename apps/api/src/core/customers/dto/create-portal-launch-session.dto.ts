import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreatePortalLaunchSessionDto {
  @ApiPropertyOptional({
    description:
      'Customer portal return URL shown as "Back to merchant". Must be absolute HTTPS in production.',
    example: 'https://merchant.example.com/account',
  })
  @IsOptional()
  @IsUrl({ require_tld: true, require_protocol: true })
  return_url?: string;

  @ApiPropertyOptional({
    description: 'Optional deep-link flow to open in the portal',
    enum: ['portal_home', 'subscription_cancel', 'subscription_manage'],
    default: 'portal_home',
  })
  @IsOptional()
  @IsString()
  @IsIn(['portal_home', 'subscription_cancel', 'subscription_manage'])
  flow_type?: 'portal_home' | 'subscription_cancel' | 'subscription_manage';

  @ApiPropertyOptional({
    description:
      'Required when flow_type=subscription_cancel; subscription to target.',
    example: '3d6236f9-2c3e-4f0c-b00d-e2d73d3f0d24',
  })
  @ValidateIf((o) => o.flow_type === 'subscription_cancel')
  @IsUUID()
  flow_subscription_id?: string;

  @ApiPropertyOptional({
    description:
      'Optional URL to redirect after successful completion of targeted flow.',
    example: 'https://merchant.example.com/account/subscription-cancelled',
  })
  @IsOptional()
  @IsUrl({ require_tld: true, require_protocol: true })
  flow_after_completion_url?: string;
}
