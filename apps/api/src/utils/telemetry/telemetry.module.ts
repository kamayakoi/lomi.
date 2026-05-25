import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { WideEventService } from './wide-event.service';

@Module({
  imports: [SupabaseModule],
  providers: [WideEventService],
  exports: [WideEventService],
})
export class TelemetryModule {}
