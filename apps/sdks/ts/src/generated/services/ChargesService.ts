/**
 * ChargesService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class ChargesService {
    /**
     * OpenAPI operationId: `ChargesController_cancelCardCharge`.
     * Annuler un encaissement carte
     */
    public static async cancelCardCharge(id: string): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/charge/card/{id}/cancel',
            path: { id: id },
        });
    }

    /**
     * OpenAPI operationId: `ChargesController_createCardCharge`.
     * Créer un encaissement carte (client_secret)
     */
    public static async createCardCharge(body?: unknown): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/charge/card',
            body,
        });
    }

    /**
     * OpenAPI operationId: `ChargesController_createMtnCharge`.
     * Lancer un encaissement direct MTN MoMo
     */
    public static async createMtnCharge(): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/charge/mtn',
        });
    }

    /**
     * OpenAPI operationId: `ChargesController_createWaveCharge`.
     * Lancer un encaissement direct Wave
     */
    public static async createWaveCharge(): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/charge/wave',
        });
    }

    /**
     * OpenAPI operationId: `ChargesController_getCardCharge`.
     * Obtenir un encaissement carte
     */
    public static async getCardCharge(id: string): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/charge/card/{id}',
            path: { id: id },
        });
    }
}
