/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { meter_balances } from '../models/meter_balances';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MeterBalancesService {
    /**
     * List meter balances
     * Meter balances - view current usage balances
     * @returns any Successful response with paginated data
     * @throws ApiError
     */
    public static listMeterBalances({
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
        data?: Array<meter_balances>;
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
            url: '/meter_balances',
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
     * Retrieve meter balance
     * Retrieve a specific meter balance by its unique identifier.
     * @returns meter_balances Meter_balance retrieved successfully
     * @throws ApiError
     */
    public static retrieveMeterBalance({
        balanceId,
    }: {
        /**
         * Unique identifier for the meter balance
         */
        balanceId: string,
    }): CancelablePromise<meter_balances> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/meter_balances/{balance_id}',
            path: {
                'balance_id': balanceId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
}
