/**
 * PayoutsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class PayoutsService {
    /**
     * OpenAPI operationId: `PayoutsUnifiedController_create`.
     * Créer un virement
     */
    public static async create(): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/payouts',
        });
    }

    /**
     * OpenAPI operationId: `PayoutsUnifiedController_findOne`.
     * Obtenir un virement
     */
    public static async get(id: string): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/payouts/{id}',
            path: { id: id },
        });
    }

    /**
     * OpenAPI operationId: `PayoutsUnifiedController_findAll`.
     * Lister les virements
     */
    public static async list(options?: Record<string, unknown>): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/payouts',
            query: options,
        });
    }
}
