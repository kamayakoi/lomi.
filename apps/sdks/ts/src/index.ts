/**
 * Main entry point for lomi. TypeScript SDK
 *
 * @module @lomi/sdk-typescript
 */

// Export main SDK class
export { LomiSDK } from './sdk.js';

// Export configuration types
export type { LomiConfig } from './config.js';

// Export error classes
export {
  LomiError,
  LomiValidationError,
  LomiAuthError,
  LomiNotFoundError,
  LomiRateLimitError,
} from './errors.js';

// Export error handler for advanced use cases
export { handleApiError } from './error-handler.js';

// Re-export all generated types and services
export * from './generated/index.js';
