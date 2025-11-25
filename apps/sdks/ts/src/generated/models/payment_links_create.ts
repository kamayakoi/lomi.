/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for creating a payment links object. System-managed fields like `created_at`, `organization_id`, and IDs are automatically set.
 */
export type payment_links_create = {
    allow_coupon_code?: boolean;
    allow_quantity?: boolean;
    allowed_providers?: string;
    /**
     * Amount in the smallest currency unit (e.g., cents for USD, same for XOF)
     */
    amount?: number;
    /**
     * URL/URI
     */
    cancel_url?: string;
    /**
     * Three-letter ISO currency code (e.g., XOF, USD, EUR)
     */
    currency_code?: string;
    /**
     * ISO 8601 datetime
     */
    expires_at?: string;
    /**
     * Whether this resource is currently active
     */
    is_active?: boolean;
    /**
     * Unique identifier (UUID format)
     */
    link_id?: string;
    link_type?: string;
    /**
     * Set of key-value pairs for storing additional information
     */
    metadata?: Record<string, any>;
    /**
     * Unique identifier (UUID format)
     */
    price_id?: string;
    private_description?: string;
    /**
     * Unique identifier (UUID format)
     */
    product_id?: string;
    public_description?: string;
    quantity?: number;
    /**
     * URL/URI
     */
    success_url?: string;
    title?: string;
    /**
     * URL/URI
     */
    url?: string;
};

