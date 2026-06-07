'use client';

/* eslint-disable @next/next/no-img-element -- Lomi UI registry components are framework-portable copy-paste components. */

import * as React from 'react';
import { Check } from 'lucide-react';

type ProviderId = 'wave' | 'mtn' | 'orange' | 'spi' | 'card';

type Provider = {
  id: ProviderId;
  label: string;
  description?: string;
  icon: string;
  iconClassName?: string;
};

export interface PaymentProviderSelectorProps {
  providers?: ProviderId[];
  selectedProvider?: ProviderId;
  onProviderChange?: (provider: ProviderId) => void;
  disabledProviders?: ProviderId[];
  variant?: 'grid' | 'rail';
  className?: string;
}

const providerCatalog: Record<ProviderId, Provider> = {
  wave: {
    id: 'wave',
    label: 'Wave',
    description: 'Pay from a Wave wallet.',
    icon: '/payment_channels/wave.webp',
  },
  mtn: {
    id: 'mtn',
    label: 'MTN',
    description: 'Mobile Money payment.',
    icon: '/payment_channels/mtn.webp',
  },
  orange: {
    id: 'orange',
    label: 'Orange',
    description: 'Orange Money payment.',
    icon: '/payment_channels/orange.webp',
  },
  spi: {
    id: 'spi',
    label: 'π-SPI',
    description: 'Instant bank payment.',
    icon: '/payment_channels/pi_spi.webp',
    iconClassName: 'w-16',
  },
  card: {
    id: 'card',
    label: 'Card',
    description: 'Visa, Mastercard, and more.',
    icon: '/payment_channels/cards.webp',
    iconClassName: 'w-12',
  },
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function PaymentProviderSelector({
  providers = ['wave', 'mtn', 'orange', 'spi', 'card'],
  selectedProvider,
  onProviderChange,
  disabledProviders = [],
  variant = 'rail',
  className,
}: PaymentProviderSelectorProps) {
  const firstEnabledProvider = providers.find(
    (provider) => !disabledProviders.includes(provider),
  );
  const currentProvider = selectedProvider ?? firstEnabledProvider;

  return (
    <div
      className={cn(
        variant === 'grid'
          ? 'grid grid-cols-2 gap-3 sm:grid-cols-3'
          : 'flex gap-3 overflow-x-auto pb-2',
        className,
      )}
      role="radiogroup"
      aria-label="Payment provider"
    >
      {providers.map((providerId) => {
        const provider = providerCatalog[providerId];
        const isSelected = currentProvider === provider.id;
        const isDisabled = disabledProviders.includes(provider.id);

        return (
          <button
            key={provider.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={isDisabled}
            onClick={() => onProviderChange?.(provider.id)}
            className={cn(
              'relative flex min-h-[78px] min-w-[112px] flex-1 flex-col items-start justify-center rounded-sm border bg-card p-4 text-left text-card-foreground shadow-sm transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isSelected
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-border hover:border-border/80 hover:bg-accent',
              isDisabled && 'cursor-not-allowed opacity-50 grayscale',
            )}
          >
            <span className="mb-2 flex h-8 items-center">
              <img
                src={provider.icon}
                alt=""
                className={cn(
                  'h-7 w-7 rounded-[4px] object-contain',
                  provider.iconClassName,
                )}
              />
            </span>
            <span className="text-xs font-medium">{provider.label}</span>
            {variant === 'grid' && provider.description ? (
              <span className="mt-1 text-xs leading-4 text-muted-foreground">
                {provider.description}
              </span>
            ) : null}
            {isSelected ? (
              <span className="absolute right-2 top-2 rounded-full bg-primary p-0.5 text-primary-foreground shadow-sm">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export type { ProviderId };
