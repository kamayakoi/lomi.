/**
 * CheckoutSessionsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class CheckoutSessionsService {
    /**
     * OpenAPI operationId: `CheckoutSessionsController_create`.
     * Créer une session de paiement
     */
    public static async create(body?: unknown): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/checkout-sessions',
            body,
        });
    }

    /**
     * OpenAPI operationId: `CheckoutSessionsController_findOne`.
     * Obtenir une session de paiement par ID
     */
    public static async get(id: string): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/checkout-sessions/{id}',
            path: { id: id },
        });
    }

    /**
     * OpenAPI operationId: `CheckoutSessionsController_findAll`.
     * Lister les sessions de paiement
     */
    public static async list(options?: Record<string, unknown>): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/checkout-sessions',
            query: options,
        });
    }
}
