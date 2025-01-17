export const config = {
  isPortal: window.location.hostname === 'portal.lomi.africa',
  isPay: window.location.hostname === 'pay.lomi.africa',
  isLocalhost: window.location.hostname === 'localhost',
  supabaseUrl: import.meta.env['VITE_SUPABASE_URL'],
  supabaseAnonKey: import.meta.env['VITE_SUPABASE_ANON_KEY'],
  baseUrl: import.meta.env.PROD ? 'https://lomi.africa' : 'http://localhost:5173',
  portalBaseUrl: import.meta.env.PROD ? 'https://portal.lomi.africa' : 'http://localhost:5173',
  mainSiteBaseUrl: import.meta.env.PROD ? 'https://lomi.africa' : 'http://localhost:5173',
  paymentBaseUrl: import.meta.env.PROD ? 'https://pay.lomi.africa' : 'http://localhost:5173',
  apiUrl: import.meta.env['NODE_ENV'] === 'production' 
    ? 'https://api.lomi.africa'
    : import.meta.env['NODE_ENV'] === 'development'
      ? 'https://sandbox.api.lomi.africa'
      : 'http://localhost:4242',
  apiVersion: 'v1',
  storeBaseUrl: import.meta.env.PROD ? 'https://store.lomi.africa' : 'http://localhost:5173',
};
