# lomi. SDK

The official Node.js SDK for integrating lomi.'s payment infrastructure.

## Installation

```bash
npm install lomi.
# or
yarn add lomi.
# or
pnpm add lomi.
```

## Quick Start

```typescript
import { CustomersClient, PaymentLinksClient } from 'lomi.';

// Initialize clients
const customers = new CustomersClient('https://api.lomi.africa/v1', 'your_api_key');
const paymentLinks = new PaymentLinksClient('https://api.lomi.africa/v1', 'your_api_key');

// Create a customer
const customer = await customers.create({
  merchant_id: 'your_merchant_id',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  phone: '+221777777777'
});

// Create a payment link
const paymentLink = await paymentLinks.create({
  merchant_id: 'your_merchant_id',
  link_type: 'instant',
  title: 'One-time Payment',
  price: 5000,
  currency_code: 'XOF',
  allowed_providers: ['ORANGE', 'WAVE'],
  success_url: 'https://your-app.com/success'
});
```

## Authentication

The SDK uses API key authentication. You can get your API key from the [lomi. Dashboard](https://lomi.africa/portal/settings/api-keys).

Each client is initialized with your API key:

```typescript
const client = new CustomersClient('https://api.lomi.africa/v1', 'your_api_key');
```

## Available APIs

### Customers API
- Create customers
- List customers
- Get customer details
- Update customer information
- Delete customers

```typescript
// List customers with filters
const customers = await client.list({
  merchant_id: 'your_merchant_id',
  email: 'search@example.com'
});

// Get customer details
const customer = await client.get('customer_id');

// Update customer
await client.patch('customer_id', {
  first_name: 'Jane',
  metadata: { preferred_language: 'fr' }
});
```

### Payment Links API
- Create payment links
- List payment links
- Get payment link details
- Update payment links
- Delete payment links

```typescript
// Create a product payment link
const paymentLink = await paymentLinks.create({
  merchant_id: 'your_merchant_id',
  link_type: 'product',
  product_id: 'your_product_id',
  allowed_providers: ['ORANGE', 'WAVE'],
  success_url: 'https://your-app.com/success'
});
```

### Products API
- Create products
- List products
- Get product details
- Update products
- Delete products

### Subscriptions API
- Create subscription plans
- List subscription plans
- Get plan details
- Update plans
- Delete plans

### Transactions API
- Create transactions
- List transactions

### Refunds API
- Create refunds
- Get refund details
- Update refunds

### Webhooks API
- Register webhook endpoints
- List webhook endpoints
- Get webhook details
- Update webhook configuration
- Delete webhook endpoints

```typescript
// Register a webhook endpoint
const webhook = await webhooks.create({
  merchant_id: 'your_merchant_id',
  url: 'https://your-app.com/webhooks',
  authorized_events: [
    'transaction.completed',
    'refund.completed'
  ]
});
```

### Checkout Sessions API
- Create checkout sessions
- List checkout sessions

### Merchants API
- Get merchant details
- List connected providers

### Providers API
- List available payment providers

## Error Handling

The SDK uses typed error handling:

```typescript
import { ApiError } from 'lomi.';

try {
  await client.create({ /* ... */ });
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error ${error.status}:`, error.body);
  }
}
```

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions:

```typescript
import { CreateCustomer, Customer, ApiResult } from 'lomi.';

const createCustomer = async (data: CreateCustomer): Promise<ApiResult<Customer>> => {
  return await client.create(data);
};
```

## Support

- [Documentation](https://developers.lomi.africa)
- [API Reference](https://developers.lomi.africa/api)
- [Support Email](mailto:hello@lomi.africa)

## License

MIT License - see LICENSE for details 