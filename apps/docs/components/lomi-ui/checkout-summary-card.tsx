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
        'w-full max-w-md rounded-sm border border-gray-800 bg-[#121317] p-5 text-white shadow-[0_2px_0_rgba(255,255,255,0.04),0_18px_48px_rgba(2,6,23,0.28)]',
        className,
      )}
    >
      <p className="text-sm text-gray-400">{merchantName}</p>
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
              <p className="text-sm font-medium text-gray-100">{item.name}</p>
              {item.quantity ? (
                <p className="mt-0.5 text-xs text-gray-500">
                  Quantity {item.quantity}
                </p>
              ) : null}
            </div>
            <p className="text-sm text-gray-200">
              {formatMoney(item.amount, currency)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
        <div className="flex justify-between text-gray-400">
          <span>Subtotal</span>
          <span>{formatMoney(subtotal, currency)}</span>
        </div>
        {fees > 0 ? (
          <div className="flex justify-between text-gray-400">
            <span>Fees</span>
            <span>{formatMoney(fees, currency)}</span>
          </div>
        ) : null}
        {discount > 0 ? (
          <div className="flex justify-between text-[#8fd0ff]">
            <span>Discount</span>
            <span>-{formatMoney(discount, currency)}</span>
          </div>
        ) : null}
        <div className="flex justify-between pt-2 text-base font-semibold text-white">
          <span>Total</span>
          <span>{formatMoney(total, currency)}</span>
        </div>
      </div>
    </aside>
  );
}
