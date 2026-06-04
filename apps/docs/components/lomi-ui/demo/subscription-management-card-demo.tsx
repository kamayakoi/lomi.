import { SubscriptionManagementCard } from '@/components/lomi-ui/subscription-management-card';

export function SubscriptionManagementCardDemo() {
  return (
    <div className="not-prose flex justify-center rounded-sm border bg-fd-background p-4">
      <SubscriptionManagementCard
        planName="Growth"
        status="active"
        amount={25000}
        currency="XOF"
        interval="month"
        nextBillingDate="June 28, 2026"
        paymentMethod="Wave ending 4821"
        features={['Payment links', 'Subscriptions', 'Webhooks', 'Payouts']}
      />
    </div>
  );
}
