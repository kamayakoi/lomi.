'use client';

import * as React from 'react';
import { Check, Sparkles } from 'lucide-react';

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice?: number;
  currency: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel?: string;
}

export interface PricingTableProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
  onPlanSelect?: (planId: string, interval: 'monthly' | 'yearly') => void;
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

export function PricingTable({
  plans,
  title = 'Choose your plan',
  description = 'Simple pricing for payment teams building with Lomi.',
  onPlanSelect,
  className,
}: PricingTableProps) {
  const [interval, setInterval] = React.useState<'monthly' | 'yearly'>(
    'monthly',
  );

  return (
    <section className={cn('w-full text-foreground', className)}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="inline-flex w-fit rounded-sm border border-input bg-background p-1 shadow-sm">
          {(['monthly', 'yearly'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setInterval(value)}
              className={cn(
                'h-8 rounded-sm px-3 text-sm font-medium capitalize transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                interval === value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const price =
            interval === 'yearly' && plan.yearlyPrice
              ? plan.yearlyPrice
              : plan.monthlyPrice;

          return (
            <article
              key={plan.id}
              className={cn(
                'relative flex min-h-full flex-col rounded-sm border bg-card text-card-foreground p-5 shadow-sm transition-all',
                plan.highlighted ? 'border-primary shadow-md' : 'border-border',
              )}
            >
              {plan.highlighted ? (
                <span className="mb-4 inline-flex w-fit items-center gap-1 rounded-sm bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Popular
                </span>
              ) : null}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-1 min-h-10 text-sm leading-5 text-muted-foreground">
                {plan.description}
              </p>
              <div className="mt-5">
                <span className="text-3xl font-semibold tracking-tight">
                  {formatMoney(price, plan.currency)}
                </span>
                <span className="text-sm text-muted-foreground">
                  /{interval === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onPlanSelect?.(plan.id, interval)}
                className={cn(
                  'mt-5 inline-flex h-10 items-center justify-center rounded-sm px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  plan.highlighted
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                {plan.ctaLabel ?? 'Select plan'}
              </button>
              <ul className="mt-5 space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-2 text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 flex-none text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
