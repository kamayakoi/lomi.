/**
 * ProductsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class ProductsService {
    /**
     * OpenAPI operationId: `ProductsController_addPrice`.
     * Ajouter un prix à un produit
     */
    public static async addPrice(id: string): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/products/{id}/prices',
            path: { id: id },
        });
    }

    /**
     * OpenAPI operationId: `ProductsController_create`.
     * Créer un produit
     */
    public static async create(): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/products',
        });
    }

    /**
     * OpenAPI operationId: `ProductsController_findOne`.
     * Obtenir un produit par ID
     */
    public static async get(id: string): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/products/{id}',
            path: { id: id },
        });
    }

    /**
     * OpenAPI operationId: `ProductsController_findAll`.
     * Lister les produits
     */
    public static async list(options?: Record<string, unknown>): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/products',
            query: options,
        });
    }

    /**
     * OpenAPI operationId: `ProductsController_setDefaultPrice`.
     * Définir le prix par défaut
     */
    public static async setDefaultPrice(id: string, priceId: string): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/products/{id}/prices/{priceId}/set-default',
            path: { id: id, priceId: priceId },
        });
    }
}
