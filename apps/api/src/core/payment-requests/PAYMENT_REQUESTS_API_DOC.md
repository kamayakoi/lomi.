# Payment Requests API Documentation

## Overview

The Payment Requests API allows you to create payment intents and track their status. Payment requests have an expiration date and are useful for invoicing, billing, and requesting payments from specific customers.

## Base URL

```
https://api.lomi.africa/payment-requests
```

## Authentication

All requests require API key authentication via the `Authorization` header:

```
Authorization: Bearer your_api_key_here
```

## Endpoints

### 1. Create Payment Request

Create a new payment request.

**Endpoint:** `POST /payment-requests`

**Request Body:**

```json
{
  "amount": 10000.00,
  "currency_code": "XOF",
  "description": "Invoice #INV-2024-001",
  "customer_id": "123e4567-e89b-12d3-a456-426614174000",
  "expiry_date": "2024-12-31T23:59:59Z",
  "payment_reference": "INV-2024-001",
  "metadata": {
    "invoice_id": "INV-2024-001",
    "customer_ref": "CUST-123"
  }
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | number | Yes | Amount to request |
| `currency_code` | string | Yes | Currency (XOF, USD, EUR) |
| `description` | string | No | Description of the payment request |
| `customer_id` | UUID | No | Customer ID (if linked to a customer) |
| `expiry_date` | string | Yes | Expiration date/time (ISO 8601) |
| `payment_reference` | string | No | Reference (invoice number, order ID) |
| `metadata` | object | No | Additional metadata |

**Response:** `201 Created`

```json
{
  "request_id": "req-abc123-...",
  "organization_id": "org-...",
  "customer_id": "123e4567-...",
  "amount": 10000.00,
  "currency_code": "XOF",
  "description": "Invoice #INV-2024-001",
  "status": "pending",
  "expiry_date": "2024-12-31T23:59:59Z",
  "payment_link": "https://pay.lomi.africa/req-abc123",
  "payment_reference": "INV-2024-001",
  "metadata": {
    "invoice_id": "INV-2024-001",
    "customer_ref": "CUST-123"
  },
  "environment": "live",
  "created_at": "2024-01-15T10:00:00Z",
  "created_by": "merchant-...",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

---

### 2. List Payment Requests

Retrieve all payment requests with optional filtering.

**Endpoint:** `GET /payment-requests`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | No | Filter by status: `pending`, `completed`, `failed`, `expired` |
| `customerId` | UUID | No | Filter by customer ID |
| `limit` | integer | No | Results per page (default: 20) |
| `offset` | integer | No | Pagination offset (default: 0) |

**Example Request:**

```bash
GET /payment-requests?status=pending&limit=20&offset=0
```

**Response:** `200 OK`

```json
{
  "data": [
    {
      "request_id": "req-abc123-...",
      "organization_id": "org-...",
      "customer_id": "123e4567-...",
      "amount": 10000.00,
      "currency_code": "XOF",
      "description": "Invoice #INV-2024-001",
      "status": "pending",
      "expiry_date": "2024-12-31T23:59:59Z",
      "payment_reference": "INV-2024-001",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 125,
  "limit": 20,
  "offset": 0
}
```

---

### 3. Get Payment Request by ID

Retrieve detailed information about a specific payment request.

**Endpoint:** `GET /payment-requests/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Payment request ID |

**Response:** `200 OK`

```json
{
  "request_id": "req-abc123-...",
  "organization_id": "org-...",
  "customer_id": "123e4567-...",
  "amount": 10000.00,
  "currency_code": "XOF",
  "description": "Invoice #INV-2024-001",
  "status": "completed",
  "expiry_date": "2024-12-31T23:59:59Z",
  "payment_link": "https://pay.lomi.africa/req-abc123",
  "payment_reference": "INV-2024-001",
  "metadata": {
    "invoice_id": "INV-2024-001"
  },
  "environment": "live",
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Error Response:** `404 Not Found`

```json
{
  "statusCode": 404,
  "message": "Payment request with ID req-abc123 not found or access denied"
}
```

---

## Payment Request Status

Payment requests can have the following statuses:

| Status | Description |
|--------|-------------|
| `pending` | Created but not yet paid |
| `completed` | Payment received successfully |
| `failed` | Payment attempt failed |
| `expired` | Passed expiry date without payment |

### Status Transitions

```
pending → completed (payment successful)
pending → failed (payment failed)
pending → expired (expiry date reached)
```

---

## Use Cases

### 1. Invoice Payment Request

Create a payment request for an invoice:

```json
{
  "amount": 50000,
  "currency_code": "XOF",
  "description": "Consulting Services - January 2024",
  "customer_id": "cust-123",
  "expiry_date": "2024-02-28T23:59:59Z",
  "payment_reference": "INV-2024-001",
  "metadata": {
    "invoice_number": "INV-2024-001",
    "service_period": "January 2024"
  }
}
```

### 2. Bill Payment Request

Create a payment request for a recurring bill:

```json
{
  "amount": 15000,
  "currency_code": "XOF",
  "description": "Internet Service - February 2024",
  "customer_id": "cust-456",
  "expiry_date": "2024-02-15T23:59:59Z",
  "payment_reference": "BILL-FEB-2024"
}
```

### 3. Order Payment Request

Request payment for a specific order:

```json
{
  "amount": 25000,
  "currency_code": "XOF",
  "description": "Order #ORD-2024-789",
  "expiry_date": "2024-01-20T23:59:59Z",
  "payment_reference": "ORD-2024-789",
  "metadata": {
    "order_id": "ORD-2024-789",
    "items_count": 3
  }
}
```

---

## Field Descriptions

### expiry_date

**Required.** The date/time when the payment request expires. After this time:
- Status automatically changes to `expired`
- Payment cannot be completed
- Customer cannot access payment link

Format: ISO 8601 datetime (e.g., `2024-12-31T23:59:59Z`)

### payment_link

System-generated URL where customers can complete payment. Share this link with customers via:
- Email
- SMS
- Messaging apps

Format: `https://pay.lomi.africa/{request_id}`

### payment_reference

Your internal reference for tracking (invoice number, order ID, bill reference, etc.). This appears on payment receipts and helps reconcile payments.

### metadata

Store any additional context as key-value pairs:
- Invoice details
- Customer information
- Order items
- Billing period
- Project references

---

## Business Logic

### Automatic Expiration

Payment requests automatically expire when:
1. Current time passes the `expiry_date`
2. Status changes from `pending` to `expired`
3. Payment link becomes inaccessible

### Payment Tracking

When a customer pays a payment request:
1. Status changes from `pending` to `completed`
2. A transaction is created and linked
3. Webhook `payment_request.completed` is triggered
4. Receipt is sent to customer

### Multi-tenancy

All payment requests are isolated by organization:
- You can only create requests for your organization
- You can only view requests from your organization
- Customers can only pay requests from your organization

---

## Error Handling

### Common Errors

**400 Bad Request**
```json
{
  "statusCode": 400,
  "message": "Invalid input or validation error"
}
```

Causes:
- Missing required fields
- Invalid expiry date (in the past)
- Invalid amount (negative or zero)
- Invalid currency code

**401 Unauthorized**
```json
{
  "statusCode": 401,
  "message": "Invalid or missing API key"
}
```

**404 Not Found**
```json
{
  "statusCode": 404,
  "message": "Payment request not found or access denied"
}
```

---

## Best Practices

1. **Set Reasonable Expiry Dates**: 
   - Invoices: 30-90 days
   - Bills: 7-15 days
   - Orders: 1-3 days

2. **Include Clear Descriptions**: Help customers identify the payment purpose

3. **Use Payment References**: Track payments in your accounting system

4. **Store Context in Metadata**: Include all relevant information for reconciliation

5. **Monitor Status**: Regularly check for completed and expired requests

6. **Send Reminders**: For pending requests approaching expiry

---

## Integration Examples

### Node.js

```javascript
const response = await fetch('https://api.lomi.africa/payment-requests', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 10000,
    currency_code: 'XOF',
    description: 'Invoice #INV-2024-001',
    expiry_date: '2024-12-31T23:59:59Z',
    payment_reference: 'INV-2024-001'
  })
});

const request = await response.json();
console.log('Payment link:', request.payment_link);
```

### Python

```python
import requests
from datetime import datetime, timedelta

# Set expiry to 30 days from now
expiry = (datetime.now() + timedelta(days=30)).isoformat()

response = requests.post(
    'https://api.lomi.africa/payment-requests',
    headers={'Authorization': 'Bearer your_api_key'},
    json={
        'amount': 10000,
        'currency_code': 'XOF',
        'description': 'Invoice #INV-2024-001',
        'expiry_date': expiry,
        'payment_reference': 'INV-2024-001'
    }
)

request = response.json()
print(f"Payment link: {request['payment_link']}")
```

### cURL

```bash
curl -X POST https://api.lomi.africa/payment-requests \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10000,
    "currency_code": "XOF",
    "description": "Invoice #INV-2024-001",
    "expiry_date": "2024-12-31T23:59:59Z",
    "payment_reference": "INV-2024-001"
  }'
```

---

## Webhooks

Payment requests trigger the following webhook events:

- `payment_request.created` - New payment request created
- `payment_request.completed` - Payment received
- `payment_request.failed` - Payment failed
- `payment_request.expired` - Request expired without payment

Subscribe to these events in your webhook settings.

---

## Rate Limits

- **Create**: 100 requests per minute
- **List/Get**: 300 requests per minute

---

## Changelog

### v1.0.0 (2024-01-15)
- Initial release
- Support for invoice and bill payments
- Automatic expiration handling
- Customer linking
- Metadata support

