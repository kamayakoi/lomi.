/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { installment_payments } from '../models/installment_payments';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InstallmentPaymentsService {
    /**
     * List installment payments
     * BNPL installment payments - track installment payments
     * @returns any Successful response with paginated data
     * @throws ApiError
     */
    public static listInstallmentPayments({
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
        data?: Array<installment_payments>;
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
            url: '/installment_payments',
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
     * Retrieve installment payment
     * Retrieve a specific installment payment by its unique identifier.
     * @returns installment_payments Installment_payment retrieved successfully
     * @throws ApiError
     */
    public static retrieveInstallmentPayment({
        paymentId,
    }: {
        /**
         * Unique identifier for the installment payment
         */
        paymentId: string,
    }): CancelablePromise<installment_payments> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/installment_payments/{payment_id}',
            path: {
                'payment_id': paymentId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
}
