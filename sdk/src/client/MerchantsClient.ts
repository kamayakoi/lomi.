import { BaseClient } from './BaseClient';
import { ApiResult } from './core/ApiResult';
import * as Types from '../types/api';

export class MerchantsClient extends BaseClient {

  /**
 * Get merchant details
 */
  public async get(merchant_id: string): Promise<ApiResult<Types.Merchant>> {
    return this.request({
      method: 'GET',
      path: '/merchants/{merchant_id}',
      params: { merchant_id: merchant_id }
    });
  }

  /**
 * List connected payment providers for a merchant
 */
  public async list(merchant_id: string): Promise<ApiResult<Types.ConnectedProvider[]>> {
    return this.request({
      method: 'GET',
      path: '/merchants/{merchant_id}/providers',
      params: { merchant_id: merchant_id }
    });
  }
}