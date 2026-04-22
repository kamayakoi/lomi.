# Beneficiary Payouts API Documentation

## Overview

The Beneficiary Payouts API allows you to pay external parties (contractors, suppliers, employees, etc.) from your account balance. All payouts are processed asynchronously by payment providers (Wave, SPI) and status updates are sent via webhooks.

**Important:** This is different from the Payouts API (merchant withdrawals). Beneficiary payouts are for paying **others**, while regular payouts are for withdrawing to **your own** accounts.

## Base URL

```
https://api.lomi.africa/beneficiary-payouts
```

## Authentication

All requests require API key authentication via the `Authorization` header:

```
Authorization: Bearer your_api_key_here
```

## Endpoints

### 1. Initiate Beneficiary Payout

Initiate a payout to a beneficiary (contractor, supplier, employee).

**Endpoint:** `POST /beneficiary-payouts`

**Request Body:**

```json
{
  "amount": 5000.00,
  "currency_code": "XOF",
  "payout_method_id": "123e4567-e89b-12d3-a456-426614174000",
  "provider_code": "WAVE",
  "payment_method_code": "MOBILE_MONEY",
  "metadata": {
    "recipient_name": "John Doe",
    "reference": "INV-001",
    "purpose": "Contract payment"
  }
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | number | Yes | Amount to pay beneficiary |
| `currency_code` | string | Yes | Currency (XOF, USD, EUR) |
| `payout_method_id` | UUID | No | Beneficiary's payout method |
| `provider_code` | string | No | Provider (WAVE, SPI) - default: WAVE |
| `payment_method_code` | string | No | Method (MOBILE_MONEY, BANK_TRANSFER) - default: MOBILE_MONEY |
| `metadata` | object | No | Additional information |

**Response:** `201 Created`

```json
{
  "payout_id": "bpayout-abc123-...",
  "account_id": "acc-...",
  "organization_id": "org-...",
  "payout_method_id": "123e4567-...",
  "amount": 5000.00,
  "currency_code": "XOF",
  "status": "pending",
  "provider_code": "WAVE",
  "payment_method_code": "MOBILE_MONEY",
  "metadata": {
    "recipient_name": "John Doe",
    "reference": "INV-001",
    "purpose": "Contract payment"
  },
  "created_at": "2024-01-15T10:00:00Z",
  "created_by": "merchant-...",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

**Important Notes:**

- ✅ Returns immediately with `status: "pending"`
- 🔄 Actual payout processed asynchronously
- 📬 Status updates sent via webhooks
- ⏱️ Processing time: Minutes to hours (varies by provider)
- 💰 Amount + fees deducted from balance immediately
- 👤 For paying external parties, not yourself

---

### 2. List Beneficiary Payouts

Retrieve all beneficiary payouts with optional filtering.

**Endpoint:** `GET /beneficiary-payouts`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `statuses` | string | No | Comma-separated: `pending,completed,failed` |
| `startDate` | string | No | Filter by start date (ISO 8601) |
| `endDate` | string | No | Filter by end date (ISO 8601) |
| `currencyCode` | string | No | Filter by currency (XOF, USD, EUR) |
| `limit` | integer | No | Results per page (default: 50) |
| `offset` | integer | No | Pagination offset (default: 0) |

**Example Request:**

```bash
GET /beneficiary-payouts?statuses=pending,completed&currencyCode=XOF&limit=20
```

**Response:** `200 OK`

```json
{
  "data": [
    {
      "payout_id": "bpayout-abc123-...",
      "amount": 5000.00,
      "currency_code": "XOF",
      "status": "completed",
      "provider_code": "WAVE",
      "metadata": {
        "recipient_name": "John Doe"
      },
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:02:00Z"
    }
  ],
  "limit": 20,
  "offset": 0
}
```

---

### 3. Get Beneficiary Payout by ID

Retrieve detailed information about a specific beneficiary payout.

**Endpoint:** `GET /beneficiary-payouts/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Beneficiary payout ID |

**Response:** `200 OK`

```json
{
  "payout_id": "bpayout-abc123-...",
  "account_id": "acc-...",
  "organization_id": "org-...",
  "payout_method_id": "123e4567-...",
  "amount": 5000.00,
  "currency_code": "XOF",
  "status": "completed",
  "provider_code": "WAVE",
  "payment_method_code": "MOBILE_MONEY",
  "metadata": {
    "recipient_name": "John Doe",
    "reference": "INV-001",
    "provider_transaction_id": "wave-tx-456"
  },
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:02:00Z"
}
```

**Error Response:** `404 Not Found`

```json
{
  "statusCode": 404,
  "message": "Beneficiary payout with ID bpayout-abc123 not found or access denied"
}
```

---

## Payout Status

Beneficiary payouts follow these statuses:

| Status | Description | Your Action |
|--------|-------------|-------------|
| `pending` | Initiated, awaiting processing | Wait for webhook |
| `processing` | Provider is transferring funds | Wait for webhook |
| `completed` | Successfully paid to beneficiary | None - payment complete |
| `failed` | Transfer failed | Check reason, retry if appropriate |

### Status Flow

```
pending → processing → completed (success)
pending → processing → failed (error)
```

---

## Use Cases

### 1. Contractor Payment

Pay a freelance contractor for completed work:

```json
{
  "amount": 50000,
  "currency_code": "XOF",
  "payout_method_id": "contractor-mobile-123",
  "provider_code": "WAVE",
  "metadata": {
    "recipient_name": "Jane Smith",
    "project": "Website Development",
    "invoice_number": "INV-2024-001",
    "contract_id": "CONT-456"
  }
}
```

### 2. Supplier Payment

Pay a supplier for goods delivered:

```json
{
  "amount": 150000,
  "currency_code": "XOF",
  "payout_method_id": "supplier-bank-456",
  "provider_code": "SPI",
  "payment_method_code": "BANK_TRANSFER",
  "metadata": {
    "recipient_name": "ABC Supplies Ltd",
    "purchase_order": "PO-2024-789",
    "invoice": "SUP-INV-123"
  }
}
```

### 3. Employee Salary

Pay employee monthly salary:

```json
{
  "amount": 200000,
  "currency_code": "XOF",
  "payout_method_id": "employee-bank-789",
  "metadata": {
    "recipient_name": "John Doe",
    "employee_id": "EMP-001",
    "salary_month": "January 2024",
    "payment_type": "salary"
  }
}
```

### 4. Refund to Customer

Refund a customer (alternative to Refunds API):

```json
{
  "amount": 15000,
  "currency_code": "XOF",
  "payout_method_id": "customer-mobile-321",
  "provider_code": "WAVE",
  "metadata": {
    "recipient_name": "Customer Name",
    "order_id": "ORD-2024-456",
    "reason": "Order cancellation",
    "refund": true
  }
}
```

---

## Provider Details

### Wave (Mobile Money)

- **Best for**: Small to medium payments, quick transfers
- **Processing time**: 1-10 minutes
- **Fee**: 1% of amount
- **Minimum**: 100 XOF
- **Maximum**: 1,000,000 XOF per transaction
- **Payment method**: Mobile money only

### SPI (Senegal Payment System)

- **Best for**: Bank transfers, larger amounts
- **Processing time**: 1-24 hours
- **Fee**: Varies by bank
- **Minimum**: 500 XOF
- **Methods**: Bank transfer, mobile money
- **Coverage**: All UEMOA banks

---

## Balance & Fees

### Fee Structure

| Provider | Payment Method | Fee |
|----------|----------------|-----|
| Wave | Mobile Money | 1% of amount |
| SPI | Bank Transfer | Variable (0.5-2%) |
| SPI | Mobile Money | Variable |

### Balance Deduction

When initiating a beneficiary payout:

1. **Amount + fees** deducted immediately from your balance
2. If payout **completes**: No further action
3. If payout **fails**: Amount + fees credited back to your balance

---

## Error Handling

### Common Errors

**400 - Insufficient Balance**
```json
{
  "statusCode": 400,
  "message": "Insufficient balance: Available 3000 XOF, Requested 5000 XOF (including fees)"
}
```

**400 - Invalid Payout Method**
```json
{
  "statusCode": 400,
  "message": "Payout method not found or belongs to different organization"
}
```

**400 - Amount Below Minimum**
```json
{
  "statusCode": 400,
  "message": "Amount 50 XOF is below minimum of 100 XOF for Wave"
}
```

**404 - Beneficiary Not Found**
```json
{
  "statusCode": 404,
  "message": "Beneficiary payout not found or access denied"
}
```

---

## Webhooks

Subscribe to these events for real-time updates:

### beneficiary_payout.pending
```json
{
  "event": "beneficiary_payout.pending",
  "data": {
    "payout_id": "bpayout-abc123",
    "amount": 5000.00,
    "currency_code": "XOF",
    "recipient_name": "John Doe",
    "status": "pending"
  }
}
```

### beneficiary_payout.completed
```json
{
  "event": "beneficiary_payout.completed",
  "data": {
    "payout_id": "bpayout-abc123",
    "amount": 5000.00,
    "currency_code": "XOF",
    "status": "completed",
    "completed_at": "2024-01-15T10:02:00Z"
  }
}
```

### beneficiary_payout.failed
```json
{
  "event": "beneficiary_payout.failed",
  "data": {
    "payout_id": "bpayout-abc123",
    "amount": 5000.00,
    "status": "failed",
    "failure_reason": "Invalid mobile number",
    "failed_at": "2024-01-15T10:02:00Z"
  }
}
```

---

## Best Practices

1. **Verify Payout Methods**: Ensure beneficiary payout methods are correct before initiating
2. **Use Metadata**: Store recipient details, references, and context
3. **Subscribe to Webhooks**: Monitor payout status in real-time
4. **Handle Failures Gracefully**: Implement retry logic for transient errors
5. **Track Payments**: Store payout IDs for accounting reconciliation
6. **Batch Processing**: Consider mass payout API for multiple beneficiaries
7. **Provider Selection**: Choose Wave for speed, SPI for bank transfers

---

## Beneficiary Payout Methods

Before initiating payouts, beneficiaries must have payout methods configured:

### Mobile Money
- Provider: Wave or SPI
- Required: Mobile number
- Processing: Minutes

### Bank Account
- Provider: SPI
- Required: Account number, bank name, account holder
- Processing: Hours to 1 day

---

## Integration Examples

### Node.js

```javascript
// Pay a contractor
const response = await fetch('https://api.lomi.africa/beneficiary-payouts', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 50000,
    currency_code: 'XOF',
    payout_method_id: 'contractor-method-123',
    provider_code: 'WAVE',
    metadata: {
      recipient_name: 'Jane Smith',
      invoice: 'INV-2024-001'
    }
  })
});

const payout = await response.json();
console.log('Payout initiated:', payout.payout_id);
console.log('Status:', payout.status); // "pending"
```

### Python

```python
import requests

# Pay multiple contractors
contractors = [
    {'method_id': 'method-1', 'amount': 50000, 'name': 'John Doe'},
    {'method_id': 'method-2', 'amount': 75000, 'name': 'Jane Smith'}
]

for contractor in contractors:
    response = requests.post(
        'https://api.lomi.africa/beneficiary-payouts',
        headers={'Authorization': 'Bearer your_api_key'},
        json={
            'amount': contractor['amount'],
            'currency_code': 'XOF',
            'payout_method_id': contractor['method_id'],
            'metadata': {'recipient_name': contractor['name']}
        }
    )
    payout = response.json()
    print(f"Paid {contractor['name']}: {payout['payout_id']}")
```

### cURL

```bash
curl -X POST https://api.lomi.africa/beneficiary-payouts \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "currency_code": "XOF",
    "payout_method_id": "method-123",
    "provider_code": "WAVE",
    "metadata": {
      "recipient_name": "John Doe",
      "reference": "INV-001"
    }
  }'
```

---

## Difference from Payouts API

| Feature | Payouts API | Beneficiary Payouts API |
|---------|-------------|-------------------------|
| **Purpose** | Withdraw to your own accounts | Pay external parties |
| **Recipient** | Yourself (merchant) | Contractors, suppliers, employees |
| **Payout Methods** | Your bank/mobile | Beneficiary's bank/mobile |
| **Use Cases** | Withdrawals, cash out | Payments, salaries, invoices |
| **Endpoint** | `/payouts` | `/beneficiary-payouts` |

---

## Security

- Multi-tenancy enforced at organization level
- Payout methods validated for ownership
- Balance checks prevent overdrafts
- Audit trail for all payouts
- Webhook signatures for secure notifications

---

## Rate Limits

- **Initiate**: 100 requests per minute
- **List/Get**: 300 requests per minute

---

## Changelog

### v1.0.0 (2024-01-15)
- Initial release
- Support for Wave and SPI providers
- Mobile money and bank transfer methods
- Async processing with webhooks
- Metadata support for tracking

