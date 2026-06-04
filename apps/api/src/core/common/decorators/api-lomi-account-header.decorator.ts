import { ApiHeader } from '@nestjs/swagger';

export function ApiLomiAccountHeader() {
  return ApiHeader({
    name: 'Lomi-Account',
    required: false,
    description:
      'Optional lomi. Network account id (`acct_...`). When present, the API key acts as the Operator and the request targets the connected Member Account.',
    schema: {
      type: 'string',
      example: 'acct_1234567890',
    },
  });
}
