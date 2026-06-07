import * as React from 'react';

export interface CheckoutSummaryItem {
  name: string;
  quantity?: number;
  amount: number;
}

export interface CheckoutSummaryCardProps {
  merchantName: string;
  items: CheckoutSummaryItem[];
  subtotal: number;
  fees?: number;
  discount?: number;
  total: number;
  currency: string;
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

export function CheckoutSummaryCard({
  merchantName,
  items,
  subtotal,
  fees = 0,
  discount = 0,
  total,
  currency,
  className,
}: CheckoutSummaryCardProps) {
  return (
    <aside
      className={cn(
        'w-full max-w-md rounded-sm border bg-card p-5 text-card-foreground shadow-sm',
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">{merchantName}</p>
      <h3 className="mt-1 text-2xl font-semibold tracking-tight">
        {formatMoney(total, currency)}
      </h3>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex items-start justify-between gap-4"
          >
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              {item.quantity ? (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Quantity {item.quantity}
                </p>
              ) : null}
            </div>
            <p className="text-sm">
              {formatMoney(item.amount, currency)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2 border-t pt-4 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatMoney(subtotal, currency)}</span>
        </div>
        {fees > 0 ? (
          <div className="flex justify-between text-muted-foreground">
            <span>Fees</span>
            <span>{formatMoney(fees, currency)}</span>
          </div>
        ) : null}
        {discount > 0 ? (
          <div className="flex justify-between text-primary">
            <span>Discount</span>
            <span>-{formatMoney(discount, currency)}</span>
          </div>
        ) : null}
        <div className="flex justify-between pt-2 text-base font-semibold">
          <span>Total</span>
          <span>{formatMoney(total, currency)}</span>
        </div>
      </div>
    </aside>
  );
}
