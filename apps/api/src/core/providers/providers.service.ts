import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../utils/supabase/supabase.service';
import { AuthContext } from '../common/decorators/current-user.decorator';
import type { ProviderCode } from '../../utils/types/api';

@Injectable()
export class ProvidersService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(user: AuthContext, providerCode?: ProviderCode) {
    const { data, error } = await this.supabase.getClient().rpc(
      'fetch_organization_providers_settings_api' as never,
      {
        p_merchant_id: user.merchantId,
        p_organization_id: user.organizationId,
        p_provider_code: providerCode ?? null,
      } as never,
    );

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data: data ?? [] };
  }
}
