'use client';

import * as React from 'react';
import { MobileMoneyCheckoutCard } from '@/components/lomi-ui/mobile-money-checkout-card';
import type { ProviderId } from '@/components/lomi-ui/payment-provider-selector';

export function MobileMoneyCheckoutCardDemo() {
  const [provider, setProvider] = React.useState<ProviderId>('wave');
  const [phoneNumber, setPhoneNumber] = React.useState('+225 07 00 00 00 00');
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="not-prose flex justify-center rounded-sm border bg-fd-background p-4">
      <MobileMoneyCheckoutCard
        amount={12500}
        currency="XOF"
        merchantName="Keur Studio"
        selectedProvider={provider}
        phoneNumber={phoneNumber}
        loading={loading}
        onProviderChange={setProvider}
        onPhoneNumberChange={setPhoneNumber}
        onSubmit={() => {
          setLoading(true);
          window.setTimeout(() => setLoading(false), 900);
        }}
      />
    </div>
  );
}
