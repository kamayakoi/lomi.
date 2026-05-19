/**
 * SDK Configuration
 */

export interface LomiConfig {
  /**
   * API key for authentication
   * Get your API key from the lomi. dashboard
   */
  apiKey: string;

  /**
   * Base URL for the API
   * @default 'https://api.lomi.africa'
   */
  baseUrl?: string;

  /**
   * Additional headers to include in requests
   */
  headers?: Record<string, string>;

  /**
   * Request timeout in milliseconds
   * @default 30000 (30 seconds)
   */
  timeout?: number;

  /**
   * Environment: 'live' or 'test'
   * @default 'live'
   */
  environment?: 'live' | 'test';
}

export const DEFAULT_CONFIG = {
  baseUrl: 'https://api.lomi.africa',
  timeout: 30000,
  environment: 'live' as const,
};
