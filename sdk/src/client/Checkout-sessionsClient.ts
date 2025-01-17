import { BaseClient } from './BaseClient';
import { ApiResult } from './core/ApiResult';
import * as Types from '../types/api';

export class CheckoutSessionsClient extends BaseClient {

  /**
 * Create a checkout session
 */
  public async create(data: Types.CreateCheckoutSession): Promise<ApiResult<Types.CheckoutSession>> {
    return this.request({
      method: 'POST',
      path: '/checkout-sessions',
      data
    });
  }

  /**
 * Get checkout session details
 */
  public async get(params: { checkout_session_id: string }): Promise<ApiResult<Types.CheckoutSession>> {
    return this.request({
      method: 'GET',
      path: '/checkout-sessions',
      params
    });
  }
}