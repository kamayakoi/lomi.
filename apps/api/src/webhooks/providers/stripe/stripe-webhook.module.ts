import { Module } from '@nestjs/common';
import { StripeWebhookController } from './stripe-webhook.controller';
import { StripeWebhookService } from './stripe-webhook.service';
import { SupabaseModule } from '../../../utils/supabase/supabase.module';
import { TelemetryModule } from '../../../utils/telemetry/telemetry.module';
import { WebhookSenderService } from '../../webhook-sender.service';

@Module({
  imports: [SupabaseModule, TelemetryModule],
  controllers: [StripeWebhookController],
  providers: [StripeWebhookService, WebhookSenderService],
  exports: [StripeWebhookService],
})
export class StripeWebhookModule {}
