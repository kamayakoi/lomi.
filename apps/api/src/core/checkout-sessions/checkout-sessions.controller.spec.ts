import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutSessionsController } from './checkout-sessions.controller';
import { CheckoutSessionsService } from './checkout-sessions.service';

import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { AuthContext } from '../common/decorators/current-user.decorator';

describe('CheckoutSessionsController', () => {
  let controller: CheckoutSessionsController;
  let service: jest.Mocked<
    Pick<CheckoutSessionsService, 'create' | 'findAll' | 'findOne'>
  >;

  const user = {
    merchantId: 'merch_1',
    organizationId: 'org_1',
    environment: 'test',
  } as AuthContext;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckoutSessionsController],
      providers: [
        {
          provide: CheckoutSessionsService,
          useValue: service,
        },
      ],
    })
      .overrideGuard(ApiKeyGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CheckoutSessionsController>(
      CheckoutSessionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create delegates to service', async () => {
    const dto = {
      amount: 1000,
      currency_code: 'XOF',
    } as CreateCheckoutSessionDto;
    service.create.mockResolvedValue({ checkout_session_id: 'cs_1' } as any);

    const result = await controller.create(dto, user);

    expect(service.create).toHaveBeenCalledWith(dto, user);
    expect(result.checkout_session_id).toBe('cs_1');
  });

  it('findAll forwards status + pagination to service', async () => {
    service.findAll.mockResolvedValue([] as any);
    await controller.findAll(user, 'open', 10, 5);
    expect(service.findAll).toHaveBeenCalledWith(user, 'open', 10, 5);
  });

  it('findOne delegates to service', async () => {
    service.findOne.mockResolvedValue({ checkout_session_id: 'cs_1' } as any);
    const result = await controller.findOne('cs_1', user);
    expect(service.findOne).toHaveBeenCalledWith('cs_1', user);
    expect(result.checkout_session_id).toBe('cs_1');
  });
});
