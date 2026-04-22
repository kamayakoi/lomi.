/* @proprietary license */

'use client';

import { RootProvider } from 'fumadocs-ui/provider/next';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { TranslationProvider } from '@/lib/utils/translation-context';
import { Toaster } from 'sonner';

const SearchDialog = dynamic(() => import('@/components/ui/search'), {
  ssr: false,
});

const inject = `
const urlParams = new URLSearchParams(window.location.search);
const uwuParam = urlParams.get("uwu");

if (typeof uwuParam === 'string') {
    localStorage.setItem('uwu', uwuParam);
}

const item = localStorage.getItem('uwu')

if (item === 'true') {
    document.documentElement.classList.add("uwu")
}
`;

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        SearchDialog,
      }}
      theme={{
        storageKey: 'lomi-theme',
        defaultTheme: 'light',
      }}
    >
      <TranslationProvider>
        <TooltipProvider>
          <script
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: inject }}
          />
          {children}
          <Toaster />
        </TooltipProvider>
      </TranslationProvider>
    </RootProvider>
  );
}
