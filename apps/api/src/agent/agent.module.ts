import { Module } from '@nestjs/common';
import { AgentCapabilitiesController } from './agent-capabilities.controller';
import { AgentStreamController } from './agent-stream.controller';
import { AgentSubscriptionsController } from './agent-subscriptions.controller';
import { AgentWorkflowsController } from './agent-workflows.controller';
import { AgentHandoffController } from './agent-handoff.controller';
import { L5EventBusService } from './l5-event-bus.service';
import { AgentSubscriptionsStore } from './agent-subscriptions.store';
import { AgentWorkflowsStore } from './agent-workflows.store';
import { AgentHandoffStore } from './agent-handoff.store';

@Module({
  controllers: [
    AgentCapabilitiesController,
    AgentStreamController,
    AgentSubscriptionsController,
    AgentWorkflowsController,
    AgentHandoffController,
  ],
  providers: [
    L5EventBusService,
    AgentSubscriptionsStore,
    AgentWorkflowsStore,
    AgentHandoffStore,
  ],
  exports: [L5EventBusService],
})
export class AgentModule {}
