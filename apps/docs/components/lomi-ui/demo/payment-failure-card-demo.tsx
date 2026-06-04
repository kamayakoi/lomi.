import { PaymentFailureCard } from '@/components/lomi-ui/payment-failure-card';

export function PaymentFailureCardDemo() {
  return (
    <div className="not-prose flex justify-center rounded-sm border bg-fd-background p-4">
      <PaymentFailureCard
        amount={12500}
        currency="XOF"
        provider="MTN Mobile Money"
        supportHref="#"
      />
    </div>
  );
}
