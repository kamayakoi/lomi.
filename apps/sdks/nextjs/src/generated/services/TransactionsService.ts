/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { transactions } from '../models/transactions';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TransactionsService {
    /**
     * List transactions
     * Transaction history - view completed and pending transactions
     * @returns any Successful response with paginated data
     * @throws ApiError
     */
    public static listTransactions({
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
        data?: Array<transactions>;
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
            url: '/transactions',
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
     * Retrieve transaction
     * Retrieve a specific transaction by its unique identifier.
     * @returns transactions Transaction retrieved successfully
     * @throws ApiError
     */
    public static retrieveTransaction({
        transactionId,
    }: {
        /**
         * Unique identifier for the transaction
         */
        transactionId: string,
    }): CancelablePromise<transactions> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/transactions/{transaction_id}',
            path: {
                'transaction_id': transactionId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
}
