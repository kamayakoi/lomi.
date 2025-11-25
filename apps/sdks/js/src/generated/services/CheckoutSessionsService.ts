/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { checkout_sessions } from '../models/checkout_sessions.js';
import type { checkout_sessions_create } from '../models/checkout_sessions_create.js';
import type { checkout_sessions_update } from '../models/checkout_sessions_update.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class CheckoutSessionsService {
    /**
     * List checkout sessions
     * Checkout sessions - create hosted payment pages
     * @returns any Successful response with paginated data
     * @throws ApiError
     */
    public static listCheckoutSessions({
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
        data?: Array<checkout_sessions>;
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
            url: '/checkout_sessions',
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
     * Create checkout session
     * Checkout sessions - create hosted payment pages
     * @returns checkout_sessions Checkout_session successfully created
     * @throws ApiError
     */
    public static createCheckoutSession({
        requestBody,
    }: {
        requestBody: checkout_sessions_create,
    }): CancelablePromise<checkout_sessions> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/checkout_sessions',
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
     * Retrieve checkout session
     * Retrieve a specific checkout session by its unique identifier.
     * @returns checkout_sessions Checkout_session retrieved successfully
     * @throws ApiError
     */
    public static retrieveCheckoutSession({
        sessionId,
    }: {
        /**
         * Unique identifier for the checkout session
         */
        sessionId: string,
    }): CancelablePromise<checkout_sessions> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/checkout_sessions/{session_id}',
            path: {
                'session_id': sessionId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Update checkout session
     * Update a specific checkout session. Only provided fields will be updated.
     * @returns checkout_sessions Checkout_session successfully updated
     * @throws ApiError
     */
    public static updateCheckoutSession({
        sessionId,
        requestBody,
    }: {
        /**
         * Unique identifier for the checkout session
         */
        sessionId: string,
        requestBody: checkout_sessions_update,
    }): CancelablePromise<checkout_sessions> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/checkout_sessions/{session_id}',
            path: {
                'session_id': sessionId,
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
     * Delete checkout session
     * Delete a specific checkout session. This action cannot be undone.
     * @returns void
     * @throws ApiError
     */
    public static deleteCheckoutSession({
        sessionId,
    }: {
        /**
         * Unique identifier for the checkout session
         */
        sessionId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/checkout_sessions/{session_id}',
            path: {
                'session_id': sessionId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
}
