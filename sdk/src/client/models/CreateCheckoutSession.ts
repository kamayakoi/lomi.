/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProviderCode } from './ProviderCode';
export type CreateCheckoutSession = {
    merchant_id: string;
    product_id?: string;
    subscription_id?: string;
    success_url: string;
    cancel_url: string;
    /**
     * Specific payment providers to enable for this checkout session
     */
    provider_codes: Array<ProviderCode>;
    customer_email?: string;
    customer_phone?: string;
    customer_name?: string;
    metadata?: Record<string, any>;
};

