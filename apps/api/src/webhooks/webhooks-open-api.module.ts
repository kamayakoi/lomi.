/* @proprietary license */

/**
 * Webhook HTTP surface for OpenAPI export only (no BullMQ queue / workers).
 * Keeps `openapi:export` from blocking on Redis while preserving provider routes.
 */

import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { WaveWebhookModule } from './providers/wave/wave-webhook.module';
import { StripeWebhookModule } from './providers/stripe/stripe-webhook.module';

@Module({
  imports: [WaveWebhookModule, StripeWebhookModule],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksOpenApiModule {}
