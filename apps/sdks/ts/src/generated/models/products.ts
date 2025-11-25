/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * products resource object
 */
export type products = {
    billing_frequency?: string;
    charge_day?: number;
    /**
     * ISO 8601 datetime
     */
    readonly created_at?: string;
    readonly created_by?: string;
    description?: string;
    display_on_storefront?: boolean;
    environment?: string;
    failed_payment_action?: string;
    first_payment_type?: string;
    /**
     * URL/URI
     */
    image_url?: string;
    /**
     * Whether this resource is currently active
     */
    is_active?: boolean;
    /**
     * Set of key-value pairs for storing additional information
     */
    metadata?: Record<string, any>;
    name?: string;
    /**
     * Unique identifier (UUID format)
     */
    organization_id?: string;
    /**
     * Unique identifier (UUID format)
     */
    readonly product_id?: string;
    product_type?: string;
    /**
     * ISO 8601 datetime
     */
    readonly updated_at?: string;
    usage_aggregation?: string;
    usage_unit?: string;
};

