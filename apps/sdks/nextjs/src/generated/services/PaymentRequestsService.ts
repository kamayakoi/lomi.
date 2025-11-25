/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { payment_requests } from '../models/payment_requests';
import type { payment_requests_create } from '../models/payment_requests_create';
import type { payment_requests_update } from '../models/payment_requests_update';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PaymentRequestsService {
    /**
     * List payment requests
     * Payment requests - create payment intents and track status
     * @returns any Successful response with paginated data
     * @throws ApiError
     */
    public static listPaymentRequests({
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
        data?: Array<payment_requests>;
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
            url: '/payment_requests',
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
     * Create payment request
     * Payment requests - create payment intents and track status
     * @returns payment_requests Payment_request successfully created
     * @throws ApiError
     */
    public static createPaymentRequest({
        requestBody,
    }: {
        requestBody: payment_requests_create,
    }): CancelablePromise<payment_requests> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/payment_requests',
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
     * Retrieve payment request
     * Retrieve a specific payment request by its unique identifier.
     * @returns payment_requests Payment_request retrieved successfully
     * @throws ApiError
     */
    public static retrievePaymentRequest({
        requestId,
    }: {
        /**
         * Unique identifier for the payment request
         */
        requestId: string,
    }): CancelablePromise<payment_requests> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/payment_requests/{request_id}',
            path: {
                'request_id': requestId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Update payment request
     * Update a specific payment request. Only provided fields will be updated.
     * @returns payment_requests Payment_request successfully updated
     * @throws ApiError
     */
    public static updatePaymentRequest({
        requestId,
        requestBody,
    }: {
        /**
         * Unique identifier for the payment request
         */
        requestId: string,
        requestBody: payment_requests_update,
    }): CancelablePromise<payment_requests> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/payment_requests/{request_id}',
            path: {
                'request_id': requestId,
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
     * Delete payment request
     * Delete a specific payment request. This action cannot be undone.
     * @returns void
     * @throws ApiError
     */
    public static deletePaymentRequest({
        requestId,
    }: {
        /**
         * Unique identifier for the payment request
         */
        requestId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/payment_requests/{request_id}',
            path: {
                'request_id': requestId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
}
