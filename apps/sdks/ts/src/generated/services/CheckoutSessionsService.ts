/**
 * CheckoutSessionsService
 * AUTO-GENERATED - Do not edit manually
 * 
 * Checkout sessions - create hosted payment pages
 */

import { request } from '../core/request.js';
import type { Database } from '../types.js';

type CheckoutSessionsRow = Database['public']['Tables']['checkout_sessions']['Row'];
type CheckoutSessionsInsert = Database['public']['Tables']['checkout_sessions']['Insert'];
type CheckoutSessionsUpdate = Database['public']['Tables']['checkout_sessions']['Update'];

export class CheckoutSessionsService {

    /**
     * List checkout_sessions
     * Checkout sessions - create hosted payment pages
     */
    public static async list(options?: {
        limit?: number;
        offset?: number;
        [key: string]: any;
    }): Promise<CheckoutSessionsRow[]> {
        return await request<CheckoutSessionsRow[]>({
            method: 'GET',
            url: '/checkout-sessions',
            query: options,
        });
    }

    /**
     * Get a single checkout_session
     */
    public static async get(id: string): Promise<CheckoutSessionsRow> {
        return await request<CheckoutSessionsRow>({
            method: 'GET',
            url: '/checkout-sessions/{id}',
            path: { id },
        });
    }

    /**
     * Create a new checkout_session
     */
    public static async create(data: CheckoutSessionsInsert): Promise<CheckoutSessionsRow> {
        return await request<CheckoutSessionsRow>({
            method: 'POST',
            url: '/checkout-sessions',
            body: data,
        });
    }
}
