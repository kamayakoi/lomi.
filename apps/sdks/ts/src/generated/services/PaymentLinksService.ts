/**
 * PaymentLinksService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class PaymentLinksService {
    /**
     * OpenAPI operationId: `PaymentLinksController_create`.
     * Créer un lien de paiement
     */
    public static async create(body?: unknown): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/payment-links',
            body,
        });
    }

    /**
     * OpenAPI operationId: `PaymentLinksController_findOne`.
     * Obtenir un lien de paiement par ID
     */
    public static async get(id: string): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/payment-links/{id}',
            path: { id: id },
        });
    }

    /**
     * OpenAPI operationId: `PaymentLinksController_findAll`.
     * Lister les liens de paiement
     */
    public static async list(options?: Record<string, unknown>): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/payment-links',
            query: options,
        });
    }
}
