import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { WebhookSenderService } from './webhook-sender.service';
import { WebhookListener } from './listeners/webhook.listener';
import { WebhookQueueProcessor } from './processors/webhook.processor';
import { WaveWebhookModule } from './providers/wave/wave-webhook.module';
import { StripeWebhookModule } from './providers/stripe/stripe-webhook.module';
import { CliModule } from '../cli/cli.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'webhooks',
      defaultJobOptions: {
        // Aggressive retention to keep Redis command volume low.
        // Webhooks fan out per event + 5 attempts each; old jobs bloat streams/hashes.
        removeOnComplete: { age: 3600, count: 1000 }, // 1h or last 1k
        removeOnFail: { age: 86400, count: 5000 }, // 24h or last 5k (for debugging)
      },
    }),
    WaveWebhookModule,
    StripeWebhookModule,
    CliModule,
  ],
  controllers: [WebhooksController],
  providers: [
    WebhooksService,
    WebhookSenderService,
    WebhookListener,
    WebhookQueueProcessor,
  ],
  exports: [WebhookSenderService],
})
export class WebhooksModule {}
