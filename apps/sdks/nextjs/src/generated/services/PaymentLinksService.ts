/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { payment_links } from '../models/payment_links';
import type { payment_links_create } from '../models/payment_links_create';
import type { payment_links_update } from '../models/payment_links_update';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PaymentLinksService {
    /**
     * List payment links
     * Payment links - shareable payment URLs
     * @returns any Successful response with paginated data
     * @throws ApiError
     */
    public static listPaymentLinks({
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
        data?: Array<payment_links>;
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
            url: '/payment_links',
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
     * Create payment link
     * Payment links - shareable payment URLs
     * @returns payment_links Payment_link successfully created
     * @throws ApiError
     */
    public static createPaymentLink({
        requestBody,
    }: {
        requestBody: payment_links_create,
    }): CancelablePromise<payment_links> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/payment_links',
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
     * Retrieve payment link
     * Retrieve a specific payment link by its unique identifier.
     * @returns payment_links Payment_link retrieved successfully
     * @throws ApiError
     */
    public static retrievePaymentLink({
        linkId,
    }: {
        /**
         * Unique identifier for the payment link
         */
        linkId: string,
    }): CancelablePromise<payment_links> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/payment_links/{link_id}',
            path: {
                'link_id': linkId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Update payment link
     * Update a specific payment link. Only provided fields will be updated.
     * @returns payment_links Payment_link successfully updated
     * @throws ApiError
     */
    public static updatePaymentLink({
        linkId,
        requestBody,
    }: {
        /**
         * Unique identifier for the payment link
         */
        linkId: string,
        requestBody: payment_links_update,
    }): CancelablePromise<payment_links> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/payment_links/{link_id}',
            path: {
                'link_id': linkId,
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
     * Delete payment link
     * Delete a specific payment link. This action cannot be undone.
     * @returns void
     * @throws ApiError
     */
    public static deletePaymentLink({
        linkId,
    }: {
        /**
         * Unique identifier for the payment link
         */
        linkId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/payment_links/{link_id}',
            path: {
                'link_id': linkId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
}
