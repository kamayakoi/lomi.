/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * refunds resource object
 */
export type refunds = {
    /**
     * Amount in the smallest currency unit (e.g., cents for USD, same for XOF)
     */
    amount?: number;
    /**
     * ISO 8601 datetime
     */
    readonly created_at?: string;
    environment?: string;
    fee_amount?: number;
    /**
     * Set of key-value pairs for storing additional information
     */
    metadata?: Record<string, any>;
    reason?: string;
    /**
     * Unique identifier (UUID format)
     */
    refund_id?: string;
    refunded_amount?: number;
    spi_account_number?: string;
    /**
     * Unique identifier (UUID format)
     */
    spi_end2end_id?: string;
    spi_fund_return_status?: string;
    spi_motif_code?: string;
    spi_rejection_reason?: string;
    spi_retour_date_demande?: string;
    spi_retour_date_irrevocabilite?: string;
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
    /**
     * ISO 8601 datetime
     */
    readonly updated_at?: string;
};

