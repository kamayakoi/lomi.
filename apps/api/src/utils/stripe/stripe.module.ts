import { Global, Module } from '@nestjs/common';
import { StripeClientsService } from './stripe-clients.service';

@Global()
@Module({
  providers: [StripeClientsService],
  exports: [StripeClientsService],
})
export class StripeModule {}
