/* @proprietary license */

export type Language = 'en' | 'fr';

export const languages: readonly { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
] as const;
