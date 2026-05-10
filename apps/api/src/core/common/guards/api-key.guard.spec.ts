import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { ApiKeyGuard } from './api-key.guard';
import { SupabaseService } from '../../../utils/supabase/supabase.service';

function createMockContext(request: Record<string, any>): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext;
}

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;
  let supabase: { rpc: jest.Mock };

  beforeEach(() => {
    supabase = { rpc: jest.fn() };
    guard = new ApiKeyGuard(supabase as unknown as SupabaseService);
  });

  it('rejects when API key header is missing', async () => {
    const ctx = createMockContext({
      headers: {},
      url: '/transactions',
      method: 'GET',
      ip: '127.0.0.1',
    });

    await expect(guard.canActivate(ctx)).rejects.toThrow('API Key is missing');
    expect(supabase.rpc).not.toHaveBeenCalled();
  });

  it('accepts API key from X-API-KEY header', async () => {
    supabase.rpc.mockResolvedValue({
      data: [
        {
          is_valid: true,
          merchant_id: 'm2',
          organization_id: 'o2',
          environment: 'live',
        },
      ],
      error: null,
    });

    const req: any = {
      headers: { 'x-api-key': 'sk_test_abc' },
      url: '/checkout-sessions',
      method: 'POST',
      ip: '192.168.1.1',
    };

    await expect(guard.canActivate(createMockContext(req))).resolves.toBe(true);
    expect(supabase.rpc).toHaveBeenCalledWith(
      'verify_api_key',
      expect.objectContaining({
        p_api_key: 'sk_test_abc',
        p_endpoint: '/checkout-sessions',
        p_request_method: 'POST',
        p_ip_address: '192.168.1.1',
      }),
    );
    expect(req.user).toEqual({
      merchantId: 'm2',
      organizationId: 'o2',
      environment: 'live',
    });
  });

  it('accepts API key from Authorization: Bearer', async () => {
    supabase.rpc.mockResolvedValue({
      data: [
        {
          is_valid: true,
          merchant_id: 'm1',
          organization_id: 'o1',
          environment: 'test',
        },
      ],
      error: null,
    });

    const req: any = {
      headers: { authorization: 'Bearer secret' },
      url: '/payment-requests',
      method: 'POST',
      ip: '127.0.0.1',
    };

    await expect(guard.canActivate(createMockContext(req))).resolves.toBe(true);
    expect(supabase.rpc).toHaveBeenCalledWith(
      'verify_api_key',
      expect.objectContaining({
        p_api_key: 'secret',
        p_endpoint: '/payment-requests',
        p_request_method: 'POST',
        p_ip_address: '127.0.0.1',
      }),
    );
    expect(req.user).toEqual({
      merchantId: 'm1',
      organizationId: 'o1',
      environment: 'test',
    });
  });

  it('rejects when verify_api_key returns invalid', async () => {
    supabase.rpc.mockResolvedValue({
      data: [{ is_valid: false }],
      error: null,
    });

    const ctx = createMockContext({
      headers: { 'x-api-key': 'bad' },
      url: '/',
      method: 'GET',
      ip: '127.0.0.1',
    });

    await expect(guard.canActivate(ctx)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rejects when verify_api_key RPC errors', async () => {
    supabase.rpc.mockResolvedValue({
      data: null,
      error: { message: 'rpc down' },
    });

    const ctx = createMockContext({
      headers: { 'x-api-key': 'k' },
      url: '/',
      method: 'GET',
      ip: '127.0.0.1',
    });

    await expect(guard.canActivate(ctx)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
