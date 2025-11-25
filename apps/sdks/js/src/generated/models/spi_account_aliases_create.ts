/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for creating a spi account aliases object. System-managed fields like `created_at`, `organization_id`, and IDs are automatically set.
 */
export type spi_account_aliases_create = {
    account_number?: string;
    /**
     * Unique identifier (UUID format)
     */
    alias_id?: string;
    alias_key?: string;
    alias_type?: string;
    /**
     * Whether this resource is currently active
     */
    is_active?: boolean;
    is_default?: boolean;
    /**
     * Set of key-value pairs for storing additional information
     */
    metadata?: Record<string, any>;
};

