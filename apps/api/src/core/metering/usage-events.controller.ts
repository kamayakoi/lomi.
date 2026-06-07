import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../common/decorators/current-user.decorator';
import { ApiLomiAccountHeader } from '../common/decorators/api-lomi-account-header.decorator';
import { UsageEventsService } from './usage-events.service';
import {
  CreateUsageEventDto,
  UsageEventResponseDto,
} from './dto/create-usage-event.dto';
import {
  CreateUsageSubscriptionDto,
  UsageSubscriptionResponseDto,
} from './dto/create-usage-subscription.dto';

@ApiTags('Usage events')
@ApiSecurity('api-key')
@ApiLomiAccountHeader()
@UseGuards(ApiKeyGuard)
@Controller()
export class UsageEventsController {
  constructor(private readonly usageEventsService: UsageEventsService) {}

  @Post('usage-events')
  @HttpCode(202)
  @ApiOperation({
    summary: 'Record a usage event',
    description:
      'Idempotent usage ingest. Events are processed asynchronously and update meter balances.',
  })
  @ApiResponse({ status: 202, type: UsageEventResponseDto })
  ingest(@Body() dto: CreateUsageEventDto, @CurrentUser() user: AuthContext) {
    return this.usageEventsService.ingest(dto, user);
  }

  @Post('usage-subscriptions')
  @ApiOperation({
    summary: 'Create a usage subscription',
    description:
      'Enrolls a customer on a usage_based product without an upfront charge. Required before billing metered usage.',
  })
  @ApiResponse({ status: 201, type: UsageSubscriptionResponseDto })
  createUsageSubscription(
    @Body() dto: CreateUsageSubscriptionDto,
    @CurrentUser() user: AuthContext,
  ) {
    return this.usageEventsService.createUsageSubscription(dto, user);
  }
}
