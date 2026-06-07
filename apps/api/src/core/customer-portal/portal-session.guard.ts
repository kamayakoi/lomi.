import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../../utils/supabase/supabase.service';

export type PortalSessionContext = {
  sessionToken: string;
  organizationId: string;
  customerId: string;
  environment: string;
};

@Injectable()
export class PortalSessionGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      portalSession?: PortalSessionContext;
    }>();

    const auth = req.headers.authorization ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
    if (!token || token.length < 16) {
      throw new UnauthorizedException('Missing portal session token');
    }

    const { data, error } = await this.supabase
      .getClient()
      .rpc(
        'customer_portal_validate_session' as any,
        { p_session_token: token } as any,
      );

    const rows = (data as unknown[] | null) ?? [];
    if (error || rows.length === 0) {
      throw new UnauthorizedException('Invalid or expired portal session');
    }

    const row = rows[0] as {
      organization_id: string;
      customer_id: string;
      environment: string;
    };

    req.portalSession = {
      sessionToken: token,
      organizationId: row.organization_id,
      customerId: row.customer_id,
      environment: row.environment,
    };

    return true;
  }
}
