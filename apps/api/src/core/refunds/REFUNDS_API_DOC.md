# Refunds API

## Overview

Merchant refunds use a **provider-agnostic** REST surface. The API routes each request based on the original transaction’s payment type (card vs mobile money).

- **Card**: ledger updated immediately; customer credit is completed by operations (no external refund API from merchants).
- **Mobile money (full)**: refund via payment network, then ledger updated.
- **Mobile money (partial)**: payout to customer phone, then ledger updated.

Full and partial refunds are supported.

## Base URL

```
https://api.lomi.africa/refunds
```

## Endpoints

| Method | Path | RPC / backend |
|--------|------|----------------|
| `POST` | `/refunds` | Branch: `create_manual_refund_request_api`, payment edge, `create_refund`, `update_organization_balance_for_refund` |
| `GET` | `/refunds` | `list_refunds` |
| `GET` | `/refunds/{id}` | `get_refund` |

## POST /refunds body

```json
{
  "transaction_id": "uuid",
  "amount": 5000,
  "reason": "optional",
  "refund_type": "full"
}
```

## Response (create)

```json
{
  "success": true,
  "refund_id": "uuid",
  "transaction_id": "uuid",
  "refunded_amount": 5000,
  "status": "completed",
  "message": "Refund recorded..."
}
```

## Migration

`create_manual_refund_request_api` lives in [`20250226000091_credit_cards.sql`](../../../dashboard/supabase/migrations/20250226000091_credit_cards.sql) (same migration as dashboard card refunds). Apply that migration (or re-run the function block) if the RPC is missing in your project.
