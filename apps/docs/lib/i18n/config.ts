/* @proprietary license */

/** Docs site is English-only; context kept for components that still call `useTranslation`. */
export type Language = 'en';

export const languages: readonly { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
] as const;
