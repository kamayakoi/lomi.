/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { prices } from '../models/prices.js';
import type { prices_create } from '../models/prices_create.js';
import type { prices_update } from '../models/prices_update.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class PricesService {
    /**
     * List prices
     * Pricing tiers - manage product pricing
     * @returns any Successful response with paginated data
     * @throws ApiError
     */
    public static listPrices({
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
        data?: Array<prices>;
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
            url: '/prices',
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
     * Create price
     * Pricing tiers - manage product pricing
     * @returns prices Price successfully created
     * @throws ApiError
     */
    public static createPrice({
        requestBody,
    }: {
        requestBody: prices_create,
    }): CancelablePromise<prices> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/prices',
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
     * Retrieve price
     * Retrieve a specific price by its unique identifier.
     * @returns prices Price retrieved successfully
     * @throws ApiError
     */
    public static retrievePrice({
        priceId,
    }: {
        /**
         * Unique identifier for the price
         */
        priceId: string,
    }): CancelablePromise<prices> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/prices/{price_id}',
            path: {
                'price_id': priceId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Update price
     * Update a specific price. Only provided fields will be updated.
     * @returns prices Price successfully updated
     * @throws ApiError
     */
    public static updatePrice({
        priceId,
        requestBody,
    }: {
        /**
         * Unique identifier for the price
         */
        priceId: string,
        requestBody: prices_update,
    }): CancelablePromise<prices> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/prices/{price_id}',
            path: {
                'price_id': priceId,
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
     * Delete price
     * Delete a specific price. This action cannot be undone.
     * @returns void
     * @throws ApiError
     */
    public static deletePrice({
        priceId,
    }: {
        /**
         * Unique identifier for the price
         */
        priceId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/prices/{price_id}',
            path: {
                'price_id': priceId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
}
