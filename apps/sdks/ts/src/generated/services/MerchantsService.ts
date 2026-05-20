/**
 * MerchantsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class MerchantsService {
    /**
     * OpenAPI operationId: `MerchantsController_getDetails`.
     * Get merchant details
     */
    public static async get(id: string): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/merchants/{id}',
            path: { id: id },
        });
    }

    /**
     * OpenAPI operationId: `MerchantsController_getArr`.
     * Get merchant ARR
     */
    public static async getArr(id: string): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/merchants/{id}/arr',
            path: { id: id },
        });
    }

    /**
     * OpenAPI operationId: `MerchantsController_getBalance`.
     * Get merchant account balance for a currency
     */
    public static async getBalance(id: string, options?: Record<string, unknown>): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/merchants/{id}/balance',
            path: { id: id },
            query: options,
        });
    }

    /**
     * OpenAPI operationId: `MerchantsController_getMrr`.
     * Get merchant MRR
     */
    public static async getMrr(id: string): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/merchants/{id}/mrr',
            path: { id: id },
        });
    }
}
