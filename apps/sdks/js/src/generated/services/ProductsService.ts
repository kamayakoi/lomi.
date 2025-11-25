/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { products } from '../models/products.js';
import type { products_create } from '../models/products_create.js';
import type { products_update } from '../models/products_update.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class ProductsService {
    /**
     * List products
     * Product catalog - manage one-time and recurring products
     * @returns any Successful response with paginated data
     * @throws ApiError
     */
    public static listProducts({
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
        data?: Array<products>;
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
            url: '/products',
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
     * Create product
     * Product catalog - manage one-time and recurring products
     * @returns products Product successfully created
     * @throws ApiError
     */
    public static createProduct({
        requestBody,
    }: {
        requestBody: products_create,
    }): CancelablePromise<products> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/products',
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
     * Retrieve product
     * Retrieve a specific product by its unique identifier.
     * @returns products Product retrieved successfully
     * @throws ApiError
     */
    public static retrieveProduct({
        productId,
    }: {
        /**
         * Unique identifier for the product
         */
        productId: string,
    }): CancelablePromise<products> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/{product_id}',
            path: {
                'product_id': productId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Update product
     * Update a specific product. Only provided fields will be updated.
     * @returns products Product successfully updated
     * @throws ApiError
     */
    public static updateProduct({
        productId,
        requestBody,
    }: {
        /**
         * Unique identifier for the product
         */
        productId: string,
        requestBody: products_update,
    }): CancelablePromise<products> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/products/{product_id}',
            path: {
                'product_id': productId,
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
     * Delete product
     * Delete a specific product. This action cannot be undone.
     * @returns void
     * @throws ApiError
     */
    public static deleteProduct({
        productId,
    }: {
        /**
         * Unique identifier for the product
         */
        productId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/products/{product_id}',
            path: {
                'product_id': productId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
}
