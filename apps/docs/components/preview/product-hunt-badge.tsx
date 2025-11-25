/* @proprietary license */

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export function ProductHuntBadge() {
  // Initialize with default theme to prevent hydration mismatch, useEffect will update it
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  // Initialize timestamp as null, will be set client-side only after hydration
  const [timestamp, setTimestamp] = useState<number | null>(null);

  // Use MutationObserver for instant reaction to class changes on <html>
  useEffect(() => {
    // Set initial theme based on current document state
    const isDark = document.documentElement.classList.contains('dark');
    setCurrentTheme(isDark ? 'dark' : 'light');

    // Set timestamp only on client-side after hydration
    setTimestamp(Date.now());

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          // Update state based on the new class state
          const isDark = document.documentElement.classList.contains('dark');
          setCurrentTheme(isDark ? 'dark' : 'light');
        }
      });
    });

    // Start observing the <html> element
    observer.observe(document.documentElement, { attributes: true });

    // Cleanup: disconnect observer on unmount
    return () => {
      observer.disconnect();
    };
  }, []); // Empty dependency array: run only once on mount

  // Use a stable URL during SSR, update with timestamp after hydration
  const imageSrc = timestamp
    ? `https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=720260&theme=${currentTheme}&t=${timestamp}`
    : `https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=720260&theme=${currentTheme}`;

  return (
    <Image
      src={imageSrc}
      alt="lomi. - Helping West African ventures sell online"
      width={250}
      height={54}
      style={{
        width: '500px',
        height: '100px',
      }}
      className="mx-auto md:w-[550px] md:h-[110px]"
    />
  );
}
