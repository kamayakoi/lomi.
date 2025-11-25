/* @proprietary license */

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-10-09';

// Use lazy evaluation to avoid throwing errors during module import
// This allows sanity.config.ts to import apiVersion without triggering errors
function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}

// Lazy getters that only throw when accessed (not on module load)
let _dataset: string | undefined;
let _projectId: string | undefined;

export const dataset = (): string => {
  if (_dataset === undefined) {
    _dataset = assertValue(
      process.env.NEXT_PUBLIC_SANITY_DATASET,
      'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET',
    );
  }
  return _dataset;
};

export const projectId = (): string => {
  if (_projectId === undefined) {
    _projectId = assertValue(
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID',
    );
  }
  return _projectId;
};
