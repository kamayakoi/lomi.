/* @proprietary license */

'use client';

import type { ComponentProps } from 'react';
import type React from 'react';
import { Search } from 'lucide-react';
import { useSearchContext } from 'fumadocs-ui/provider';
import { useTranslation } from '@/lib/contexts/translation-context';
import { t as translate } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils/cn';
import { type ButtonProps, buttonVariants } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';

interface SearchToggleProps extends ComponentProps<'button'>, ButtonProps {
  hideIfDisabled?: boolean;
}

export function SearchToggle({
  hideIfDisabled,
  size = 'small',
  variant = 'ghost',
  ...props
}: SearchToggleProps) {
  const { setOpenSearch, enabled } = useSearchContext();
  if (hideIfDisabled && !enabled) return null;

  return (
    <button
      type="button"
      className={cn(
        buttonVariants({
          size,
          variant,
        }),
        props.className,
      )}
      data-search=""
      aria-label="Open Search"
      onClick={() => {
        setOpenSearch(true);
      }}
    >
      <Search />
    </button>
  );
}

export function LargeSearchToggle({
  hideIfDisabled,
  ...props
}: ComponentProps<'button'> & {
  hideIfDisabled?: boolean;
}) {
  const { enabled, hotKey, setOpenSearch } = useSearchContext();
  const { currentLanguage } = useTranslation();
  const t = (key: string) => String(translate(key, currentLanguage));
  if (hideIfDisabled && !enabled) return null;

  return (
    <button
      type="button"
      data-search-full=""
      {...props}
      className={cn(
        'inline-flex items-center gap-2 rounded-sm border bg-fd-secondary/50 p-1.5 ps-2 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground',
        props.className,
      )}
      onClick={() => {
        setOpenSearch(true);
      }}
    >
      <Search className="size-4" />
      {t('search.search')}
      <Kbd variant="search" className="ms-auto hidden md:inline">
        <span className="flex items-center gap-0.5 -translate-y-0.25">
          {hotKey.map((k: { display: React.ReactNode }, index: number) => (
            <span key={index}>{k.display}</span>
          ))}
        </span>
      </Kbd>
    </button>
  );
}
