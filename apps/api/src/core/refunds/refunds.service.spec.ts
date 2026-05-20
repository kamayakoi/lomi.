import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RefundsService } from './refunds.service';
import type { AuthContext } from '../common/decorators/current-user.decorator';

describe('RefundsService', () => {
  const user: AuthContext = {
    merchantId: '904d003c-3736-41d4-90a5-9de74d404fd7',
    organizationId: '0979ec77-9fb1-4c9a-8c55-d7fb6c182c9c',
    environment: 'live',
  };

  const completedCardTx = {
    transaction_id: 'tx-card',
    organization_id: user.organizationId,
    customer_id: 'cust-1',
    gross_amount: 10000,
    net_amount: 9500,
    fee_amount: 500,
    currency_code: 'XOF',
    provider_code: 'STRIPE',
    payment_method_code: 'CARDS',
    status: 'completed',
  };

  function buildService(rpcImpl: (name: string, args: Record<string, unknown>) => unknown) {
    const rpc = jest.fn((name: string, args: Record<string, unknown>) =>
      Promise.resolve(rpcImpl(name, args)),
    );
    const client = { rpc };
    const supabaseService = {
      getClient: () => client,
    };
    const configService = {
      get: (key: string) =>
        key === 'SUPABASE_PROJECT_REF' ? 'proj' : 'anon-key',
    };
    return { service: new RefundsService(configService as never, supabaseService as never), rpc };
  }

  it('rejects unsupported provider', async () => {
    const { service } = buildService((name) => {
      if (name === 'get_transaction') {
        return {
          data: [
            {
              ...completedCardTx,
              provider_code: 'MTN',
              payment_method_code: 'MOBILE_MONEY',
            },
          ],
          error: null,
        };
      }
      if (name.startsWith('get_effective_other_fee_config')) {
        return { data: [{ percentage: 2, fixed_amount: 0 }], error: null };
      }
      return { data: null, error: null };
    });

    await expect(
      service.create(
        { transaction_id: 'tx-card', amount: 1000 },
        user,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('creates card refund via create_manual_refund_request_api', async () => {
    const { service, rpc } = buildService((name) => {
      if (name === 'get_transaction') {
        return { data: [completedCardTx], error: null };
      }
      if (name.startsWith('get_effective_other_fee_config')) {
        return { data: [{ percentage: 2, fixed_amount: 0 }], error: null };
      }
      if (name === 'create_manual_refund_request_api') {
        return {
          data: {
            success: true,
            refund_id: 'ref-1',
            refunded_amount: 10000,
            status: 'completed',
          },
          error: null,
        };
      }
      return { data: null, error: null };
    });

    const result = await service.create(
      { transaction_id: 'tx-card', amount: 10000, refund_type: 'full' },
      user,
    );

    expect(result.refund_id).toBe('ref-1');
    expect(rpc).toHaveBeenCalledWith(
      'create_manual_refund_request_api',
      expect.objectContaining({
        p_merchant_id: user.merchantId,
        p_transaction_id: 'tx-card',
      }),
    );
  });

  it('findOne throws when refund missing', async () => {
    const { service } = buildService((name) => {
      if (name === 'get_refund') {
        return { data: [], error: null };
      }
      return { data: null, error: null };
    });

    await expect(service.findOne('missing', user)).rejects.toThrow(
      NotFoundException,
    );
  });
});
