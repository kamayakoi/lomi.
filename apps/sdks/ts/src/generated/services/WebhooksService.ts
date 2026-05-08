/**
 * WebhooksService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class WebhooksService {
    /**
     * OpenAPI operationId: `WebhooksController_findOne`.
     * Obtenir un webhook par ID
     */
    public static async get(id: string): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/webhooks/{id}',
            path: { id: id },
        });
    }

    /**
     * OpenAPI operationId: `WebhooksController_findAll`.
     * Lister les webhooks
     */
    public static async list(): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/webhooks',
        });
    }

    /**
     * OpenAPI operationId: `WebhooksController_update`.
     * Mettre à jour un webhook
     */
    public static async update(id: string, body?: unknown): Promise<any> {
        return await request<any>({
            method: 'PATCH',
            url: '/webhooks/{id}',
            path: { id: id },
            body,
        });
    }
}
