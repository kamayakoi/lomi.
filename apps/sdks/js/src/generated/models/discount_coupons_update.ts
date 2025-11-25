/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for updating a discount coupons object. Only include fields you want to modify.
 */
export type discount_coupons_update = {
    applies_to_product_types?: string;
    code?: string;
    /**
     * Unique identifier (UUID format)
     */
    coupon_id?: string;
    current_uses?: number;
    customer_type?: string;
    description?: string;
    discount_fixed_amount?: number;
    discount_percentage?: number;
    discount_type?: string;
    /**
     * ISO 8601 datetime
     */
    expires_at?: string;
    /**
     * Whether this resource is currently active
     */
    is_active?: boolean;
    is_organization_wide?: boolean;
    max_quantity_per_use?: number;
    max_uses?: number;
    scope_type?: string;
    usage_frequency_limit?: string;
    usage_limit_value?: number;
    valid_from?: string;
};

