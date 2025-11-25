/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * webhook delivery logs resource object
 */
export type webhook_delivery_logs = {
    attempt_number?: number;
    compte_paye?: string;
    compte_payeur?: string;
    /**
     * ISO 8601 datetime
     */
    readonly created_at?: string;
    event_type?: string;
    headers?: Record<string, any>;
    ip_address?: string;
    /**
     * Unique identifier (UUID format)
     */
    log_id?: string;
    montant?: number;
    /**
     * Unique identifier (UUID format)
     */
    organization_id?: string;
    payload?: Record<string, any>;
    request_duration_ms?: number;
    response_body?: string;
    response_status?: number;
    spi_event_code?: string;
    /**
     * Unique identifier (UUID format)
     */
    spi_tx_id?: string;
    success?: boolean;
    user_agent?: string;
    /**
     * Unique identifier (UUID format)
     */
    webhook_id?: string;
};

