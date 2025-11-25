# lomi. SDKs

Official SDKs for the [lomi.](https://lomi.africa) payments API.

We provide SDKs for multiple languages and frameworks to help you integrate with the lomi. API quickly and easily.

| Language/Framework | Package | Installation | Directory |
|-------------------|---------|--------------|-----------|
| **TypeScript** | `@lomi./sdk` | `npm install @lomi./sdk` | [`ts/`](./ts) |
| **JavaScript** | `@lomi./sdk-js` | `npm install @lomi./sdk-js` | [`js/`](./js) |
| **Next.js** | `@lomi./sdk-next` | `npm install @lomi./sdk-next` | [`nextjs/`](./nextjs) |
| **Python** | `lomi-sdk` | `pip install lomi-sdk` | [`python/`](./python) |
| **Go** | `github.com/lomiafrica/lomi-go-sdk` | `go get github.com/lomiafrica/lomi-go-sdk` | [`go/`](./go) |

### PHP SDK

Due to our monorepo structure, the PHP SDK are **not available on Packagist**. You can install them directly from this GitHub repository.

Add the following to your project's `composer.json`:

```json
{
  "repositories": [
    {
      "type": "vcs",
      "url": "https://github.com/lomiafrica/lomi./"
    }
  ],
  "require": {
    "lomi/lomi-sdk": "dev-main#apps/sdks/php"
  }
}
```

Then run:
```bash
composer install
```

**Directory:** [`php/`](./php)

## Quick Start

Each SDK directory contains its own README with specific usage examples and documentation. Here's a quick overview:

### TypeScript
```typescript
import { LomiClient } from '@lomi./sdk';

const client = new LomiClient({
  apiKey: 'your-api-key'
});
```

### JavaScript
```javascript
import { LomiClient } from '@lomi./sdk-js';

const client = new LomiClient({
  apiKey: 'your-api-key'
});
```

### Next.js
```typescript
import { LomiClient } from '@lomi./sdk-next';

const client = new LomiClient({
  apiKey: 'your-api-key'
});
``` 

### Python
```python
from lomi import LomiClient

client = LomiClient(api_key='your-api-key')
```

### Go
```go
import "github.com/lomiafrica/lomi-go-sdk"

client := lomi.NewClient("your-api-key")
```

### PHP
```php
use LomiSDK\Client;

$client = new Client('your-api-key');
```

## Documentation

For comprehensive API documentation and guides, visit [docs.lomi.africa](https://docs.lomi.africa)

## License

MIT - see [LICENSE](./LICENSE) for details.

## Support

- **Email:** hello@lomi.africa
- **Docs:** https://lomi.africa/docs/
- **Discord:** https://discord.gg/yb4FnBmh