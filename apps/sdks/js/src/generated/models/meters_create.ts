/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for creating a meters object. System-managed fields like `created_at`, `organization_id`, and IDs are automatically set.
 */
export type meters_create = {
    aggregation?: Record<string, any>;
    filter?: Record<string, any>;
    /**
     * Whether this resource is currently active
     */
    is_active?: boolean;
    /**
     * Unique identifier (UUID format)
     */
    meter_id?: string;
    name?: string;
    /**
     * Unique identifier (UUID format)
     */
    product_id?: string;
};

