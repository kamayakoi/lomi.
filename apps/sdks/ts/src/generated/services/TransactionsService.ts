/**
 * TransactionsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class TransactionsService {
    /**
     * OpenAPI operationId: `TransactionsController_findOne`.
     * Obtenir une transaction par ID
     */
    public static async get(id: string): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/transactions/{id}',
            path: { id: id },
        });
    }

    /**
     * OpenAPI operationId: `TransactionsController_findAll`.
     * Lister les transactions
     */
    public static async list(options?: Record<string, unknown>): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/transactions',
            query: options,
        });
    }
}
