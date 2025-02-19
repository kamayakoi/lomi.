/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_SITE_URL: string
    readonly VITE_PAYMENT_LINK_BASE_URL: string
    readonly VITE_STORE_DOMAIN_BASE_URL: string
    readonly UPSTASH_REDIS_REST_URL: string
    readonly UPSTASH_REDIS_REST_TOKEN: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
} 