// Orange Money API Response Types

export interface OrangeTokenResponse {
    token_type: string;
    access_token: string;
    expires_in: string;
}

export interface OrangeWebPaymentResponse {
    status: number;
    message: string;
    pay_token: string;
    payment_url: string;
    notif_token: string;
}

export interface OrangePaymentNotification {
    status: 'SUCCESS' | 'FAILED';
    notif_token: string;
    txnid: string;
}

export interface OrangeTransactionStatusResponse {
    status: OrangePaymentStatus;
    order_id: string;
    txnid?: string;
}

// Orange Money API Request Types

export interface OrangeWebPaymentRequest {
    merchant_key: string;
    currency: string;
    order_id: string;
    amount: number;
    return_url: string;
    cancel_url: string;
    notif_url: string;
    lang: string;
    reference?: string;
}

export interface OrangeTransactionStatusRequest {
    order_id: string;
    amount: number;
    pay_token: string;
}

// Orange Configuration Types

export interface OrangeConfig {
    clientId: string;
    clientSecret: string;
    merchantKey: string;
    apiUrl: string;
    environment: 'dev' | 'prod';
}

// Orange Service Types

export interface CreateOrangeCheckoutSessionParams {
    merchantId: string;
    organizationId: string;
    customerId: string;
    amount: number;
    currency: string;
    successUrl: string;
    cancelUrl: string;
    notificationUrl: string;
    orderId?: string;
    language?: string;
    reference?: string;
    productId?: string;
    subscriptionId?: string;
    description?: string;
    metadata?: Record<string, unknown>;
}

// Orange Status Types

export type OrangePaymentStatus = 
    | 'INITIATED'    // waiting for user entry
    | 'PENDING'      // user has clicked on "Confirmer", transaction is in progress
    | 'EXPIRED'      // user has clicked on "Confirmer" too late (after token's validity)
    | 'SUCCESS'      // payment is done
    | 'FAILED';      // payment has failed

export interface OrangePaymentError {
    code: string;
    message: string;
} 