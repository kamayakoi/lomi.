/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { payouts } from '../models/payouts';
import type { payouts_create } from '../models/payouts_create';
import type { payouts_update } from '../models/payouts_update';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PayoutsService {
    /**
     * List payouts
     * Payout management - transfer funds to beneficiaries
     * @returns any Successful response with paginated data
     * @throws ApiError
     */
    public static listPayouts({
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
        data?: Array<payouts>;
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
            url: '/payouts',
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
     * Create payout
     * Payout management - transfer funds to beneficiaries
     * @returns payouts Payout successfully created
     * @throws ApiError
     */
    public static createPayout({
        requestBody,
    }: {
        requestBody: payouts_create,
    }): CancelablePromise<payouts> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/payouts',
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
     * Retrieve payout
     * Retrieve a specific payout by its unique identifier.
     * @returns payouts Payout retrieved successfully
     * @throws ApiError
     */
    public static retrievePayout({
        payoutId,
    }: {
        /**
         * Unique identifier for the payout
         */
        payoutId: string,
    }): CancelablePromise<payouts> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/payouts/{payout_id}',
            path: {
                'payout_id': payoutId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Update payout
     * Update a specific payout. Only provided fields will be updated.
     * @returns payouts Payout successfully updated
     * @throws ApiError
     */
    public static updatePayout({
        payoutId,
        requestBody,
    }: {
        /**
         * Unique identifier for the payout
         */
        payoutId: string,
        requestBody: payouts_update,
    }): CancelablePromise<payouts> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/payouts/{payout_id}',
            path: {
                'payout_id': payoutId,
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
     * Delete payout
     * Delete a specific payout. This action cannot be undone.
     * @returns void
     * @throws ApiError
     */
    public static deletePayout({
        payoutId,
    }: {
        /**
         * Unique identifier for the payout
         */
        payoutId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/payouts/{payout_id}',
            path: {
                'payout_id': payoutId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
}
