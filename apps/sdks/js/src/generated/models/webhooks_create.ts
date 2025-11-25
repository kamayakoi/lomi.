/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for creating a webhooks object. System-managed fields like `created_at`, `organization_id`, and IDs are automatically set.
 */
export type webhooks_create = {
    authorized_events?: string;
    /**
     * Whether this resource is currently active
     */
    is_active?: boolean;
    last_payload?: Record<string, any>;
    last_response_body?: string;
    last_response_status?: number;
    /**
     * ISO 8601 datetime
     */
    last_triggered_at?: string;
    /**
     * Set of key-value pairs for storing additional information
     */
    metadata?: Record<string, any>;
    retry_count?: number;
    spi_event_types?: string;
    supports_spi?: boolean;
    /**
     * URL/URI
     */
    url?: string;
    verification_token?: string;
    /**
     * Unique identifier (UUID format)
     */
    webhook_id?: string;
};

