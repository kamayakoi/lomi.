/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * payment requests resource object
 */
export type payment_requests = {
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
     * Unique identifier (UUID format)
     */
    customer_id?: string;
    description?: string;
    environment?: string;
    expiry_date?: string;
    /**
     * Unique identifier (UUID format)
     */
    organization_id?: string;
    payment_link?: string;
    payment_reference?: string;
    /**
     * Unique identifier (UUID format)
     */
    readonly request_id?: string;
    spi_account_number?: string;
    /**
     * Unique identifier (UUID format)
     */
    spi_bulk_instruction_id?: string;
    spi_confirmation?: boolean;
    spi_date_envoi?: string;
    spi_date_irrevocabilite?: string;
    spi_date_limite_paiement?: string;
    spi_date_limite_reponse?: string;
    spi_date_rejet?: string;
    spi_debit_differe?: boolean;
    /**
     * Unique identifier (UUID format)
     */
    spi_end2end_id?: string;
    spi_payeur_alias?: string;
    spi_payeur_nom?: string;
    spi_payeur_pays?: string;
    spi_payment_request_category?: string;
    spi_payment_status?: string;
    spi_ref_doc_numero?: string;
    spi_ref_doc_type?: string;
    spi_rejection_reason?: string;
    spi_remise_amount?: number;
    spi_remise_rate?: number;
    /**
     * Unique identifier (UUID format)
     */
    spi_tx_id?: string;
    /**
     * Current status of the resource
     */
    status?: string;
    /**
     * ISO 8601 datetime
     */
    readonly updated_at?: string;
};

