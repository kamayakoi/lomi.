/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * customers resource object
 */
export type customers = {
    address?: string;
    city?: string;
    country?: string;
    /**
     * ISO 8601 datetime
     */
    readonly created_at?: string;
    readonly created_by?: string;
    /**
     * Unique identifier (UUID format)
     */
    readonly customer_id?: string;
    /**
     * ISO 8601 datetime
     */
    readonly deleted_at?: string;
    /**
     * Email address
     */
    email?: string;
    environment?: string;
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
    /**
     * Unique identifier (UUID format)
     */
    organization_id?: string;
    phone_number?: string;
    postal_code?: string;
    spi_alias_mbno?: string;
    spi_alias_shid?: string;
    spi_primary_alias?: string;
    /**
     * ISO 8601 datetime
     */
    readonly updated_at?: string;
    whatsapp_number?: string;
};

