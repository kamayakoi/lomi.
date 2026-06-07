import { Module } from '@nestjs/common';
import { SupabaseModule } from '../../utils/supabase/supabase.module';
import { CustomerPortalController } from './customer-portal.controller';
import { CustomerPortalService } from './customer-portal.service';
import { PortalSessionGuard } from './portal-session.guard';

@Module({
  imports: [SupabaseModule],
  controllers: [CustomerPortalController],
  providers: [CustomerPortalService, PortalSessionGuard],
})
export class CustomerPortalModule {}
