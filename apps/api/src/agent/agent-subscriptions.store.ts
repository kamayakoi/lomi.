import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

export type AgentSubscriptionRecord = {
  subscription_id: string;
  organization_id: string;
  topics: string[];
  channel: 'sse' | 'webhook' | 'pull';
  webhook_url?: string;
  created_at: string;
};

@Injectable()
export class AgentSubscriptionsStore {
  private readonly store = new Map<string, AgentSubscriptionRecord>();

  create(
    organizationId: string,
    input: {
      topics: string[];
      channel: AgentSubscriptionRecord['channel'];
      webhook_url?: string;
    },
  ): AgentSubscriptionRecord {
    const subscription_id = randomUUID();
    const rec: AgentSubscriptionRecord = {
      subscription_id,
      organization_id: organizationId,
      topics: [...new Set(input.topics)],
      channel: input.channel,
      webhook_url: input.webhook_url,
      created_at: new Date().toISOString(),
    };
    this.store.set(subscription_id, rec);
    return rec;
  }

  list(organizationId: string): AgentSubscriptionRecord[] {
    return [...this.store.values()].filter(
      (r) => r.organization_id === organizationId,
    );
  }

  get(organizationId: string, id: string): AgentSubscriptionRecord | undefined {
    const r = this.store.get(id);
    if (!r || r.organization_id !== organizationId) return undefined;
    return r;
  }

  delete(organizationId: string, id: string): boolean {
    const r = this.store.get(id);
    if (!r || r.organization_id !== organizationId) return false;
    return this.store.delete(id);
  }
}
