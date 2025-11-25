/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { webhook_delivery_logs } from '../models/webhook_delivery_logs';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WebhookDeliveryLogsService {
    /**
     * List webhook delivery logs
     * Webhook event log - history of webhook deliveries
     * @returns any Successful response with paginated data
     * @throws ApiError
     */
    public static listWebhookDeliveryLogs({
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
        data?: Array<webhook_delivery_logs>;
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
            url: '/webhook_delivery_logs',
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
     * Retrieve webhook delivery log
     * Retrieve a specific webhook delivery log by its unique identifier.
     * @returns webhook_delivery_logs Webhook_delivery_log retrieved successfully
     * @throws ApiError
     */
    public static retrieveWebhookDeliveryLog({
        logId,
    }: {
        /**
         * Unique identifier for the webhook delivery log
         */
        logId: string,
    }): CancelablePromise<webhook_delivery_logs> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webhook_delivery_logs/{log_id}',
            path: {
                'log_id': logId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
}
