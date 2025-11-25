/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for creating a events object. System-managed fields like `created_at`, `organization_id`, and IDs are automatically set.
 */
export type events_create = {
    /**
     * Unique identifier (UUID format)
     */
    customer_id?: string;
    event_data?: Record<string, any>;
    /**
     * Unique identifier (UUID format)
     */
    event_id?: string;
    event_name?: string;
    /**
     * Set of key-value pairs for storing additional information
     */
    metadata?: Record<string, any>;
    /**
     * Unique identifier (UUID format)
     */
    product_id?: string;
};

