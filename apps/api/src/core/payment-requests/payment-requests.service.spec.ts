import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PaymentRequestsService } from './payment-requests.service';
import { SupabaseService } from '../../utils/supabase/supabase.service';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { AuthContext } from '../common/decorators/current-user.decorator';

describe('PaymentRequestsService', () => {
  let service: PaymentRequestsService;
  let mockClientRpc: jest.Mock;
  let mockFromChain: { single: jest.Mock };

  const user: AuthContext = {
    merchantId: 'merch_1',
    organizationId: 'org_1',
    environment: 'test',
  } as AuthContext;

  beforeEach(async () => {
    mockClientRpc = jest.fn();
    mockFromChain = {
      single: jest.fn(),
    };

    const mockSupabase = {
      getClient: jest.fn(() => ({
        rpc: mockClientRpc,
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              eq: jest.fn(() => mockFromChain),
            })),
          })),
        })),
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentRequestsService,
        { provide: SupabaseService, useValue: mockSupabase },
      ],
    }).compile();

    service = module.get(PaymentRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('calls create_payment_request_api with organization + merchant context', async () => {
      const dto: CreatePaymentRequestDto = {
        amount: 1000,
        currency_code: 'XOF',
        expiry_date: '2026-12-31T23:59:59.000Z',
        description: 'Test',
        customer_id: '123e4567-e89b-12d3-a456-426614174000',
        payment_reference: 'INV-1',
      };

      const row = { request_id: 'pr_1', amount: dto.amount };
      mockClientRpc.mockResolvedValue({ data: row, error: null });

      const result = await service.create(dto, user);

      expect(result).toEqual(row);
      expect(mockClientRpc).toHaveBeenCalledWith(
        'create_payment_request_api',
        expect.objectContaining({
          p_organization_id: user.organizationId,
          p_customer_id: dto.customer_id,
          p_amount: dto.amount,
          p_currency_code: dto.currency_code,
          p_description: dto.description,
          p_expiry_date: dto.expiry_date,
          p_payment_reference: dto.payment_reference,
          p_created_by: user.merchantId,
          p_environment: user.environment,
        }),
      );
    });

    it('throws when RPC returns an error', async () => {
      mockClientRpc.mockResolvedValue({
        data: null,
        error: { message: 'boom' },
      });

      await expect(
        service.create(
          {
            amount: 1,
            currency_code: 'XOF',
            expiry_date: '2026-01-01T00:00:00.000Z',
          } as CreatePaymentRequestDto,
          user,
        ),
      ).rejects.toThrow('boom');
    });

    it('throws when RPC returns empty payload', async () => {
      mockClientRpc.mockResolvedValue({ data: [], error: null });

      await expect(
        service.create(
          {
            amount: 1,
            currency_code: 'XOF',
            expiry_date: '2026-01-01T00:00:00.000Z',
          } as CreatePaymentRequestDto,
          user,
        ),
      ).rejects.toThrow('Failed to create payment request');
    });
  });

  describe('findAll', () => {
    it('calls list_payment_requests with filters + pagination defaults', async () => {
      const rows = [{ request_id: 'a' }];
      mockClientRpc.mockResolvedValue({ data: rows, error: null });

      const result = await service.findAll(user, 'pending', undefined, 20, 0);

      expect(result).toEqual({
        data: rows,
        total: 1,
        limit: 20,
        offset: 0,
      });
      expect(mockClientRpc).toHaveBeenCalledWith(
        'list_payment_requests',
        expect.objectContaining({
          p_organization_id: user.organizationId,
          p_status: 'pending',
          p_customer_id: null,
          p_limit: 20,
          p_offset: 0,
        }),
      );
    });

    it('validates customerId UUID format', async () => {
      await expect(
        service.findAll(user, undefined, 'not-a-uuid'),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(mockClientRpc).not.toHaveBeenCalled();
    });

    it('maps RPC failures to InternalServerErrorException', async () => {
      mockClientRpc.mockResolvedValue({
        data: null,
        error: { message: 'rpc failed' },
      });

      await expect(service.findAll(user)).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('returns row when found', async () => {
      const row = { request_id: 'pr_1' };
      mockFromChain.single.mockResolvedValue({ data: row, error: null });

      const result = await service.findOne('pr_1', user);

      expect(result).toEqual(row);
    });

    it('throws NotFound when missing', async () => {
      mockFromChain.single.mockResolvedValue({ data: null, error: { message: 'nope' } });

      await expect(service.findOne('missing', user)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
