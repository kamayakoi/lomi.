import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../utils/supabase/supabase.service';
import { AuthContext } from '../common/decorators/current-user.decorator';
import { MeResponseDto } from './dto/me-response.dto';

@Injectable()
export class MeService {
  constructor(private readonly supabase: SupabaseService) {}

  async getMe(user: AuthContext): Promise<MeResponseDto> {
    const { data, error } = await this.supabase.getClient().rpc(
      'list_organizations' as never,
      {
        p_organization_id: user.organizationId,
      } as never,
    );

    if (error) {
      throw new InternalServerErrorException(
        `Failed to fetch organization: ${error.message}`,
      );
    }

    const rows = (data as Record<string, unknown>[]) || [];
    const org = rows[0] ?? {};
    const organizationName = String(
      org.name ?? org.organization_name ?? 'Organization',
    );

    return {
      merchant_id: user.merchantId,
      organization_id: user.organizationId,
      organization_name: organizationName,
      environment: user.environment,
    };
  }
}
