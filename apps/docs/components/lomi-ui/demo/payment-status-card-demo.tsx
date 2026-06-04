import { PaymentStatusCard } from '@/components/lomi-ui/payment-status-card';

export function PaymentStatusCardDemo() {
  return (
    <div className="not-prose flex justify-center rounded-sm border bg-fd-background p-4">
      <PaymentStatusCard
        status="success"
        amount={11750}
        currency="XOF"
        provider="wave"
        transactionId="txn_7n4Pq3b9"
        primaryAction={{ label: 'View transaction', href: '#' }}
      />
    </div>
  );
}
