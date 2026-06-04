import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../utils/supabase/supabase.service';
import { AuthContext } from '../common/decorators/current-user.decorator';
import { environmentFromAuth } from '../common/auth-environment';
import { isNetworkRequest } from '../common/network-context';

@Injectable()
export class TransactionsService {
  constructor(private readonly supabase: SupabaseService) {}

  /**
   * List all transactions for merchant's organization with advanced filtering
   * Uses RPC: fetch_transactions
   */
  async findAll(
    user: AuthContext,
    providerCode?: string,
    status?: string[],
    type?: string[],
    currency?: string[],
    paymentMethod?: string[],
    page: number = 1,
    pageSize: number = 50,
    startDate?: string,
    endDate?: string,
    isPos?: boolean,
  ) {
    if (isNetworkRequest(user)) {
      const { data, error } = await this.supabase.getClient().rpc(
        'fetch_network_transactions_for_api' as any,
        {
          p_network_membership_id: user.networkMembershipId,
          p_provider_code: providerCode || null,
          p_status: status || null,
          p_type: type || null,
          p_currency: currency || null,
          p_payment_method: paymentMethod || null,
          p_page: page,
          p_page_size: pageSize,
          p_start_date: startDate || null,
          p_end_date: endDate || null,
          p_is_pos: isPos !== undefined ? isPos : null,
          p_environment: environmentFromAuth(user),
          p_read_scope:
            user.networkCapabilityKey === 'transaction.read' ? 'all' : 'own',
        } as any,
      );

      if (error) throw new Error(error.message);

      return data || [];
    }

    const { data, error } = await this.supabase.getClient().rpc(
      'fetch_transactions' as any,
      {
        p_organization_id: user.organizationId,
        p_provider_code: providerCode || null,
        p_status: status || null,
        p_type: type || null,
        p_currency: currency || null,
        p_payment_method: paymentMethod || null,
        p_page: page,
        p_page_size: pageSize,
        p_start_date: startDate || null,
        p_end_date: endDate || null,
        p_is_pos: isPos !== undefined ? isPos : null,
        p_environment: environmentFromAuth(user),
      } as any,
    );

    if (error) throw new Error(error.message);

    return data || [];
  }

  /**
   * Get single transaction by ID
   * Uses RPC: get_transaction (with organization_id filter)
   */
  async findOne(id: string, user: AuthContext) {
    if (isNetworkRequest(user)) {
      const { data, error } = await this.supabase.getClient().rpc(
        'get_network_transaction_for_api' as any,
        {
          p_network_membership_id: user.networkMembershipId,
          p_transaction_id: id,
          p_environment: environmentFromAuth(user),
          p_read_scope:
            user.networkCapabilityKey === 'transaction.read' ? 'all' : 'own',
        } as any,
      );

      if (error) {
        throw new Error(`RPC Error: ${error.message || 'Unknown error'}`);
      }

      const dataArray = Array.isArray(data) ? data : [data];
      const transaction = dataArray[0] as any;

      if (!transaction || !transaction.transaction_id) {
        throw new NotFoundException(
          `Transaction with ID ${id} not found or access denied`,
        );
      }

      return transaction;
    }

    const { data, error } = await this.supabase.getClient().rpc(
      'get_transaction' as any,
      {
        p_transaction_id: id,
        p_organization_id: user.organizationId,
      } as any,
    );

    if (error) {
      throw new Error(`RPC Error: ${error.message || 'Unknown error'}`);
    }

    // RPC functions that return TABLE return an array
    // Handle null, undefined, or empty responses
    if (!data) {
      throw new NotFoundException(
        `Transaction with ID ${id} not found or access denied`,
      );
    }

    // Ensure data is an array - type assertion for TypeScript
    const dataArray = Array.isArray(data) ? data : [data];
    const results = dataArray as any[];
    const transaction = results[0] as any;

    if (!transaction || !transaction.transaction_id) {
      throw new NotFoundException(
        `Transaction with ID ${id} not found or access denied`,
      );
    }

    // Organization ownership is already validated by the RPC function
    return transaction;
  }
}
