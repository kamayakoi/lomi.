# lomi. Webhooks

Handle lomi. webhook events securely in your application.

## Signature verification

lomi. signs webhooks with HMAC-SHA256. The signature is in the `lomi-signature` header:

```
lomi-signature: t=1678886400,s=sha256=abcdef...
```

Verify by computing HMAC-SHA256 over `{timestamp}.{rawBody}` with your webhook secret.

```typescript
import crypto from 'node:crypto';

function verifyLomiSignature(rawBody: string, header: string, secret: string) {
  const parts = header.split(',');
  const timestamp = parts.find(p => p.startsWith('t='))?.split('=')[1];
  const signature = parts.find(p => p.startsWith('s='))?.split('=')[1];
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody}`)
    .digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(signature!, 'hex'), Buffer.from(expected, 'hex'))) {
    throw new Error('Invalid signature');
  }
  return JSON.parse(rawBody);
}
```

## Common event types

- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.failed`
- `transaction.completed`
- `refund.created`
- `subscription.created` / `subscription.updated` / `subscription.cancelled`

## Local development

Run `lomi dev` to start a local webhook receiver on port 4242.
Use ngrok or similar to expose it publicly for dashboard webhook configuration.

## Environment variable

Set `LOMI_WEBHOOK_SECRET=whsec_…` from your dashboard webhook settings.
