import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomerPortalService } from './customer-portal.service';
import { PortalSession } from './portal-session.decorator';
import type { PortalSessionContext } from './portal-session.guard';
import { PortalSessionGuard } from './portal-session.guard';

@ApiTags('Customer Portal (headless)')
@Controller('customer-portal')
@UseGuards(PortalSessionGuard)
@ApiBearerAuth()
export class CustomerPortalController {
  constructor(private readonly customerPortalService: CustomerPortalService) {}

  @Get('me')
  @ApiOperation({ summary: 'Current portal session customer profile' })
  getMe(@PortalSession() session: PortalSessionContext) {
    return this.customerPortalService.getMe(session);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'List transactions for portal session' })
  listTransactions(
    @PortalSession() session: PortalSessionContext,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.customerPortalService.listTransactions(
      session,
      limit ? Number.parseInt(limit, 10) : 50,
      offset ? Number.parseInt(offset, 10) : 0,
    );
  }

  @Get('subscriptions')
  @ApiOperation({ summary: 'List subscriptions for portal session' })
  listSubscriptions(
    @PortalSession() session: PortalSessionContext,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.customerPortalService.listSubscriptions(
      session,
      limit ? Number.parseInt(limit, 10) : 50,
      offset ? Number.parseInt(offset, 10) : 0,
    );
  }

  @Post('subscriptions/:id/actions')
  @ApiOperation({ summary: 'Pause, resume, cancel, or uncancel a subscription' })
  subscriptionAction(
    @PortalSession() session: PortalSessionContext,
    @Param('id') id: string,
    @Body() body: { action: string; cancellation_reason?: string },
  ) {
    return this.customerPortalService.manageSubscription(
      session,
      id,
      body.action,
      body.cancellation_reason,
    );
  }
}
