import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { UsageEventsService } from '../usage-events.service';

@Processor('metering')
export class MeteringProcessor extends WorkerHost {
  private readonly logger = new Logger(MeteringProcessor.name);

  constructor(private readonly usageEventsService: UsageEventsService) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    if (job.name !== 'process-usage-event') {
      this.logger.warn(`Unknown metering job: ${job.name}`);
      return { skipped: true };
    }

    const { eventId, organizationId } = job.data as {
      eventId: string;
      organizationId: string;
    };

    this.logger.log(
      `Processing usage event ${eventId} (attempt ${job.attemptsMade + 1})`,
    );

    return this.usageEventsService.processEvent(eventId, organizationId);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, error: Error) {
    if (!job) return;
    this.logger.error(
      `Metering job ${job.id} failed after ${job.attemptsMade} attempts: ${error.message}`,
    );
  }
}
