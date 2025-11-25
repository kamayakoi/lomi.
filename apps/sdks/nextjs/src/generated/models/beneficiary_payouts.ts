/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * beneficiary payouts resource object
 */
export type beneficiary_payouts = {
    /**
     * Unique identifier (UUID format)
     */
    account_id?: string;
    /**
     * Amount in the smallest currency unit (e.g., cents for USD, same for XOF)
     */
    amount?: number;
    /**
     * ISO 8601 datetime
     */
    readonly created_at?: string;
    readonly created_by?: string;
    /**
     * Three-letter ISO currency code (e.g., XOF, USD, EUR)
     */
    currency_code?: string;
    /**
     * Set of key-value pairs for storing additional information
     */
    metadata?: Record<string, any>;
    /**
     * Unique identifier (UUID format)
     */
    organization_id?: string;
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
     * Unique identifier (UUID format)
     */
    spi_bulk_instruction_id?: string;
    /**
     * Current status of the resource
     */
    status?: string;
    /**
     * ISO 8601 datetime
     */
    readonly updated_at?: string;
};

