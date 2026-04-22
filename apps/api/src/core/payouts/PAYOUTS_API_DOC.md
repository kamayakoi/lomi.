# Payouts API Documentation

## Overview

The Payouts API allows you to withdraw funds from your lomi. account balance to your bank account or mobile money wallet. All payouts are processed asynchronously by payment providers (Wave, SPI, etc.) and status updates are sent via webhooks.

**Important:** Payouts are **initiated** immediately but **processed asynchronously**. Always check the status via webhooks or polling.

## Base URL

```
https://api.lomi.africa/payouts
```

## Authentication

All requests require API key authentication via the `Authorization` header:

```
Authorization: Bearer your_api_key_here
```

## Endpoints

### 1. Initiate Payout (Withdrawal)

Initiate a withdrawal from your account balance.

**Endpoint:** `POST /payouts`

**Request Body:**

```json
{
  "amount": 10000.00,
  "currency_code": "XOF",
  "payout_method_id": "123e4567-e89b-12d3-a456-426614174000",
  "provider_code": "WAVE",
  "metadata": {
    "note": "Monthly withdrawal"
  }
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | number | Yes | Amount to withdraw |
| `currency_code` | string | Yes | Currency (XOF, USD, EUR) |
| `payout_method_id` | UUID | Yes | Payout method ID (bank or mobile money) |
| `provider_code` | string | No | Provider (WAVE, SPI, STRIPE) |
| `metadata` | object | No | Additional metadata |

**Response:** `201 Created`

```json
{
  "payout_id": "payout-abc123-...",
  "account_id": "acc-...",
  "organization_id": "org-...",
  "payout_method_id": "123e4567-...",
  "amount": 10000.00,
  "currency_code": "XOF",
  "status": "pending",
  "provider_code": "WAVE",
  "payment_method_code": "MOBILE_MONEY",
  "metadata": {
    "note": "Monthly withdrawal"
  },
  "environment": "live",
  "created_at": "2024-01-15T10:00:00Z",
  "created_by": "merchant-...",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

**Important Notes:**

- ✅ Returns immediately with `status: "pending"`
- 🔄 Actual payout processed asynchronously by provider
- 📬 Status updates sent via webhooks
- ⏱️ Processing time: 1 minute to 24 hours (varies by provider)
- 💰 Amount deducted from your available balance immediately

---

### 2. List Payouts

Retrieve all payouts with optional filtering.

**Endpoint:** `GET /payouts`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `statuses` | string | No | Comma-separated statuses: `pending,completed,failed` |
| `startDate` | string | No | Filter by start date (ISO 8601) |
| `endDate` | string | No | Filter by end date (ISO 8601) |
| `limit` | integer | No | Results per page (default: 50) |
| `offset` | integer | No | Pagination offset (default: 0) |

**Example Request:**

```bash
GET /payouts?statuses=pending,completed&limit=20&offset=0
```

**Response:** `200 OK`

```json
{
  "data": [
    {
      "payout_id": "payout-abc123-...",
      "account_id": "acc-...",
      "amount": 10000.00,
      "currency_code": "XOF",
      "status": "completed",
      "provider_code": "WAVE",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:05:00Z"
    }
  ],
  "limit": 20,
  "offset": 0
}
```

---

### 3. Get Payout by ID

Retrieve detailed information about a specific payout.

**Endpoint:** `GET /payouts/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Payout ID |

**Response:** `200 OK`

```json
{
  "payout_id": "payout-abc123-...",
  "account_id": "acc-...",
  "organization_id": "org-...",
  "payout_method_id": "123e4567-...",
  "amount": 10000.00,
  "currency_code": "XOF",
  "status": "completed",
  "provider_code": "WAVE",
  "payment_method_code": "MOBILE_MONEY",
  "metadata": {
    "note": "Monthly withdrawal",
    "provider_transaction_id": "wave-tx-123"
  },
  "environment": "live",
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:05:00Z"
}
```

**Error Response:** `404 Not Found`

```json
{
  "statusCode": 404,
  "message": "Payout with ID payout-abc123 not found or access denied"
}
```

---

## Payout Status

Payouts go through the following statuses:

| Status | Description | Next Steps |
|--------|-------------|------------|
| `pending` | Initiated, awaiting provider processing | Wait for webhook |
| `processing` | Provider is processing the payout | Wait for webhook |
| `completed` | Successfully transferred to your account | None - funds received |
| `failed` | Transfer failed | Check failure reason, retry if needed |
| `cancelled` | Cancelled before processing | None |

### Status Flow

```
pending → processing → completed (success)
pending → processing → failed (error)
pending → cancelled (manual cancellation)
```

---

## Payout Methods

Before initiating a payout, you must have a payout method configured. Payout methods can be:

### 1. Bank Account
- Requires: account number, bank name, account holder name
- Processing time: 1-3 business days
- Available providers: SPI, STRIPE

### 2. Mobile Money
- Requires: mobile number
- Processing time: Minutes to hours
- Available providers: WAVE, SPI

---

## Balance Requirements

### Checking Available Balance

Before initiating a payout:

1. Check your available balance via the Accounts API
2. Ensure balance ≥ payout amount + fees
3. Account is immediately debited upon payout initiation

### Insufficient Balance

If balance is insufficient, the API returns:

```json
{
  "statusCode": 400,
  "message": "Insufficient balance: Available 5000 XOF, Requested 10000 XOF"
}
```

---

## Provider-Specific Details

### Wave

- **Method**: Mobile money
- **Processing time**: 1-10 minutes
- **Fee**: 1% of payout amount
- **Minimum**: 100 XOF
- **Maximum**: 1,000,000 XOF per transaction

### SPI (Senegal)

- **Method**: Bank transfer or mobile money
- **Processing time**: 1-24 hours
- **Fee**: Variable by bank
- **Minimum**: 500 XOF
- **Supported**: All UEMOA banks

---

## Use Cases

### 1. Weekly Withdrawal

Withdraw funds on a weekly schedule:

```json
{
  "amount": 50000,
  "currency_code": "XOF",
  "payout_method_id": "method-123",
  "metadata": {
    "schedule": "weekly",
    "week": "2024-W03"
  }
}
```

### 2. Emergency Withdrawal

Quick withdrawal to mobile money:

```json
{
  "amount": 10000,
  "currency_code": "XOF",
  "payout_method_id": "mobile-456",
  "provider_code": "WAVE",
  "metadata": {
    "urgent": true,
    "reason": "Emergency expense"
  }
}
```

### 3. Salary Payment

Transfer funds for salary payments:

```json
{
  "amount": 200000,
  "currency_code": "XOF",
  "payout_method_id": "bank-789",
  "metadata": {
    "purpose": "salary_transfer",
    "month": "January 2024"
  }
}
```

---

## Error Handling

### Common Errors

**400 - Insufficient Balance**
```json
{
  "statusCode": 400,
  "message": "Insufficient balance: Available 5000 XOF, Requested 10000 XOF"
}
```

**400 - Invalid Payout Method**
```json
{
  "statusCode": 400,
  "message": "Payout method not found or not configured"
}
```

**400 - Amount Below Minimum**
```json
{
  "statusCode": 400,
  "message": "Amount 50 XOF is below minimum payout amount of 100 XOF"
}
```

**401 - Unauthorized**
```json
{
  "statusCode": 401,
  "message": "Invalid or missing API key"
}
```

---

## Webhooks

Subscribe to these webhook events for payout updates:

### payout.pending
Triggered when payout is initiated.

```json
{
  "event": "payout.pending",
  "data": {
    "payout_id": "payout-abc123",
    "amount": 10000.00,
    "currency_code": "XOF",
    "status": "pending"
  }
}
```

### payout.completed
Triggered when payout is successfully transferred.

```json
{
  "event": "payout.completed",
  "data": {
    "payout_id": "payout-abc123",
    "amount": 10000.00,
    "currency_code": "XOF",
    "status": "completed",
    "completed_at": "2024-01-15T10:05:00Z"
  }
}
```

### payout.failed
Triggered when payout fails.

```json
{
  "event": "payout.failed",
  "data": {
    "payout_id": "payout-abc123",
    "amount": 10000.00,
    "status": "failed",
    "failure_reason": "Invalid account number",
    "failed_at": "2024-01-15T10:05:00Z"
  }
}
```

---

## Best Practices

1. **Check Balance First**: Always verify sufficient balance before initiating payout
2. **Use Webhooks**: Don't poll - subscribe to webhook events for status updates
3. **Store Payout IDs**: Save payout IDs for reconciliation
4. **Handle Failures**: Implement retry logic for failed payouts
5. **Use Metadata**: Track withdrawal purpose, schedule, and context
6. **Monitor Status**: Regularly check pending payouts
7. **Set Limits**: Configure daily/weekly withdrawal limits for security

---

## Integration Examples

### Node.js

```javascript
// Check balance first
const balanceRes = await fetch('https://api.lomi.africa/accounts/balance', {
  headers: { 'Authorization': 'Bearer your_api_key' }
});
const balance = await balanceRes.json();

if (balance.available_balance >= 10000) {
  // Initiate payout
  const response = await fetch('https://api.lomi.africa/payouts', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer your_api_key',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: 10000,
      currency_code: 'XOF',
      payout_method_id: 'method-123'
    })
  });

  const payout = await response.json();
  console.log('Payout initiated:', payout.payout_id);
  console.log('Status:', payout.status); // "pending"
}
```

### Python

```python
import requests

# Initiate payout
response = requests.post(
    'https://api.lomi.africa/payouts',
    headers={'Authorization': 'Bearer your_api_key'},
    json={
        'amount': 10000,
        'currency_code': 'XOF',
        'payout_method_id': 'method-123',
        'provider_code': 'WAVE'
    }
)

payout = response.json()
print(f"Payout {payout['payout_id']} initiated")
print(f"Status: {payout['status']}")  # "pending"

# Check status later (or better: use webhooks)
status_response = requests.get(
    f"https://api.lomi.africa/payouts/{payout['payout_id']}",
    headers={'Authorization': 'Bearer your_api_key'}
)
current_status = status_response.json()
print(f"Current status: {current_status['status']}")
```

### cURL

```bash
# Initiate payout
curl -X POST https://api.lomi.africa/payouts \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10000,
    "currency_code": "XOF",
    "payout_method_id": "method-123"
  }'

# Check payout status
curl -X GET https://api.lomi.africa/payouts/payout-abc123 \
  -H "Authorization: Bearer your_api_key"
```

---

## Security

### Balance Protection
- Payouts are validated against available balance
- Concurrent payout attempts are handled safely
- Balance is locked during processing

### Multi-tenancy
- All payouts are organization-scoped
- Cannot withdraw from other organizations
- Payout methods are organization-specific

---

## Rate Limits

- **Initiate**: 50 requests per minute
- **List/Get**: 300 requests per minute

---

## Changelog

### v1.0.0 (2024-01-15)
- Initial release
- Support for Wave and SPI providers
- Async processing with webhooks
- Balance validation
- Status tracking

