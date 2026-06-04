'use client';

import { PricingTable } from '@/components/lomi-ui/pricing-table';

export function PricingTableDemo() {
  return (
    <div className="not-prose rounded-sm border bg-fd-background p-4">
      <PricingTable
        plans={[
          {
            id: 'starter',
            name: 'Starter',
            description: 'For teams launching their first checkout flow.',
            monthlyPrice: 0,
            yearlyPrice: 0,
            currency: 'XOF',
            features: ['Hosted checkout', 'Payment links', 'Basic webhooks'],
          },
          {
            id: 'growth',
            name: 'Growth',
            description: 'For teams scaling payment operations.',
            monthlyPrice: 25000,
            yearlyPrice: 250000,
            currency: 'XOF',
            highlighted: true,
            features: [
              'Mobile money + cards',
              'Subscriptions',
              'Advanced reconciliation',
            ],
          },
          {
            id: 'scale',
            name: 'Scale',
            description: 'For platforms with custom payment needs.',
            monthlyPrice: 75000,
            yearlyPrice: 750000,
            currency: 'XOF',
            features: ['Dedicated support', 'Custom limits', 'Payout routing'],
          },
        ]}
      />
    </div>
  );
}
