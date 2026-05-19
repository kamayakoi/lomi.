import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../utils/supabase/supabase.service';
import { AuthContext } from '../common/decorators/current-user.decorator';
import { environmentFromAuth } from '../common/auth-environment';
import { CancelSubscriptionDto } from './dto/cancel-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly supabase: SupabaseService) {}

  /**
   * List all subscriptions for merchant's organization
   * Uses RPC: fetch_subscriptions
   */
  async findAll(user: AuthContext, page: number = 1, pageSize: number = 50) {
    const { data, error } = await this.supabase.getClient().rpc(
      'fetch_subscriptions' as any,
      {
        p_organization_id: user.organizationId,
        p_merchant_id: user.merchantId,
        p_page: page,
        p_page_size: pageSize,
        p_environment: environmentFromAuth(user),
      } as any,
    );

    if (error) throw new Error(error.message);

    return data || [];
  }

  /**
   * Get single subscription by ID
   * Uses RPC: get_customer_subscription
   */
  async findOne(id: string, user: AuthContext) {
    const { data, error } = await this.supabase.getClient().rpc(
      'get_customer_subscription' as any,
      {
        p_subscription_id: id,
        p_merchant_id: user.merchantId,
      } as any,
    );

    if (error) throw new Error(error.message);

    const subscription = data as any;

    if (!subscription || !subscription.subscription_id) {
      throw new NotFoundException(
        `Subscription with ID ${id} not found or access denied`,
      );
    }

    // Validate ownership
    if (subscription.organization_id !== user.organizationId) {
      throw new NotFoundException(
        `Subscription with ID ${id} not found or access denied`,
      );
    }

    return subscription;
  }

  /**
   * Cancel a subscription
   * Uses RPC: cancel_customer_subscription
   *
   * This is the ONLY modification allowed on subscriptions.
   * Fields like price_id, next_billing_date, start_date are system-managed.
   *
   * Note: cancellation_reason is accepted but currently only logged.
   * Future enhancement: Store in audit log or metadata table.
   */
  async cancel(
    id: string,
    cancelDto: CancelSubscriptionDto,
    user: AuthContext,
  ) {
    // First verify ownership
    await this.findOne(id, user);

    // Log cancellation reason if provided
    if (cancelDto.cancellation_reason) {
      console.log(
        `Cancelling subscription ${id}: ${cancelDto.cancellation_reason}`,
      );
    }

    const { error } = await this.supabase.getClient().rpc(
      'cancel_customer_subscription' as any,
      {
        p_subscription_id: id,
        p_merchant_id: user.merchantId,
      } as any,
    );

    if (error) throw new Error(error.message);

    // Return the updated subscription
    return this.findOne(id, user);
  }

  /**
   * Get subscriptions for a specific customer
   * Uses RPC: fetch_subscriptions_for_customer
   */
  async findByCustomer(customerId: string, user: AuthContext) {
    // First verify the customer belongs to this organization
    const { data: customer, error: customerError } = await this.supabase
      .getClient()
      .from('customers')
      .select('organization_id')
      .eq('customer_id', customerId)
      .eq('organization_id', user.organizationId)
      .single();

    if (customerError || !customer) {
      throw new NotFoundException(
        `Customer with ID ${customerId} not found or access denied`,
      );
    }

    const { data, error } = await this.supabase.getClient().rpc(
      'fetch_subscriptions_for_customer' as any,
      {
        p_customer_id: customerId,
        p_environment: environmentFromAuth(user),
      } as any,
    );

    if (error) throw new Error(error.message);

    return data || [];
  }
}
