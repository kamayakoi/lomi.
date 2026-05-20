import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../utils/supabase/supabase.service';
import { AuthContext } from '../common/decorators/current-user.decorator';
import { Database } from '../../utils/types/api';

type WebhookDeliveryLog =
  Database['public']['Tables']['webhook_delivery_logs']['Row'];

@Injectable()
export class WebhookDeliveryLogsService {
  constructor(private readonly supabase: SupabaseService) {}

  /**
   * List all webhook delivery logs for a specific webhook
   * Uses RPC: get_webhook_delivery_logs
   */
  async findAll(
    user: AuthContext,
    webhookId: string,
    successOnly: boolean = false,
    failedOnly: boolean = false,
    limit: number = 25,
    offset: number = 0,
  ) {
    const { data, error } = await this.supabase.rpc(
      'get_webhook_delivery_logs',
      {
        p_webhook_id: webhookId,
        p_merchant_id: user.merchantId,
        p_limit: limit,
        p_offset: offset,
        p_success_only: successOnly,
        p_failed_only: failedOnly,
      },
    );

    if (error) throw new Error(error.message);

    return data || [];
  }

  /**
   * Get single webhook delivery log by ID
   * Uses RPC: get_webhook_delivery_log
   */
  async findOne(id: string, user: AuthContext) {
    const { data, error } = await this.supabase.rpc(
      'get_webhook_delivery_log' as never,
      {
        p_log_id: id,
        p_merchant_id: user.merchantId,
      } as never,
    );

    if (error) {
      throw new Error(error.message);
    }

    const rows = Array.isArray(data) ? data : [];
    const row = rows[0] as WebhookDeliveryLog | undefined;

    if (!row) {
      throw new NotFoundException(
        `Webhook delivery log with ID ${id} not found or access denied`,
      );
    }

    if (row.organization_id !== user.organizationId) {
      throw new NotFoundException(
        `Webhook delivery log with ID ${id} not found or access denied`,
      );
    }

    return row;
  }
}
