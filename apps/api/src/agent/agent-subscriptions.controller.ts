import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKeyGuard } from '../core/common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../core/common/decorators/current-user.decorator';
import { CreateSubscriptionDto } from './dto/create-workflow.dto';
import { AgentSubscriptionsStore } from './agent-subscriptions.store';
import { L5EventBusService } from './l5-event-bus.service';

@Controller('agent')
@ApiTags('Agent')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
export class AgentSubscriptionsController {
  constructor(
    private readonly store: AgentSubscriptionsStore,
    private readonly bus: L5EventBusService,
  ) {}

  @Post('subscriptions')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Register for agent-appropriate notifications (MVP: in-process registry + SSE test ping)' })
  @ApiResponse({ status: 201, description: 'Created' })
  create(
    @CurrentUser() user: AuthContext,
    @Body() body: CreateSubscriptionDto,
  ) {
    const rec = this.store.create(user.organizationId, {
      topics: body.topics,
      channel: body.channel,
      webhook_url: body.webhook_url,
    });
    this.bus.emit(user.organizationId, {
      type: 'agent.subscription_created',
      subscription_id: rec.subscription_id,
    });
    return { data: rec };
  }

  @Get('subscriptions')
  @ApiOperation({ summary: 'List agent subscriptions' })
  list(@CurrentUser() user: AuthContext) {
    return { data: this.store.list(user.organizationId) };
  }

  @Delete('subscriptions/:id')
  @ApiParam({ name: 'id', description: 'Subscription id' })
  @ApiOperation({ summary: 'Delete a subscription' })
  @ApiResponse({ status: 200, description: 'Deleted' })
  @ApiResponse({ status: 404, description: 'Not found' })
  remove(
    @CurrentUser() user: AuthContext,
    @Param('id') id: string,
  ) {
    const ok = this.store.delete(user.organizationId, id);
    if (!ok) {
      throw new NotFoundException('Subscription not found');
    }
    return { data: { deleted: true, subscription_id: id } };
  }
}
