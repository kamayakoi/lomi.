/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * webhooks resource object
 */
export type webhooks = {
    authorized_events?: string;
    /**
     * ISO 8601 datetime
     */
    readonly created_at?: string;
    readonly created_by?: string;
    /**
     * ISO 8601 datetime
     */
    readonly deleted_at?: string;
    environment?: string;
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
    /**
     * Unique identifier (UUID format)
     */
    organization_id?: string;
    retry_count?: number;
    spi_event_types?: string;
    supports_spi?: boolean;
    /**
     * ISO 8601 datetime
     */
    readonly updated_at?: string;
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

