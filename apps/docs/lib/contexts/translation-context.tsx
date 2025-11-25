/* @proprietary license */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '@/lib/i18n/config';
import { languages } from '@/lib/i18n/config';
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@/lib/utils/localStorage';
import { LocalStorageKeys } from '@/lib/utils/constants';

interface TranslationContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
}

const TranslationContext = createContext<TranslationContextType>({
  currentLanguage: 'en',
  setLanguage: () => {},
});

// Main provider component
export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Always start with default language to prevent hydration mismatch
  // We'll update to the correct language after mount
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only run on client side to avoid SSR issues
    if (typeof window === 'undefined') return;

    // After mount, read the actual language preference
    // Try cookie first (set by setLanguage), then localStorage
    let preferredLang: Language = 'en';

    // Check cookie
    const cookieMatch = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${LocalStorageKeys.Language}=`));
    if (cookieMatch) {
      const cookieLang = cookieMatch.split('=')[1];
      if (languages.some((lang) => lang.code === cookieLang)) {
        preferredLang = cookieLang as Language;
      }
    }

    // Check localStorage (takes precedence)
    const savedLanguage = getLocalStorageItem(LocalStorageKeys.Language);
    if (
      savedLanguage &&
      languages.some((lang) => lang.code === savedLanguage)
    ) {
      preferredLang = savedLanguage as Language;
    }

    // Update language if different from default
    if (preferredLang !== currentLanguage) {
      setCurrentLanguage(preferredLang);
    }

    // Ensure cookie is synced
    document.cookie = `${LocalStorageKeys.Language}=${preferredLang}; path=/; max-age=31536000; SameSite=Lax`;

    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove currentLanguage dependency to prevent re-runs during SSR

  useEffect(() => {
    // Sync cookie whenever language changes (after initialization)
    // Only run on client side
    if (typeof window === 'undefined') return;

    if (isInitialized && currentLanguage) {
      document.cookie = `${LocalStorageKeys.Language}=${currentLanguage}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [currentLanguage, isInitialized]);

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    setLocalStorageItem(LocalStorageKeys.Language, lang);

    // Set cookie for server-side access (only on client side)
    if (typeof window !== 'undefined') {
      document.cookie = `${LocalStorageKeys.Language}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    }
  };

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
}

// Hook component
export function useTranslation() {
  const context = useContext(TranslationContext);

  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }

  return context;
}
