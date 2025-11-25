/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for creating a installment payments object. System-managed fields like `created_at`, `organization_id`, and IDs are automatically set.
 */
export type installment_payments_create = {
    /**
     * Amount in the smallest currency unit (e.g., cents for USD, same for XOF)
     */
    amount?: number;
    due_date?: string;
    /**
     * Unique identifier (UUID format)
     */
    installment_id?: string;
    interest_amount?: number;
    /**
     * ISO 8601 datetime
     */
    paid_at?: string;
    payment_link?: string;
    payment_method_code?: string;
    /**
     * Unique identifier (UUID format)
     */
    plan_id?: string;
    principal_amount?: number;
    processing_fee?: number;
    provider_code?: string;
    sequence_number?: number;
    /**
     * Unique identifier (UUID format)
     */
    spi_payment_request_id?: string;
    /**
     * Unique identifier (UUID format)
     */
    spi_tx_id?: string;
    /**
     * Current status of the resource
     */
    status?: string;
    /**
     * Unique identifier (UUID format)
     */
    transaction_id?: string;
};

