declare namespace NodeJS {
  interface ProcessEnv {
    RESEND_API_KEY: string;
    WHATSAPP_ACCESS_TOKEN: string;
    WHATSAPP_PHONE_NUMBER_ID: string;
    NODE_ENV: 'development' | 'production' | 'test';
    VITE_API_URL: string;
  }
} 