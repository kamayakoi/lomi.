import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { PaymentLinksClient } from '../../src/client/PaymentLinksClient';
import { ApiResult } from '../../src/client/core/ApiResult';
import * as Types from '../../src/types/api';

// Mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe('PaymentLinksClient', () => {
  const mockBaseUrl = 'https://api.test.com';
  const mockApiKey = 'test-api-key';
  let client: PaymentLinksClient;

  beforeEach(() => {
    client = new PaymentLinksClient(mockBaseUrl, mockApiKey);
    mockFetch.mockClear();
  });

  describe('create', () => {
    const mockCreatePaymentLinkData: Types.CreatePaymentLink = {
      merchant_id: '123e4567-e89b-12d3-a456-426614174000',
      link_type: Types.PaymentLinkType.product,
      product_id: '123e4567-e89b-12d3-a456-426614174001',
      title: 'Test Product Link',
      public_description: 'A test payment link for a product',
      private_description: 'Internal notes about this link',
      currency_code: Types.CurrencyCode.USD,
      allowed_providers: [Types.ProviderCode.WAVE, Types.ProviderCode.ORANGE],
      allow_coupon_code: true,
      is_active: true,
      expires_at: new Date('2024-12-31T23:59:59Z'),
      success_url: 'https://example.com/success',
      metadata: { test: 'data' }
    };

    const mockPaymentLinkResponse: Types.PaymentLink = {
      ...mockCreatePaymentLinkData,
      link_id: '123e4567-e89b-12d3-a456-426614174002',
      organization_id: '123e4567-e89b-12d3-a456-426614174003',
      url: 'https://pay.test.com/p/123e4567',
      created_at: new Date('2024-01-17T00:00:00Z'),
      updated_at: new Date('2024-01-17T00:00:00Z')
    };

    it('should create a payment link successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve(mockPaymentLinkResponse)
      } as Response);

      const result = await client.create(mockCreatePaymentLinkData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/payment-links',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': mockApiKey
          },
          body: JSON.stringify(mockCreatePaymentLinkData)
        })
      );

      expect(result).toBeInstanceOf(ApiResult);
      expect(result.status).toBe(201);
      expect(result.data).toEqual(mockPaymentLinkResponse);
    });
  });

  describe('list', () => {
    const mockMerchantId = '123e4567-e89b-12d3-a456-426614174000';
    const mockPaymentLinks: Types.PaymentLink[] = [
      {
        link_id: '123e4567-e89b-12d3-a456-426614174001',
        merchant_id: mockMerchantId,
        organization_id: '123e4567-e89b-12d3-a456-426614174002',
        link_type: Types.PaymentLinkType.product,
        url: 'https://pay.test.com/p/123e4567-1',
        product_id: '123e4567-e89b-12d3-a456-426614174003',
        title: 'Product Link 1',
        public_description: 'First test payment link',
        private_description: 'Internal notes 1',
        currency_code: Types.CurrencyCode.USD,
        allowed_providers: [Types.ProviderCode.WAVE],
        allow_coupon_code: true,
        is_active: true,
        expires_at: new Date('2024-12-31T23:59:59Z'),
        success_url: 'https://example.com/success',
        metadata: { test: 'data1' },
        created_at: new Date('2024-01-17T00:00:00Z'),
        updated_at: new Date('2024-01-17T00:00:00Z')
      },
      {
        link_id: '123e4567-e89b-12d3-a456-426614174004',
        merchant_id: mockMerchantId,
        organization_id: '123e4567-e89b-12d3-a456-426614174002',
        link_type: Types.PaymentLinkType.instant,
        url: 'https://pay.test.com/p/123e4567-2',
        title: 'Instant Link 1',
        public_description: 'Second test payment link',
        private_description: 'Internal notes 2',
        price: 1000,
        currency_code: Types.CurrencyCode.EUR,
        allowed_providers: [Types.ProviderCode.ORANGE],
        allow_coupon_code: false,
        is_active: true,
        success_url: 'https://example.com/success',
        metadata: { test: 'data2' },
        created_at: new Date('2024-01-17T00:00:00Z'),
        updated_at: new Date('2024-01-17T00:00:00Z')
      }
    ];

    it('should list payment links successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockPaymentLinks)
      } as Response);

      const result = await client.list({ merchant_id: mockMerchantId });

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.test.com/payment-links?merchant_id=${mockMerchantId}`,
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
      expect(result.data).toEqual(mockPaymentLinks);
    });

    it('should list payment links with filters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockPaymentLinks)
      } as Response);

      const filters = {
        merchant_id: mockMerchantId,
        link_type: 'product',
        currency_code: Types.CurrencyCode.USD,
        is_active: 'true'
      };

      const result = await client.list(filters);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.test.com/payment-links?merchant_id=${mockMerchantId}&link_type=${filters.link_type}&currency_code=${filters.currency_code}&is_active=${filters.is_active}`,
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
      expect(result.data).toEqual(mockPaymentLinks);
    });
  });

  describe('get', () => {
    const mockLinkId = '123e4567-e89b-12d3-a456-426614174001';
    const mockPaymentLink: Types.PaymentLink = {
      link_id: mockLinkId,
      merchant_id: '123e4567-e89b-12d3-a456-426614174000',
      organization_id: '123e4567-e89b-12d3-a456-426614174002',
      link_type: Types.PaymentLinkType.product,
      url: 'https://pay.test.com/p/123e4567',
      product_id: '123e4567-e89b-12d3-a456-426614174003',
      title: 'Test Product Link',
      public_description: 'A test payment link',
      private_description: 'Internal notes',
      currency_code: Types.CurrencyCode.USD,
      allowed_providers: [Types.ProviderCode.WAVE],
      allow_coupon_code: true,
      is_active: true,
      expires_at: new Date('2024-12-31T23:59:59Z'),
      success_url: 'https://example.com/success',
      metadata: { test: 'data' },
      created_at: new Date('2024-01-17T00:00:00Z'),
      updated_at: new Date('2024-01-17T00:00:00Z')
    };

    it('should get a payment link successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockPaymentLink)
      } as Response);

      const result = await client.get(mockLinkId);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.test.com/payment-links/${mockLinkId}`,
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
      expect(result.data).toEqual(mockPaymentLink);
    });
  });

  describe('patch', () => {
    const mockLinkId = '123e4567-e89b-12d3-a456-426614174001';
    const mockUpdateData = {
      title: 'Updated Link Title',
      public_description: 'Updated description',
      private_description: 'Updated internal notes',
      currency_code: Types.CurrencyCode.EUR,
      allowed_providers: [Types.ProviderCode.ORANGE],
      allow_coupon_code: false,
      is_active: false,
      expires_at: new Date('2025-12-31T23:59:59Z'),
      success_url: 'https://example.com/updated-success',
      metadata: { test: 'updated' }
    };

    const mockUpdatedPaymentLink: Types.PaymentLink = {
      ...mockUpdateData,
      link_id: mockLinkId,
      merchant_id: '123e4567-e89b-12d3-a456-426614174000',
      organization_id: '123e4567-e89b-12d3-a456-426614174002',
      link_type: Types.PaymentLinkType.product,
      url: 'https://pay.test.com/p/123e4567',
      product_id: '123e4567-e89b-12d3-a456-426614174003',
      created_at: new Date('2024-01-17T00:00:00Z'),
      updated_at: new Date('2024-01-17T00:00:00Z')
    };

    it('should update a payment link successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockUpdatedPaymentLink)
      } as Response);

      const result = await client.patch(mockLinkId, mockUpdateData);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.test.com/payment-links/${mockLinkId}`,
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
      expect(result.data).toEqual(mockUpdatedPaymentLink);
    });
  });

  describe('delete', () => {
    const mockLinkId = '123e4567-e89b-12d3-a456-426614174001';

    it('should delete a payment link successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: () => Promise.resolve(undefined)
      } as Response);

      const result = await client.delete(mockLinkId);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.test.com/payment-links/${mockLinkId}`,
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