# lomi. Next.js SDK

Official Next.js SDK for interacting with the lomi. payment processing API.

## Installation

```bash
# Using pnpm
pnpm add @lomi./sdk-next

# Using npm
npm install @lomi./sdk-next

# Using yarn
yarn add @lomi./sdk-next
```

## Configuration

Add your lomi. API key to your `.env.local` file:

```env
LOMI_API_KEY=your_lomi_api_key_here
LOMI_BASE_URL=https://api.lomi.africa/v1  # Optional, defaults to production
```

## Usage

### Server Components (App Router)

```typescript
import { lomiClient } from '@lomi./sdk-next';

export default async function CustomersPage() {
  const customers = await lomiClient.customers.list();
  
  return (
    <div>
      <h1>Customers</h1>
      {customers.data.map((customer) => (
        <div key={customer.id}>
          <p>{customer.name}</p>
          <p>{customer.email}</p>
        </div>
      ))}
    </div>
  );
}
```

### Server Actions

```typescript
'use server';

import { lomiClient } from '@lomi./sdk-next';

export async function createCustomer(formData: FormData) {
  try {
    const customer = await lomiClient.customers.create({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone_number: formData.get('phone') as string,
    });
    
    return { success: true, customer };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### API Routes

```typescript
import { lomiClient } from '@lomi./sdk-next';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const customer = await lomiClient.customers.create(body);
    
    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
```

Refer to the [lomi. API documentation](https://docs.lomi.africa/docs) for details on available services and methods.

## Contributing

Please refer to the main `CONTRIBUTING.md` in the monorepo.

## Support

Contact **hello@lomi.africa** or visit our [support center](https://lomi.africa/support).

## License

This project is licensed under the MIT License.
