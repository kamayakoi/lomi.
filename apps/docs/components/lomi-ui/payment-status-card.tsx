import * as React from 'react';
import { AlertCircle, CheckCircle2, Clock3 } from 'lucide-react';
import type { ProviderId } from './payment-provider-selector';

export interface PaymentStatusCardProps {
  status: 'success' | 'failed' | 'pending';
  amount: number;
  currency: string;
  provider: ProviderId;
  transactionId?: string;
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

const providerLabels: Record<ProviderId, string> = {
  wave: 'Wave',
  mtn: 'MTN',
  orange: 'Orange Money',
  spi: 'π-SPI',
  card: 'Card',
};

const statusCopy = {
  success: {
    title: 'Payment succeeded',
    description: 'The payment is confirmed and ready to reconcile.',
    icon: CheckCircle2,
    tone: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  },
  failed: {
    title: 'Payment failed',
    description: 'The customer can retry with the same or another provider.',
    icon: AlertCircle,
    tone: 'text-red-600 bg-red-50 border-red-100',
  },
  pending: {
    title: 'Payment pending',
    description: 'Waiting for the customer or provider to confirm.',
    icon: Clock3,
    tone: 'text-[#2478d4] bg-sky-50 border-sky-100',
  },
};

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

export function PaymentStatusCard({
  status,
  amount,
  currency,
  provider,
  transactionId,
  primaryAction,
  className,
}: PaymentStatusCardProps) {
  const copy = statusCopy[status];
  const Icon = copy.icon;
  const actionClass =
    'inline-flex h-9 items-center justify-center rounded-sm bg-[#374151] px-3 text-sm font-medium text-white transition hover:bg-[#4B5563] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#56A5F9] focus-visible:ring-offset-2';

  return (
    <section
      className={cn(
        'w-full max-w-md rounded-sm border border-gray-200 bg-white p-5 text-gray-950 shadow-[0_2px_0_rgba(0,0,0,0.08),0_16px_40px_rgba(15,23,42,0.08)]',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className={cn('rounded-sm border p-2', copy.tone)}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-base font-semibold">{copy.title}</h3>
          <p className="mt-1 text-sm leading-5 text-gray-500">
            {copy.description}
          </p>
        </div>
      </div>

      <dl className="mt-5 grid gap-3 rounded-sm bg-gray-50 p-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-gray-500">Amount</dt>
          <dd className="font-medium">{formatMoney(amount, currency)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-gray-500">Provider</dt>
          <dd className="font-medium">{providerLabels[provider]}</dd>
        </div>
        {transactionId ? (
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Transaction</dt>
            <dd className="font-mono text-xs font-medium">{transactionId}</dd>
          </div>
        ) : null}
      </dl>

      {primaryAction ? (
        primaryAction.href ? (
          <a href={primaryAction.href} className={cn('mt-4 w-full', actionClass)}>
            {primaryAction.label}
          </a>
        ) : (
          <button
            type="button"
            onClick={primaryAction.onClick}
            className={cn('mt-4 w-full', actionClass)}
          >
            {primaryAction.label}
          </button>
        )
      ) : null}
    </section>
  );
}
