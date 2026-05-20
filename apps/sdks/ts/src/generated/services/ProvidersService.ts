/**
 * ProvidersService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class ProvidersService {
    /**
     * OpenAPI operationId: `ProvidersController_findAll`.
     * List payment providers
     */
    public static async list(options?: Record<string, unknown>): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/providers',
            query: options,
        });
    }
}
