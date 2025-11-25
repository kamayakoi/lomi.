/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * meters resource object
 */
export type meters = {
    aggregation?: Record<string, any>;
    /**
     * ISO 8601 datetime
     */
    readonly created_at?: string;
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
    organization_id?: string;
    /**
     * Unique identifier (UUID format)
     */
    product_id?: string;
    /**
     * ISO 8601 datetime
     */
    readonly updated_at?: string;
};

