import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { BillingService } from '../billing.service';

@Processor('billing')
export class BillingProcessor extends WorkerHost {
  private readonly logger = new Logger(BillingProcessor.name);

  constructor(private readonly billingService: BillingService) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    if (job.name === 'run-usage-billing-cycle') {
      const asOfDate =
        (job.data.asOfDate as string) ?? new Date().toISOString().split('T')[0];
      this.logger.log(`Running usage billing cycle for ${asOfDate}`);
      return this.billingService.executeUsageBillingCycle(asOfDate);
    }

    return { skipped: true };
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, error: Error) {
    if (!job) return;
    this.logger.error(`Billing job ${job.id} failed: ${error.message}`);
  }
}
