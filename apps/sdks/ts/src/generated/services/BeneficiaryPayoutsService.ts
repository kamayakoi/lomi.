/**
 * BeneficiaryPayoutsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class BeneficiaryPayoutsService {
    /**
     * OpenAPI operationId: `BeneficiaryPayoutsController_create`.
     * Lancer un paiement vers un bénéficiaire
     */
    public static async create(): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/beneficiary-payouts',
        });
    }

    /**
     * OpenAPI operationId: `BeneficiaryPayoutsController_findOne`.
     * Obtenir un paiement bénéficiaire par ID
     */
    public static async get(id: string): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/beneficiary-payouts/{id}',
            path: { id: id },
        });
    }

    /**
     * OpenAPI operationId: `BeneficiaryPayoutsController_findAll`.
     * Lister les paiements vers bénéficiaires
     */
    public static async list(options?: Record<string, unknown>): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/beneficiary-payouts',
            query: options,
        });
    }
}
