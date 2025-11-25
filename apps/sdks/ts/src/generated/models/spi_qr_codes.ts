/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * spi qr codes resource object
 */
export type spi_qr_codes = {
    categorie?: string;
    /**
     * Unique identifier (UUID format)
     */
    checkout_session_id?: string;
    compte_paye?: string;
    /**
     * ISO 8601 datetime
     */
    readonly created_at?: string;
    readonly created_by?: string;
    environment?: string;
    /**
     * ISO 8601 datetime
     */
    expires_at?: string;
    /**
     * Whether this resource is currently active
     */
    is_active?: boolean;
    is_used?: boolean;
    /**
     * Set of key-value pairs for storing additional information
     */
    metadata?: Record<string, any>;
    montant?: number;
    name?: string;
    /**
     * Unique identifier (UUID format)
     */
    organization_id?: string;
    payeur_alias?: string;
    /**
     * Unique identifier (UUID format)
     */
    payment_request_id?: string;
    /**
     * Unique identifier (UUID format)
     */
    plan_id?: string;
    /**
     * Unique identifier (UUID format)
     */
    product_id?: string;
    qr_code_data?: string;
    /**
     * Unique identifier (UUID format)
     */
    qr_code_id?: string;
    qr_code_image_data?: string;
    /**
     * URL/URI
     */
    qr_code_image_url?: string;
    qr_code_type?: string;
    /**
     * ISO 8601 datetime
     */
    readonly updated_at?: string;
};

