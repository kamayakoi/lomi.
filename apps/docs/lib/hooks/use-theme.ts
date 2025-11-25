/* @proprietary license */

'use client';

import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme as Theme;
  // Default to 'dark' as the preferred theme
  const currentResolvedTheme = (resolvedTheme ?? 'dark') as 'light' | 'dark';

  return {
    theme: currentTheme,
    resolvedTheme: currentResolvedTheme,
    setTheme,
    mounted,
  };
};
