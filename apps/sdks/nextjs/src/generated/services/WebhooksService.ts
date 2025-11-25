/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { webhooks } from '../models/webhooks';
import type { webhooks_create } from '../models/webhooks_create';
import type { webhooks_update } from '../models/webhooks_update';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WebhooksService {
    /**
     * List webhooks
     * Webhook configuration - receive real-time event notifications
     * @returns any Successful response with paginated data
     * @throws ApiError
     */
    public static listWebhooks({
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
        data?: Array<webhooks>;
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
            url: '/webhooks',
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
     * Create webhook
     * Webhook configuration - receive real-time event notifications
     * @returns webhooks Webhook successfully created
     * @throws ApiError
     */
    public static createWebhook({
        requestBody,
    }: {
        requestBody: webhooks_create,
    }): CancelablePromise<webhooks> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhooks',
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
     * Retrieve webhook
     * Retrieve a specific webhook by its unique identifier.
     * @returns webhooks Webhook retrieved successfully
     * @throws ApiError
     */
    public static retrieveWebhook({
        webhookId,
    }: {
        /**
         * Unique identifier for the webhook
         */
        webhookId: string,
    }): CancelablePromise<webhooks> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webhooks/{webhook_id}',
            path: {
                'webhook_id': webhookId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Update webhook
     * Update a specific webhook. Only provided fields will be updated.
     * @returns webhooks Webhook successfully updated
     * @throws ApiError
     */
    public static updateWebhook({
        webhookId,
        requestBody,
    }: {
        /**
         * Unique identifier for the webhook
         */
        webhookId: string,
        requestBody: webhooks_update,
    }): CancelablePromise<webhooks> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/webhooks/{webhook_id}',
            path: {
                'webhook_id': webhookId,
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
     * Delete webhook
     * Delete a specific webhook. This action cannot be undone.
     * @returns void
     * @throws ApiError
     */
    public static deleteWebhook({
        webhookId,
    }: {
        /**
         * Unique identifier for the webhook
         */
        webhookId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/webhooks/{webhook_id}',
            path: {
                'webhook_id': webhookId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
}
