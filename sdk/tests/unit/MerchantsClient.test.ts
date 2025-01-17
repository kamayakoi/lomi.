import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { MerchantsClient } from '../../src/client/MerchantsClient';
import { ApiResult } from '../../src/client/core/ApiResult';
import * as Types from '../../src/types/api';

// Mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe('MerchantsClient', () => {
  const mockBaseUrl = 'https://api.test.com';
  const mockApiKey = 'test-api-key';
  let client: MerchantsClient;

  beforeEach(() => {
    client = new MerchantsClient(mockBaseUrl, mockApiKey);
    mockFetch.mockClear();
  });

  describe('get', () => {
    const mockMerchantId = '123e4567-e89b-12d3-a456-426614174000';
    const mockMerchant: Types.Merchant = {
      merchant_id: mockMerchantId,
      name: 'Test Merchant',
      email: 'merchant@test.com',
      phone_number: '+1234567890',
      onboarded: true,
      country: 'US',
      avatar_url: 'https://test.com/avatar.png',
      preferred_language: 'en',
      timezone: 'UTC',
      metadata: { test: 'data' },
      created_at: new Date('2024-01-17T00:00:00Z'),
      updated_at: new Date('2024-01-17T00:00:00Z')
    };

    it('should get merchant details successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockMerchant)
      } as Response);

      const result = await client.get(mockMerchantId);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.test.com/merchants/${mockMerchantId}`,
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
      expect(result.data).toEqual(mockMerchant);
    });
  });

  describe('list', () => {
    const mockMerchantId = '123e4567-e89b-12d3-a456-426614174000';
    const mockConnectedProviders: Types.ConnectedProvider[] = [
      {
        provider_code: Types.ProviderCode.ORANGE,
        is_connected: true,
        phone_number: '+1234567890',
        is_phone_verified: true,
        metadata: { test: 'data1' },
        created_at: new Date('2024-01-17T00:00:00Z'),
        updated_at: new Date('2024-01-17T00:00:00Z')
      },
      {
        provider_code: Types.ProviderCode.WAVE,
        is_connected: true,
        phone_number: '+0987654321',
        is_phone_verified: true,
        metadata: { test: 'data2' },
        created_at: new Date('2024-01-17T00:00:00Z'),
        updated_at: new Date('2024-01-17T00:00:00Z')
      }
    ];

    it('should list connected providers successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockConnectedProviders)
      } as Response);

      const result = await client.list(mockMerchantId);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.test.com/merchants/${mockMerchantId}/providers`,
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
      expect(result.data).toEqual(mockConnectedProviders);
    });
  });
}); 