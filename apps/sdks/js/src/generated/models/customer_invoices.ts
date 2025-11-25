/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * customer invoices resource object
 */
export type customer_invoices = {
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
    /**
     * Unique identifier (UUID format)
     */
    customer_invoice_id?: string;
    description?: string;
    due_date?: string;
    /**
     * Set of key-value pairs for storing additional information
     */
    metadata?: Record<string, any>;
    /**
     * Unique identifier (UUID format)
     */
    organization_id?: string;
    /**
     * Current status of the resource
     */
    status?: string;
    /**
     * ISO 8601 datetime
     */
    readonly updated_at?: string;
};

