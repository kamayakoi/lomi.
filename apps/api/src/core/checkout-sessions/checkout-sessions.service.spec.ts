import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutSessionsService } from './checkout-sessions.service';
import { SupabaseService } from '../../utils/supabase/supabase.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { AuthContext } from '../common/decorators/current-user.decorator';
describe('CheckoutSessionsService', () => {
  let service: CheckoutSessionsService;
  let mockSupabaseService: { getClient: jest.Mock; rpc: jest.Mock };
  let mockSupabaseClient: { from: jest.Mock };

  const mockUser = {
    merchantId: 'test-merchant-id',
    organizationId: 'test-org-id',
    environment: 'test-env',
  };

  beforeEach(async () => {
    mockSupabaseClient = {
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
          eq: jest.fn(() => ({ single: jest.fn() })),
        })),
        insert: jest.fn(() => ({
          select: jest.fn(() => ({ single: jest.fn() })),
        })),
      })),
    };

    mockSupabaseService = {
      getClient: jest.fn(() => mockSupabaseClient),
      rpc: jest.fn().mockResolvedValue({ data: null, error: null }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckoutSessionsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<CheckoutSessionsService>(CheckoutSessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a checkout session with correct environment and context', async () => {
    const createDto: CreateCheckoutSessionDto = {
      amount: 1000,
      currency_code: 'XOF',
    } as CreateCheckoutSessionDto;
    const expectedResponse = {
      ...createDto,
      checkout_session_id: 'session_123',
      checkout_url: 'https://checkout.lomi.africa/checkout/session_123',
    };

    mockSupabaseService.rpc.mockResolvedValue({
      data: expectedResponse,
      error: null,
    });

    const result = await service.create(createDto, mockUser as AuthContext);

    expect(result).toEqual(expectedResponse);
    expect(mockSupabaseService.rpc).toHaveBeenCalledWith(
      'create_checkout_session',
      expect.objectContaining({
        p_organization_id: mockUser.organizationId,
        p_environment: mockUser.environment,
        p_created_by: mockUser.merchantId,
        p_amount: createDto.amount,
        p_currency_code: createDto.currency_code,
      }),
    );
  });

  it('should findAll checkout sessions using RPC', async () => {
    const expectedResponse = [{ id: 'session_123' }];

    mockSupabaseService.rpc.mockResolvedValue({
      data: expectedResponse,
      error: null,
    });

    const result = await service.findAll(mockUser as AuthContext);

    expect(result).toEqual(expectedResponse);
    expect(mockSupabaseService.rpc).toHaveBeenCalledWith(
      'list_checkout_sessions',
      {
        p_merchant_id: mockUser.merchantId,
        p_status: null,
        p_limit: 20,
        p_offset: 0,
      },
    );
  });
});
