/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { refunds } from '../models/refunds';
import type { refunds_create } from '../models/refunds_create';
import type { refunds_update } from '../models/refunds_update';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RefundsService {
    /**
     * List refunds
     * Refund management - process and track refunds
     * @returns any Successful response with paginated data
     * @throws ApiError
     */
    public static listRefunds({
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
        data?: Array<refunds>;
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
            url: '/refunds',
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
     * Create refund
     * Refund management - process and track refunds
     * @returns refunds Refund successfully created
     * @throws ApiError
     */
    public static createRefund({
        requestBody,
    }: {
        requestBody: refunds_create,
    }): CancelablePromise<refunds> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/refunds',
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
     * Retrieve refund
     * Retrieve a specific refund by its unique identifier.
     * @returns refunds Refund retrieved successfully
     * @throws ApiError
     */
    public static retrieveRefund({
        refundId,
    }: {
        /**
         * Unique identifier for the refund
         */
        refundId: string,
    }): CancelablePromise<refunds> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/refunds/{refund_id}',
            path: {
                'refund_id': refundId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Update refund
     * Update a specific refund. Only provided fields will be updated.
     * @returns refunds Refund successfully updated
     * @throws ApiError
     */
    public static updateRefund({
        refundId,
        requestBody,
    }: {
        /**
         * Unique identifier for the refund
         */
        refundId: string,
        requestBody: refunds_update,
    }): CancelablePromise<refunds> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/refunds/{refund_id}',
            path: {
                'refund_id': refundId,
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
     * Delete refund
     * Delete a specific refund. This action cannot be undone.
     * @returns void
     * @throws ApiError
     */
    public static deleteRefund({
        refundId,
    }: {
        /**
         * Unique identifier for the refund
         */
        refundId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/refunds/{refund_id}',
            path: {
                'refund_id': refundId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
}
