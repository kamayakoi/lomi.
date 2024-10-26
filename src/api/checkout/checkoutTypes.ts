export interface PaymentLink {
    linkId: string;
    merchantId: string;
    organizationId: string;
    linkType: 'product' | 'plan' | 'instant';
    url: string;
    productId: string | null;
    planId: string | null;
    title: string;
    public_description: string;
    privateDescription: string | null;
    price: number | null;
    currency_code: string;
    allowed_providers: string[];
    allow_coupon_code: boolean;
    isActive: boolean;
    expiresAt: string | null;
    success_url: string | null;
    metadata: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
    organizationLogoUrl: string | null;
}

export interface MerchantProduct {
    productId: string;
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

export interface SubscriptionPlan {
    planId: string;
    merchantId: string;
    organizationId: string;
    name: string;
    description: string;
    billingFrequency: string;
    amount: number;
    currencyCode: string;
    failedPaymentAction: string;
    chargeDay: number | null;
    metadata: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
    firstPaymentType: string;
}

export interface CheckoutData {
    paymentLink: PaymentLink;
    merchantProduct: MerchantProduct | null;
    subscriptionPlan: SubscriptionPlan | null;
}
