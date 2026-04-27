/* @proprietary license */

'use client';

import { RootProvider } from 'fumadocs-ui/provider/next';
import dynamic from 'next/dynamic';
import { useEffect, type ReactNode } from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { TranslationProvider } from '@/lib/utils/translation-context';
import { Toaster } from 'sonner';
import type { Language } from '@/lib/i18n/config';

const SearchDialog = dynamic(() => import('@/components/ui/search'), {
  ssr: false,
});

export function Provider({
  children,
  initialLanguage = 'en',
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const uwuParam = urlParams.get('uwu');

    if (typeof uwuParam === 'string') {
      localStorage.setItem('uwu', uwuParam);
    }

    const item = localStorage.getItem('uwu');

    if (item === 'true') {
      document.documentElement.classList.add('uwu');
    } else {
      document.documentElement.classList.remove('uwu');
    }
  }, []);

  return (
    <RootProvider
      search={{
        SearchDialog,
      }}
      theme={{
        storageKey: 'lomi-theme',
        defaultTheme: 'light',
        disableTransitionOnChange: false,
      }}
    >
      <TranslationProvider initialLanguage={initialLanguage}>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </TranslationProvider>
    </RootProvider>
  );
}
