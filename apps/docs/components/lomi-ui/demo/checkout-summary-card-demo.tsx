import { CheckoutSummaryCard } from '@/components/lomi-ui/checkout-summary-card';

export function CheckoutSummaryCardDemo() {
  return (
    <div className="not-prose flex justify-center rounded-sm border bg-fd-background p-4">
      <CheckoutSummaryCard
        merchantName="Keur Studio"
        currency="XOF"
        items={[
          { name: 'Design workshop', quantity: 1, amount: 10000 },
          { name: 'Template pack', quantity: 1, amount: 2500 },
        ]}
        subtotal={12500}
        fees={250}
        discount={1000}
        total={11750}
      />
    </div>
  );
}
