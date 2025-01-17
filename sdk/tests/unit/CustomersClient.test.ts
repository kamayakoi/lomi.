import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { CustomersClient } from '../../src/client/CustomersClient';
import { ApiResult } from '../../src/client/core/ApiResult';
import * as Types from '../../src/types/api';

// Mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe('CustomersClient', () => {
  const mockBaseUrl = 'https://api.test.com';
  const mockApiKey = 'test-api-key';
  let client: CustomersClient;

  beforeEach(() => {
    client = new CustomersClient(mockBaseUrl, mockApiKey);
    mockFetch.mockClear();
  });

  describe('create', () => {
    const mockCreateCustomerData: Types.CreateCustomer = {
      merchant_id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'customer@example.com',
      phone_number: '+1234567890',
      first_name: 'John',
      last_name: 'Doe',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'US'
      },
      metadata: { source: 'test' }
    };

    const mockCustomerResponse: Types.Customer = {
      customer_id: '123e4567-e89b-12d3-a456-426614174001',
      merchant_id: mockCreateCustomerData.merchant_id,
      email: mockCreateCustomerData.email,
      phone_number: mockCreateCustomerData.phone_number,
      first_name: mockCreateCustomerData.first_name,
      last_name: mockCreateCustomerData.last_name,
      address: mockCreateCustomerData.address,
      metadata: mockCreateCustomerData.metadata,
      created_at: new Date('2024-01-17T00:00:00Z'),
      updated_at: new Date('2024-01-17T00:00:00Z')
    };

    it('should create a customer successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve(mockCustomerResponse)
      } as Response);

      const result = await client.create(mockCreateCustomerData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/customers',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': mockApiKey
          },
          body: JSON.stringify(mockCreateCustomerData)
        })
      );

      expect(result).toBeInstanceOf(ApiResult);
      expect(result.status).toBe(201);
      expect(result.data).toEqual(mockCustomerResponse);
    });
  });

  describe('list', () => {
    const mockMerchantId = '123e4567-e89b-12d3-a456-426614174000';
    const mockCustomers: Types.Customer[] = [
      {
        customer_id: '123e4567-e89b-12d3-a456-426614174001',
        merchant_id: mockMerchantId,
        email: 'customer1@example.com',
        phone_number: '+1234567890',
        first_name: 'John',
        last_name: 'Doe',
        created_at: new Date('2024-01-17T00:00:00Z'),
        updated_at: new Date('2024-01-17T00:00:00Z')
      },
      {
        customer_id: '123e4567-e89b-12d3-a456-426614174002',
        merchant_id: mockMerchantId,
        email: 'customer2@example.com',
        phone_number: '+1234567891',
        first_name: 'Jane',
        last_name: 'Smith',
        created_at: new Date('2024-01-17T00:00:00Z'),
        updated_at: new Date('2024-01-17T00:00:00Z')
      }
    ];

    it('should list customers successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockCustomers)
      } as Response);

      const result = await client.list({ merchant_id: mockMerchantId });

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.test.com/customers?merchant_id=${mockMerchantId}`,
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
      expect(result.data).toEqual(mockCustomers);
    });

    it('should list customers with filters successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve([mockCustomers[0]])
      } as Response);

      const filters = {
        merchant_id: mockMerchantId,
        email: 'customer1@example.com',
        phone_number: '+1234567890'
      };

      const result = await client.list(filters);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.test.com/customers?merchant_id=${filters.merchant_id}&email=${encodeURIComponent(filters.email)}&phone_number=${encodeURIComponent(filters.phone_number)}`,
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
      expect(result.data).toEqual([mockCustomers[0]]);
    });
  });

  describe('get', () => {
    const mockCustomerId = '123e4567-e89b-12d3-a456-426614174001';
    const mockCustomer: Types.Customer = {
      customer_id: mockCustomerId,
      merchant_id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'customer@example.com',
      phone_number: '+1234567890',
      first_name: 'John',
      last_name: 'Doe',
      created_at: new Date('2024-01-17T00:00:00Z'),
      updated_at: new Date('2024-01-17T00:00:00Z')
    };

    it('should get a customer successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockCustomer)
      } as Response);

      const result = await client.get(mockCustomerId);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.test.com/customers/${mockCustomerId}`,
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
      expect(result.data).toEqual(mockCustomer);
    });
  });

  describe('patch', () => {
    const mockCustomerId = '123e4567-e89b-12d3-a456-426614174001';
    const mockUpdateData = {
      first_name: 'Johnny',
      last_name: 'Doe Jr',
      metadata: { updated: true }
    };

    const mockUpdatedCustomer: Types.Customer = {
      customer_id: mockCustomerId,
      merchant_id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'customer@example.com',
      phone_number: '+1234567890',
      first_name: mockUpdateData.first_name,
      last_name: mockUpdateData.last_name,
      metadata: mockUpdateData.metadata,
      created_at: new Date('2024-01-17T00:00:00Z'),
      updated_at: new Date('2024-01-17T00:00:00Z')
    };

    it('should update a customer successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockUpdatedCustomer)
      } as Response);

      const result = await client.patch(mockCustomerId, mockUpdateData);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.test.com/customers/${mockCustomerId}`,
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
      expect(result.data).toEqual(mockUpdatedCustomer);
    });
  });

  describe('delete', () => {
    const mockCustomerId = '123e4567-e89b-12d3-a456-426614174001';

    it('should delete a customer successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: () => Promise.resolve(undefined)
      } as Response);

      const result = await client.delete(mockCustomerId);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.test.com/customers/${mockCustomerId}`,
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