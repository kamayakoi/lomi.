import { Test, TestingModule } from '@nestjs/testing';
import { MerchantsController } from './merchants.controller';
import { MerchantsService } from './merchants.service';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import type { AuthContext } from '../common/decorators/current-user.decorator';

describe('MerchantsController', () => {
  let controller: MerchantsController;
  let service: MerchantsService;

  const user: AuthContext = {
    merchantId: 'merchant-uuid',
    organizationId: 'org-uuid',
    environment: 'live',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantsController],
      providers: [
        {
          provide: MerchantsService,
          useValue: {
            getDetails: jest.fn(),
            getMrr: jest.fn(),
            getArr: jest.fn(),
            getBalance: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(ApiKeyGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(MerchantsController);
    service = module.get(MerchantsService);
  });

  it('delegates getDetails to service', async () => {
    const payload = {
      success: true as const,
      data: { merchant_id: user.merchantId },
    };
    jest.spyOn(service, 'getDetails').mockResolvedValue(payload);

    await expect(controller.getDetails(user.merchantId, user)).resolves.toEqual(
      payload,
    );
  });
});
