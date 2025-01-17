import { BaseClient } from './BaseClient';
import { ApiResult } from './core/ApiResult';
import * as Types from '../types/api';

export class CheckoutSessionsClient extends BaseClient {

  /**
 * Create a checkout session
 * Create a new checkout session for collecting payments
 */
  public async create(data: Types.CreateCheckoutSession): Promise<ApiResult<Types.CheckoutSession>> {
    return this.request({
      method: 'POST',
      path: '/checkout-sessions',
      data
    });
  }

  /**
 * List checkout sessions
 * List all checkout sessions for a merchant
 */
  public async list(params?: { merchant_id: string, checkout_session_id?: string, status?: string }): Promise<ApiResult<Types.CheckoutSession[]>> {
    return this.request({
      method: 'GET',
      path: '/checkout-sessions',
      params
    });
  }
}