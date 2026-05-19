import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../../../utils/supabase/supabase.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractApiKey(request);

    if (!apiKey) {
      throw new UnauthorizedException('API Key is missing');
    }

    const { data, error } = await this.supabase.rpc('verify_api_key', {
      p_api_key: apiKey,
      p_endpoint: request.url,
      p_request_method: request.method,
      p_ip_address: request.ip,
    });

    if (error || !data || data.length === 0 || !data[0].is_valid) {
      throw new UnauthorizedException('Invalid API Key');
    }

    // Attach context to request
    request.user = {
      merchantId: data[0].merchant_id,
      organizationId: data[0].organization_id,
      environment: data[0].environment,
    };

    // Validate Environment
    // We trust the API key's environment. The user can use a test key on any host (e.g. localhost or api.lomi.africa)
    // and it will be treated as a test request.
    // The service layer will use this environment to scope data.

    return true;
  }

  private extractApiKey(request: any): string | undefined {
    // 1. Check x-api-key header
    if (request.headers['x-api-key']) {
      return request.headers['x-api-key'] as string;
    }

    // 2. Check Bearer token
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    return undefined;
  }
}
