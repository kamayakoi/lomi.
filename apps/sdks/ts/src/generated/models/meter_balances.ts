/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * meter balances resource object
 */
export type meter_balances = {
    balance?: number;
    /**
     * Unique identifier (UUID format)
     */
    balance_id?: string;
    /**
     * Unique identifier (UUID format)
     */
    billable_organization_id?: string;
    consumed_units?: number;
    /**
     * ISO 8601 datetime
     */
    readonly created_at?: string;
    credited_units?: number;
    /**
     * Unique identifier (UUID format)
     */
    customer_id?: string;
    /**
     * Unique identifier (UUID format)
     */
    last_event_id?: string;
    /**
     * Unique identifier (UUID format)
     */
    meter_id?: string;
    /**
     * ISO 8601 datetime
     */
    readonly updated_at?: string;
};

