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
    cancel_url: string;
    metadata: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
    organizationLogoUrl: string | null;
    organizationName: string;
}

export interface Fee {
    fee_type_id: string;
    name: string;
    percentage: number;
    is_enabled: boolean;
}

export interface MerchantProduct {
    product_id: string;
    name: string;
    description: string | null;
    price: number;
    currency_code: string;
    image_url: string | null;
    fees?: Fee[];
}

export interface SubscriptionPlan {
    planId: string;
    merchantId: string;
    organizationId: string;
    name: string;
    description: string;
    billingFrequency: string;
    amount: number;
    currency_code: string;
    failedPaymentAction: string;
    chargeDay: number | null;
    metadata: Record<string, unknown>;
    image_url: string | null;
    createdAt: string;
    updatedAt: string;
    firstPaymentType: string;
}

export interface CustomerDetails {
    email: string;
    name: string;
    countryCode: string;
    phoneNumber: string;
    whatsappNumber: string;
    country: string;
    city: string;
    postalCode: string;
    address: string;
}

export interface CheckoutData {
    paymentLink: PaymentLink;
    merchantProduct: MerchantProduct | null;
    subscriptionPlan: SubscriptionPlan | null;
}

// export interface WaveCheckoutResponse {
//     waveLaunchUrl: string;
// }

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failure';

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
}

// not used
export interface CheckoutSession {
    checkout_session_id: string;
    organization_id: string;
    merchant_id: string;
    payment_link_id?: string;
    customer_id?: string;
    amount: number;
    currency_code: string;
    status: 'open' | 'completed' | 'expired';
    is_expired: boolean;
    product_id?: string;
    plan_id?: string;
    success_url?: string;
    cancel_url?: string;
    customer_email?: string;
    customer_name?: string;
    customer_phone?: string;
    allowed_providers?: string[];
    expires_at: string;
    created_at: string;
    updated_at: string;
    metadata?: Record<string, unknown>;
}
