/// <reference types="vite/client" />

interface ImportMetaEnv {
    // Supabase
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_SUPABASE_SERVICE_ROLE_KEY: string

    // Environment
    readonly VITE_SITE_URL: string
    readonly VITE_PAYMENT_LINK_BASE_URL: string
    readonly VITE_STORE_DOMAIN_BASE_URL: string
    readonly API_URL: string

    // Configuration
    readonly BUN_ENV: 'development' | 'production'
    readonly EMAIL_DOMAIN_WHITELIST: string
    readonly EMAIL_WHITELIST: string
    readonly USER_FILE_SIZE_LIMIT: string

    // Orange
    readonly ORANGE_BASE_URL: string
    readonly ORANGE_BUSINESS_ID: string
    readonly ORANGE_API_KEY: string

    // Upstash Redis
    readonly UPSTASH_REDIS_REST_URL: string
    readonly UPSTASH_REDIS_REST_TOKEN: string

    // MTN
    readonly MTN_BASE_URL: string
    readonly MTN_BUSINESS_ID: string
    readonly MTN_API_KEY: string

    // Wave
    readonly WAVE_API_URL: string
    readonly WAVE_MERCHANT_ID: string
    readonly WAVE_ACCOUNT_ID: string
    readonly WAVE_API_KEY: string
    readonly WAVE_WEBHOOK_SECRET: string

    // NOWPayments
    readonly NOWPAYMENTS_API_KEY: string
    readonly NOWPAYMENTS_PUBLIC_KEY: string

    // AI
    readonly ANTHROPIC_API_KEY: string
    readonly HUGGING_FACE_API_KEY: string

    // Sanity
    readonly SANITY_PROJECT_ID: string
    readonly SANITY_DATASET: string
    readonly SANITY_TOKEN: string

    // Whatsapp
    readonly WHATSAPP_ACCESS_TOKEN: string
    readonly WHATSAPP_PHONE_NUMBER_ID: string

    // Resend
    readonly RESEND_API_KEY: string

    // Shopify
    readonly SHOPIFY_API_KEY: string
    readonly SHOPIFY_API_SECRET: string
    readonly SHOPIFY_STOREFRONT_ACCESS_TOKEN: string
    readonly SHOPIFY_APP_URL: string
    readonly SHOPIFY_SCOPES: string

    // ECOBANK
    readonly ECOBANK_BASE_URL: string
    readonly ECOBANK_USER_ID: string
    readonly ECOBANK_LAB_KEY: string
    readonly ECOBANK_SECRET: string

    // Auth
    readonly SUPABASE_AUTH_GITHUB_CLIENT_ID: string
    readonly SUPABASE_AUTH_GITHUB_SECRET: string
    readonly SUPABASE_AUTH_GOOGLE_CLIENT_ID: string
    readonly SUPABASE_AUTH_GOOGLE_SECRET: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
} 