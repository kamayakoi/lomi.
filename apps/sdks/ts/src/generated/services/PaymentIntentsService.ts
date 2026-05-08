/**
 * PaymentIntentsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class PaymentIntentsService {
    /**
     * OpenAPI operationId: `PaymentIntentsController_create`.
     * Créer un Payment Intent carte (client_secret)
     */
    public static async create(body?: unknown): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/payment-intents',
            body,
        });
    }
}
