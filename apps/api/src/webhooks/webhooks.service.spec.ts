import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { WebhooksService } from './webhooks.service';
import { SupabaseService } from '../utils/supabase/supabase.service';
import { AuthContext } from '../core/common/decorators/current-user.decorator';

describe('WebhooksService', () => {
  let service: WebhooksService;

  const mockRpc = jest.fn();
  const mockSupabaseService = {
    getClient: jest.fn(() => ({ rpc: mockRpc })),
    rpc: mockRpc,
  };

  const user: AuthContext = {
    merchantId: 'merch-1',
    organizationId: 'org-1',
    environment: 'live',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhooksService,
        { provide: SupabaseService, useValue: mockSupabaseService },
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(WebhooksService);
    jest.clearAllMocks();
  });

  it('creates webhook via RPC and returns secret once', async () => {
    mockRpc
      .mockResolvedValueOnce({ data: 'wh-uuid', error: null })
      .mockResolvedValueOnce({
        data: [
          {
            webhook_id: 'wh-uuid',
            url: 'https://example.com/hook',
            authorized_events: ['PAYMENT_SUCCEEDED'],
            is_active: true,
            verification_token: 'whsec_test',
          },
        ],
        error: null,
      });

    const result = await service.create(
      {
        url: 'https://example.com/hook',
        authorized_events: ['PAYMENT_SUCCEEDED'],
      },
      user,
    );

    expect(mockRpc).toHaveBeenCalledWith(
      'create_webhook',
      expect.objectContaining({
        p_organization_id: 'org-1',
        p_environment: 'live',
      }),
    );
    expect(result.secret).toBe('whsec_test');
    expect(result.data).not.toHaveProperty('verification_token');
  });

  it('lists webhooks without verification_token', async () => {
    mockRpc.mockResolvedValue({
      data: [{ webhook_id: 'wh-1', verification_token: 'whsec_x' }],
      error: null,
    });

    const rows = await service.findAll(user);
    expect(rows[0]).not.toHaveProperty('verification_token');
  });
});
