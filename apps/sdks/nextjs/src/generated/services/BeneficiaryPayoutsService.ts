/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { beneficiary_payouts } from '../models/beneficiary_payouts';
import type { beneficiary_payouts_create } from '../models/beneficiary_payouts_create';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BeneficiaryPayoutsService {
    /**
     * List beneficiary payouts
     * Beneficiary payouts - track individual payout transfers
     * @returns any Successful response with paginated data
     * @throws ApiError
     */
    public static listBeneficiaryPayouts({
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
        data?: Array<beneficiary_payouts>;
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
            url: '/beneficiary_payouts',
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
     * Create beneficiary payout
     * Beneficiary payouts - track individual payout transfers
     * @returns beneficiary_payouts Beneficiary_payout successfully created
     * @throws ApiError
     */
    public static createBeneficiaryPayout({
        requestBody,
    }: {
        requestBody: beneficiary_payouts_create,
    }): CancelablePromise<beneficiary_payouts> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/beneficiary_payouts',
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
     * Retrieve beneficiary payout
     * Retrieve a specific beneficiary payout by its unique identifier.
     * @returns beneficiary_payouts Beneficiary_payout retrieved successfully
     * @throws ApiError
     */
    public static retrieveBeneficiaryPayout({
        payoutId,
    }: {
        /**
         * Unique identifier for the beneficiary payout
         */
        payoutId: string,
    }): CancelablePromise<beneficiary_payouts> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/beneficiary_payouts/{payout_id}',
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
