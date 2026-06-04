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
    <section className={cn('w-full text-gray-950', className)}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            {description}
          </p>
        </div>
        <div className="inline-flex w-fit rounded-sm border border-gray-200 bg-white p-1 shadow-sm">
          {(['monthly', 'yearly'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setInterval(value)}
              className={cn(
                'h-8 rounded-sm px-3 text-sm font-medium capitalize transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#56A5F9] focus-visible:ring-offset-2',
                interval === value
                  ? 'bg-[#374151] text-white'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-950',
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
                'relative flex min-h-full flex-col rounded-sm border bg-white p-5 shadow-sm transition',
                plan.highlighted
                  ? 'border-[#56A5F9] shadow-[0_2px_0_rgba(0,0,0,0.08),0_18px_48px_rgba(86,165,249,0.16)]'
                  : 'border-gray-200',
              )}
            >
              {plan.highlighted ? (
                <span className="mb-4 inline-flex w-fit items-center gap-1 rounded-sm bg-sky-50 px-2 py-1 text-xs font-medium text-[#2478d4]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Popular
                </span>
              ) : null}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-1 min-h-10 text-sm leading-5 text-gray-500">
                {plan.description}
              </p>
              <div className="mt-5">
                <span className="text-3xl font-semibold tracking-tight">
                  {formatMoney(price, plan.currency)}
                </span>
                <span className="text-sm text-gray-500">
                  /{interval === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onPlanSelect?.(plan.id, interval)}
                className={cn(
                  'mt-5 inline-flex h-10 items-center justify-center rounded-sm px-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#56A5F9] focus-visible:ring-offset-2',
                  plan.highlighted
                    ? 'bg-[#374151] text-white hover:bg-[#4B5563]'
                    : 'border border-gray-200 bg-white text-gray-950 hover:bg-gray-50',
                )}
              >
                {plan.ctaLabel ?? 'Select plan'}
              </button>
              <ul className="mt-5 space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-gray-600">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-[#56A5F9]" />
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
