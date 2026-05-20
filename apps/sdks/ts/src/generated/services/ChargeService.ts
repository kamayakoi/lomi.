/**
 * ChargeService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class ChargeService {
    /**
     * OpenAPI operationId: `ChargesController_createMtnCharge`.
     * Lancer un encaissement direct MTN MoMo
     */
    public static async createMtnCharge(): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/charge/mtn',
        });
    }
}
