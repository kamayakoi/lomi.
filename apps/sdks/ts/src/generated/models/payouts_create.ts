/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for creating a payouts object. System-managed fields like `created_at`, `organization_id`, and IDs are automatically set.
 */
export type payouts_create = {
    /**
     * Unique identifier (UUID format)
     */
    account_id?: string;
    /**
     * Amount in the smallest currency unit (e.g., cents for USD, same for XOF)
     */
    amount?: number;
    /**
     * Three-letter ISO currency code (e.g., XOF, USD, EUR)
     */
    currency_code?: string;
    /**
     * Set of key-value pairs for storing additional information
     */
    metadata?: Record<string, any>;
    payment_method_code?: string;
    /**
     * Unique identifier (UUID format)
     */
    payout_id?: string;
    /**
     * Unique identifier (UUID format)
     */
    payout_method_id?: string;
    provider_code?: string;
    /**
     * Current status of the resource
     */
    status?: string;
};

