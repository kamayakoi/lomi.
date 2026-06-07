import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../utils/supabase/supabase.service';

@Injectable()
export class UsageCreditsService {
  constructor(private readonly supabase: SupabaseService) {}

  async credit(
    meterId: string,
    customerId: string,
    units: number,
    reason?: string,
  ) {
    const { data, error } = await this.supabase.getClient().rpc(
      'credit_usage_wallet' as never,
      {
        p_meter_id: meterId,
        p_customer_id: customerId,
        p_units: units,
        p_reason: reason ?? 'top_up',
      } as never,
    );

    if (error) throw new Error(error.message);
    return data;
  }
}
