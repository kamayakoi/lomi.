/**
 * WebhooksService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class WebhooksService {
    /**
     * OpenAPI operationId: `WebhooksController_create`.
     * Créer un webhook
     */
    public static async create(): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/webhooks',
        });
    }

    /**
     * OpenAPI operationId: `WebhooksController_remove`.
     * Supprimer un webhook
     */
    public static async delete(id: string): Promise<any> {
        return await request<any>({
            method: 'DELETE',
            url: '/webhooks/{id}',
            path: { id: id },
        });
    }

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
     * OpenAPI operationId: `WebhooksController_retryDelivery`.
     * Relancer une livraison webhook
     */
    public static async retryDelivery(webhookId: string, logId: string): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/webhooks/{webhookId}/logs/{logId}/retry',
            path: { webhookId: webhookId, logId: logId },
        });
    }

    /**
     * OpenAPI operationId: `WebhooksController_test`.
     * Envoyer un événement test au webhook
     */
    public static async test(id: string): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/webhooks/{id}/test',
            path: { id: id },
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
