/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * spi account aliases resource object
 */
export type spi_account_aliases = {
    account_number?: string;
    /**
     * Unique identifier (UUID format)
     */
    alias_id?: string;
    alias_key?: string;
    alias_type?: string;
    /**
     * ISO 8601 datetime
     */
    readonly created_at?: string;
    /**
     * Whether this resource is currently active
     */
    is_active?: boolean;
    is_default?: boolean;
    /**
     * Set of key-value pairs for storing additional information
     */
    metadata?: Record<string, any>;
    /**
     * Unique identifier (UUID format)
     */
    organization_id?: string;
    /**
     * ISO 8601 datetime
     */
    readonly updated_at?: string;
};

