/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for updating a transactions object. Only include fields you want to modify.
 */
export type transactions_update = {
    /**
     * Unique identifier (UUID format)
     */
    checkout_session_id?: string;
    /**
     * Three-letter ISO currency code (e.g., XOF, USD, EUR)
     */
    currency_code?: string;
    /**
     * Unique identifier (UUID format)
     */
    customer_id?: string;
    description?: string;
    discount_amount?: number;
    fee_amount?: number;
    /**
     * Unique identifier (UUID format)
     */
    fee_structure_id?: string;
    gross_amount?: number;
    is_bnpl?: boolean;
    is_pos?: boolean;
    /**
     * Set of key-value pairs for storing additional information
     */
    metadata?: Record<string, any>;
    net_amount?: number;
    payment_method_code?: string;
    /**
     * Unique identifier (UUID format)
     */
    price_id?: string;
    /**
     * Unique identifier (UUID format)
     */
    product_id?: string;
    provider_code?: string;
    quantity?: number;
    spi_account_number?: string;
    /**
     * Unique identifier (UUID format)
     */
    spi_bulk_instruction_id?: string;
    spi_date_envoi?: string;
    spi_date_irrevocabilite?: string;
    spi_discount_amount?: number;
    spi_discount_rate?: number;
    /**
     * Unique identifier (UUID format)
     */
    spi_end2end_id?: string;
    spi_payment_category?: string;
    spi_payment_flow_type?: string;
    spi_payment_status?: string;
    spi_rejection_reason?: string;
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
    subscription_id?: string;
    transaction_type?: string;
};

