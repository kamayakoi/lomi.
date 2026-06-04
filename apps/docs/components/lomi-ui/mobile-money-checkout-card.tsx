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
        'w-full max-w-md rounded-sm border border-gray-200 bg-white p-5 text-gray-950 shadow-[0_2px_0_rgba(0,0,0,0.08),0_16px_40px_rgba(15,23,42,0.08)]',
        className,
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Pay {merchantName}</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight">
            {formatMoney(amount, currency)}
          </h3>
        </div>
        <span className="rounded-sm bg-sky-50 px-2.5 py-1 text-xs font-medium text-[#2478d4]">
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
          <span className="mb-1.5 block text-sm font-medium text-gray-700">
            Mobile money number
          </span>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(event) => onPhoneNumberChange?.(event.target.value)}
            placeholder="+225 07 00 00 00 00"
            className="h-11 w-full rounded-sm border border-gray-300 bg-white px-3 text-sm text-gray-950 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#56A5F9] focus-visible:ring-offset-2"
          />
        </label>

        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-[#374151] px-4 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)] transition hover:bg-[#4B5563] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#56A5F9] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Pay {formatMoney(amount, currency)}
        </button>

        <p className="flex items-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="h-4 w-4 text-[#56A5F9]" />
          Secured by lomi. Your customer confirms the payment with their
          provider.
        </p>
      </div>
    </section>
  );
}
