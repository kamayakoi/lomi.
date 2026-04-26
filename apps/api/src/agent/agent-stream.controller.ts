import { Controller, MessageEvent, Sse, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from '../core/common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../core/common/decorators/current-user.decorator';
import { Observable } from 'rxjs';
import { L5EventBusService } from './l5-event-bus.service';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('agent')
@ApiTags('Agent')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
export class AgentStreamController {
  constructor(private readonly bus: L5EventBusService) {}

  @Sse('events')
  @SkipThrottle()
  @ApiOperation({ summary: 'Server-Sent Events stream (scoped to organization, keepalive pings)' })
  stream(@CurrentUser() user: AuthContext): Observable<MessageEvent> {
    return this.bus.events$(user.organizationId);
  }
}
