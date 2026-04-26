import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

export type WorkflowRun = {
  run_id: string;
  organization_id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  steps: { id: string; status: string }[];
  idempotency_key: string | null;
  created_at: string;
  updated_at: string;
};

@Injectable()
export class AgentWorkflowsStore {
  private readonly byRun = new Map<string, WorkflowRun>();
  private readonly idempotency = new Map<string, WorkflowRun>();

  create(
    organizationId: string,
    input: { name: string; steps: { id: string }[]; idempotency_key?: string },
  ): WorkflowRun {
    if (input.idempotency_key) {
      const existing = this.idempotency.get(
        `${organizationId}:${input.idempotency_key}`,
      );
      if (existing) return existing;
    }

    const run_id = randomUUID();
    const now = new Date().toISOString();
    const run: WorkflowRun = {
      run_id,
      organization_id: organizationId,
      name: input.name,
      status: 'running',
      steps: input.steps.map((s) => ({ id: s.id, status: 'pending' })),
      idempotency_key: input.idempotency_key ?? null,
      created_at: now,
      updated_at: now,
    };

    if (input.idempotency_key) {
      const k = `${organizationId}:${input.idempotency_key}`;
      this.idempotency.set(k, run);
    }

    this.byRun.set(run_id, run);
    return run;
  }

  get(organizationId: string, runId: string): WorkflowRun {
    const r = this.byRun.get(runId);
    if (!r || r.organization_id !== organizationId) {
      throw new NotFoundException('Workflow run not found');
    }
    return r;
  }

  updateStep(
    organizationId: string,
    runId: string,
    stepId: string,
    status: string,
  ): WorkflowRun {
    const run = this.get(organizationId, runId);
    const step = run.steps.find((s) => s.id === stepId);
    if (!step) {
      throw new NotFoundException(`Step ${stepId} not found in run`);
    }
    step.status = status;
    run.updated_at = new Date().toISOString();
    if (run.steps.every((s) => s.status === 'completed')) {
      run.status = 'completed';
    }
    return run;
  }
}
