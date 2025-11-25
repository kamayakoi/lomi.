/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * payment links resource object
 */
export type payment_links = {
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
     * ISO 8601 datetime
     */
    readonly created_at?: string;
    readonly created_by?: string;
    /**
     * Three-letter ISO currency code (e.g., XOF, USD, EUR)
     */
    currency_code?: string;
    environment?: string;
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
    organization_id?: string;
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
     * ISO 8601 datetime
     */
    readonly updated_at?: string;
    /**
     * URL/URI
     */
    url?: string;
};

