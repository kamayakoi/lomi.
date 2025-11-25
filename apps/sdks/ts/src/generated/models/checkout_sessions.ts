/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * checkout sessions resource object
 */
export type checkout_sessions = {
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
     * Unique identifier (UUID format)
     */
    checkout_session_id?: string;
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
     * Email address
     */
    customer_email?: string;
    /**
     * Unique identifier (UUID format)
     */
    customer_id?: string;
    customer_name?: string;
    customer_phone?: string;
    environment?: string;
    /**
     * ISO 8601 datetime
     */
    expires_at?: string;
    /**
     * Unique identifier (UUID format)
     */
    installment_plan_id?: string;
    is_pos?: boolean;
    is_spi?: boolean;
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
    payment_link_id?: string;
    /**
     * Unique identifier (UUID format)
     */
    payment_request_id?: string;
    /**
     * Unique identifier (UUID format)
     */
    price_id?: string;
    /**
     * Unique identifier (UUID format)
     */
    product_id?: string;
    public_description?: string;
    qr_code_data?: Record<string, any>;
    qr_code_type?: string;
    quantity?: number;
    spi_account_number?: string;
    /**
     * Unique identifier (UUID format)
     */
    spi_qr_code_id?: string;
    /**
     * Current status of the resource
     */
    status?: string;
    /**
     * Unique identifier (UUID format)
     */
    subscription_id?: string;
    /**
     * URL/URI
     */
    success_url?: string;
    title?: string;
    /**
     * ISO 8601 datetime
     */
    readonly updated_at?: string;
};

