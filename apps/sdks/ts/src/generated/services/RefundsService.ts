/**
 * RefundsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class RefundsService {
    /**
     * OpenAPI operationId: `RefundsController_createWaveRefund`.
     * Lancer un remboursement Wave
     */
    public static async createWaveRefund(): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/refund/wave',
        });
    }
}
