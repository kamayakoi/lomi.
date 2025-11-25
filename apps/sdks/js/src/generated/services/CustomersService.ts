/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { customers } from '../models/customers.js';
import type { customers_create } from '../models/customers_create.js';
import type { customers_update } from '../models/customers_update.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class CustomersService {
    /**
     * List customers
     * Customer management - create and manage customer profiles
     * @returns any Successful response with paginated data
     * @throws ApiError
     */
    public static listCustomers({
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
        data?: Array<customers>;
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
            url: '/customers',
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
     * Create customer
     * Customer management - create and manage customer profiles
     * @returns customers Customer successfully created
     * @throws ApiError
     */
    public static createCustomer({
        requestBody,
    }: {
        requestBody: customers_create,
    }): CancelablePromise<customers> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/customers',
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
     * Retrieve customer
     * Retrieve a specific customer by its unique identifier.
     * @returns customers Customer retrieved successfully
     * @throws ApiError
     */
    public static retrieveCustomer({
        customerId,
    }: {
        /**
         * Unique identifier for the customer
         */
        customerId: string,
    }): CancelablePromise<customers> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/customers/{customer_id}',
            path: {
                'customer_id': customerId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Update customer
     * Update a specific customer. Only provided fields will be updated.
     * @returns customers Customer successfully updated
     * @throws ApiError
     */
    public static updateCustomer({
        customerId,
        requestBody,
    }: {
        /**
         * Unique identifier for the customer
         */
        customerId: string,
        requestBody: customers_update,
    }): CancelablePromise<customers> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/customers/{customer_id}',
            path: {
                'customer_id': customerId,
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
     * Delete customer
     * Delete a specific customer. This action cannot be undone.
     * @returns void
     * @throws ApiError
     */
    public static deleteCustomer({
        customerId,
    }: {
        /**
         * Unique identifier for the customer
         */
        customerId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/customers/{customer_id}',
            path: {
                'customer_id': customerId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
}
