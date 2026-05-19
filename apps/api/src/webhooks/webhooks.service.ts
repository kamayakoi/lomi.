import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../utils/supabase/supabase.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { AuthContext } from '../core/common/decorators/current-user.decorator';
import { Database } from '../utils/types/api';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class WebhooksService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(createDto: CreateWebhookDto, user: AuthContext) {
    const insertData: Database['public']['Tables']['webhooks']['Insert'] = {
      url: createDto.url,
      authorized_events: (typeof createDto.authorized_events === 'string'
        ? [createDto.authorized_events]
        : createDto.authorized_events) as Database['public']['Enums']['webhook_event'][],
      organization_id: user.organizationId,
      is_active: createDto.is_active ?? true,
      spi_event_types: createDto.spi_event_types
        ? typeof createDto.spi_event_types === 'string'
          ? [createDto.spi_event_types]
          : createDto.spi_event_types
        : null,
      supports_spi: createDto.supports_spi ?? false,
      metadata: createDto.metadata ?? null,
      environment: createDto.environment ?? 'live',
      verification_token: createDto.verification_token,
    };

    const { data, error } = await (
      this.supabase.getClient().from('webhooks') as unknown as ReturnType<
        SupabaseClient<Database>['from']
      >
    )
      .insert(insertData)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findAll(user: AuthContext) {
    // Use RPC function to bypass RLS
    const { data, error } = await this.supabase.rpc(
      'fetch_organization_webhooks',
      {
        p_merchant_id: user.merchantId,
        p_organization_id: user.organizationId,
        p_event: null,
        p_is_active: null,
        p_search_term: null,
        p_environment: 'live',
      },
    );

    if (error) throw new Error(error.message);
    return data || [];
  }

  async findOne(id: string, user: AuthContext) {
    // Use RPC function to bypass RLS
    const { data, error } = await this.supabase.rpc('get_webhook', {
      p_webhook_id: id,
      p_merchant_id: user.merchantId,
    });

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      throw new Error('Webhook not found');
    }
    return data[0];
  }

  async update(id: string, updateDto: UpdateWebhookDto, user: AuthContext) {
    // Use RPC function to bypass RLS and ensure proper permissions
    // Prepare authorized_events if provided
    let authorizedEvents:
      | Database['public']['Enums']['webhook_event'][]
      | null
      | undefined = undefined;
    if (updateDto.authorized_events !== undefined) {
      if (typeof updateDto.authorized_events === 'string') {
        authorizedEvents = [
          updateDto.authorized_events,
        ] as Database['public']['Enums']['webhook_event'][];
      } else if (Array.isArray(updateDto.authorized_events)) {
        authorizedEvents =
          updateDto.authorized_events as Database['public']['Enums']['webhook_event'][];
      } else {
        authorizedEvents = null;
      }
    }

    // Build params object - only include defined fields (omit undefined to use DEFAULT NULL)
    const params: any = {
      p_webhook_id: id,
      p_merchant_id: user.merchantId,
    };

    if (updateDto.url !== undefined) {
      params.p_url = updateDto.url;
    }
    if (authorizedEvents !== undefined) {
      params.p_authorized_events = authorizedEvents;
    }
    if (updateDto.is_active !== undefined) {
      params.p_is_active = updateDto.is_active;
    }
    if (updateDto.metadata !== undefined) {
      params.p_metadata = updateDto.metadata;
    }

    // Use getClient().rpc() for untyped functions instead of this.supabase.rpc
    const client = this.supabase.getClient();
    const { data: updated, error: updateError } = await client.rpc(
      'update_webhook',
      params,
    );

    if (updateError) {
      throw new Error(
        `Failed to update webhook: ${updateError.message || updateError}`,
      );
    }
    if (!updated) {
      throw new Error('Webhook not found or update failed');
    }

    // Fetch the updated webhook to return full details
    const { data, error } = await this.supabase.rpc('get_webhook', {
      p_webhook_id: id,
      p_merchant_id: user.merchantId,
    });

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      throw new Error('Webhook not found after update');
    }
    return data[0];
  }
}
