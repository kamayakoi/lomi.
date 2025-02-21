export type EventType =
    // Authentication & Security
    | 'create_api_key'
    | 'edit_api_key'
    | 'remove_api_key'
    | 'user_login'
    | 'edit_user_password'
    | 'create_pin'
    | 'edit_pin'
    | 'edit_user_details'
    | 'authorize_user_2fa'
    | 'create_user_2fa'
    | 'remove_user_2fa'
    | 'edit_user_phone'
    
    // Settings & Configuration
    | 'set_callback_url'
    | 'update_webhook'
    
    // Banking & Payouts
    | 'add_bank_account'
    | 'remove_bank_account'
    | 'create_payout'
    | 'payout_status_change'
    
    // Payments & Transactions
    | 'process_payment'
    | 'payment_status_change'
    | 'create_refund'
    | 'refund_status_change'
    | 'create_dispute'
    | 'dispute_status_change'
    
    // Subscriptions
    | 'create_subscription'
    | 'cancel_subscription'
    | 'subscription_status_change'
    | 'subscription_payment_failed'
    
    // Products & Services
    | 'create_product'
    | 'update_product'
    | 'delete_product'
    
    // Provider Integration
    | 'provider_status_change'
    | 'provider_connection_error'
    | 'provider_integration_success'
    
    // System & Maintenance
    | 'system_maintenance'
    | 'system_update'
    | 'compliance_update'
    | 'api_status_change'
    
    // Customer Management
    | 'customer_verification_required'
    | 'customer_verification_success'
    | 'customer_verification_failed';

export type SeverityType = 'NOTICE' | 'WARNING' | 'ERROR' | 'CRITICAL';

export type Log = {
    log_id: string
    event: EventType
    ip_address: string
    operating_system: string | null
    browser: string | null
    details: Record<string, unknown>
    severity: SeverityType
    request_url: string
    request_method: string
    response_status: number
    created_at: string
}
