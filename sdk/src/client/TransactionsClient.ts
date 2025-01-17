import { BaseClient } from './BaseClient';
import { ApiResult } from './core/ApiResult';
import * as Types from '../types/api';

export class TransactionsClient extends BaseClient {

  /**
 * Create a transaction
 */
  public async create(data: Types.CreateTransaction): Promise<ApiResult<Types.Transaction>> {
    return this.request({
      method: 'POST',
      path: '/transactions',
      data
    });
  }

  /**
 * List transactions for a merchant
 */
  public async list(params?: { merchant_id: string }): Promise<ApiResult<Types.Transaction[]>> {
    return this.request({
      method: 'GET',
      path: '/transactions',
      params
    });
  }
}