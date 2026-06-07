'use client';

import * as React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import {
  PaymentProviderSelector,
  type ProviderId,
} from './payment-provider-selector';

export interface MobileMoneyCheckoutCardProps {
  amount: number;
  currency: string;
  merchantName: string;
  selectedProvider?: ProviderId;
  phoneNumber?: string;
  onProviderChange?: (provider: ProviderId) => void;
  onPhoneNumberChange?: (phoneNumber: string) => void;
  onSubmit?: () => void;
  loading?: boolean;
  className?: string;
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function MobileMoneyCheckoutCard({
  amount,
  currency,
  merchantName,
  selectedProvider = 'wave',
  phoneNumber = '',
  onProviderChange,
  onPhoneNumberChange,
  onSubmit,
  loading = false,
  className,
}: MobileMoneyCheckoutCardProps) {
  return (
    <section
      className={cn(
        'w-full max-w-md rounded-sm border bg-card p-5 text-card-foreground shadow-sm',
        className,
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Pay {merchantName}</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight">
            {formatMoney(amount, currency)}
          </h3>
        </div>
        <span className="rounded-sm bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          Checkout
        </span>
      </div>

      <div className="space-y-4">
        <PaymentProviderSelector
          providers={['wave', 'mtn', 'orange', 'spi']}
          selectedProvider={selectedProvider}
          onProviderChange={onProviderChange}
        />

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">
            Mobile money number
          </span>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(event) => onPhoneNumberChange?.(event.target.value)}
            placeholder="+225 07 00 00 00 00"
            className="flex h-11 w-full rounded-sm border border-input bg-background px-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </label>

        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Pay {formatMoney(amount, currency)}
        </button>

        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Secured by lomi. Your customer confirms the payment with their
          provider.
        </p>
      </div>
    </section>
  );
}
