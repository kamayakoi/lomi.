import { BaseClient } from './BaseClient';
import { ApiResult } from './core/ApiResult';
import * as Types from '../types/api';

export class PaymentLinksClient extends BaseClient {

  /**
 * Create a payment link
 * Create a new payment link for collecting payments
 */
  public async create(data: Types.CreatePaymentLink): Promise<ApiResult<Types.PaymentLink>> {
    return this.request({
      method: 'POST',
      path: '/payment-links',
      data
    });
  }

  /**
 * List payment links
 * List all payment links for a merchant
 */
  public async list(params?: { merchant_id: string, link_type?: string, currency_code?: string, is_active?: string }): Promise<ApiResult<Types.PaymentLink[]>> {
    return this.request({
      method: 'GET',
      path: '/payment-links',
      params
    });
  }

  /**
 * Get payment link details
 * Get details of a specific payment link
 */
  public async get(link_id: string): Promise<ApiResult<Types.PaymentLink>> {
    return this.request({
      method: 'GET',
      path: '/payment-links/{link_id}',
      params: { link_id: link_id }
    });
  }

  /**
 * Update payment link
 * Update payment link details
 */
  public async patch(link_id: string, data: Record<string, unknown>): Promise<ApiResult<Types.PaymentLink>> {
    return this.request({
      method: 'PATCH',
      path: '/payment-links/{link_id}',
      params: { link_id: link_id },
      data
    });
  }

  /**
 * Delete payment link
 * Delete a payment link
 */
  public async delete(link_id: string): Promise<ApiResult<void>> {
    return this.request({
      method: 'DELETE',
      path: '/payment-links/{link_id}',
      params: { link_id: link_id }
    });
  }
}