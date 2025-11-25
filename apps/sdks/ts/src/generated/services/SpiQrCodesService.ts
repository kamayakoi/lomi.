/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { spi_qr_codes } from '../models/spi_qr_codes.js';
import type { spi_qr_codes_create } from '../models/spi_qr_codes_create.js';
import type { spi_qr_codes_update } from '../models/spi_qr_codes_update.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class SpiQrCodesService {
    /**
     * List spi qr codes
     * SPI QR codes - generate and manage SPI QR payment codes
     * @returns any Successful response with paginated data
     * @throws ApiError
     */
    public static listSpiQrCodes({
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
        data?: Array<spi_qr_codes>;
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
            url: '/spi_qr_codes',
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
     * Create spi qr code
     * SPI QR codes - generate and manage SPI QR payment codes
     * @returns spi_qr_codes Spi_qr_code successfully created
     * @throws ApiError
     */
    public static createSpiQrCode({
        requestBody,
    }: {
        requestBody: spi_qr_codes_create,
    }): CancelablePromise<spi_qr_codes> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/spi_qr_codes',
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
     * Retrieve spi qr code
     * Retrieve a specific spi qr code by its unique identifier.
     * @returns spi_qr_codes Spi_qr_code retrieved successfully
     * @throws ApiError
     */
    public static retrieveSpiQrCode({
        qrCodeId,
    }: {
        /**
         * Unique identifier for the spi qr code
         */
        qrCodeId: string,
    }): CancelablePromise<spi_qr_codes> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/spi_qr_codes/{qr_code_id}',
            path: {
                'qr_code_id': qrCodeId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Update spi qr code
     * Update a specific spi qr code. Only provided fields will be updated.
     * @returns spi_qr_codes Spi_qr_code successfully updated
     * @throws ApiError
     */
    public static updateSpiQrCode({
        qrCodeId,
        requestBody,
    }: {
        /**
         * Unique identifier for the spi qr code
         */
        qrCodeId: string,
        requestBody: spi_qr_codes_update,
    }): CancelablePromise<spi_qr_codes> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/spi_qr_codes/{qr_code_id}',
            path: {
                'qr_code_id': qrCodeId,
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
     * Delete spi qr code
     * Delete a specific spi qr code. This action cannot be undone.
     * @returns void
     * @throws ApiError
     */
    public static deleteSpiQrCode({
        qrCodeId,
    }: {
        /**
         * Unique identifier for the spi qr code
         */
        qrCodeId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/spi_qr_codes/{qr_code_id}',
            path: {
                'qr_code_id': qrCodeId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
}
