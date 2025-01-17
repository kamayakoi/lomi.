import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { LomiSDK } from '../../src';
import * as Types from '../../src/types/api';
import { ApiError } from '../../src/client/core/ApiError';

// Mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe('Environment Handling', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('SDK Initialization', () => {
    it('should initialize with auto baseUrl', () => {
      const sdk = new LomiSDK({ baseUrl: 'auto', apiKey: 'lomi_sk_test_123' });
      expect(sdk).toBeDefined();
    });

    it('should initialize with custom baseUrl', () => {
      const sdk = new LomiSDK({ baseUrl: 'https://custom.api.com', apiKey: 'lomi_sk_test_123' });
      expect(sdk).toBeDefined();
    });

    it('should throw error if no API key provided', () => {
      expect(() => new LomiSDK({ baseUrl: 'auto' })).toThrow('API key is required');
    });
  });

  describe('Test Environment', () => {
    const testApiKey = 'lomi_sk_test_123';
    let sdk: LomiSDK;

    beforeEach(() => {
      sdk = new LomiSDK({
        baseUrl: 'auto',
        apiKey: testApiKey
      });
    });

    it('should use sandbox URL and include test environment headers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ message: 'pong' })
      } as Response);

      await sdk.ping.list();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://sandbox.api.lomi.africa/v1/ping',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': testApiKey,
            'X-Environment': 'test'
          }
        })
      );
    });

    it('should handle test transactions correctly', async () => {
      const mockTransaction: Types.CreateTransaction = {
        merchant_id: 'merchant_123',
        organization_id: 'org_123',
        customer_id: 'cust_123',
        product_id: undefined,
        subscription_id: undefined,
        transaction_type: Types.TransactionType.payment,
        description: 'Test transaction',
        reference_id: 'ref_123',
        metadata: {},
        gross_amount: 1000,
        fee_amount: 50,
        net_amount: 950,
        fee_reference: 'XOF/WAVE Mobile Money Fee',
        currency_code: Types.CurrencyCode.XOF,
        provider_code: Types.ProviderCode.WAVE,
        payment_method_code: Types.PaymentMethodCode.E_WALLET
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve({
          ...mockTransaction,
          id: 'txn_123',
          status: 'completed',
          environment: 'test',
          provider_details: {
            status: 'completed',
            provider_transaction_id: 'test_txn_123',
            payment_status: 'SUCCESSFUL'
          }
        })
      } as Response);

      const result = await sdk.transactions.create(mockTransaction);

      expect(result.data.environment).toBe('test');
      expect(result.data.provider_details).toBeDefined();
      expect(result.data.status).toBe('completed');
    });

    it('should handle API errors in test environment', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({
          code: 'INVALID_REQUEST',
          message: 'Invalid transaction data'
        })
      } as Response);

      await expect(sdk.transactions.create({} as Types.CreateTransaction))
        .rejects
        .toThrow(ApiError);
    });

    it('should handle network errors in test environment', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(sdk.ping.list())
        .rejects
        .toThrow('Network error');
    });
  });

  describe('Live Environment', () => {
    const liveApiKey = 'lomi_sk_live_123';
    let sdk: LomiSDK;

    beforeEach(() => {
      sdk = new LomiSDK({
        baseUrl: 'auto',
        apiKey: liveApiKey
      });
    });

    it('should use production URL and include live environment headers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ message: 'pong' })
      } as Response);

      await sdk.ping.list();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.lomi.africa/v1/ping',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': liveApiKey,
            'X-Environment': 'live'
          }
        })
      );
    });

    it('should handle live transactions correctly', async () => {
      const mockTransaction: Types.CreateTransaction = {
        merchant_id: 'merchant_123',
        organization_id: 'org_123',
        customer_id: 'cust_123',
        product_id: undefined,
        subscription_id: undefined,
        transaction_type: Types.TransactionType.payment,
        description: 'Live transaction',
        reference_id: 'ref_123',
        metadata: {},
        gross_amount: 1000,
        fee_amount: 50,
        net_amount: 950,
        fee_reference: 'XOF/WAVE Mobile Money Fee',
        currency_code: Types.CurrencyCode.XOF,
        provider_code: Types.ProviderCode.WAVE,
        payment_method_code: Types.PaymentMethodCode.E_WALLET
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve({
          ...mockTransaction,
          id: 'txn_123',
          status: 'pending',
          environment: 'live',
          provider_details: {
            status: 'pending',
            provider_transaction_id: 'wave_123',
            payment_status: 'PENDING'
          }
        })
      } as Response);

      const result = await sdk.transactions.create(mockTransaction);

      expect(result.data.environment).toBe('live');
      expect(result.data.provider_details).toBeDefined();
      expect(result.data.status).toBe('pending');
    });

    it('should handle API errors in live environment', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({
          code: 'INVALID_REQUEST',
          message: 'Invalid transaction data'
        })
      } as Response);

      await expect(sdk.transactions.create({} as Types.CreateTransaction))
        .rejects
        .toThrow(ApiError);
    });

    it('should handle network errors in live environment', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(sdk.ping.list())
        .rejects
        .toThrow('Network error');
    });
  });

  describe('Environment Detection', () => {
    it('should detect test environment from API key prefix', () => {
      const sdk = new LomiSDK({ baseUrl: 'auto', apiKey: 'lomi_sk_test_123' });
      expect(sdk.transactions.create({} as Types.CreateTransaction))
        .rejects
        .toThrow(ApiError);
    });

    it('should detect live environment from API key prefix', () => {
      const sdk = new LomiSDK({ baseUrl: 'auto', apiKey: 'lomi_sk_live_123' });
      expect(sdk.transactions.create({} as Types.CreateTransaction))
        .rejects
        .toThrow(ApiError);
    });
  });
}); 