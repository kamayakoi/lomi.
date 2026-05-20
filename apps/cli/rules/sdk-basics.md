# lomi. SDK Basics

Use the official TypeScript SDK `@lomi./sdk` to integrate lomi. payments.

## Authentication

- **Production API**: `https://api.lomi.africa`
- **Sandbox API**: `https://sandbox.api.lomi.africa`
- **Secret keys**: `lomi_sk_live_…` (production) or `lomi_sk_test_…` (sandbox)
- **Publishable keys**: `lomi_pk_live_…` or `lomi_pk_test_…`

Environment is determined by your **API key**, not the hostname.

## Client setup

```typescript
import { DefaultService, OpenAPI } from '@lomi./sdk';
import 'dotenv/config';

OpenAPI.BASE = process.env.LOMI_API_URL || 'https://api.lomi.africa';
OpenAPI.HEADERS = {
  Authorization: `Bearer ${process.env.LOMI_API_KEY}`,
};

export const lomiApi = DefaultService;
```

## Environment variables

| Variable | Description |
| --- | --- |
| `LOMI_API_KEY` | Secret API key from the dashboard |
| `LOMI_WEBHOOK_SECRET` | Webhook signing secret (`whsec_…`) |
| `LOMI_API_URL` | Optional API base URL override |

## Currencies

Supported: **XOF**, **USD**, **EUR**.

## Docs

Full documentation: https://docs.lomi.africa
