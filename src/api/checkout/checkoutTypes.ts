export interface PaymentMethod {
    id: string
    name: string
    icon: string
    color: string
}

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failure'

export interface CheckoutFormData {
    amount: number;
    currency: string;
    aggregatedMerchantId: string;
    errorUrl: string;
    successUrl: string;
    merchantId: string;
    organizationId: string;
    customerId: string;
    productId: string | null;
    subscriptionId: string | null;
    transactionType: string;
    description: string;
    referenceId: string;
    metadata: Record<string, unknown>;
    feeAmount: number;
    feeReference: string;
    providerCode: string;
    paymentMethodCode: string;
    providerTransactionId: string;
    providerPaymentStatus: string;
}

export interface WaveCheckoutResponse {
    waveLaunchUrl: string;
    // Add other properties if needed
}

export interface Product {
    id: string;
    merchantId: string;
    organizationId: string;
    name: string;
    description: string;
    price: number;
    currencyCode: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Provider {
    name: string;
    code: string;
    description: string;
}

export interface Organization {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    verified: boolean;
    websiteUrl: string;
    logoUrl: string;
    status: string;
    defaultCurrency: string;
    totalRevenue: number;
    totalTransactions: number;
    totalMerchants: number;
    totalCustomers: number;
    employeeNumber: string;
    industry: string;
    metadata: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    deletedAt: string | null;
}

export interface PaymentLink {
    id: string;
    merchantId: string;
    organizationId: string;
    linkType: string;
    url: string;
    productId: string | null;
    planId: string | null;
    title: string;
    publicDescription: string;
    privateDescription: string;
    price: number | null;
    currencyCode: string;
    allowedProviders: string[];
    allowCouponCode: boolean;
    isActive: boolean;
    expiresAt: string | null;
    successUrl: string | null;
    metadata: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

export interface Props {
    paymentLinkId: string;
}

export interface Checkout {
    id: string;
    merchantId: string;
    organizationId: string;
    customerId: string;
    productId: string | null;
    subscriptionId: string | null;
    transactionType: string;
    description: string;
    referenceId: string;
    metadata: Record<string, unknown>;
    amount: number;
    feeAmount: number;
    feeReference: string;
    currency: string;
    providerCode: string;
    paymentMethodCode: string;
    providerTransactionId: string;
    providerPaymentStatus: string;
    // Add other checkout properties here
}
