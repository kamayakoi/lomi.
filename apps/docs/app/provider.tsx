/* @proprietary license */

'use client';

import { RootProvider } from 'fumadocs-ui/provider/next';
import dynamic from 'next/dynamic';
import { useEffect, type ReactNode } from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { TranslationProvider } from '@/lib/contexts/translation-context';
import { GithubStarsProvider } from '@/lib/hooks/use-github-stars';
import { Toaster } from 'sonner';

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
    <TranslationProvider initialLanguage={initialLanguage}>
      <RootProviderWithLanguage>{children}</RootProviderWithLanguage>
    </TranslationProvider>
  );
}

function RootProviderWithLanguage({ children }: { children: ReactNode }) {
  const { currentLanguage } = useTranslation();
  const t = (key: string) => translate(key, currentLanguage);

  return (
    <RootProvider
      search={{
        SearchDialog,
      }}
      theme={{
        storageKey: 'lomi-theme',
      }}
    >
      <TranslationProvider>
        <GithubStarsProvider>
          <TooltipProvider>
            <script
              suppressHydrationWarning
              dangerouslySetInnerHTML={{ __html: inject }}
            />
            {children}
            <Toaster />
          </TooltipProvider>
        </GithubStarsProvider>
      </TranslationProvider>
    </RootProvider>
  );
}
