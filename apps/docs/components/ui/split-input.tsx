'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

interface SplitInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  prefix: string;
  className?: string;
}

const SplitInput = React.forwardRef<HTMLInputElement, SplitInputProps>(
  ({ className, prefix, ...props }, ref) => {
    return (
      <div
        className={cn(
          'flex rounded-sm border border-gray-200 dark:border-[0.15px] dark:border-gray-700/20 bg-gray-50/30 dark:bg-gray-800/30 overflow-hidden h-8',
          className,
        )}
      >
        {/* Prefix section */}
        <div className="px-3 py-1 bg-slate-50 dark:bg-zinc-800 border-r border-gray-200 dark:border-[0.15px] dark:border-gray-700/20 flex items-center">
          <span className="text-sm text-muted-foreground font-medium">
            {prefix}
          </span>
        </div>
        {/* Input section */}
        <input
          {...props}
          ref={ref}
          className="flex-1 pl-2 pr-3 py-1 bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    );
  },
);

SplitInput.displayName = 'SplitInput';

export { SplitInput };
