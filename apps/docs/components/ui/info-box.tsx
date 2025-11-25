import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils/cn';

const infoBoxVariants = cva('py-2 px-3 rounded-sm select-none w-fit', {
  variants: {
    variant: {
      default:
        'bg-sky-100 dark:bg-sky-900 border border-sky-200 dark:border-sky-800/50',
      blue: 'bg-[#56A5F9] text-white border border-[#52A1F8] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] dark:bg-sky-900 dark:text-sky-300 dark:border-sky-800/50',
      green:
        'bg-[#22C55E] text-white border border-[#16A34A] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] dark:bg-green-900 dark:text-green-300 dark:border-green-800/50',
      red: 'bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800/50',
      orange:
        'bg-orange-100 dark:bg-orange-900 border border-orange-200 dark:border-orange-800/50',
      pink: 'bg-pink-100 dark:bg-pink-900 border border-pink-200 dark:border-pink-800/50',
      teal: 'bg-teal-100 dark:bg-teal-900 border border-teal-200 dark:border-teal-800/50',
      outline:
        'bg-slate-50 text-sm font-normal hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-gray-200 dark:border-[0.15px] dark:border-gray-700/20',
    },
    size: {
      default: 'text-xs',
      sm: 'text-xs',
      lg: 'text-sm',
    },
    maxWidth: {
      none: '',
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl',
      '5xl': 'max-w-5xl',
      '6xl': 'max-w-6xl',
      '7xl': 'max-w-7xl',
      full: 'max-w-full',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    maxWidth: '4xl',
  },
});

const infoBoxTextVariants = cva('leading-relaxed', {
  variants: {
    variant: {
      default: 'text-sky-600 dark:text-sky-300',
      blue: 'text-white dark:text-sky-300',
      green: 'text-white dark:text-green-300',
      red: 'text-red-600 dark:text-red-300',
      orange: 'text-orange-600 dark:text-orange-300',
      pink: 'text-pink-600 dark:text-pink-300',
      teal: 'text-teal-600 dark:text-teal-300',
      outline: 'text-gray-600 dark:text-gray-300',
    },
    size: {
      default: 'text-xs',
      sm: 'text-xs',
      lg: 'text-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface InfoBoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof infoBoxVariants> {
  children: React.ReactNode;
}

function InfoBox({
  className,
  variant,
  size,
  maxWidth,
  children,
  ...props
}: InfoBoxProps) {
  return (
    <div
      data-slot="info-box"
      className={cn(infoBoxVariants({ variant, size, maxWidth }), className)}
      {...props}
    >
      <div className={cn(infoBoxTextVariants({ variant, size }))}>
        {children}
      </div>
    </div>
  );
}

export { InfoBox, infoBoxVariants, infoBoxTextVariants };
