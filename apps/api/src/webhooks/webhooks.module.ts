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
