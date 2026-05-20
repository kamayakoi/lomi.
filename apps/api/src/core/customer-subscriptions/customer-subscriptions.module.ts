import { Module } from '@nestjs/common';
import { CustomerSubscriptionsController } from './customer-subscriptions.controller';
import { CustomerSubscriptionsService } from './customer-subscriptions.service';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [SubscriptionsModule],
  controllers: [CustomerSubscriptionsController],
  providers: [CustomerSubscriptionsService],
})
export class CustomerSubscriptionsModule {}
