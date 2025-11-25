/* @proprietary license */

import { cookies } from 'next/headers';
import type { Language } from './config';

/**
 * Detects the user's language preference from cookies on the server side
 */
export const detectLanguage = async (): Promise<Language> => {
  const cookieStore = await cookies();
  const languageCookie = cookieStore.get('lomi.language');

  // Return the language from cookie, or default to English
  if (languageCookie?.value === 'fr' || languageCookie?.value === 'en') {
    return languageCookie.value as Language;
  }

  return 'en';
};
