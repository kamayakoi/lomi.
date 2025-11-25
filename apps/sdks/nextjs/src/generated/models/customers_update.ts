/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for updating a customers object. Only include fields you want to modify.
 */
export type customers_update = {
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

