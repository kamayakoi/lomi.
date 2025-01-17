/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProviderCode } from './ProviderCode';
export type ConnectedProvider = {
    provider_code?: ProviderCode;
    is_connected?: boolean;
    phone_number?: string;
    is_phone_verified?: boolean;
    metadata?: Record<string, any>;
    created_at?: string;
    updated_at?: string;
};

