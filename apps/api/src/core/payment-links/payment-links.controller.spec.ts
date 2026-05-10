import { Test, TestingModule } from '@nestjs/testing';
import { PaymentLinksController } from './payment-links.controller';
import { PaymentLinksService } from './payment-links.service';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { CreatePaymentLinkDto } from './dto/create-payment-link.dto';
import { AuthContext } from '../common/decorators/current-user.decorator';

describe('PaymentLinksController', () => {
  let controller: PaymentLinksController;
  let service: jest.Mocked<
    Pick<PaymentLinksService, 'create' | 'findAll' | 'findOne'>
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
      controllers: [PaymentLinksController],
      providers: [{ provide: PaymentLinksService, useValue: service }],
    })
      .overrideGuard(ApiKeyGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(PaymentLinksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create delegates to service', async () => {
    const dto = {
      link_type: 'instant',
      title: 'T',
      currency_code: 'XOF',
      amount: 1,
    } as CreatePaymentLinkDto;
    service.create.mockResolvedValue({ link_id: 'l1' } as any);

    const result = (await controller.create(dto, user)) as { link_id: string };

    expect(service.create).toHaveBeenCalledWith(dto, user);
    expect(result.link_id).toBe('l1');
  });

  it('parses isActive query string semantics', async () => {
    service.findAll.mockResolvedValue({
      data: [],
      total: 0,
      limit: 20,
      offset: 0,
    });

    await controller.findAll(user, undefined, 'true', 20, 0);
    expect(service.findAll).toHaveBeenCalledWith(user, undefined, true, 20, 0);

    await controller.findAll(user, undefined, 'false', 20, 0);
    expect(service.findAll).toHaveBeenCalledWith(user, undefined, false, 20, 0);

    await controller.findAll(user, undefined, undefined, 20, 0);
    expect(service.findAll).toHaveBeenCalledWith(
      user,
      undefined,
      undefined,
      20,
      0,
    );
  });

  it('findOne delegates to service', async () => {
    service.findOne.mockResolvedValue({ link_id: 'l1' } as any);
    const result = (await controller.findOne('l1', user)) as { link_id: string };
    expect(service.findOne).toHaveBeenCalledWith('l1', user);
    expect(result.link_id).toBe('l1');
  });
});
