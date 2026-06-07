import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SupabaseModule } from '../../utils/supabase/supabase.module';
import { MetersController } from './meters.controller';
import { UsageEventsController } from './usage-events.controller';
import { MetersService } from './meters.service';
import { UsageEventsService } from './usage-events.service';
import { MeteringProcessor } from './processors/metering.processor';
import { BillingProcessor } from './processors/billing.processor';
import { BillingService } from './billing.service';
import { UsageBillingController } from './usage-billing.controller';
import { UsageCreditsService } from './usage-credits.service';
import { EntitlementsService } from './entitlements.service';

@Module({
  imports: [
    SupabaseModule,
    BullModule.registerQueue({ name: 'metering' }),
    BullModule.registerQueue({ name: 'billing' }),
  ],
  controllers: [
    MetersController,
    UsageEventsController,
    UsageBillingController,
  ],
  providers: [
    MetersService,
    UsageEventsService,
    MeteringProcessor,
    BillingService,
    BillingProcessor,
    UsageCreditsService,
    EntitlementsService,
  ],
  exports: [UsageEventsService, MetersService, BillingService],
})
export class MeteringModule {}
