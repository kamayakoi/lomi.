/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * events resource object
 */
export type events = {
    /**
     * ISO 8601 datetime
     */
    readonly created_at?: string;
    readonly created_by?: string;
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
    organization_id?: string;
    /**
     * Unique identifier (UUID format)
     */
    product_id?: string;
};

