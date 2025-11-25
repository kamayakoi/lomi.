/* @proprietary license */

import { OramaClient } from '@oramacloud/client';

const apiKey = process.env.NEXT_PUBLIC_ORAMA_API_KEY;
const endpoint = process.env.NEXT_PUBLIC_ORAMA_ENDPOINT;

// Validate environment variables
const isConfigured = !!(apiKey && endpoint);

if (!isConfigured) {
  if (typeof window === 'undefined') {
    // Server-side: use console.error (won't be removed in dev)
    console.error(
      'Orama environment variables (NEXT_PUBLIC_ORAMA_API_KEY and NEXT_PUBLIC_ORAMA_ENDPOINT) are not set.',
    );
  }
  // Client-side: errors will be handled in the component
}

export const DataSourceId = endpoint ? (endpoint.split('/').pop() ?? '') : '';
export const isAdmin = !!process.env.ORAMA_PRIVATE_API_KEY;

// Only create client if environment variables are configured
// Otherwise, create a mock client that will throw helpful errors
export const orama = isConfigured
  ? new OramaClient({
      endpoint: endpoint!,
      api_key: apiKey!,
    })
  : ({
      search: async () => {
        throw new Error(
          'Orama search is not configured. Please set NEXT_PUBLIC_ORAMA_API_KEY and NEXT_PUBLIC_ORAMA_ENDPOINT environment variables.',
        );
      },
    } as unknown as OramaClient);
