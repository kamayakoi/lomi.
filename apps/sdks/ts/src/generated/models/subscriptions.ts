/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * subscriptions resource object
 */
export type subscriptions = {
    /**
     * ISO 8601 datetime
     */
    readonly created_at?: string;
    readonly created_by?: string;
    /**
     * Unique identifier (UUID format)
     */
    customer_id?: string;
    end_date?: string;
    environment?: string;
    /**
     * Set of key-value pairs for storing additional information
     */
    metadata?: Record<string, any>;
    next_billing_date?: string;
    /**
     * Unique identifier (UUID format)
     */
    organization_id?: string;
    /**
     * Unique identifier (UUID format)
     */
    price_id?: string;
    /**
     * Unique identifier (UUID format)
     */
    product_id?: string;
    start_date?: string;
    /**
     * Current status of the resource
     */
    status?: string;
    /**
     * Unique identifier (UUID format)
     */
    readonly subscription_id?: string;
    /**
     * ISO 8601 datetime
     */
    readonly updated_at?: string;
};

