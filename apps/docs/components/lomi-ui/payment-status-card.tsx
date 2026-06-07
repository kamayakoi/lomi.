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
    tone: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/50 dark:border-emerald-900',
  },
  failed: {
    title: 'Payment failed',
    description: 'The customer can retry with the same or another provider.',
    icon: AlertCircle,
    tone: 'text-destructive bg-destructive/10 border-destructive/20',
  },
  pending: {
    title: 'Payment pending',
    description: 'Waiting for the customer or provider to confirm.',
    icon: Clock3,
    tone: 'text-primary bg-primary/10 border-primary/20',
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
    'inline-flex h-9 items-center justify-center rounded-sm bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

  return (
    <section
      className={cn(
        'w-full max-w-md rounded-sm border bg-card p-5 text-card-foreground shadow-sm',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className={cn('rounded-sm border p-2', copy.tone)}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-base font-semibold">{copy.title}</h3>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            {copy.description}
          </p>
        </div>
      </div>

      <dl className="mt-5 grid gap-3 rounded-sm bg-muted/50 p-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Amount</dt>
          <dd className="font-medium">{formatMoney(amount, currency)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Provider</dt>
          <dd className="font-medium">{providerLabels[provider]}</dd>
        </div>
        {transactionId ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Transaction</dt>
            <dd className="font-mono text-xs font-medium">{transactionId}</dd>
          </div>
        ) : null}
      </dl>

      {primaryAction ? (
        primaryAction.href ? (
          <a
            href={primaryAction.href}
            className={cn('mt-4 w-full', actionClass)}
          >
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
