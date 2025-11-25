/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { meters } from '../models/meters';
import type { meters_create } from '../models/meters_create';
import type { meters_update } from '../models/meters_update';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MetersService {
    /**
     * List meters
     * Usage meters - track usage for usage-based billing
     * @returns any Successful response with paginated data
     * @throws ApiError
     */
    public static listMeters({
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
        data?: Array<meters>;
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
            url: '/meters',
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
     * Create meter
     * Usage meters - track usage for usage-based billing
     * @returns meters Meter successfully created
     * @throws ApiError
     */
    public static createMeter({
        requestBody,
    }: {
        requestBody: meters_create,
    }): CancelablePromise<meters> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/meters',
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
     * Retrieve meter
     * Retrieve a specific meter by its unique identifier.
     * @returns meters Meter retrieved successfully
     * @throws ApiError
     */
    public static retrieveMeter({
        meterId,
    }: {
        /**
         * Unique identifier for the meter
         */
        meterId: string,
    }): CancelablePromise<meters> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/meters/{meter_id}',
            path: {
                'meter_id': meterId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Update meter
     * Update a specific meter. Only provided fields will be updated.
     * @returns meters Meter successfully updated
     * @throws ApiError
     */
    public static updateMeter({
        meterId,
        requestBody,
    }: {
        /**
         * Unique identifier for the meter
         */
        meterId: string,
        requestBody: meters_update,
    }): CancelablePromise<meters> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/meters/{meter_id}',
            path: {
                'meter_id': meterId,
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
     * Delete meter
     * Delete a specific meter. This action cannot be undone.
     * @returns void
     * @throws ApiError
     */
    public static deleteMeter({
        meterId,
    }: {
        /**
         * Unique identifier for the meter
         */
        meterId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/meters/{meter_id}',
            path: {
                'meter_id': meterId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
}
