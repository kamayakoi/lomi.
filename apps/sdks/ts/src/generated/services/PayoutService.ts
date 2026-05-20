/**
 * PayoutService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class PayoutService {
    /**
     * OpenAPI operationId: `PayoutsController_createSpiPayout`.
     * Lancer un virement SPI
     */
    public static async createSpiPayout(): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/payout/spi',
        });
    }
}
