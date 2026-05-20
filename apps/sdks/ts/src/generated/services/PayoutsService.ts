/**
 * PayoutsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class PayoutsService {
    /**
     * OpenAPI operationId: `PayoutsController_createWavePayout`.
     * Lancer un virement Wave
     */
    public static async createWavePayout(): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/payout/wave',
        });
    }

    /**
     * OpenAPI operationId: `PayoutsListController_findAll`.
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
