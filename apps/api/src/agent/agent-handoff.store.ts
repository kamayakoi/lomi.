import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

export type HandoffRecord = {
  handoff_id: string;
  organization_id: string;
  to: string;
  task: string;
  context: Record<string, unknown>;
  trace_id: string | null;
  status: 'accepted' | 'pending';
  created_at: string;
};

@Injectable()
export class AgentHandoffStore {
  private readonly store = new Map<string, HandoffRecord>();

  create(
    organizationId: string,
    input: {
      to: string;
      task: string;
      context: Record<string, unknown>;
      trace_id?: string;
    },
  ): HandoffRecord {
    const handoff_id = randomUUID();
    const rec: HandoffRecord = {
      handoff_id,
      organization_id: organizationId,
      to: input.to,
      task: input.task,
      context: input.context,
      trace_id: input.trace_id ?? null,
      status: 'accepted',
      created_at: new Date().toISOString(),
    };
    this.store.set(handoff_id, rec);
    return rec;
  }

  get(organizationId: string, id: string): HandoffRecord | undefined {
    const h = this.store.get(id);
    if (!h || h.organization_id !== organizationId) return undefined;
    return h;
  }
}
