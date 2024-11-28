export const config = {
  isPortal: window.location.hostname === 'portal.lomi.africa',
  isPay: window.location.hostname === 'pay.lomi.africa',
  isLocalhost: window.location.hostname === 'localhost',
  supabaseUrl: import.meta.env['VITE_SUPABASE_URL'],
  supabaseAnonKey: import.meta.env['VITE_SUPABASE_ANON_KEY'],
  baseUrl: import.meta.env.PROD ? 'https://lomi.africa' : 'http://localhost:5173',
  portalBaseUrl: 'https://portal.lomi.africa',
  mainSiteBaseUrl: 'https://lomi.africa',
  paymentBaseUrl: import.meta.env.PROD ? 'https://pay.lomi.africa' : 'http://localhost:5173',
};
