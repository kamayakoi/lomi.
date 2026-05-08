/**
 * OrganizationsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class OrganizationsService {
    /**
     * OpenAPI operationId: `OrganizationsController_findOne`.
     * Organisation par ID
     */
    public static async get(id: string): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/organizations/{id}',
            path: { id: id },
        });
    }

    /**
     * OpenAPI operationId: `OrganizationsController_getMetrics`.
     * Indicateurs de l'organisation
     */
    public static async getMetrics(): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/organizations/metrics',
        });
    }

    /**
     * OpenAPI operationId: `OrganizationsController_findAll`.
     * Détails de l'organisation
     */
    public static async list(): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/organizations',
        });
    }
}
