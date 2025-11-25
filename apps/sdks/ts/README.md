# lomi. TypeScript SDK

Official Node.js SDK for interacting with the lomi. payment processing API.

## Installation

```bash
# Using pnpm
pnpm add @lomi./sdk

# Using npm
npm install @lomi./sdk

# Using yarn
yarn add @lomi./sdk
```

## Usage

Import the OpenAPI client and configure it with your API key. Then access the different API services.

```typescript
import { OpenAPI, CustomersService, CreateCustomer, type Customer } from '@lomi./sdk';

// Configure your API key (obtainable from your lomi. dashboard)
OpenAPI.HEADERS = {
  'X-API-KEY': 'YOUR_LOMI_API_KEY',
};

// Optionally configure the base URL if not using the default production URL
// OpenAPI.BASE = 'https://sandbox.api.lomi.africa/v1';

async function createNewCustomer() {
  try {
    const customerData: CreateCustomer = {
      name: 'Test customer',
      email: 'customer@example.com',
      phone_number: '+225021234567',
    };

    const newCustomer: Customer = await CustomersService.createCustomer(customerData);
    console.log('Customer created:', newCustomer);

  } catch (error) {
    console.error('Error creating customer:', error);
  }
}

createNewCustomer();
```

Refer to the `src/generated/services` directory and the [lomi. API documentation](https://docs.lomi.africa/docs) for details on available services and methods.

## Contributing

Please refer to the main `CONTRIBUTING.md` in the monorepo.

## Support

Contact **hello@lomi.africa** or visit our [support center](https://lomi.africa/support).

## License

This project is licensed under the MIT License.
