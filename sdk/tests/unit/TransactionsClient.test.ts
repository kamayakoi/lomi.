import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { TransactionsClient } from '../../src/client/TransactionsClient';
import { ApiResult } from '../../src/client/core/ApiResult';
import * as Types from '../../src/types/api';

// Mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe('TransactionsClient', () => {
  const mockBaseUrl = 'https://api.test.com';
  const mockApiKey = 'test-api-key';
  let client: TransactionsClient;

  beforeEach(() => {
    client = new TransactionsClient(mockBaseUrl, mockApiKey);
    mockFetch.mockClear();
  });

  describe('create', () => {
    const mockCreateData: Types.CreateTransaction = {
      merchant_id: '123e4567-e89b-12d3-a456-426614174000',
      organization_id: '123e4567-e89b-12d3-a456-426614174001',
      customer_id: '123e4567-e89b-12d3-a456-426614174002',
      transaction_type: Types.TransactionType.payment,
      reference_id: 'TX_REF_123',
      gross_amount: 1000,
      fee_amount: 25,
      net_amount: 975,
      fee_reference: 'FEE_REF_123',
      currency_code: Types.CurrencyCode.XOF,
      provider_code: Types.ProviderCode.ORANGE,
      payment_method_code: Types.PaymentMethodCode.MOBILE_MONEY,
      description: 'Test payment',
      metadata: { test: 'data' }
    };

    const mockResponse: Types.Transaction = {
      ...mockCreateData,
      transaction_id: '123e4567-e89b-12d3-a456-426614174003',
      status: Types.TransactionStatus.pending,
      created_at: new Date('2024-01-17T00:00:00Z'),
      updated_at: new Date('2024-01-17T00:00:00Z')
    };

    it('should create a transaction successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve(mockResponse)
      } as Response);

      const result = await client.create(mockCreateData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/transactions',
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
    const mockMerchantId = '123e4567-e89b-12d3-a456-426614174000';
    const mockTransactions: Types.Transaction[] = [
      {
        transaction_id: '123e4567-e89b-12d3-a456-426614174001',
        merchant_id: mockMerchantId,
        organization_id: '123e4567-e89b-12d3-a456-426614174002',
        customer_id: '123e4567-e89b-12d3-a456-426614174003',
        transaction_type: Types.TransactionType.payment,
        reference_id: 'TX_REF_1',
        gross_amount: 1000,
        fee_amount: 25,
        net_amount: 975,
        fee_reference: 'FEE_REF_1',
        currency_code: Types.CurrencyCode.XOF,
        provider_code: Types.ProviderCode.ORANGE,
        payment_method_code: Types.PaymentMethodCode.MOBILE_MONEY,
        status: Types.TransactionStatus.completed,
        description: 'Test payment 1',
        metadata: { test: 'data1' },
        created_at: new Date('2024-01-17T00:00:00Z'),
        updated_at: new Date('2024-01-17T00:00:00Z')
      },
      {
        transaction_id: '123e4567-e89b-12d3-a456-426614174004',
        merchant_id: mockMerchantId,
        organization_id: '123e4567-e89b-12d3-a456-426614174002',
        customer_id: '123e4567-e89b-12d3-a456-426614174005',
        transaction_type: Types.TransactionType.payment,
        reference_id: 'TX_REF_2',
        gross_amount: 2000,
        fee_amount: 50,
        net_amount: 1950,
        fee_reference: 'FEE_REF_2',
        currency_code: Types.CurrencyCode.XOF,
        provider_code: Types.ProviderCode.WAVE,
        payment_method_code: Types.PaymentMethodCode.MOBILE_MONEY,
        status: Types.TransactionStatus.pending,
        description: 'Test payment 2',
        metadata: { test: 'data2' },
        created_at: new Date('2024-01-17T00:00:00Z'),
        updated_at: new Date('2024-01-17T00:00:00Z')
      }
    ];

    it('should list transactions successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockTransactions)
      } as Response);

      const result = await client.list({ merchant_id: mockMerchantId });

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.test.com/transactions?merchant_id=${mockMerchantId}`,
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
      expect(result.data).toEqual(mockTransactions);
    });
  });
}); 