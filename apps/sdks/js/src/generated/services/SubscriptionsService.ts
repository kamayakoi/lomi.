/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { subscriptions } from '../models/subscriptions.js';
import type { subscriptions_create } from '../models/subscriptions_create.js';
import type { subscriptions_update } from '../models/subscriptions_update.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class SubscriptionsService {
    /**
     * List subscriptions
     * Subscription management - create and manage recurring billing
     * @returns any Successful response with paginated data
     * @throws ApiError
     */
    public static listSubscriptions({
        limit = 20,
        offset,
        sort,
    }: {
        /**
         * Maximum number of items to return (1-100)
         */
        limit?: number,
        /**
         * Number of items to skip for pagination
         */
        offset?: number,
        /**
         * Sort order. Format: `field:direction` (e.g., `created_at:desc`)
         */
        sort?: string,
    }): CancelablePromise<{
        data?: Array<subscriptions>;
        pagination?: {
            /**
             * Number of items per page
             */
            limit?: number;
            /**
             * Number of items skipped
             */
            offset?: number;
            /**
             * Total number of items available
             */
            total?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/subscriptions',
            query: {
                'limit': limit,
                'offset': offset,
                'sort': sort,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Create subscription
     * Subscription management - create and manage recurring billing
     * @returns subscriptions Subscription successfully created
     * @throws ApiError
     */
    public static createSubscription({
        requestBody,
    }: {
        requestBody: subscriptions_create,
    }): CancelablePromise<subscriptions> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/subscriptions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - Invalid input`,
                401: `Unauthorized - Invalid or missing API key`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Retrieve subscription
     * Retrieve a specific subscription by its unique identifier.
     * @returns subscriptions Subscription retrieved successfully
     * @throws ApiError
     */
    public static retrieveSubscription({
        subscriptionId,
    }: {
        /**
         * Unique identifier for the subscription
         */
        subscriptionId: string,
    }): CancelablePromise<subscriptions> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/subscriptions/{subscription_id}',
            path: {
                'subscription_id': subscriptionId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Update subscription
     * Update a specific subscription. Only provided fields will be updated.
     * @returns subscriptions Subscription successfully updated
     * @throws ApiError
     */
    public static updateSubscription({
        subscriptionId,
        requestBody,
    }: {
        /**
         * Unique identifier for the subscription
         */
        subscriptionId: string,
        requestBody: subscriptions_update,
    }): CancelablePromise<subscriptions> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/subscriptions/{subscription_id}',
            path: {
                'subscription_id': subscriptionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - Invalid input`,
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Delete subscription
     * Delete a specific subscription. This action cannot be undone.
     * @returns void
     * @throws ApiError
     */
    public static deleteSubscription({
        subscriptionId,
    }: {
        /**
         * Unique identifier for the subscription
         */
        subscriptionId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/subscriptions/{subscription_id}',
            path: {
                'subscription_id': subscriptionId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
}
