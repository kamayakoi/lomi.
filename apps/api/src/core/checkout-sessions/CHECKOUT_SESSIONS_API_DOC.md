# Checkout Sessions API

The Checkout Sessions API allows you to create hosted payment pages for your customers. Checkout sessions provide a secure, pre-built payment experience that handles the entire payment flow, from collecting payment information to processing the transaction.

## Overview

A checkout session is a temporary, hosted payment page that:
- Expires after 60 minutes (default)
- Can be used for one-time or recurring payments
- Supports discount codes and quantity selection
- Handles payment processing securely
- Redirects customers after completion or cancellation

## Features

- ✅ **Create Checkout Session** - Generate hosted payment pages
- ✅ **List Checkout Sessions** - View all sessions with filtering
- ✅ **Get Checkout Session** - Fetch specific session details
- ✅ **Status Filtering** - Filter by open, completed, or expired
- ✅ **Pagination** - Handle large lists efficiently
- ❌ **Update Session** - Not available (sessions are immutable)
- ❌ **Delete Session** - Not available (sessions expire automatically)

---

## Endpoints

### 1. Create Checkout Session

```
POST /checkout-sessions
```

Creates a new hosted payment page for customers to complete their purchase.

**Request Body:**
```json
{
  "amount": 10000.0,
  "currency_code": "XOF",
  "title": "Premium Subscription",
  "description": "Monthly subscription to premium features",
  "customer_email": "john@example.com",
  "customer_name": "John Doe",
  "customer_phone": "+221771234567",
  "product_id": "123e4567-e89b-12d3-a456-426614174000",
  "price_id": "321e4567-e89b-12d3-a456-426614174000",
  "allow_quantity": false,
  "quantity": 1,
  "success_url": "https://example.com/success",
  "cancel_url": "https://example.com/cancel",
  "allow_coupon_code": true,
  "require_billing_address": true,
  "metadata": {
    "order_id": "ORDER-12345"
  }
}
```

**Response:**
```json
{
  "checkout_session_id": "987e6543-e89b-12d3-a456-426614174000",
  "organization_id": "789e0123-e89b-12d3-a456-426614174000",
  "amount": 10000.0,
  "currency_code": "XOF",
  "status": "open",
  "title": "Premium Subscription",
  "description": "Monthly subscription to premium features",
  "customer_id": null,
  "customer_email": "john@example.com",
  "customer_name": "John Doe",
  "customer_phone": "+221771234567",
  "product_id": "123e4567-e89b-12d3-a456-426614174000",
  "price_id": "321e4567-e89b-12d3-a456-426614174000",
  "subscription_id": null,
  "allow_quantity": false,
  "quantity": 1,
  "success_url": "https://example.com/success",
  "cancel_url": "https://example.com/cancel",
  "allow_coupon_code": true,
  "require_billing_address": true,
  "payment_link_id": null,
  "expires_at": "2024-01-15T11:30:00Z",
  "metadata": {
    "order_id": "ORDER-12345"
  },
  "environment": "live",
  "created_at": "2024-01-15T10:30:00Z",
  "created_by": "456e7890-e89b-12d3-a456-426614174000",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**RPC Function Used:** `create_checkout_session(...)`

**Important Notes:**
- Sessions expire after 60 minutes by default
- Either `customer_id` OR `customer_email` is required
- `success_url` and `cancel_url` are optional but recommended
- For product purchases, include `product_id` and optionally `price_id`

---

### 2. List Checkout Sessions

```
GET /checkout-sessions
```

Retrieves all checkout sessions for your organization with pagination and filtering.

**Query Parameters:**
- `status` (optional): Filter by session status (`open`, `completed`, `expired`)
- `limit` (optional): Number of results to return (default: 20)
- `offset` (optional): Offset for pagination (default: 0)

**Response:**
```json
[
  {
    "checkout_session_id": "987e6543-e89b-12d3-a456-426614174000",
    "organization_id": "789e0123-e89b-12d3-a456-426614174000",
    "amount": 10000.0,
    "currency_code": "XOF",
    "status": "completed",
    "title": "Premium Subscription",
    "description": "Monthly subscription to premium features",
    "customer_id": "123e4567-e89b-12d3-a456-426614174000",
    "customer_email": "john@example.com",
    "expires_at": "2024-01-15T11:30:00Z",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:45:00Z"
  }
]
```

**RPC Function Used:** `list_checkout_sessions(p_merchant_id, p_status, p_limit, p_offset)`

---

### 3. Get Checkout Session

```
GET /checkout-sessions/:id
```

Retrieves detailed information about a specific checkout session.

**Parameters:**
- `id`: Checkout session UUID

**Response:**
```json
{
  "checkout_session_id": "987e6543-e89b-12d3-a456-426614174000",
  "organization_id": "789e0123-e89b-12d3-a456-426614174000",
  "amount": 10000.0,
  "currency_code": "XOF",
  "status": "open",
  "title": "Premium Subscription",
  "description": "Monthly subscription to premium features",
  "customer_id": null,
  "customer_email": "john@example.com",
  "customer_name": "John Doe",
  "customer_phone": "+221771234567",
  "product_id": "123e4567-e89b-12d3-a456-426614174000",
  "price_id": "321e4567-e89b-12d3-a456-426614174000",
  "subscription_id": null,
  "allow_quantity": false,
  "quantity": 1,
  "success_url": "https://example.com/success",
  "cancel_url": "https://example.com/cancel",
  "allow_coupon_code": true,
  "require_billing_address": true,
  "payment_link_id": null,
  "is_spi": false,
  "is_pos": false,
  "expires_at": "2024-01-15T11:30:00Z",
  "metadata": {
    "order_id": "ORDER-12345"
  },
  "environment": "live",
  "created_at": "2024-01-15T10:30:00Z",
  "created_by": "456e7890-e89b-12d3-a456-426614174000",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

## Authentication

All endpoints require API key authentication via the `x-api-key` header.

```bash
curl -H "x-api-key: your-api-key" https://api.lomi.africa/checkout-sessions
```

---

## Checkout Session Statuses

### open
The session is active and awaiting payment. The checkout page is accessible to the customer.

### completed
The customer completed the payment successfully. The transaction has been processed.

### expired
The session expired (60 minutes) without payment. The checkout page is no longer accessible.

---

## Use Cases

### Simple One-Time Payment

```typescript
const session = await api.checkoutSessions.create({
  amount: 5000,
  currency_code: 'XOF',
  title: 'Coffee Beans - 1kg',
  customer_email: 'customer@example.com',
  success_url: 'https://mystore.com/thank-you',
  cancel_url: 'https://mystore.com/cart'
});

// Redirect customer to: session.url
```

### Product Purchase with Multiple Prices

```typescript
const session = await api.checkoutSessions.create({
  product_id: 'premium-plan-id',
  price_id: 'monthly-price-id', // Or yearly-price-id
  customer_email: 'customer@example.com',
  success_url: 'https://myapp.com/dashboard',
  allow_coupon_code: true
});
```

### Subscription Renewal

```typescript
const session = await api.checkoutSessions.create({
  subscription_id: 'existing-subscription-id',
  customer_id: 'customer-id',
  success_url: 'https://myapp.com/subscription-renewed'
});
```

### Custom Amount (No Product)

```typescript
const session = await api.checkoutSessions.create({
  amount: 15000,
  currency_code: 'XOF',
  title: 'Consultation Fee',
  description: '1 hour consultation',
  customer_name: 'John Doe',
  customer_email: 'john@example.com',
  customer_phone: '+221771234567'
});
```

---

## Example Usage

### TypeScript/JavaScript

```typescript
import axios from 'axios';

const apiKey = 'your-api-key';
const baseURL = 'https://api.lomi.africa';

// Create checkout session
const createCheckoutSession = async () => {
  const response = await axios.post(`${baseURL}/checkout-sessions`, {
    amount: 10000,
    currency_code: 'XOF',
    title: 'Premium Plan',
    customer_email: 'customer@example.com',
    product_id: 'product-id',
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
    allow_coupon_code: true
  }, {
    headers: { 'x-api-key': apiKey }
  });
  
  return response.data;
};

// List checkout sessions
const listCheckoutSessions = async (status?: string) => {
  const response = await axios.get(`${baseURL}/checkout-sessions`, {
    headers: { 'x-api-key': apiKey },
    params: {
      status,
      limit: 20,
      offset: 0
    }
  });
  
  return response.data;
};

// Get a checkout session
const getCheckoutSession = async (sessionId: string) => {
  const response = await axios.get(`${baseURL}/checkout-sessions/${sessionId}`, {
    headers: { 'x-api-key': apiKey }
  });
  
  return response.data;
};
```

### cURL

```bash
# Create checkout session
curl -X POST -H "x-api-key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10000,
    "currency_code": "XOF",
    "title": "Premium Plan",
    "customer_email": "customer@example.com",
    "success_url": "https://example.com/success"
  }' \
  "https://api.lomi.africa/checkout-sessions"

# List checkout sessions
curl -H "x-api-key: your-api-key" \
  "https://api.lomi.africa/checkout-sessions?status=open&limit=20"

# Get a checkout session
curl -H "x-api-key: your-api-key" \
  "https://api.lomi.africa/checkout-sessions/987e6543-e89b-12d3-a456-426614174000"
```

### Python

```python
import requests

api_key = 'your-api-key'
base_url = 'https://api.lomi.africa'
headers = {'x-api-key': api_key}

# Create checkout session
def create_checkout_session():
    payload = {
        'amount': 10000,
        'currency_code': 'XOF',
        'title': 'Premium Plan',
        'customer_email': 'customer@example.com',
        'success_url': 'https://example.com/success',
        'cancel_url': 'https://example.com/cancel'
    }
    
    response = requests.post(
        f'{base_url}/checkout-sessions',
        headers=headers,
        json=payload
    )
    return response.json()

# List checkout sessions
def list_checkout_sessions(status=None, limit=20, offset=0):
    params = {'limit': limit, 'offset': offset}
    if status:
        params['status'] = status
    
    response = requests.get(
        f'{base_url}/checkout-sessions',
        headers=headers,
        params=params
    )
    return response.json()

# Get a checkout session
def get_checkout_session(session_id):
    response = requests.get(
        f'{base_url}/checkout-sessions/{session_id}',
        headers=headers
    )
    return response.json()
```

---

## Error Handling

### Common Errors

#### 400 Bad Request
**Cause:** Invalid input or validation error

```json
{
  "statusCode": 400,
  "message": "Either customer_id or customer_email is required"
}
```

**Solutions:**
- Verify all required fields are provided
- Check that amount is positive
- Ensure quantity is greater than 0
- Validate currency_code is supported

#### 401 Unauthorized
**Cause:** Invalid or missing API key

```json
{
  "statusCode": 401,
  "message": "Invalid API key"
}
```

**Solution:** Verify your API key is correct and included in the `x-api-key` header.

#### 404 Not Found
**Cause:** Checkout session doesn't exist or doesn't belong to your organization

```json
{
  "statusCode": 404,
  "message": "Checkout session with ID 987e6543-e89b-12d3-a456-426614174000 not found or access denied"
}
```

**Solution:** Verify the checkout session ID is correct and belongs to your organization.

---

## Best Practices

### Creating Checkout Sessions

1. **Always Provide Success/Cancel URLs**: Improves user experience
2. **Include Product Details**: Use `product_id` when selling products
3. **Set Appropriate Title/Description**: Helps customers understand what they're buying
4. **Use Metadata**: Store order IDs or other tracking information
5. **Enable Coupon Codes**: When appropriate for promotions

### Handling Session Expiration

1. **60 Minute Limit**: Sessions expire automatically
2. **Create New Session**: If customer returns after expiration
3. **Don't Reuse Sessions**: Each purchase needs a fresh session
4. **Monitor Status**: Check session status before processing

### Security

1. **API Key Management**: Rotate API keys regularly
2. **HTTPS Only**: Always use HTTPS for API calls
3. **Validate Webhooks**: Verify webhook signatures for payment events
4. **Server-Side Creation**: Never create sessions from client-side code
5. **Environment Separation**: Use test mode for development

### Monitoring

1. **Track Conversion**: Monitor open → completed conversion rate
2. **Identify Dropoffs**: High expiration rate may indicate UX issues
3. **Analyze Cancellations**: Understand why customers cancel
4. **Set Up Alerts**: Get notified of failed session creations

---

## Integration Patterns

### E-commerce Checkout Flow

```typescript
// 1. Customer clicks "Checkout" on your site
const cart = getCartItems();

// 2. Calculate total
const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

// 3. Create checkout session
const session = await api.checkoutSessions.create({
  amount: total,
  currency_code: 'XOF',
  title: `Order #${orderId}`,
  customer_email: customer.email,
  customer_name: customer.name,
  success_url: `https://mystore.com/orders/${orderId}/success`,
  cancel_url: `https://mystore.com/cart`,
  metadata: {
    order_id: orderId,
    cart_items: JSON.stringify(cart)
  }
});

// 4. Redirect customer to session.url
window.location.href = session.url;
```

### Subscription Signup

```typescript
// 1. Customer selects a plan
const plan = getSelectedPlan();

// 2. Create checkout session with product
const session = await api.checkoutSessions.create({
  product_id: plan.product_id,
  price_id: plan.price_id,
  customer_email: customer.email,
  success_url: `https://myapp.com/welcome`,
  cancel_url: `https://myapp.com/pricing`,
  allow_coupon_code: true
});

// 3. Redirect to checkout
window.location.href = session.url;
```

### Pay What You Want

```typescript
// 1. Customer enters custom amount
const amount = parseFloat(customerInput);

// 2. Validate minimum
if (amount < minimumAmount) {
  throw new Error(`Minimum amount is ${minimumAmount}`);
}

// 3. Create session
const session = await api.checkoutSessions.create({
  amount: amount * 100, // Convert to cents
  currency_code: 'XOF',
  title: 'Support Us',
  description: 'Thank you for your support!',
  customer_email: customer.email,
  success_url: 'https://mysite.com/thank-you'
});
```

---

## Webhooks

**Merchant webhooks** (URLs you register on `GET/POST /webhooks`) use the `webhook_event` enum (for example `PAYMENT_SUCCEEDED`, `PAYMENT_FAILED`). After a successful checkout, lomi. typically emits **`PAYMENT_SUCCEEDED`** with transaction payload data—see `WebhookSenderService` in the API repo.

**Provider ingress** (e.g. `POST /webhooks/wave`) uses Stripe-style type strings such as `checkout.session.completed` internally; those are **not** valid values for `authorized_events` on your endpoint.

Use **`PAYMENT_SUCCEEDED`** / **`PAYMENT_FAILED`** to react to payment outcomes; poll **`GET /checkout-sessions/{id}`** or filter by `status` for session lifecycle (`open`, `completed`, `expired`).

---

## Limitations

### Session Expiration
- Checkout sessions expire after 60 minutes
- Cannot extend expiration time
- Create a new session if customer returns

### Immutability
- Cannot update session after creation
- Cannot delete sessions (they expire automatically)
- Create a new session for changes

### Quantity Limits
- Quantity must be greater than 0
- Maximum quantity depends on product inventory

---

## Support

For questions or issues with the Checkout Sessions API:
- 📧 Email: support@lomi.africa
- 📖 Documentation: https://docs.lomi.africa
- 🐛 Bug Reports: https://github.com/lomi/api/issues

