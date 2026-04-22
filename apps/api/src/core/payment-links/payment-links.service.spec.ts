import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PaymentLinksService } from './payment-links.service';
import { SupabaseService } from '../../utils/supabase/supabase.service';
import { CreatePaymentLinkDto } from './dto/create-payment-link.dto';
import { AuthContext } from '../common/decorators/current-user.decorator';

describe('PaymentLinksService', () => {
  let service: PaymentLinksService;
  let mockServiceRpc: jest.Mock;
  let mockClientRpc: jest.Mock;
  let mockFromChain: { single: jest.Mock };

  const user: AuthContext = {
    merchantId: 'merch_1',
    organizationId: 'org_1',
    environment: 'test',
  } as AuthContext;

  beforeEach(async () => {
    mockServiceRpc = jest.fn();
    mockClientRpc = jest.fn();
    mockFromChain = { single: jest.fn() };

    const mockSupabase = {
      rpc: mockServiceRpc,
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
        PaymentLinksService,
        { provide: SupabaseService, useValue: mockSupabase },
      ],
    }).compile();

    service = module.get(PaymentLinksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto: CreatePaymentLinkDto = {
      link_type: 'instant',
      title: 'Pay me',
      currency_code: 'XOF',
      amount: 1500,
    } as CreatePaymentLinkDto;

    it('uses create_payment_link RPC with expected payload keys', async () => {
      const linkId = 'link_123';
      const hydrated = { link_id: linkId, title: dto.title };

      mockServiceRpc.mockResolvedValueOnce({ data: linkId, error: null });
      mockClientRpc.mockResolvedValueOnce({ data: [hydrated], error: null });

      const result = await service.create(dto, user);

      expect(result).toEqual(hydrated);
      expect(mockServiceRpc).toHaveBeenCalledWith(
        'create_payment_link',
        expect.objectContaining({
          p_organization_id: user.organizationId,
          p_link_type: dto.link_type,
          p_title: dto.title,
          p_currency_code: dto.currency_code,
          p_price: dto.amount,
          p_created_by: user.merchantId,
          p_environment: 'live',
        }),
      );
      expect(mockClientRpc).toHaveBeenCalledWith(
        'get_payment_link_api',
        expect.objectContaining({
          p_link_id: linkId,
          p_organization_id: user.organizationId,
        }),
      );
    });

    it('falls back to findOne when hydration RPC fails', async () => {
      const linkId = 'link_456';
      const row = { link_id: linkId };

      mockServiceRpc.mockResolvedValueOnce({ data: linkId, error: null });
      mockClientRpc.mockResolvedValueOnce({ data: null, error: { message: 'nope' } });
      mockFromChain.single.mockResolvedValueOnce({ data: row, error: null });

      const result = await service.create(dto, user);

      expect(result).toEqual(row);
    });

    it('throws when create RPC errors', async () => {
      mockServiceRpc.mockResolvedValueOnce({
        data: null,
        error: { message: 'failed' },
      });

      await expect(service.create(dto, user)).rejects.toThrow('failed');
    });
  });

  describe('findAll', () => {
    it('calls list_payment_links with nullable filters', async () => {
      const links = [{ link_id: 'l1' }];
      mockClientRpc.mockResolvedValue({ data: links, error: null });

      const result = await service.findAll(user, 'product', true, 15, 30);

      expect(result).toEqual({
        data: links,
        total: 1,
        limit: 15,
        offset: 30,
      });
      expect(mockClientRpc).toHaveBeenCalledWith(
        'list_payment_links',
        expect.objectContaining({
          p_organization_id: user.organizationId,
          p_link_type: 'product',
          p_is_active: true,
          p_limit: 15,
          p_offset: 30,
        }),
      );
    });

    it('throws when RPC errors', async () => {
      mockClientRpc.mockResolvedValue({
        data: null,
        error: { message: 'bad' },
      });

      await expect(service.findAll(user)).rejects.toThrow('bad');
    });
  });

  describe('findOne', () => {
    it('returns row when found', async () => {
      const row = { link_id: 'l1' };
      mockFromChain.single.mockResolvedValue({ data: row, error: null });

      await expect(service.findOne('l1', user)).resolves.toEqual(row);
    });

    it('throws NotFound when missing', async () => {
      mockFromChain.single.mockResolvedValue({ data: null, error: { message: 'missing' } });

      await expect(service.findOne('nope', user)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
