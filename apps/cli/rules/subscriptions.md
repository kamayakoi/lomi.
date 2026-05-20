# lomi. Subscriptions

Manage recurring billing with lomi. subscriptions.

## Create a subscription

```typescript
import { lomiApi } from './lib/lomi/client';

const subscription = await lomiApi.createSubscription({
  merchant_id: 'your_merchant_id',
  customer_id: 'cus_xxx',
  price_id: 'price_xxx',
});
```

## Customer portal

Launch a self-service portal session for customers to manage their subscription:

```typescript
const portal = await lomiApi.createPortalLaunchSession({
  customer_id: 'cus_xxx',
  return_url: 'https://your-site.com/account',
});
// Redirect to portal.url
```

## Webhook events

- `subscription.created`
- `subscription.updated`
- `subscription.cancelled`

Handle these to provision/revoke access in your application.

## Cancellation

Update the subscription status or use the dashboard.
Always reconcile subscription state via webhooks, not just API responses at checkout time.
