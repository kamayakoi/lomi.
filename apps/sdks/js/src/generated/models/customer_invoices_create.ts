/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for creating a customer invoices object. System-managed fields like `created_at`, `organization_id`, and IDs are automatically set.
 */
export type customer_invoices_create = {
    /**
     * Amount in the smallest currency unit (e.g., cents for USD, same for XOF)
     */
    amount?: number;
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
     * Current status of the resource
     */
    status?: string;
};

