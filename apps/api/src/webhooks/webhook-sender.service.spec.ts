import { Test, TestingModule } from '@nestjs/testing';
import { WebhookSenderService, Webhook } from './webhook-sender.service';
import { SupabaseService } from '../utils/supabase/supabase.service';
import axios from 'axios';
import { resolveSafeMerchantWebhookTarget } from './merchant-webhook-url';

jest.mock('axios');
jest.mock('./merchant-webhook-url', () => ({
  ...jest.requireActual('./merchant-webhook-url'),
  resolveSafeMerchantWebhookTarget: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedResolveSafeTarget =
  resolveSafeMerchantWebhookTarget as jest.MockedFunction<
    typeof resolveSafeMerchantWebhookTarget
  >;

describe('WebhookSenderService', () => {
  let service: WebhookSenderService;

  const mockSupabaseService = {
    getClient: jest.fn(),
    rpc: jest.fn().mockResolvedValue({ data: null, error: null }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookSenderService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<WebhookSenderService>(WebhookSenderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendWebhook', () => {
    const webhook: Webhook = {
      id: 'wh_123',
      url: 'https://example.com/webhook',
      events: ['PAYMENT_SUCCEEDED'],
      secret: 'secret_123',
      active: true,
      organization_id: 'org_123',
    };
    const event = 'PAYMENT_SUCCEEDED';
    const data = { id: 'tx_123' };

    it('should send webhook successfully', async () => {
      mockedResolveSafeTarget.mockResolvedValue({
        url: webhook.url,
        hostname: 'example.com',
        port: 443,
        pinnedAddresses: ['93.184.216.34'],
      });
      mockedAxios.post.mockResolvedValue({ status: 200, data: 'OK' });
      mockSupabaseService.rpc.mockResolvedValue({ data: null, error: null });

      const result = await service.sendWebhook(webhook, event, data);

      expect(result).toBe(true);
      expect(mockedResolveSafeTarget).toHaveBeenCalledWith(webhook.url);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        webhook.url,
        expect.any(String),
        expect.objectContaining({
          maxRedirects: 0,
          headers: expect.objectContaining({
            'X-Lomi-Event': event,
            'X-Lomi-Signature': expect.any(String),
          }),
        }),
      );
      expect(mockSupabaseService.rpc).toHaveBeenCalledWith(
        'log_webhook_delivery',
        expect.objectContaining({
          p_webhook_id: webhook.id,
          p_response_status: 200,
        }),
      );
    });

    it('should retry on failure', async () => {
      mockedResolveSafeTarget.mockResolvedValue({
        url: webhook.url,
        hostname: 'example.com',
        port: 443,
        pinnedAddresses: ['93.184.216.34'],
      });
      mockedAxios.post
        .mockRejectedValueOnce({ response: { status: 500 } })
        .mockResolvedValueOnce({ status: 200, data: 'OK' });
      mockSupabaseService.rpc.mockResolvedValue({ data: null, error: null });

      const result = await service.sendWebhook(webhook, event, data, 1, 10); // 1 retry, 10ms delay

      expect(result).toBe(true);
      expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    });

    it('should fail after max retries', async () => {
      mockedResolveSafeTarget.mockResolvedValue({
        url: webhook.url,
        hostname: 'example.com',
        port: 443,
        pinnedAddresses: ['93.184.216.34'],
      });
      mockedAxios.post.mockRejectedValue({ response: { status: 500 } });
      mockSupabaseService.rpc.mockResolvedValue({ data: null, error: null });

      const result = await service.sendWebhook(webhook, event, data, 1, 10);

      expect(result).toBe(false);
      expect(mockedAxios.post).toHaveBeenCalledTimes(2); // Initial + 1 retry
      expect(mockSupabaseService.rpc).toHaveBeenCalledWith(
        'log_webhook_delivery',
        expect.objectContaining({
          p_response_status: 500,
        }),
      );
    });

    it('should not send if webhook is inactive', async () => {
      const inactiveWebhook = { ...webhook, active: false };
      const result = await service.sendWebhook(inactiveWebhook, event, data);
      expect(result).toBe(false);
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it('should not send if event is not subscribed', async () => {
      const result = await service.sendWebhook(webhook, 'PAYMENT_FAILED', data);
      expect(result).toBe(false);
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it('should block unsafe webhook URLs before sending', async () => {
      mockedResolveSafeTarget.mockRejectedValue(
        new Error('Webhook URL resolves to a private address'),
      );

      const result = await service.sendWebhook(webhook, event, data);

      expect(result).toBe(false);
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });
  });
});
