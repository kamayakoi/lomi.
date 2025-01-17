import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { CheckoutSessionsClient } from '../../src/client/CheckoutSessionsClient';
import { ApiResult } from '../../src/client/core/ApiResult';
import * as Types from '../../src/types/api';

// Mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe('CheckoutSessionsClient', () => {
  const mockBaseUrl = 'https://api.test.com';
  const mockApiKey = 'test-api-key';
  let client: CheckoutSessionsClient;

  beforeEach(() => {
    client = new CheckoutSessionsClient(mockBaseUrl, mockApiKey);
    mockFetch.mockClear();
  });

  describe('create', () => {
    const mockCreateData: Types.CreateCheckoutSession = {
      merchant_id: '123e4567-e89b-12d3-a456-426614174000',
      success_url: 'https://success.test.com',
      cancel_url: 'https://cancel.test.com',
      provider_codes: [Types.ProviderCode.ORANGE, Types.ProviderCode.WAVE],
      customer_email: 'test@example.com',
      customer_name: 'Test Customer'
    };

    const mockResponse: Types.CheckoutSession = {
      ...mockCreateData,
      checkout_session_id: '123e4567-e89b-12d3-a456-426614174001',
      url: 'https://checkout.test.com/session',
      status: 'open',
      created_at: new Date('2024-01-17T00:00:00Z'),
      expires_at: new Date('2024-01-17T01:00:00Z')
    };

    it('should create a checkout session successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve(mockResponse)
      } as Response);

      const result = await client.create(mockCreateData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/checkout-sessions',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': mockApiKey
          },
          body: JSON.stringify(mockCreateData)
        })
      );

      expect(result).toBeInstanceOf(ApiResult);
      expect(result.status).toBe(201);
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('list', () => {
    const mockSessionId = '123e4567-e89b-12d3-a456-426614174001';
    const mockMerchantId = '123e4567-e89b-12d3-a456-426614174000';
    const mockSession: Types.CheckoutSession = {
      merchant_id: mockMerchantId,
      success_url: 'https://success.test.com',
      cancel_url: 'https://cancel.test.com',
      provider_codes: [Types.ProviderCode.ORANGE, Types.ProviderCode.WAVE],
      checkout_session_id: mockSessionId,
      url: 'https://checkout.test.com/session',
      status: 'open',
      created_at: new Date('2024-01-17T00:00:00Z'),
      expires_at: new Date('2024-01-17T01:00:00Z')
    };

    it('should get checkout session details successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockSession)
      } as Response);

      const result = await client.list({ 
        merchant_id: mockMerchantId,
        checkout_session_id: mockSessionId 
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.test.com/checkout-sessions?merchant_id=${mockMerchantId}&checkout_session_id=${mockSessionId}`,
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
      expect(result.data).toEqual(mockSession);
    });
  });
}); 