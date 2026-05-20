import { ForbiddenException } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import type { AuthContext } from '../common/decorators/current-user.decorator';

describe('MerchantsService', () => {
  const user: AuthContext = {
    merchantId: '904d003c-3736-41d4-90a5-9de74d404fd7',
    organizationId: '0979ec77-9fb1-4c9a-8c55-d7fb6c182c9c',
    environment: 'live',
  };

  it('denies access when merchant id does not match API key', async () => {
    const service = new MerchantsService({} as never);
    await expect(
      service.getDetails('00000000-0000-0000-0000-000000000001', user),
    ).rejects.toThrow(ForbiddenException);
  });
});
