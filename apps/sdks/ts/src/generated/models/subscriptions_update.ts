/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for updating a subscriptions object. Only include fields you want to modify.
 */
export type subscriptions_update = {
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

