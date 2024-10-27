export const config = {
  isPortal: window.location.hostname === 'portal.lomi.africa',
  supabaseUrl: import.meta.env['VITE_SUPABASE_URL'],
  supabaseAnonKey: import.meta.env['VITE_SUPABASE_ANON_KEY'],
  stripeSecretKey: import.meta.env['VITE_STRIPE_SECRET_KEY'],
  stripePublishableKey: import.meta.env['VITE_STRIPE_PUBLISHABLE_KEY'],
  baseUrl: import.meta.env.PROD ? 'https://lomi.africa' : 'http://localhost:5173',
  portalBaseUrl: 'https://portal.lomi.africa',
  mainSiteBaseUrl: 'https://lomi.africa',
  paymentBaseUrl: import.meta.env.PROD ? 'https://pay.lomi.africa' : 'http://localhost:5173',
};
