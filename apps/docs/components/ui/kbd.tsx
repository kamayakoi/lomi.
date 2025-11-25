import { cn } from '@/lib/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

const kbdVariants = cva(
  'pointer-events-none inline-flex w-fit select-none items-center justify-center gap-2 font-mono font-semibold text-primary bg-background border border-border shadow-sm',
  {
    variants: {
      variant: {
        default: 'rounded-sm px-2 py-0.5 h-5 text-xs',
        tiny: 'rounded-sm px-1 h-3.5 min-w-[8px] text-[1px] !font-normal',
        search:
          'rounded-[4px] px-1.5 py-0.5 h-5 text-xs font-normal bg-slate-100 hover:bg-slate-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 border border-gray-300 dark:border-gray-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Kbd({
  className,
  variant,
  ...props
}: ComponentProps<'kbd'> & VariantProps<typeof kbdVariants>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        kbdVariants({ variant }),
        "[&_svg:not([class*='size-'])]:size-3",
        'in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10',
        className,
      )}
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: ComponentProps<'div'>) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn('inline-flex items-center gap-2', className)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup };
