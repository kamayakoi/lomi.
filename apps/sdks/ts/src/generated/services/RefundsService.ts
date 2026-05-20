/**
 * RefundsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class RefundsService {
    /**
     * OpenAPI operationId: `RefundsController_create`.
     * Créer un remboursement
     */
    public static async create(): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/refunds',
        });
    }

    /**
     * OpenAPI operationId: `RefundsController_findOne`.
     * Obtenir un remboursement
     */
    public static async get(id: string): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/refunds/{id}',
            path: { id: id },
        });
    }

    /**
     * OpenAPI operationId: `RefundsController_findAll`.
     * Lister les remboursements
     */
    public static async list(options?: Record<string, unknown>): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/refunds',
            query: options,
        });
    }
}
