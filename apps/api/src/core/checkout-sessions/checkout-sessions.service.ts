import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../utils/supabase/supabase.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { AuthContext } from '../common/decorators/current-user.decorator';
import type { CurrencyCode, Json } from '../../utils/types/api';
import { throwMappedSupabaseRpcError } from '../../utils/supabase-rpc-errors';

export type CheckoutIdempotencyContext = {
  key: string;
  bodyHash: string;
};

@Injectable()
export class CheckoutSessionsService {
  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Create a new checkout session
   * Uses RPC: create_checkout_session for single product
   * Uses RPC: create_checkout_session_with_line_items for multi-product
   */
  async create(
    createDto: CreateCheckoutSessionDto,
    user: AuthContext,
    idempotency?: CheckoutIdempotencyContext,
  ) {
    if (createDto.line_items && createDto.line_items.length > 0) {
      const rpcArgs = {
        p_organization_id: user.organizationId,
        p_created_by: user.merchantId,
        p_currency_code: createDto.currency_code as CurrencyCode,
        p_line_items: createDto.line_items as unknown as Json,
        p_environment: user.environment,
        p_customer_id: createDto.customer_id || null,
        p_metadata: createDto.metadata || null,
        p_title: createDto.title || null,
        p_description: createDto.description || null,
        p_success_url: createDto.success_url || null,
        p_cancel_url: createDto.cancel_url || null,
        p_customer_email: createDto.customer_email || null,
        p_customer_name: createDto.customer_name || null,
        p_customer_phone: createDto.customer_phone || null,
        p_customer_city: createDto.customer_city || null,
        p_customer_country: createDto.customer_country || null,
        p_customer_address: createDto.customer_address || null,
        p_customer_postal_code: createDto.customer_postal_code || null,
        p_allow_coupon_code: createDto.allow_coupon_code ?? false,
        p_expiration_minutes: 60,
        p_require_billing_address: createDto.require_billing_address ?? false,
        p_payment_link_id: createDto.payment_link_id || null,
        ...(idempotency
          ? {
              p_idempotency_key: idempotency.key,
              p_idempotency_body_hash: idempotency.bodyHash,
            }
          : {}),
      };

      const { data, error } = await this.supabase.rpc(
        'create_checkout_session_with_line_items',
        rpcArgs,
      );

      if (process.env.LOMI_DEBUG_CHECKOUT_RPC === '1') {
        console.log('create_checkout_session_with_line_items RPC result:', {
          data,
          error,
        });
      }

      if (error) throwMappedSupabaseRpcError(error.message);
      return data;
    }

    const rpcArgs = {
      p_organization_id: user.organizationId,
      p_environment: user.environment,
      p_created_by: user.merchantId,
      p_amount: (createDto.amount ?? null) as unknown as number,
      p_currency_code: createDto.currency_code as CurrencyCode,
      p_customer_id: createDto.customer_id || null,
      p_metadata: createDto.metadata || null,
      p_title: createDto.title || null,
      p_description: createDto.description || null,
      p_product_id: createDto.product_id || null,
      p_price_id: createDto.price_id || null,
      p_subscription_id: createDto.subscription_id || null,
      p_allow_quantity: createDto.allow_quantity ?? false,
      p_quantity: createDto.quantity ?? 1,
      p_success_url: createDto.success_url || null,
      p_cancel_url: createDto.cancel_url || null,
      p_customer_email: createDto.customer_email || null,
      p_customer_name: createDto.customer_name || null,
      p_customer_phone: createDto.customer_phone || null,
      p_customer_city: createDto.customer_city || null,
      p_customer_country: createDto.customer_country || null,
      p_customer_address: createDto.customer_address || null,
      p_customer_postal_code: createDto.customer_postal_code || null,
      p_allow_coupon_code: createDto.allow_coupon_code ?? false,
      p_require_billing_address: createDto.require_billing_address ?? false,
      p_payment_link_id: createDto.payment_link_id || null,
      ...(idempotency
        ? {
            p_idempotency_key: idempotency.key,
            p_idempotency_body_hash: idempotency.bodyHash,
          }
        : {}),
    };

    const { data, error } = await this.supabase.rpc(
      'create_checkout_session',
      rpcArgs,
    );

    if (process.env.LOMI_DEBUG_CHECKOUT_RPC === '1') {
      console.log('create_checkout_session RPC result:', { data, error });
    }

    if (error) throwMappedSupabaseRpcError(error.message);
    return data;
  }

  async findAll(
    user: AuthContext,
    status?: string,
    limit: number = 20,
    offset: number = 0,
  ) {
    const { data, error } = await this.supabase.rpc('list_checkout_sessions', {
      p_merchant_id: user.merchantId,
      p_status: (status as never) || null,
      p_limit: limit,
      p_offset: offset,
    });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async findOne(id: string, user: AuthContext) {
    const { data, error } = await this.supabase.getClient().rpc(
      'get_checkout_session_api' as any,
      {
        p_checkout_session_id: id,
        p_organization_id: user.organizationId,
      } as any,
    );

    const dataArray = Array.isArray(data) ? data : [data];
    const session = dataArray[0];

    if (error || !session) {
      throw new NotFoundException(
        `Checkout session with ID ${id} not found or access denied`,
      );
    }

    return session;
  }
}
