import { Test, TestingModule } from '@nestjs/testing';
import { PaymentIntentsController } from './payment-intents.controller';
import { PaymentIntentsService } from './payment-intents.service';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { AuthContext } from '../common/decorators/current-user.decorator';

describe('PaymentIntentsController', () => {
  let controller: PaymentIntentsController;
  let service: jest.Mocked<Pick<PaymentIntentsService, 'create'>>;

  const user = {
    merchantId: 'merch_1',
    organizationId: 'org_1',
    environment: 'test',
  } as AuthContext;

  beforeEach(async () => {
    service = { create: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentIntentsController],
      providers: [{ provide: PaymentIntentsService, useValue: service }],
    })
      .overrideGuard(ApiKeyGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(PaymentIntentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create delegates to service with DTO and auth context', async () => {
    const dto = {
      amount: 1000,
      currency_code: 'XOF',
      customer_email: 't@example.com',
      customer_name: 'T User',
    } as CreatePaymentIntentDto;

    service.create.mockResolvedValue({
      success: true,
      data: { client_secret: 'sec' },
    } as any);

    const result = await controller.create(dto, user);

    expect(service.create).toHaveBeenCalledWith(dto, user);
    expect(result.success).toBe(true);
    expect((result as any).data.client_secret).toBe('sec');
  });
});
