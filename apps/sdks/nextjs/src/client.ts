import { LomiSDK } from '@lomi./sdk';

let clientInstance: LomiSDK | null = null;

/**
 * Get or create Lomi client instance
 * Uses auto-generated TypeScript SDK
 */
export function getLomiClient(): LomiSDK {
  if (!clientInstance) {
    const apiKey = process.env.LOMI_API_KEY || process.env.NEXT_PUBLIC_LOMI_API_KEY;
    const environment = (process.env.LOMI_ENVIRONMENT || process.env.NEXT_PUBLIC_LOMI_ENVIRONMENT || 'live') as 'live' | 'test';
    
    if (!apiKey) {
      throw new Error('LOMI_API_KEY is required. Set it in your .env file.');
    }

    clientInstance = new LomiSDK({
      apiKey,
      environment,
    });
  }

  return clientInstance;
}

/**
 * Create a new Lomi client instance (useful for different environments)
 */
export function createLomiClient(config: {
  apiKey: string;
  environment?: 'live' | 'test';
}): LomiSDK {
  return new LomiSDK(config);
}
