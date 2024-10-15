export type EventType =
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
    | 'edit_user_2fa'
    | 'edit_user_phone'
    | 'set_callback_url'
    | 'update_ip_whitelist'
    | 'add_bank_account'
    | 'remove_bank_account'
    | 'create_payout'
    | 'create_invoice'
    | 'process_payment'
    | 'update_webhook'
    | 'create_refund';

export type SeverityType = 'NOTICE' | 'WARNING' | 'ERROR' | 'CRITICAL';

export type Log = {
    log_id: string
    event: EventType
    ip_address: string
    operating_system: string
    browser: string
    details: Record<string, unknown>
    severity: SeverityType
    request_url: string
    request_method: string
    response_status: number
    created_at: string
}
