/* @proprietary license */

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTheme } from '@/lib/hooks/use-theme';

interface SimpleImageProps {
  src:
    | string
    | {
        light: string;
        dark: string;
      };
  mobileSrc?: {
    light: string;
    dark: string;
  };
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export default function SimpleImage({
  src,
  mobileSrc,
  alt,
  width,
  height,
  className,
}: SimpleImageProps) {
  const { resolvedTheme, mounted } = useTheme();

  // Check if we're on mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Handle both string and object formats for src, with mobile support
  const currentSrc = isMobile && mobileSrc ? mobileSrc : src;
  // Use 'light' as default during SSR to prevent hydration mismatch
  const currentTheme = mounted ? resolvedTheme : 'dark';
  const imageSrc =
    typeof currentSrc === 'string'
      ? currentSrc
      : currentTheme === 'dark'
        ? currentSrc.dark
        : currentSrc.light;

  return (
    <div className="w-full">
      <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-sm border border-gray-200 dark:border-zinc-800 p-0 shadow-sm shadow-zinc-950/15 ring-1">
        <Image
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          className={`w-full min-h-[500px] md:min-h-[600px] h-auto object-cover rounded-xs ${className || ''}`}
          loading="eager"
          decoding="async"
          crossOrigin="anonymous"
          priority
        />
      </div>
    </div>
  );
}
