import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PayoutsService } from './payouts.service';
import { SupabaseService } from '../../utils/supabase/supabase.service';

describe('PayoutsService', () => {
  let service: PayoutsService;

  const user = {
    merchantId: 'merchant-1',
    organizationId: 'org-1',
    environment: 'live' as const,
  };

  const supabaseMock = {
    rpc: jest.fn(),
    getClient: jest.fn(() => ({
      rpc: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayoutsService,
        {
          provide: SupabaseService,
          useValue: supabaseMock,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'SUPABASE_PROJECT_REF') return 'testref';
              if (key === 'SUPABASE_PUBLISHABLE_KEY') return 'testkey';
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get(PayoutsService);
    jest.clearAllMocks();
  });

  it('rejects beneficiary bank payouts', async () => {
    await expect(
      service.create(
        {
          destination: 'beneficiary',
          rail: 'bank',
          amount: 1000,
          currency_code: 'XOF',
        },
        user,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects MTN payouts', async () => {
    await expect(
      service.create(
        {
          destination: 'self',
          rail: 'mtn',
          amount: 1000,
          currency_code: 'XOF',
          payout_method_id: '550e8400-e29b-41d4-a716-446655440000',
        },
        user,
      ),
    ).rejects.toThrow(/MTN payouts are not supported/);
  });

  it('requires payout_method_id for self payouts', async () => {
    await expect(
      service.create(
        {
          destination: 'self',
          rail: 'bank',
          amount: 1000,
          currency_code: 'XOF',
        },
        user,
      ),
    ).rejects.toThrow(/payout_method_id is required/);
  });
});
