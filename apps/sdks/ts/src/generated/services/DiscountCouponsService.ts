/**
 * DiscountCouponsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class DiscountCouponsService {
    /**
     * OpenAPI operationId: `DiscountCouponsController_create`.
     * Créer un coupon
     */
    public static async create(): Promise<any> {
        return await request<any>({
            method: 'POST',
            url: '/discount-coupons',
        });
    }

    /**
     * OpenAPI operationId: `DiscountCouponsController_findOne`.
     * Obtenir un coupon par ID
     */
    public static async get(id: string): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/discount-coupons/{id}',
            path: { id: id },
        });
    }

    /**
     * OpenAPI operationId: `DiscountCouponsController_getPerformance`.
     * Indicateurs de performance du coupon
     */
    public static async getPerformance(id: string): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/discount-coupons/{id}/performance',
            path: { id: id },
        });
    }

    /**
     * OpenAPI operationId: `DiscountCouponsController_findAll`.
     * Lister les coupons
     */
    public static async list(): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/discount-coupons',
        });
    }
}
