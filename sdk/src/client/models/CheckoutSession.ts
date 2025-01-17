/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCheckoutSession } from './CreateCheckoutSession';
export type CheckoutSession = (CreateCheckoutSession & {
    checkout_session_id?: string;
    url?: string;
    status?: CheckoutSession.status;
    created_at?: string;
    expires_at?: string;
});
export namespace CheckoutSession {
    export enum status {
        OPEN = 'open',
        COMPLETED = 'completed',
        EXPIRED = 'expired',
    }
}

