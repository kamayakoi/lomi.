/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { customer_invoices } from '../models/customer_invoices.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class CustomerInvoicesService {
    /**
     * List customer invoices
     * Customer invoices - view subscription invoices
     * @returns any Successful response with paginated data
     * @throws ApiError
     */
    public static listCustomerInvoices({
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
        data?: Array<customer_invoices>;
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
            url: '/customer_invoices',
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
     * Retrieve customer invoice
     * Retrieve a specific customer invoice by its unique identifier.
     * @returns customer_invoices Customer_invoice retrieved successfully
     * @throws ApiError
     */
    public static retrieveCustomerInvoice({
        invoiceId,
    }: {
        /**
         * Unique identifier for the customer invoice
         */
        invoiceId: string,
    }): CancelablePromise<customer_invoices> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/customer_invoices/{invoice_id}',
            path: {
                'invoice_id': invoiceId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
}
