/**
 * PaymentIntentsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class PaymentIntentsService {
    /**
     * OpenAPI operationId: `PaymentIntentsController_cancel`.
     * Annuler un intent de paiement carte
     */
    public static async cancel(id: string): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/payment-intents/{id}/cancel',
            path: { id: id },
        });
    }

    /**
     * OpenAPI operationId: `PaymentIntentsController_create`.
     * Créer un intent de paiement carte (client_secret)
     */
    public static async create(body?: unknown): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/payment-intents',
            body,
        });
    }

    /**
     * OpenAPI operationId: `PaymentIntentsController_findOne`.
     * Récupérer un intent de paiement carte
     */
    public static async get(id: string): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/payment-intents/{id}',
            path: { id: id },
        });
    }
}
