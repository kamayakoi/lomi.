import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { WebhookSignatureGuard } from './webhook-signature.guard';
import { SupabaseService } from '../../utils/supabase/supabase.service';

function createMockContext(request: Record<string, any>): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext;
}

describe('WebhookSignatureGuard', () => {
  let guard: WebhookSignatureGuard;
  let supabase: { rpc: jest.Mock };

  beforeEach(() => {
    supabase = { rpc: jest.fn() };
    guard = new WebhookSignatureGuard(supabase as unknown as SupabaseService);
  });

  it('verifies signatures against the exact raw request body', async () => {
    const rawBody = Buffer.from('{"amount":10000,"currency":"XOF"}');
    const token = 'whsec_test';
    const signature = crypto
      .createHmac('sha256', token)
      .update(rawBody)
      .digest('hex');

    supabase.rpc.mockResolvedValue({
      data: [
        {
          verification_token: token,
          created_by: 'merchant_1',
          organization_id: 'org_1',
        },
      ],
      error: null,
    });

    const request: any = {
      headers: {
        'x-merchant-signature': signature,
        'x-webhook-id': 'webhook_1',
      },
      rawBody,
      body: { currency: 'XOF', amount: 10000 },
    };

    await expect(guard.canActivate(createMockContext(request))).resolves.toBe(
      true,
    );
    expect(request.webhookId).toBe('webhook_1');
    expect(request.merchantId).toBe('merchant_1');
    expect(request.organizationId).toBe('org_1');
  });

  it('rejects mismatched or malformed signatures without timingSafeEqual errors', async () => {
    supabase.rpc.mockResolvedValue({
      data: [
        {
          verification_token: 'whsec_test',
          created_by: 'merchant_1',
          organization_id: 'org_1',
        },
      ],
      error: null,
    });

    const request = {
      headers: {
        'x-merchant-signature': 'bad',
        'x-webhook-id': 'webhook_1',
      },
      rawBody: Buffer.from('{"amount":10000}'),
    };

    await expect(guard.canActivate(createMockContext(request))).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
