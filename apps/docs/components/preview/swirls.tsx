/* @proprietary license */

import { cn } from '@/lib/utils/cn';
import Image from 'next/image';
import type React from 'react';

type SwirlProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'alt'
>;

export function SingleSwirl({ className, ...props }: SwirlProps) {
  return (
    <Image
      {...props}
      src="/random/swirl-2.png"
      alt="Swirl"
      className={cn(
        'pointer-events-none w-full h-full object-cover',
        className,
      )}
      width={1200}
      height={1200}
    />
  );
}
