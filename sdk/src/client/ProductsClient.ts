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

  /**
 * Get product details
 * Get details of a specific product
 */
  public async get(product_id: string): Promise<ApiResult<Types.Product>> {
    return this.request({
      method: 'GET',
      path: '/products/{product_id}',
      params: { product_id: product_id }
    });
  }

  /**
 * Update product
 * Update product details
 */
  public async patch(product_id: string, data: Record<string, unknown>): Promise<ApiResult<Types.Product>> {
    return this.request({
      method: 'PATCH',
      path: '/products/{product_id}',
      params: { product_id: product_id },
      data
    });
  }

  /**
 * Delete product
 * Delete a product
 */
  public async delete(product_id: string): Promise<ApiResult<void>> {
    return this.request({
      method: 'DELETE',
      path: '/products/{product_id}',
      params: { product_id: product_id }
    });
  }
}