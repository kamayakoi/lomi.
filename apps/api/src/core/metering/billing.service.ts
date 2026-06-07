import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Optional } from '@nestjs/common';
import { Queue } from 'bullmq';
import { SupabaseService } from '../../utils/supabase/supabase.service';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private readonly supabase: SupabaseService,
    @Optional()
    @InjectQueue('billing')
    private readonly billingQueue: Queue | null,
  ) {}

  async runUsageBillingCycle(asOfDate?: string) {
    const date = asOfDate ?? new Date().toISOString().split('T')[0];

    if (this.billingQueue) {
      const job = await this.billingQueue.add(
        'run-usage-billing-cycle',
        { asOfDate: date },
        {
          jobId: `billing-cycle:${date}`,
          attempts: 3,
          backoff: { type: 'exponential', delay: 5000 },
        },
      );
      return { queued: true, job_id: job.id, as_of_date: date };
    }

    return this.executeUsageBillingCycle(date);
  }

  async executeUsageBillingCycle(asOfDate: string) {
    const { data, error } = await this.supabase
      .getClient()
      .rpc(
        'process_usage_billing_cycle' as never,
        { p_as_of_date: asOfDate } as never,
      );

    if (error) throw new Error(error.message);
    return data;
  }

  async runDunning(graceDays = 3) {
    const { data, error } = await this.supabase
      .getClient()
      .rpc(
        'process_usage_invoice_dunning' as never,
        { p_grace_days: graceDays } as never,
      );

    if (error) throw new Error(error.message);
    return { processed: data };
  }

  async getCombinedRevenue(
    organizationId: string,
    startDate: string,
    endDate: string,
    environment = 'live',
  ) {
    const { data, error } = await this.supabase.getClient().rpc(
      'fetch_combined_revenue_metrics' as never,
      {
        p_organization_id: organizationId,
        p_start_date: startDate,
        p_end_date: endDate,
        p_environment: environment,
      } as never,
    );

    if (error) throw new Error(error.message);
    return data;
  }
}
