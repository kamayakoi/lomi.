import {
  Controller,
  MessageEvent,
  Query,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { Observable } from 'rxjs';
import { ApiKeyGuard } from '../core/common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../core/common/decorators/current-user.decorator';
import { SupabaseService } from '../utils/supabase/supabase.service';
import { CliListenerService } from './cli-listener.service';
import { CliStreamService } from './cli-stream.service';

@ApiTags('CLI')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('cli')
export class CliListenController {
  constructor(
    private readonly listener: CliListenerService,
    private readonly stream: CliStreamService,
    private readonly supabase: SupabaseService,
  ) {}

  @Sse('listen')
  @SkipThrottle()
  @ApiOperation({
    summary: 'Flux SSE pour relais webhook CLI',
    description:
      'Maintient une connexion Server-Sent Events pour recevoir les webhooks en développement.',
  })
  @ApiQuery({
    name: 'allow_production',
    required: false,
    type: Boolean,
    description:
      'Autoriser l’écoute en production (nécessite CLI_LISTEN_ALLOW_PRODUCTION)',
  })
  listen(
    @CurrentUser() user: AuthContext,
    @Query('allow_production') allowProduction?: string,
  ): Observable<MessageEvent> {
    const allowProd = allowProduction === 'true' || allowProduction === '1';
    this.listener.assertListenAllowed(user.environment, allowProd);

    const organizationId = user.organizationId;

    return new Observable<MessageEvent>((subscriber) => {
      let streamSub: { unsubscribe: () => void } | null = null;

      void (async () => {
        try {
          await this.listener.markActive(organizationId);
          const webhookSecret = await this.resolveWebhookSecret(user);

          subscriber.next({
            data: {
              type: 'connected',
              organization_id: organizationId,
              webhook_secret: webhookSecret,
              ts: new Date().toISOString(),
            },
          } as MessageEvent);

          streamSub = this.stream.events$(organizationId).subscribe({
            next: (event) => {
              void this.listener.refreshTtl(organizationId);
              subscriber.next(event);
            },
            error: (error) => subscriber.error(error),
            complete: () => subscriber.complete(),
          });
        } catch (error) {
          subscriber.error(error);
        }
      })();

      return () => {
        streamSub?.unsubscribe();
        void this.listener.markInactive(organizationId);
      };
    });
  }

  private async resolveWebhookSecret(user: AuthContext): Promise<string> {
    const { data, error } = await this.supabase.getClient().rpc(
      'fetch_organization_webhooks' as never,
      {
        p_merchant_id: user.merchantId,
        p_organization_id: user.organizationId,
        p_event: null,
        p_is_active: true,
        p_search_term: null,
        p_environment: user.environment || 'live',
      } as never,
    );

    if (error) {
      return '';
    }

    const rows = (data as Record<string, unknown>[]) || [];
    const active = rows.find((row) => row.is_active !== false);
    const token = active?.verification_token ?? rows[0]?.verification_token;
    return token ? String(token) : '';
  }
}
