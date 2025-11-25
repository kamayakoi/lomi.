/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { spi_account_aliases } from '../models/spi_account_aliases.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class SpiAccountAliasesService {
    /**
     * List spi account aliases
     * SPI account aliases - manage SPI payment aliases
     * @returns any Successful response with paginated data
     * @throws ApiError
     */
    public static listSpiAccountAliases({
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
        data?: Array<spi_account_aliases>;
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
            url: '/spi_account_aliases',
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
     * Retrieve spi account aliase
     * Retrieve a specific spi account aliase by its unique identifier.
     * @returns spi_account_aliases Spi_account_aliase retrieved successfully
     * @throws ApiError
     */
    public static retrieveSpiAccountAliase({
        aliasId,
    }: {
        /**
         * Unique identifier for the spi account aliase
         */
        aliasId: string,
    }): CancelablePromise<spi_account_aliases> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/spi_account_aliases/{alias_id}',
            path: {
                'alias_id': aliasId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
}
