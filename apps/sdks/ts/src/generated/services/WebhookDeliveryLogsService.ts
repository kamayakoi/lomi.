/**
 * WebhookDeliveryLogsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class WebhookDeliveryLogsService {
    /**
     * OpenAPI operationId: `WebhookDeliveryLogsController_findOne`.
     * Obtenir un journal de livraison par ID
     */
    public static async get(id: string): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/webhook-delivery-logs/{id}',
            path: { id: id },
        });
    }

    /**
     * OpenAPI operationId: `WebhookDeliveryLogsController_findAll`.
     * Lister les journaux de livraison
     */
    public static async list(options?: Record<string, unknown>): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/webhook-delivery-logs',
            query: options,
        });
    }
}
