/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for updating a meter balances object. Only include fields you want to modify.
 */
export type meter_balances_update = {
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

