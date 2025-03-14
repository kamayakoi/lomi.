# Wave API Commands for Merchant Management

This document provides a collection of useful cURL commands for interacting with the Wave API, particularly for merchant management, checking aggregated merchants, performing refunds, and other operations.

## Authentication

Most Wave API requests require authentication. Replace `YOUR_WAVE_API_KEY` with your actual Wave API key in all commands.

```bash
# Base headers for authentication
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

## Merchant Management

### List Aggregated Merchants

Retrieve a list of all merchants aggregated under your account:

```bash
curl -X GET "https://api.wave.com/v1/merchants" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

### Get Merchant Details

Retrieve detailed information about a specific merchant:

```bash
curl -X GET "https://api.wave.com/v1/merchants/{MERCHANT_ID}" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

### Delete Merchant

Remove a merchant from your aggregator account:

```bash
curl -X DELETE "https://api.wave.com/v1/merchants/{MERCHANT_ID}" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

### Update Merchant Information

Update a merchant's details:

```bash
curl -X PATCH "https://api.wave.com/v1/merchants/{MERCHANT_ID}" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json" \
-d '{
  "business_name": "Updated Business Name",
  "contact_name": "Updated Contact Name",
  "contact_phone": "+221XXXXXXXXX",
  "contact_email": "updated@example.com"
}'
```

## Aggregated Merchant Management

### List Aggregated Merchants

List all aggregated merchants under your Wave account:

```bash
curl -X GET "https://api.wave.com/v1/aggregated_merchants" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

### Create Aggregated Merchant

Create a new aggregated merchant under your Wave account:

```bash
curl -X POST "https://api.wave.com/v1/aggregated_merchants" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json" \
-d '{
  "name": "My Merchant Name",
  "business_type": "other",
  "business_description": "Description of merchant business",
  "business_sector": "other",
  "website_url": "https://example.com",
  "manager_name": "Manager Name",
  "business_registration_identifier": "REG123456"
}'
```

### Get Aggregated Merchant Details

Get details about a specific aggregated merchant:

```bash
curl -X GET "https://api.wave.com/v1/aggregated_merchants/{MERCHANT_ID}" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

### Delete Aggregated Merchant

Delete an aggregated merchant (use with caution):

```bash
curl -X DELETE "https://api.wave.com/v1/aggregated_merchants/{MERCHANT_ID}" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

## Transaction Management

### Process Refund

Refund a transaction to a customer:

```bash
curl -X POST "https://api.wave.com/v1/transactions/{TRANSACTION_ID}/refund" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json" \
-d '{
  "amount": "1000",
  "currency": "XOF",
  "reason": "Customer requested refund"
}'
```

### Process Partial Refund

Process a partial refund for a transaction:

```bash
curl -X POST "https://api.wave.com/v1/transactions/{TRANSACTION_ID}/refund" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json" \
-d '{
  "amount": "500",
  "currency": "XOF",
  "reason": "Partial refund for returned item"
}'
```

### Check Refund Status

Verify the status of a refund:

```bash
curl -X GET "https://api.wave.com/v1/refunds/{REFUND_ID}" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

### List All Refunds

Get a list of all refunds processed:

```bash
curl -X GET "https://api.wave.com/v1/refunds" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

### Check Transaction Status

Check the status of a transaction:

```bash
curl -X GET "https://api.wave.com/v1/transactions/{TRANSACTION_ID}" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

## Payment Operations

### Create Payment Request

Generate a new payment request for a customer:

```bash
curl -X POST "https://api.wave.com/v1/checkout" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json" \
-d '{
  "amount": "2000",
  "currency": "XOF",
  "mobile_number": "+221XXXXXXXXX",
  "description": "Payment for order #12345",
  "merchant_reference": "ORD-12345",
  "success_url": "https://yourwebsite.com/success",
  "error_url": "https://yourwebsite.com/error",
  "webhook_url": "https://yourwebsite.com/webhook"
}'
```

### Check Payment Status

Verify the status of a payment:

```bash
curl -X GET "https://api.wave.com/v1/checkout/{CHECKOUT_ID}" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

### Retrieve Transaction History

Get transaction history for a specific merchant:

```bash
curl -X GET "https://api.wave.com/v1/merchants/{MERCHANT_ID}/transactions" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

### Filter Transactions by Date Range

Retrieve transactions within a specific date range:

```bash
curl -X GET "https://api.wave.com/v1/merchants/{MERCHANT_ID}/transactions?start_date=2023-01-01T00:00:00Z&end_date=2023-12-31T23:59:59Z" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

## Checkout Management

### Create Checkout Session

Create a new checkout session for a customer to pay:

```bash
curl -X POST "https://api.wave.com/v1/checkout/sessions" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json" \
-d '{
  "amount": "2000",
  "currency": "XOF",
  "success_url": "https://yourwebsite.com/success",
  "error_url": "https://yourwebsite.com/error",
  "aggregated_merchant_id": "YOUR_AGGREGATED_MERCHANT_ID",
  "client_reference": "ORDER-123456"
}'
```

### Check Checkout Session Status

Check the status of a checkout session:

```bash
curl -X GET "https://api.wave.com/v1/checkout/sessions/{SESSION_ID}" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

### Cancel Checkout Session

Cancel a checkout session that hasn't been completed:

```bash
curl -X POST "https://api.wave.com/v1/checkout/sessions/{SESSION_ID}/cancel" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

## Settlement and Payout Management

### Create Payout

Send money to a Wave wallet:

```bash
curl -X POST "https://api.wave.com/v1/payouts" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json" \
-d '{
  "recipient_mobile": "+221XXXXXXXXX",
  "amount": "5000",
  "currency": "XOF",
  "client_reference": "PAYOUT-123456",
  "aggregated_merchant_id": "YOUR_AGGREGATED_MERCHANT_ID",
  "reason": "Vendor payment"
}'
```

### Initiate Payout

Request a payout to a merchant's bank account or mobile money account:

```bash
curl -X POST "https://api.wave.com/v1/payouts" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json" \
-d '{
  "merchant_id": "MERCHANT_ID",
  "amount": "50000",
  "currency": "XOF",
  "destination_type": "bank_account",
  "destination_id": "BANK_ACCOUNT_ID"
}'
```

### Check Payout Status

Check the status of a payout:

```bash
curl -X GET "https://api.wave.com/v1/payouts/{PAYOUT_ID}" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

### Search Payouts

Search for payouts by criteria:

```bash
curl -X GET "https://api.wave.com/v1/payouts/search?start_date=2023-01-01T00:00:00Z&end_date=2023-12-31T23:59:59Z" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

### List Pending Settlements

Check all pending settlements for your merchants:

```bash
curl -X GET "https://api.wave.com/v1/settlements?status=pending" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

## Business Operations

### Get Business Balance

Check your Wave business account balance:

```bash
curl -X GET "https://api.wave.com/v1/business/balance" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

### Get Business Account Statement

Get a statement of your business account transactions:

```bash
curl -X GET "https://api.wave.com/v1/business/statement?start_date=2023-01-01T00:00:00Z&end_date=2023-12-31T23:59:59Z" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

## Additional Merchant Tools

### Verify Merchant Identity

Check the verification status of a merchant:

```bash
curl -X GET "https://api.wave.com/v1/merchants/{MERCHANT_ID}/verification" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

### Get Merchant Balance

Retrieve the current available balance for a merchant:

```bash
curl -X GET "https://api.wave.com/v1/merchants/{MERCHANT_ID}/balance" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

### Suspend Merchant Account

Temporarily suspend a merchant's account:

```bash
curl -X POST "https://api.wave.com/v1/merchants/{MERCHANT_ID}/suspend" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json" \
-d '{
  "reason": "Suspected fraudulent activity"
}'
```

### Reactivate Merchant Account

Reactivate a previously suspended merchant account:

```bash
curl -X POST "https://api.wave.com/v1/merchants/{MERCHANT_ID}/reactivate" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

## Webhook Management

### Register Webhook Endpoint

Set up a webhook to receive real-time notifications:

```bash
curl -X POST "https://api.wave.com/v1/webhooks" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json" \
-d '{
  "url": "https://yourwebsite.com/wave/webhook",
  "events": ["payment.success", "payment.failed", "refund.processed"]
}'
```

### List Registered Webhooks

View all registered webhook endpoints:

```bash
curl -X GET "https://api.wave.com/v1/webhooks" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

### Delete Webhook

Remove a registered webhook:

```bash
curl -X DELETE "https://api.wave.com/v1/webhooks/{WEBHOOK_ID}" \
-H "Authorization: Bearer YOUR_WAVE_API_KEY" \
-H "Content-Type: application/json"
```

## Error Handling

When errors occur, Wave API returns an HTTP status code along with a JSON payload containing error details. Common error codes:

- `400`: Bad Request - Invalid parameters or constraints violation
- `401`: Unauthorized - API key is missing or invalid
- `404`: Not Found - The resource requested doesn't exist
- `422`: Unprocessable Entity - The request is valid but cannot be processed
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Something went wrong on Wave's servers

## Important Notes

1. Replace placeholder values like `{MERCHANT_ID}`, `{TRANSACTION_ID}`, etc. with actual IDs from your Wave account
2. All monetary amounts should be specified in the smallest currency unit (e.g., for XOF, 1000 = 1000 CFA francs)
3. Wave API only supports mobile money transactions, not bank accounts
4. Response formats will typically be JSON and include detailed information about the requested operation
5. For security reasons, always protect your API keys and don't expose them in client-side code 