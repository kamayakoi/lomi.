import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../utils/supabase/supabase.service';
import type { PortalSessionContext } from './portal-session.guard';

@Injectable()
export class CustomerPortalService {
  constructor(private readonly supabase: SupabaseService) {}

  async getMe(session: PortalSessionContext) {
    const { data, error } = await this.supabase
      .getClient()
      .rpc(
        'customer_portal_validate_session' as never,
        { p_session_token: session.sessionToken } as never,
      );
    if (error) throw new Error(error.message);
    return (data as unknown[])?.[0] ?? null;
  }

  async listTransactions(
    session: PortalSessionContext,
    limit = 50,
    offset = 0,
  ) {
    const { data, error } = await this.supabase.getClient().rpc(
      'customer_portal_list_transactions' as never,
      {
        p_session_token: session.sessionToken,
        p_limit: limit,
        p_offset: offset,
      } as never,
    );
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async listSubscriptions(
    session: PortalSessionContext,
    limit = 50,
    offset = 0,
  ) {
    const { data, error } = await this.supabase.getClient().rpc(
      'customer_portal_list_subscriptions' as never,
      {
        p_session_token: session.sessionToken,
        p_limit: limit,
        p_offset: offset,
      } as never,
    );
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async manageSubscription(
    session: PortalSessionContext,
    subscriptionId: string,
    action: string,
    cancellationReason?: string,
  ) {
    const { data, error } = await this.supabase.getClient().rpc(
      'customer_portal_manage_subscription' as never,
      {
        p_session_token: session.sessionToken,
        p_subscription_id: subscriptionId,
        p_action: action,
        p_cancellation_reason: cancellationReason ?? null,
      } as never,
    );
    if (error) throw new Error(error.message);
    return data;
  }
}
