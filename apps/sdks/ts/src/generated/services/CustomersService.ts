/**
 * CustomersService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class CustomersService {
    /**
     * OpenAPI operationId: `CustomersController_create`.
     * Créer un client
     */
    public static async create(body?: unknown): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/customers',
            body,
        });
    }

    /**
     * OpenAPI operationId: `CustomersController_remove`.
     * Supprimer un client
     */
    public static async delete(id: string): Promise<any> {
        return await request<any>({
            method: 'DELETE',
            url: '/customers/{id}',
            path: { id: id },
        });
    }

    /**
     * OpenAPI operationId: `CustomersController_findOne`.
     * Obtenir un client par ID
     */
    public static async get(id: string): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/customers/{id}',
            path: { id: id },
        });
    }

    /**
     * OpenAPI operationId: `CustomersController_getTransactions`.
     * Transactions du client
     */
    public static async getTransactions(id: string): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/customers/{id}/transactions',
            path: { id: id },
        });
    }

    /**
     * OpenAPI operationId: `CustomersController_findAll`.
     * Lister les clients
     */
    public static async list(options?: Record<string, unknown>): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/customers',
            query: options,
        });
    }

    /**
     * OpenAPI operationId: `CustomersController_update`.
     * Mettre à jour un client
     */
    public static async update(id: string, body?: unknown): Promise<any> {
        return await request<any>({
            method: 'PATCH',
            url: '/customers/{id}',
            path: { id: id },
            body,
        });
    }
}
