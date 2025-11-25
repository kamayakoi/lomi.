'use client';

import { useState, useEffect } from 'react';
import type { customers } from '@lomi./sdk';

/**
 * React hook to list customers
 * Auto-syncs with OpenAPI spec via the generated SDK
 */
export function useCustomers(options?: {
  limit?: number;
  offset?: number;
  sort?: string;
}) {
  const [data, setData] = useState<customers[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true);
        // This calls the auto-generated listCustomers method
        const response = await fetch('/api/lomi/customers?' + new URLSearchParams({
          limit: String(options?.limit ?? 20),
          offset: String(options?.offset ?? 0),
          ...(options?.sort && { sort: options.sort }),
        }));
        
        if (!response.ok) throw new Error('Failed to fetch customers');
        
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, [options?.limit, options?.offset, options?.sort]);

  return { data, loading, error };
}

/**
 * React hook to create a customer
 * Auto-syncs with OpenAPI spec
 */
export function useCreateCustomer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createCustomer = async (data: {
    name: string;
    email?: string;
    phone_number?: string;
    metadata?: Record<string, any>;
  }): Promise<customers> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/lomi/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create customer');

      return await response.json();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createCustomer, loading, error };
}
