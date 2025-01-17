# Lomi Payment SDK

The Lomi Payment SDK provides a simple way to integrate Lomi's payment services into your application.

## Features

- Granular payment provider selection
- Product and subscription management
- Checkout session creation
- Transaction handling
- TypeScript support with full type definitions

## Installation

```bash
npm install @lomi/sdk
```

## Quick Start

```typescript
import { LomiClient } from '@lomi/sdk';

// Initialize the client with your API key
const client = new LomiClient({
  apiKey: 'your-api-key',
  environment: 'production' // or 'sandbox'
});

// Create a checkout session
const session = await client.checkout.createSession({
  merchant_id: 'your-merchant-id',
  product_id: 'your-product-id',
  provider_codes: ['ORANGE', 'WAVE'], // Specify which payment providers to enable
  success_url: 'https://your-site.com/success',
  cancel_url: 'https://your-site.com/cancel'
});

// Redirect to the checkout page
window.location.href = session.url;
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Generate TypeScript types from OpenAPI spec:
```bash
npm run generate:types
```

3. Generate API client:
```bash
npm run generate:client
```

4. Build the SDK:
```bash
npm run build
```

5. Run tests:
```bash
npm test
```

## Documentation

For detailed API documentation, please visit [https://docs.lomi.africa](https://docs.lomi.africa).

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 