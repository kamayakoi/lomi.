/**
 * CustomerSubscriptionsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class CustomerSubscriptionsService {
    /**
     * OpenAPI operationId: `CustomerSubscriptionsController_remove`.
     * Cancel customer subscription
     */
    public static async delete(subscription_id: string): Promise<any> {
        return await request<any>({
            method: 'DELETE',
            url: '/customer-subscriptions/{subscription_id}',
            path: { subscription_id: subscription_id },
        });
    }

    /**
     * OpenAPI operationId: `CustomerSubscriptionsController_findOne`.
     * Get customer subscription
     */
    public static async get(subscription_id: string): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/customer-subscriptions/{subscription_id}',
            path: { subscription_id: subscription_id },
        });
    }

    /**
     * OpenAPI operationId: `CustomerSubscriptionsController_findAll`.
     * List customer subscriptions
     */
    public static async list(options?: Record<string, unknown>): Promise<any> {
        return await request<any>({
            method: 'GET',
            url: '/customer-subscriptions',
            query: options,
        });
    }

    /**
     * OpenAPI operationId: `CustomerSubscriptionsController_update`.
     * Update customer subscription
     */
    public static async update(subscription_id: string): Promise<any> {
        return await request<any>({
            method: 'PATCH',
            url: '/customer-subscriptions/{subscription_id}',
            path: { subscription_id: subscription_id },
        });
    }
}
