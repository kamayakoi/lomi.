'use server';

import { getLomiClient } from '../client';
import type { customers_create, payment_requests_create } from '@lomi./sdk';

/**
 * Server Action: Create a customer
 * Uses auto-generated SDK, automatically stays in sync with schema
 */
export async function createCustomerAction(data: customers_create) {
  const lomi = getLomiClient();
  
  try {
    // Calls auto-generated createCustomer method
    const customer = await lomi.customers.createCustomer({ requestBody: data });
    return { success: true, data: customer };
  } catch (error) {
    console.error('Failed to create customer:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Server Action: Create a payment request
 * Auto-syncs with OpenAPI spec
 */
export async function createPaymentAction(data: payment_requests_create) {
  const lomi = getLomiClient();
  
  try {
    const payment = await lomi.paymentRequests.createPaymentRequest({ requestBody: data });
    return { success: true, data: payment };
  } catch (error) {
    console.error('Failed to create payment:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Server Action: List customers with pagination
 */
export async function listCustomersAction(options?: {
  limit?: number;
  offset?: number;
  sort?: string;
}) {
  const lomi = getLomiClient();
  
  try {
    const response = await lomi.customers.listCustomers(options || {});
    return { success: true, data: response };
  } catch (error) {
    console.error('Failed to list customers:', error);
    return { success: false, error: (error as Error).message };
  }
}
