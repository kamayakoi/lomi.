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
    VITE_ECOBANK_BASE_URL: string;
    VITE_ECOBANK_USER_ID: string;
    VITE_ECOBANK_LAB_KEY: string;
    VITE_ECOBANK_SECRET: string;

    // Orange
    VITE_ORANGE_BASE_URL: string;
    VITE_ORANGE_BUSINESS_ID: string;
    VITE_ORANGE_API_KEY: string;

    // MTN
    VITE_MTN_BASE_URL: string;
    VITE_MTN_BUSINESS_ID: string;
    VITE_MTN_API_KEY: string;

    // Wave
    VITE_WAVE_API_URL: string;
    VITE_WAVE_MERCHANT_ID: string;
    VITE_WAVE_API_KEY: string;

    // NOWPayments
    VITE_NOWPAYMENTS_API_KEY: string;
    VITE_NOWPAYMENTS_PUBLIC_KEY: string;

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
    VITE_PH_API_KEY: string;
    VITE_PH_API_SECRET: string;

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