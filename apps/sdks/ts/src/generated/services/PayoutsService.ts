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
}
