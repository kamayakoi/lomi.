/// <reference types="bun-types" />

declare module 'bun' {
  interface Env extends ProcessEnv {
    // Supabase
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_ANON_KEY: string;
    VITE_SUPABASE_SERVICE_ROLE_KEY: string;
    VITE_SUPABASE_DB_URL: string;

    // Auth
    SUPABASE_AUTH_GITHUB_CLIENT_ID: string;
    SUPABASE_AUTH_GITHUB_SECRET: string;
    SUPABASE_AUTH_GOOGLE_CLIENT_ID: string;
    SUPABASE_AUTH_GOOGLE_SECRET: string;

    // Environment
    BUN_ENV: 'development' | 'production' | 'test';
    VITE_SITE_URL: string;
    API_URL: string;

    // lomi. Payment
    VITE_PAYMENT_LINK_BASE_URL: string;
    VITE_STORE_DOMAIN_BASE_URL: string;

    // Ecobank
    ECOBANK_BASE_URL: string;
    ECOBANK_USER_ID: string;
    ECOBANK_LAB_KEY: string;
    ECOBANK_SECRET: string;

    // Orange
    ORANGE_BASE_URL: string;
    ORANGE_BUSINESS_ID: string;
    ORANGE_API_KEY: string;

    // MTN
    MTN_BASE_URL: string;
    MTN_BUSINESS_ID: string;
    MTN_API_KEY: string;

    // Wave
    WAVE_API_URL: string;
    WAVE_MERCHANT_ID: string;
    WAVE_API_KEY: string;

    // NOWPayments
    NOWPAYMENTS_API_KEY: string;
    NOWPAYMENTS_PUBLIC_KEY: string;

    // AI
    OPENAI_API_KEY: string;
    ANTHROPIC_API_KEY: string;
    VITE_HUGGING_FACE_API_KEY: string;

    // Sanity
    SANITY_PROJECT_ID: string;
    SANITY_DATASET: string;
    SANITY_TOKEN: string;

    // Whatsapp
    WHATSAPP_ACCESS_TOKEN: string;
    WHATSAPP_PHONE_NUMBER_ID: string;

    // Resend
    RESEND_API_KEY: string;

    // Product Hunt
    PH_API_KEY: string;
    PH_API_SECRET: string;

    // GitHub
    GITHUB_API_TOKEN: string;

    // General Configuration
    EMAIL_DOMAIN_WHITELIST?: string;
    EMAIL_WHITELIST?: string;
    USER_FILE_SIZE_LIMIT?: string;

    // Payment Links
    VITE_PAYMENT_LINK_BASE_URL_DEV: string;
  }
} 