export const config = {
  isPay: window.location.hostname === 'pay.lomi.africa',
  isLocalhost: window.location.hostname === 'localhost',
  supabaseUrl: import.meta.env['VITE_SUPABASE_URL'],
  supabaseAnonKey: import.meta.env['VITE_SUPABASE_ANON_KEY'],
  baseUrl: import.meta.env['BUN_ENV'] === 'production' ? 'https://lomi.africa' : 'http://localhost:5173',
  portalUrl: import.meta.env['BUN_ENV'] === 'production' ? 'https://portal.lomi.africa' : 'http://localhost:5173',
  mainSiteBaseUrl: import.meta.env['BUN_ENV'] === 'production' ? 'https://lomi.africa' : 'http://localhost:5173',
  paymentBaseUrl: import.meta.env['BUN_ENV'] === 'production' ? 'https://pay.lomi.africa' : 'http://localhost:5173',
  apiUrl: import.meta.env['BUN_ENV'] === 'production' 
    ? 'https://api.lomi.africa'
    : import.meta.env['BUN_ENV'] === 'development'
      ? 'https://sandbox.api.lomi.africa'
      : 'http://localhost:4242',
  apiVersion: 'v1',
  storeBaseUrl: import.meta.env['BUN_ENV'] === 'production' ? 'https://store.lomi.africa' : 'http://localhost:5173',
};

// Helper function to get portal path
export const getPortalPath = (path: string): string => {
  const isProduction = import.meta.env['BUN_ENV'] === 'production';
  const portalBase = isProduction ? 'https://portal.lomi.africa' : '';
  return isProduction ? `${portalBase}${path}` : path;
};