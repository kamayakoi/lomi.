/**
 * PaymentRequestsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class PaymentRequestsService {
    /**
     * OpenAPI operationId: `PaymentRequestsController_create`.
     * Créer une demande de paiement
     */
    public static async create(body?: unknown): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/payment-requests',
            body,
        });
    }

    /**
     * OpenAPI operationId: `PaymentRequestsController_findOne`.
     * Obtenir une demande de paiement par ID
     */
    public static async get(id: string): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/payment-requests/{id}',
            path: { id: id },
        });
    }

    /**
     * OpenAPI operationId: `PaymentRequestsController_findAll`.
     * Lister les demandes de paiement
     */
    public static async list(options?: Record<string, unknown>): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/payment-requests',
            query: options,
        });
    }
}
