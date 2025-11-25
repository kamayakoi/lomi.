/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for creating a products object. System-managed fields like `created_at`, `organization_id`, and IDs are automatically set.
 */
export type products_create = {
    billing_frequency?: string;
    charge_day?: number;
    description?: string;
    display_on_storefront?: boolean;
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
    product_type?: string;
    usage_aggregation?: string;
    usage_unit?: string;
};

