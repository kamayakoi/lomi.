/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for creating a customers object. System-managed fields like `created_at`, `organization_id`, and IDs are automatically set.
 */
export type customers_create = {
    address?: string;
    city?: string;
    country?: string;
    /**
     * Email address
     */
    email?: string;
    is_business?: boolean;
    /**
     * Soft deletion flag
     */
    is_deleted?: boolean;
    /**
     * Set of key-value pairs for storing additional information
     */
    metadata?: Record<string, any>;
    name?: string;
    phone_number?: string;
    postal_code?: string;
    spi_alias_mbno?: string;
    spi_alias_shid?: string;
    spi_primary_alias?: string;
    whatsapp_number?: string;
};

