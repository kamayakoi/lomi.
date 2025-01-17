import { BaseClient } from './BaseClient';
import { ApiResult } from './core/ApiResult';
import * as Types from '../types/api';

export class WebhooksClient extends BaseClient {

  /**
 * Register a new webhook endpoint
 * Create a new webhook endpoint for receiving event notifications
 */
  public async create(data: Types.CreateWebhook): Promise<ApiResult<Types.Webhook>> {
    return this.request({
      method: 'POST',
      path: '/webhooks',
      data
    });
  }

  /**
 * List webhook endpoints
 * List all webhook endpoints for a merchant
 */
  public async list(params?: { merchant_id: string, is_active?: string }): Promise<ApiResult<Types.Webhook[]>> {
    return this.request({
      method: 'GET',
      path: '/webhooks',
      params
    });
  }

  /**
 * Get webhook details
 * Get details of a specific webhook endpoint
 */
  public async get(webhook_id: string): Promise<ApiResult<Types.Webhook>> {
    return this.request({
      method: 'GET',
      path: '/webhooks/{webhook_id}',
      params: { webhook_id: webhook_id }
    });
  }

  /**
 * Update webhook configuration
 * Update webhook endpoint configuration
 */
  public async patch(webhook_id: string, data: Record<string, unknown>): Promise<ApiResult<Types.Webhook>> {
    return this.request({
      method: 'PATCH',
      path: '/webhooks/{webhook_id}',
      params: { webhook_id: webhook_id },
      data
    });
  }

  /**
 * Delete webhook endpoint
 * Delete a webhook endpoint
 */
  public async delete(webhook_id: string): Promise<ApiResult<void>> {
    return this.request({
      method: 'DELETE',
      path: '/webhooks/{webhook_id}',
      params: { webhook_id: webhook_id }
    });
  }
}