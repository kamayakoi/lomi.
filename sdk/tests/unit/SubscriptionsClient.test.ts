import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { SubscriptionsClient } from '../../src/client/SubscriptionsClient';
import { ApiResult } from '../../src/client/core/ApiResult';
import * as Types from '../../src/types/api';

// Mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe('SubscriptionsClient', () => {
  const mockBaseUrl = 'https://api.test.com';
  const mockApiKey = 'test-api-key';
  let client: SubscriptionsClient;

  beforeEach(() => {
    client = new SubscriptionsClient(mockBaseUrl, mockApiKey);
    mockFetch.mockClear();
  });

  describe('create', () => {
    const mockCreateSubscriptionPlanData: Types.CreateSubscriptionPlan = {
      name: 'Test Plan',
      description: 'A test subscription plan',
      amount: 1000,
      currency_code: Types.CurrencyCode.USD,
      billing_frequency: Types.BillingFrequency.monthly,
      failed_payment_action: Types.FailedPaymentAction.continue,
      charge_day: 1,
      metadata: { test: 'data' },
      display_on_storefront: true,
      image_url: 'https://example.com/image.jpg',
      first_payment_type: Types.FirstPaymentType.initial
    };

    const mockSubscriptionPlanResponse: Types.SubscriptionPlan = {
      ...mockCreateSubscriptionPlanData,
      plan_id: '123e4567-e89b-12d3-a456-426614174000',
      merchant_id: '123e4567-e89b-12d3-a456-426614174001',
      organization_id: '123e4567-e89b-12d3-a456-426614174002',
      created_at: new Date('2024-01-17T00:00:00Z'),
      updated_at: new Date('2024-01-17T00:00:00Z')
    };

    it('should create a subscription plan successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve(mockSubscriptionPlanResponse)
      } as Response);

      const result = await client.create(mockCreateSubscriptionPlanData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/subscriptions',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': mockApiKey
          },
          body: JSON.stringify(mockCreateSubscriptionPlanData)
        })
      );

      expect(result).toBeInstanceOf(ApiResult);
      expect(result.status).toBe(201);
      expect(result.data).toEqual(mockSubscriptionPlanResponse);
    });
  });

  describe('list', () => {
    const mockMerchantId = '123e4567-e89b-12d3-a456-426614174000';
    const mockSubscriptionPlans: Types.SubscriptionPlan[] = [
      {
        plan_id: '123e4567-e89b-12d3-a456-426614174001',
        merchant_id: mockMerchantId,
        organization_id: '123e4567-e89b-12d3-a456-426614174002',
        name: 'Plan 1',
        description: 'First test plan',
        amount: 1000,
        currency_code: Types.CurrencyCode.USD,
        billing_frequency: Types.BillingFrequency.monthly,
        failed_payment_action: Types.FailedPaymentAction.continue,
        charge_day: 1,
        metadata: { test: 'data' },
        display_on_storefront: true,
        image_url: 'https://example.com/image1.jpg',
        first_payment_type: Types.FirstPaymentType.initial,
        created_at: new Date('2024-01-17T00:00:00Z'),
        updated_at: new Date('2024-01-17T00:00:00Z')
      },
      {
        plan_id: '123e4567-e89b-12d3-a456-426614174003',
        merchant_id: mockMerchantId,
        organization_id: '123e4567-e89b-12d3-a456-426614174002',
        name: 'Plan 2',
        description: 'Second test plan',
        amount: 2000,
        currency_code: Types.CurrencyCode.USD,
        billing_frequency: Types.BillingFrequency.yearly,
        failed_payment_action: Types.FailedPaymentAction.cancel,
        charge_day: 15,
        metadata: { test: 'data' },
        display_on_storefront: true,
        image_url: 'https://example.com/image2.jpg',
        first_payment_type: Types.FirstPaymentType.non_initial,
        created_at: new Date('2024-01-17T00:00:00Z'),
        updated_at: new Date('2024-01-17T00:00:00Z')
      }
    ];

    it('should list subscription plans successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockSubscriptionPlans)
      } as Response);

      const result = await client.list({ merchant_id: mockMerchantId });

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.test.com/subscriptions?merchant_id=${mockMerchantId}`,
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
      expect(result.data).toEqual(mockSubscriptionPlans);
    });

    it('should list subscription plans without filters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockSubscriptionPlans)
      } as Response);

      const result = await client.list();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/subscriptions',
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
      expect(result.data).toEqual(mockSubscriptionPlans);
    });
  });

  describe('get', () => {
    const mockPlanId = '123e4567-e89b-12d3-a456-426614174001';
    const mockSubscriptionPlan: Types.SubscriptionPlan = {
      plan_id: mockPlanId,
      merchant_id: '123e4567-e89b-12d3-a456-426614174000',
      organization_id: '123e4567-e89b-12d3-a456-426614174002',
      name: 'Test Plan',
      description: 'A test subscription plan',
      amount: 1000,
      currency_code: Types.CurrencyCode.USD,
      billing_frequency: Types.BillingFrequency.monthly,
      failed_payment_action: Types.FailedPaymentAction.continue,
      charge_day: 1,
      metadata: { test: 'data' },
      display_on_storefront: true,
      image_url: 'https://example.com/image.jpg',
      first_payment_type: Types.FirstPaymentType.initial,
      created_at: new Date('2024-01-17T00:00:00Z'),
      updated_at: new Date('2024-01-17T00:00:00Z')
    };

    it('should get a subscription plan successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockSubscriptionPlan)
      } as Response);

      const result = await client.get(mockPlanId);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.test.com/subscriptions/${mockPlanId}`,
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
      expect(result.data).toEqual(mockSubscriptionPlan);
    });
  });

  describe('patch', () => {
    const mockPlanId = '123e4567-e89b-12d3-a456-426614174001';
    const mockUpdateData = {
      name: 'Updated Plan',
      description: 'An updated test plan',
      amount: 2000,
      currency_code: Types.CurrencyCode.USD,
      billing_frequency: Types.BillingFrequency.yearly,
      failed_payment_action: Types.FailedPaymentAction.cancel,
      charge_day: 15,
      metadata: { test: 'updated' },
      display_on_storefront: false,
      image_url: 'https://example.com/updated-image.jpg',
      first_payment_type: Types.FirstPaymentType.non_initial
    };

    const mockUpdatedSubscriptionPlan: Types.SubscriptionPlan = {
      ...mockUpdateData,
      plan_id: mockPlanId,
      merchant_id: '123e4567-e89b-12d3-a456-426614174000',
      organization_id: '123e4567-e89b-12d3-a456-426614174002',
      created_at: new Date('2024-01-17T00:00:00Z'),
      updated_at: new Date('2024-01-17T00:00:00Z')
    };

    it('should update a subscription plan successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockUpdatedSubscriptionPlan)
      } as Response);

      const result = await client.patch(mockPlanId, mockUpdateData);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.test.com/subscriptions/${mockPlanId}`,
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
      expect(result.data).toEqual(mockUpdatedSubscriptionPlan);
    });
  });

  describe('delete', () => {
    const mockPlanId = '123e4567-e89b-12d3-a456-426614174001';

    it('should delete a subscription plan successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: () => Promise.resolve(undefined)
      } as Response);

      const result = await client.delete(mockPlanId);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.test.com/subscriptions/${mockPlanId}`,
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