import { UsageMeter } from '@/components/lomi-ui/usage-meter';

export function UsageMeterDemo() {
  return (
    <div className="not-prose flex justify-center rounded-sm border bg-fd-background p-4">
      <UsageMeter
        items={[
          { label: 'Checkout sessions', used: 820, limit: 1000 },
          { label: 'Webhook deliveries', used: 6400, limit: 10000 },
          { label: 'Payouts', used: 89, limit: 100 },
        ]}
      />
    </div>
  );
}
