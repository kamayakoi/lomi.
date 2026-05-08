/**
 * AccountsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class AccountsService {
    /**
     * OpenAPI operationId: `AccountsController_checkAvailableBalance`.
     * Vérifier le solde disponible
     */
    public static async checkBalance(currency: string): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/accounts/balance/check/{currency}',
            path: { currency: currency },
        });
    }

    /**
     * OpenAPI operationId: `AccountsController_findOne`.
     * Obtenir un compte par ID
     */
    public static async get(id: string): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/accounts/{id}',
            path: { id: id },
        });
    }

    /**
     * OpenAPI operationId: `AccountsController_getBalance`.
     * Solde du compte
     */
    public static async getBalance(options?: Record<string, unknown>): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/accounts/balance',
            query: options,
        });
    }

    /**
     * OpenAPI operationId: `AccountsController_getBalanceBreakdown`.
     * Détail du solde
     */
    public static async getBalanceBreakdown(options?: Record<string, unknown>): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/accounts/balance/breakdown',
            query: options,
        });
    }

    /**
     * OpenAPI operationId: `AccountsController_findAll`.
     * Lister les comptes
     */
    public static async list(): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/accounts',
        });
    }
}
