export interface CustomerNotifications {
    new_payment_links: { email: boolean; whatsapp: boolean };
    payment_reminders: { email: boolean; whatsapp: boolean };
    successful_payment_attempts: { email: boolean; whatsapp: boolean };
}

export interface MerchantRecipient {
    email: string;
    notification: 'all' | 'important';
}

export interface FeeType {
    id: string;
    name: string;
    enabled: boolean;
    percentage: number;
}

export interface CheckoutSettings {
    organization_id: string;
    default_language: string;
    display_currency: string;
    payment_link_duration: number;
    fee_types: FeeType[];
    customer_notifications: CustomerNotifications;
    merchant_recipients: MerchantRecipient[];
} 