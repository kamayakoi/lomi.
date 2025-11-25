/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for updating a meters object. Only include fields you want to modify.
 */
export type meters_update = {
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

