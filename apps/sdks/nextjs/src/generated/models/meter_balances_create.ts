/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for creating a meter balances object. System-managed fields like `created_at`, `organization_id`, and IDs are automatically set.
 */
export type meter_balances_create = {
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
};

