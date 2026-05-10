import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { AuthContext } from '../common/decorators/current-user.decorator';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let transactionsService: jest.Mocked<
    Pick<TransactionsService, 'findAll' | 'findOne'>
  >;

  const user = {
    merchantId: 'merch_1',
    organizationId: 'org_1',
    environment: 'test',
  } as AuthContext;

  beforeEach(async () => {
    transactionsService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        { provide: TransactionsService, useValue: transactionsService },
      ],
    })
      .overrideGuard(ApiKeyGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll splits comma-separated filters into arrays', async () => {
    (transactionsService.findAll as jest.Mock).mockResolvedValue([]);

    await controller.findAll(
      user,
      'WAVE',
      'completed,pending',
      'payment,refund',
      'XOF,USD',
      'MOBILE_MONEY,CARDS',
      3,
      10,
      '2024-01-01T00:00:00Z',
      '2024-02-01T00:00:00Z',
      false,
    );

    expect(transactionsService.findAll).toHaveBeenCalledWith(
      user,
      'WAVE',
      ['completed', 'pending'],
      ['payment', 'refund'],
      ['XOF', 'USD'],
      ['MOBILE_MONEY', 'CARDS'],
      3,
      10,
      '2024-01-01T00:00:00Z',
      '2024-02-01T00:00:00Z',
      false,
    );
  });

  it('findAll passes undefined arrays when filters omitted', async () => {
    (transactionsService.findAll as jest.Mock).mockResolvedValue([]);
    await controller.findAll(user);
    // Parse*Pipe/DefaultValuePipe only apply at the HTTP boundary; direct calls
    // forward undefined page/pageSize and the service applies its own defaults.
    expect(transactionsService.findAll).toHaveBeenCalledWith(
      user,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );
  });

  it('findOne delegates to service', async () => {
    transactionsService.findOne.mockResolvedValue({
      transaction_id: 't1',
    } as any);
    const result = await controller.findOne('t1', user);
    expect(transactionsService.findOne).toHaveBeenCalledWith('t1', user);
    expect(result.transaction_id).toBe('t1');
  });
});
