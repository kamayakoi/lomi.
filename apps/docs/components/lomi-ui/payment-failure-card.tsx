import * as React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface PaymentFailureCardProps {
  title?: string;
  message?: string;
  amount?: number;
  currency?: string;
  provider?: string;
  onRetry?: () => void;
  supportHref?: string;
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

export function PaymentFailureCard({
  title = 'Payment failed',
  message = 'The provider could not confirm this payment. Ask the customer to retry or choose another rail.',
  amount,
  currency = 'XOF',
  provider,
  onRetry,
  supportHref,
  className,
}: PaymentFailureCardProps) {
  return (
    <section
      className={cn(
        'w-full max-w-md rounded-sm border border-red-100 bg-white p-5 text-gray-950 shadow-sm',
        className,
      )}
    >
      <div className="flex gap-3">
        <span className="rounded-sm border border-red-100 bg-red-50 p-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="mt-1 text-sm leading-5 text-gray-500">{message}</p>
        </div>
      </div>
      {amount || provider ? (
        <dl className="mt-5 grid gap-2 rounded-sm bg-gray-50 p-3 text-sm">
          {amount ? (
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Amount</dt>
              <dd className="font-medium">{formatMoney(amount, currency)}</dd>
            </div>
          ) : null}
          {provider ? (
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Provider</dt>
              <dd className="font-medium">{provider}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-sm bg-[#374151] px-4 text-sm font-medium text-white transition hover:bg-[#4B5563] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#56A5F9] focus-visible:ring-offset-2"
        >
          <RefreshCw className="h-4 w-4" />
          Retry payment
        </button>
        {supportHref ? (
          <a
            href={supportHref}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-sm border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#56A5F9] focus-visible:ring-offset-2"
          >
            Contact support
          </a>
        ) : null}
      </div>
    </section>
  );
}
