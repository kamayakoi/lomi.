import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../common/decorators/current-user.decorator';
import { ApiLomiAccountHeader } from '../common/decorators/api-lomi-account-header.decorator';
import { environmentFromAuth } from '../common/auth-environment';
import { BillingService } from './billing.service';
import { UsageCreditsService } from './usage-credits.service';
import { EntitlementsService } from './entitlements.service';

@ApiTags('Usage billing')
@ApiSecurity('api-key')
@ApiLomiAccountHeader()
@UseGuards(ApiKeyGuard)
@Controller('usage-billing')
export class UsageBillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly creditsService: UsageCreditsService,
    private readonly entitlementsService: EntitlementsService,
  ) {}

  @Post('run-cycle')
  @ApiOperation({
    summary: 'Run usage billing cycle',
    description:
      'Closes billing periods, generates usage invoices, and advances subscription dates. Normally run by pg_cron daily.',
  })
  runCycle(@Body() body: { as_of_date?: string }) {
    return this.billingService.runUsageBillingCycle(body?.as_of_date);
  }

  @Post('run-dunning')
  @ApiOperation({ summary: 'Process usage invoice dunning steps' })
  runDunning(@Body() body: { grace_days?: number }) {
    return this.billingService.runDunning(body?.grace_days ?? 3);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Combined MRR + usage + one-time revenue metrics' })
  @ApiQuery({ name: 'start_date', required: true })
  @ApiQuery({ name: 'end_date', required: true })
  getRevenue(
    @CurrentUser() user: AuthContext,
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
  ) {
    return this.billingService.getCombinedRevenue(
      user.organizationId,
      startDate,
      endDate,
      environmentFromAuth(user),
    );
  }

  @Post('credits')
  @ApiOperation({
    summary: 'Credit prepaid usage units to a customer meter wallet',
  })
  creditWallet(
    @Body()
    body: {
      meter_id: string;
      customer_id: string;
      units: number;
      reason?: string;
    },
  ) {
    return this.creditsService.credit(
      body.meter_id,
      body.customer_id,
      body.units,
      body.reason,
    );
  }

  @Post('entitlements')
  @ApiOperation({ summary: 'Create or update a plan entitlement feature' })
  createEntitlement(
    @CurrentUser() user: AuthContext,
    @Body()
    body: { feature_key: string; name: string; description?: string },
  ) {
    return this.entitlementsService.create(user, body);
  }

  @Get('entitlements/check')
  @ApiOperation({ summary: 'Check if a customer has an active entitlement' })
  checkEntitlement(
    @Query('customer_id') customerId: string,
    @Query('feature_key') featureKey: string,
  ) {
    return this.entitlementsService.check(customerId, featureKey);
  }
}
