import { BaseClient } from './BaseClient';
import { ApiResult } from './core/ApiResult';
import * as Types from '../types/api';

export class ProductsClient extends BaseClient {

  /**
 * Create a new product
 */
  public async create(data: Types.CreateProduct): Promise<ApiResult<Types.Product>> {
    return this.request({
      method: 'POST',
      path: '/products',
      data
    });
  }

  /**
 * List products for a merchant
 */
  public async list(params?: { merchant_id: string }): Promise<ApiResult<Types.Product[]>> {
    return this.request({
      method: 'GET',
      path: '/products',
      params
    });
  }
}