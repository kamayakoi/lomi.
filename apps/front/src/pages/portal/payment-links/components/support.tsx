import { supabase } from '@/utils/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'

export const fetchPaymentLinks = async (
    merchantId: string,
    linkType: string | null,
    currency: string | null,
    status: string | null,
    page: number,
    pageSize: number,
    includeExpired = false
) => {
    try {
        if (!merchantId) {
            console.error('Error fetching payment links: merchantId is required');
            return [];
        }

        const { data, error } = await supabase.rpc('fetch_payment_links', {
            p_merchant_id: merchantId,
            p_link_type: linkType === 'all' ? undefined : linkType,
            p_currency_code: currency === 'all' ? undefined : currency,
            p_is_active: status === 'all' ? undefined : status === 'active',
            p_page: page,
            p_page_size: pageSize,
            p_include_expired: includeExpired
        });

        if (error) {
            console.error('Error fetching payment links:', error);
            return [];
        }

        // Ensure we return an array, even if data is null/undefined
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.error('Exception fetching payment links:', e);
        return [];
    }
};

export interface CheckoutSession {
    checkout_session_id: string;
    payment_link_id?: string;
    expires_at: string;
}

export const generatePaymentLink = (
    linkType: string,
    productId?: string,
    planId?: string
) => {
    const baseUrl = import.meta.env['BUN_ENV'] === 'production'
        ? import.meta.env['VITE_PAYMENT_LINK_BASE_URL']
        : import.meta.env['VITE_PAYMENT_LINK_BASE_URL_DEV'];

    let linkPath = '';

    if (linkType === 'product' && productId) {
        linkPath = `/product/${encodeURIComponent(productId)}`;
    } else if (linkType === 'plan' && planId) {
        linkPath = `/plan/${encodeURIComponent(planId)}`;
    }

    return `${baseUrl}${linkPath}`;
};

/**
 * Creates a checkout session from a payment link
 * @param paymentLinkId The ID of the payment link
 * @param customerInfo Optional customer information
 * @param supabase Supabase client instance
 * @param expirationMinutes How long the checkout session should be valid (default: 60 minutes)
 * @returns Promise resolving to checkout session data
 */
export const createCheckoutSessionFromLink = async (
    paymentLinkId: string,
    customerInfo: {
        customerId?: string;
        email?: string;
        name?: string;
        phone?: string;
    },
    supabase: SupabaseClient,
    expirationMinutes = 60
): Promise<{ success: boolean; data: CheckoutSession | null; message: string }> => {
    try {
        const { data, error } = await supabase.rpc('create_checkout_session_from_payment_link', {
            p_payment_link_id: paymentLinkId,
            p_customer_id: customerInfo.customerId || null,
            p_customer_email: customerInfo.email || null,
            p_customer_name: customerInfo.name || null,
            p_customer_phone: customerInfo.phone || null,
            p_expiration_minutes: expirationMinutes
        });

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
            data: data as CheckoutSession,
            message: 'Checkout session created successfully'
        };
    } catch (error: unknown) {
        console.error('Error creating checkout session:', error);
        return {
            success: false,
            data: null,
            message: error instanceof Error ? error.message : 'An error occurred while creating the checkout session'
        };
    }
};

/**
 * Creates a checkout session directly
 * @param sessionData Session data including merchant, organization, amount, etc.
 * @param supabase Supabase client instance
 * @returns Promise resolving to checkout session data
 */
export const createCheckoutSession = async (
    sessionData: {
        merchantId: string;
        organizationId: string;
        paymentLinkId?: string;
        customerId?: string;
        amount: number;
        currencyCode: string;
        productId?: string;
        planId?: string;
        successUrl?: string;
        cancelUrl?: string;
        customerEmail?: string;
        customerName?: string;
        customerPhone?: string;
        allowedProviders?: string[];
        metadata?: Record<string, unknown>;
        expirationMinutes?: number;
    },
    supabase: SupabaseClient
): Promise<{ success: boolean; data: CheckoutSession | null; message: string }> => {
    try {
        const { data, error } = await supabase.rpc('create_checkout_session', {
            p_merchant_id: sessionData.merchantId,
            p_organization_id: sessionData.organizationId,
            p_amount: sessionData.amount,
            p_currency_code: sessionData.currencyCode,
            p_payment_link_id: sessionData.paymentLinkId || null,
            p_customer_id: sessionData.customerId || null,
            p_product_id: sessionData.productId || null,
            p_plan_id: sessionData.planId || null,
            p_success_url: sessionData.successUrl || null,
            p_cancel_url: sessionData.cancelUrl || null,
            p_customer_email: sessionData.customerEmail || null,
            p_customer_name: sessionData.customerName || null,
            p_customer_phone: sessionData.customerPhone || null,
            p_allowed_providers: sessionData.allowedProviders || null,
            p_metadata: sessionData.metadata || null,
            p_expiration_minutes: sessionData.expirationMinutes || 60
        });

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
            data: data as CheckoutSession,
            message: 'Checkout session created successfully'
        };
    } catch (error: unknown) {
        console.error('Error creating checkout session:', error);
        return {
            success: false,
            data: null,
            message: error instanceof Error ? error.message : 'An error occurred while creating the checkout session'
        };
    }
};

/**
 * Gets a checkout session by ID
 * @param checkoutSessionId The checkout session ID
 * @param supabase Supabase client instance
 * @returns Promise resolving to checkout session data
 */
export const getCheckoutSession = async (
    checkoutSessionId: string,
    supabase: SupabaseClient
): Promise<{ success: boolean; data: CheckoutSession | null; message: string }> => {
    try {
        const { data, error } = await supabase.rpc('get_checkout_session', {
            p_checkout_session_id: checkoutSessionId
        });

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
            data: data as CheckoutSession,
            message: 'Checkout session retrieved successfully'
        };
    } catch (error: unknown) {
        console.error('Error retrieving checkout session:', error);
        return {
            success: false,
            data: null,
            message: error instanceof Error ? error.message : 'An error occurred while retrieving the checkout session'
        };
    }
};

/**
 * Safely delete a payment link, handling any foreign key constraints
 */
export const safeDeletePaymentLink = async (linkId: string) => {
    try {
        const { data, error } = await supabase.rpc('safe_delete_payment_link', {
            p_link_id: linkId
        });

        if (error) {
            console.error('Error safely deleting payment link:', error);
            return { success: false, message: error.message };
        }

        return {
            success: data === true,
            message: data === true ? 'Payment link deleted successfully' : 'Failed to delete payment link'
        };
    } catch (e) {
        console.error('Exception deleting payment link:', e);
        return {
            success: false,
            message: e instanceof Error ? e.message : 'Unknown error occurred while deleting'
        };
    }
};
