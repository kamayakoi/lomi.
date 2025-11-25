/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for updating a prices object. Only include fields you want to modify.
 */
export type prices_update = {
    /**
     * Amount in the smallest currency unit (e.g., cents for USD, same for XOF)
     */
    amount?: number;
    billing_interval?: string;
    /**
     * Three-letter ISO currency code (e.g., XOF, USD, EUR)
     */
    currency_code?: string;
    /**
     * Whether this resource is currently active
     */
    is_active?: boolean;
    is_default?: boolean;
    maximum_amount?: number;
    /**
     * Set of key-value pairs for storing additional information
     */
    metadata?: Record<string, any>;
    minimum_amount?: number;
    /**
     * Unique identifier (UUID format)
     */
    price_id?: string;
    pricing_model?: string;
    /**
     * Unique identifier (UUID format)
     */
    product_id?: string;
    /**
     * Unique identifier (UUID format)
     */
    provider_price_id?: string;
    /**
     * Unique identifier (UUID format)
     */
    provider_product_id?: string;
};

