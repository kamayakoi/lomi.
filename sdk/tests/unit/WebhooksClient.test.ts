import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { WebhooksClient } from '../../src/client/WebhooksClient';
import { ApiResult } from '../../src/client/core/ApiResult';
import * as Types from '../../src/types/api';

// Mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe('WebhooksClient', () => {
  const mockBaseUrl = 'https://api.test.com';
  const mockApiKey = 'test-api-key';
  let client: WebhooksClient;

  beforeEach(() => {
    client = new WebhooksClient(mockBaseUrl, mockApiKey);
    mockFetch.mockClear();
  });

  describe('create', () => {
    const mockCreateWebhookData: Types.CreateWebhook = {
      merchant_id: '123e4567-e89b-12d3-a456-426614174000',
      url: 'https://webhook.test.com/endpoint',
      authorized_events: [
        Types.WebhookEvent.TRANSACTION_COMPLETED,
        Types.WebhookEvent.REFUND_COMPLETED
      ],
      is_active: true,
      metadata: { test: 'data' }
    };

    const mockWebhookResponse: Types.Webhook = {
      ...mockCreateWebhookData,
      webhook_id: '123e4567-e89b-12d3-a456-426614174001',
      verification_token: 'abc123def456',
      last_triggered_at: new Date('2024-01-17T00:00:00Z'),
      last_payload: { event: 'test' },
      last_response_status: 200,
      last_response_body: '{"status":"ok"}',
      retry_count: 0,
      created_at: new Date('2024-01-17T00:00:00Z'),
      updated_at: new Date('2024-01-17T00:00:00Z')
    };

    it('should create a webhook endpoint successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve(mockWebhookResponse)
      } as Response);

      const result = await client.create(mockCreateWebhookData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/webhooks',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': mockApiKey
          },
          body: JSON.stringify(mockCreateWebhookData)
        })
      );

      expect(result).toBeInstanceOf(ApiResult);
      expect(result.status).toBe(201);
      expect(result.data).toEqual(mockWebhookResponse);
    });
  });

  describe('list', () => {
    const mockMerchantId = '123e4567-e89b-12d3-a456-426614174000';
    const mockWebhooks: Types.Webhook[] = [
      {
        webhook_id: '123e4567-e89b-12d3-a456-426614174001',
        merchant_id: mockMerchantId,
        url: 'https://webhook.test.com/endpoint1',
        authorized_events: [Types.WebhookEvent.TRANSACTION_COMPLETED],
        is_active: true,
        verification_token: 'abc123def456',
        last_triggered_at: new Date('2024-01-17T00:00:00Z'),
        last_payload: { event: 'test1' },
        last_response_status: 200,
        last_response_body: '{"status":"ok"}',
        retry_count: 0,
        metadata: { test: 'data1' },
        created_at: new Date('2024-01-17T00:00:00Z'),
        updated_at: new Date('2024-01-17T00:00:00Z')
      },
      {
        webhook_id: '123e4567-e89b-12d3-a456-426614174002',
        merchant_id: mockMerchantId,
        url: 'https://webhook.test.com/endpoint2',
        authorized_events: [Types.WebhookEvent.REFUND_COMPLETED],
        is_active: false,
        verification_token: 'ghi789jkl012',
        last_triggered_at: new Date('2024-01-17T00:00:00Z'),
        last_payload: { event: 'test2' },
        last_response_status: 200,
        last_response_body: '{"status":"ok"}',
        retry_count: 1,
        metadata: { test: 'data2' },
        created_at: new Date('2024-01-17T00:00:00Z'),
        updated_at: new Date('2024-01-17T00:00:00Z')
      }
    ];

    it('should list webhook endpoints successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockWebhooks)
      } as Response);

      const result = await client.list({ merchant_id: mockMerchantId });

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.test.com/webhooks?merchant_id=${mockMerchantId}`,
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': mockApiKey
          }
        })
      );

      expect(result).toBeInstanceOf(ApiResult);
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockWebhooks);
    });

    it('should list webhook endpoints with filters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve([mockWebhooks[0]])
      } as Response);

      const filters = {
        merchant_id: mockMerchantId,
        is_active: 'true'
      };

      const result = await client.list(filters);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.test.com/webhooks?merchant_id=${mockMerchantId}&is_active=true`,
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': mockApiKey
          }
        })
      );

      expect(result).toBeInstanceOf(ApiResult);
      expect(result.status).toBe(200);
      expect(result.data).toEqual([mockWebhooks[0]]);
    });
  });

  describe('get', () => {
    const mockWebhookId = '123e4567-e89b-12d3-a456-426614174001';
    const mockWebhook: Types.Webhook = {
      webhook_id: mockWebhookId,
      merchant_id: '123e4567-e89b-12d3-a456-426614174000',
      url: 'https://webhook.test.com/endpoint',
      authorized_events: [Types.WebhookEvent.TRANSACTION_COMPLETED],
      is_active: true,
      verification_token: 'abc123def456',
      last_triggered_at: new Date('2024-01-17T00:00:00Z'),
      last_payload: { event: 'test' },
      last_response_status: 200,
      last_response_body: '{"status":"ok"}',
      retry_count: 0,
      metadata: { test: 'data' },
      created_at: new Date('2024-01-17T00:00:00Z'),
      updated_at: new Date('2024-01-17T00:00:00Z')
    };

    it('should get a webhook endpoint successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockWebhook)
      } as Response);

      const result = await client.get(mockWebhookId);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.test.com/webhooks/${mockWebhookId}`,
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': mockApiKey
          }
        })
      );

      expect(result).toBeInstanceOf(ApiResult);
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockWebhook);
    });
  });

  describe('patch', () => {
    const mockWebhookId = '123e4567-e89b-12d3-a456-426614174001';
    const mockUpdateData = {
      url: 'https://webhook.test.com/updated-endpoint',
      authorized_events: [
        Types.WebhookEvent.TRANSACTION_COMPLETED,
        Types.WebhookEvent.REFUND_COMPLETED,
        Types.WebhookEvent.SUBSCRIPTION_RENEWED
      ],
      is_active: false,
      metadata: { test: 'updated' }
    };

    const mockUpdatedWebhook: Types.Webhook = {
      webhook_id: mockWebhookId,
      merchant_id: '123e4567-e89b-12d3-a456-426614174000',
      ...mockUpdateData,
      verification_token: 'abc123def456',
      last_triggered_at: new Date('2024-01-17T00:00:00Z'),
      last_payload: { event: 'test' },
      last_response_status: 200,
      last_response_body: '{"status":"ok"}',
      retry_count: 0,
      created_at: new Date('2024-01-17T00:00:00Z'),
      updated_at: new Date('2024-01-17T00:00:00Z')
    };

    it('should update a webhook endpoint successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockUpdatedWebhook)
      } as Response);

      const result = await client.patch(mockWebhookId, mockUpdateData);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.test.com/webhooks/${mockWebhookId}`,
        expect.objectContaining({
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': mockApiKey
          },
          body: JSON.stringify(mockUpdateData)
        })
      );

      expect(result).toBeInstanceOf(ApiResult);
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockUpdatedWebhook);
    });
  });

  describe('delete', () => {
    const mockWebhookId = '123e4567-e89b-12d3-a456-426614174001';

    it('should delete a webhook endpoint successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: () => Promise.resolve(undefined)
      } as Response);

      const result = await client.delete(mockWebhookId);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.test.com/webhooks/${mockWebhookId}`,
        expect.objectContaining({
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': mockApiKey
          }
        })
      );

      expect(result).toBeInstanceOf(ApiResult);
      expect(result.status).toBe(204);
      expect(result.data).toBeUndefined();
    });
  });
}); 