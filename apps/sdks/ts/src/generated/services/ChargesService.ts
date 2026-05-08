/**
 * ChargesService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class ChargesService {
    /**
     * OpenAPI operationId: `ChargesController_createWaveCharge`.
     * Lancer un encaissement direct Wave
     */
    public static async createWaveCharge(): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/charge/wave',
        });
    }
}
