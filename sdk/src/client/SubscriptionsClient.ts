import { BaseClient } from './BaseClient';
import { ApiResult } from './core/ApiResult';
import * as Types from '../types/api';

export class SubscriptionsClient extends BaseClient {

  /**
 * Create a subscription plan
 */
  public async create(data: Types.CreateSubscriptionPlan): Promise<ApiResult<Types.SubscriptionPlan>> {
    return this.request({
      method: 'POST',
      path: '/subscriptions',
      data
    });
  }

  /**
 * List subscription plans for a merchant
 */
  public async list(params?: { merchant_id: string }): Promise<ApiResult<Types.SubscriptionPlan[]>> {
    return this.request({
      method: 'GET',
      path: '/subscriptions',
      params
    });
  }

  /**
 * Get subscription plan details
 * Get details of a specific subscription plan
 */
  public async get(plan_id: string): Promise<ApiResult<Types.SubscriptionPlan>> {
    return this.request({
      method: 'GET',
      path: '/subscriptions/{plan_id}',
      params: { plan_id: plan_id }
    });
  }

  /**
 * Update subscription plan
 * Update subscription plan details
 */
  public async patch(plan_id: string, data: Record<string, unknown>): Promise<ApiResult<Types.SubscriptionPlan>> {
    return this.request({
      method: 'PATCH',
      path: '/subscriptions/{plan_id}',
      params: { plan_id: plan_id },
      data
    });
  }

  /**
 * Delete subscription plan
 * Delete a subscription plan
 */
  public async delete(plan_id: string): Promise<ApiResult<void>> {
    return this.request({
      method: 'DELETE',
      path: '/subscriptions/{plan_id}',
      params: { plan_id: plan_id }
    });
  }
}