/* @proprietary license */

import { useRef, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from './use-theme';

export function useThemeAnimation() {
  const { setTheme, resolvedTheme } = useTheme();
  const themeButtonRef = useRef<HTMLDivElement>(null);

  const toggleTheme = useCallback(async () => {
    if (!themeButtonRef.current) return;

    await document.startViewTransition(() => {
      flushSync(() => {
        // Use resolvedTheme to get the actual theme (handles 'system' theme correctly)
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
      });
    }).ready;

    const { top, left, width, height } =
      themeButtonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top),
    );

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 400,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      },
    );
  }, [resolvedTheme, setTheme]);

  return {
    toggleTheme,
    themeButtonRef,
  };
}
