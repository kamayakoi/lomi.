import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutSessionsService } from './checkout-sessions.service';
import { SupabaseService } from '../../utils/supabase/supabase.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { AuthContext } from '../common/decorators/current-user.decorator';

describe('CheckoutSessionsService', () => {
  let service: CheckoutSessionsService;
  let mockSupabaseService: { getClient: jest.Mock; rpc: jest.Mock };
  let mockSupabaseClient: { rpc: jest.Mock };

  const mockUser = {
    merchantId: 'test-merchant-id',
    organizationId: 'test-org-id',
    environment: 'test-env',
  };

  beforeEach(async () => {
    mockSupabaseClient = {
      rpc: jest
        .fn()
        .mockResolvedValue({ data: null, error: { message: 'not found' } }),
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

  it('forwards idempotency fields to create_checkout_session RPC', async () => {
    const createDto: CreateCheckoutSessionDto = {
      amount: 1000,
      currency_code: 'XOF',
    } as CreateCheckoutSessionDto;

    mockSupabaseService.rpc.mockResolvedValue({
      data: { checkout_session_id: 'x' },
      error: null,
    });

    await service.create(createDto, mockUser as AuthContext, {
      key: 'idem-1',
      bodyHash: 'abc',
    });

    expect(mockSupabaseService.rpc).toHaveBeenCalledWith(
      'create_checkout_session',
      expect.objectContaining({
        p_idempotency_key: 'idem-1',
        p_idempotency_body_hash: 'abc',
      }),
    );
  });

  it('maps idempotency_key_conflict from RPC to ConflictException', async () => {
    const createDto: CreateCheckoutSessionDto = {
      amount: 1000,
      currency_code: 'XOF',
    } as CreateCheckoutSessionDto;

    mockSupabaseService.rpc.mockResolvedValue({
      data: null,
      error: { message: 'idempotency_key_conflict' },
    });

    await expect(
      service.create(createDto, mockUser as AuthContext, {
        key: 'idem-1',
        bodyHash: 'abc',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
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

  it('should pass status filter to list_checkout_sessions', async () => {
    mockSupabaseService.rpc.mockResolvedValue({ data: [], error: null });

    await service.findAll(mockUser as AuthContext, 'open', 10, 5);

    expect(mockSupabaseService.rpc).toHaveBeenCalledWith(
      'list_checkout_sessions',
      {
        p_merchant_id: mockUser.merchantId,
        p_status: 'open',
        p_limit: 10,
        p_offset: 5,
      },
    );
  });

  it('should create multi-product checkout via create_checkout_session_with_line_items', async () => {
    const lineItems = [
      { price_id: '11111111-1111-1111-1111-111111111111', quantity: 2 },
    ];
    const createDto: CreateCheckoutSessionDto = {
      currency_code: 'XOF',
      line_items: lineItems,
    } as CreateCheckoutSessionDto;

    const expectedResponse = {
      checkout_session_id: 'cart_session_1',
      checkout_url: 'https://checkout.lomi.africa/checkout/cart_session_1',
      amount: 2000,
      currency_code: 'XOF',
    };

    mockSupabaseService.rpc.mockResolvedValue({
      data: expectedResponse,
      error: null,
    });

    const result = await service.create(createDto, mockUser as AuthContext);

    expect(result).toEqual(expectedResponse);
    expect(mockSupabaseService.rpc).toHaveBeenCalledWith(
      'create_checkout_session_with_line_items',
      expect.objectContaining({
        p_organization_id: mockUser.organizationId,
        p_created_by: mockUser.merchantId,
        p_currency_code: createDto.currency_code,
        p_line_items: createDto.line_items,
        p_environment: mockUser.environment,
      }),
    );
  });

  it('maps line_items_recurring_not_supported RPC error to BadRequestException', async () => {
    mockSupabaseService.rpc.mockResolvedValue({
      data: null,
      error: { message: 'line_items_recurring_not_supported' },
    });

    await expect(
      service.create(
        {
          currency_code: 'XOF',
          line_items: [
            { price_id: '11111111-1111-1111-1111-111111111111', quantity: 1 },
          ],
        } as CreateCheckoutSessionDto,
        mockUser as AuthContext,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('maps line_items_pwyw_not_supported RPC error to BadRequestException', async () => {
    mockSupabaseService.rpc.mockResolvedValue({
      data: null,
      error: { message: 'line_items_pwyw_not_supported' },
    });

    await expect(
      service.create(
        {
          currency_code: 'XOF',
          line_items: [
            { price_id: '22222222-2222-2222-2222-222222222222', quantity: 1 },
          ],
        } as CreateCheckoutSessionDto,
        mockUser as AuthContext,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should findOne return row when scoped to organization', async () => {
    const row = {
      checkout_session_id: 'cs-1',
      organization_id: mockUser.organizationId,
      amount: 100,
    };
    mockSupabaseClient.rpc.mockResolvedValue({
      data: [row],
      error: null,
    });

    const result = await service.findOne('cs-1', mockUser as AuthContext);

    expect(result).toEqual(row);
    expect(mockSupabaseClient.rpc).toHaveBeenCalledWith(
      'get_checkout_session_api',
      {
        p_checkout_session_id: 'cs-1',
        p_organization_id: mockUser.organizationId,
      },
    );
  });

  it('should findOne throw NotFoundException when missing or wrong org', async () => {
    mockSupabaseClient.rpc.mockResolvedValue({
      data: [],
      error: null,
    });

    await expect(
      service.findOne('missing', mockUser as AuthContext),
    ).rejects.toThrow(NotFoundException);
  });
});
