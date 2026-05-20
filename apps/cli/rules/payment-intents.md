# lomi. Payment Intents

Payment intents represent a single payment attempt (card, Wave, MTN MoMo, etc.).

## Create a payment intent

```typescript
import { lomiApi } from './lib/lomi/client';

const intent = await lomiApi.createPaymentIntent({
  merchant_id: 'your_merchant_id',
  amount: 5000,
  currency_code: 'XOF',
  payment_method: 'wave', // or 'card', 'mtn_momo', etc.
});
```

## Payment methods (West Africa)

- **Wave** — Mobile wallet popular in Senegal
- **MTN MoMo** — Mobile money
- **Orange Money** — Mobile money
- **Card** — Visa/Mastercard via hosted or embedded checkout

## Sandbox simulation

In test mode, use sandbox test phone numbers and card numbers from:
https://docs.lomi.africa/reference/setup/sandbox-payments

Test resources include `"environment": "test"` in API responses.

## Confirming payment

Poll the payment intent status or listen for `payment_intent.succeeded` webhooks.
Never trust client-side confirmation alone — always verify server-side.
