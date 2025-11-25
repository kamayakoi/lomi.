/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for creating a subscriptions object. System-managed fields like `created_at`, `organization_id`, and IDs are automatically set.
 */
export type subscriptions_create = {
    /**
     * Unique identifier (UUID format)
     */
    customer_id?: string;
    end_date?: string;
    /**
     * Set of key-value pairs for storing additional information
     */
    metadata?: Record<string, any>;
    next_billing_date?: string;
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
};

