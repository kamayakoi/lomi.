import { lookup as dnsLookup } from 'node:dns/promises';
import type { LookupAddress } from 'node:dns';
import {
  isBlockedWebhookAddress,
  parseMerchantWebhookUrl,
  resolveSafeMerchantWebhookTarget,
  UnsafeWebhookUrlError,
} from './merchant-webhook-url';

jest.mock('node:dns/promises', () => ({
  lookup: jest.fn(),
}));

const mockedLookup = dnsLookup as jest.MockedFunction<typeof dnsLookup>;

describe('merchant-webhook-url', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isBlockedWebhookAddress', () => {
    it('blocks loopback, private, link-local, and metadata IPv4 ranges', () => {
      expect(isBlockedWebhookAddress('127.0.0.1')).toBe(true);
      expect(isBlockedWebhookAddress('10.0.0.5')).toBe(true);
      expect(isBlockedWebhookAddress('172.16.0.1')).toBe(true);
      expect(isBlockedWebhookAddress('192.168.1.10')).toBe(true);
      expect(isBlockedWebhookAddress('169.254.169.254')).toBe(true);
      expect(isBlockedWebhookAddress('100.64.0.1')).toBe(true);
    });

    it('allows public IPv4 addresses', () => {
      expect(isBlockedWebhookAddress('8.8.8.8')).toBe(false);
      expect(isBlockedWebhookAddress('93.184.216.34')).toBe(false);
    });

    it('blocks IPv6 loopback and link-local addresses', () => {
      expect(isBlockedWebhookAddress('::1')).toBe(true);
      expect(isBlockedWebhookAddress('fe80::1')).toBe(true);
    });
  });

  describe('parseMerchantWebhookUrl', () => {
    it('requires HTTPS without embedded credentials', () => {
      expect(() =>
        parseMerchantWebhookUrl('http://example.com/webhook'),
      ).toThrow(UnsafeWebhookUrlError);
      expect(() =>
        parseMerchantWebhookUrl('https://user:pass@example.com/webhook'),
      ).toThrow(UnsafeWebhookUrlError);
    });

    it('rejects literal private targets at parse time', () => {
      expect(() =>
        parseMerchantWebhookUrl('https://127.0.0.1/webhook'),
      ).toThrow(UnsafeWebhookUrlError);
      expect(() =>
        parseMerchantWebhookUrl('https://169.254.169.254/latest/meta-data'),
      ).toThrow(UnsafeWebhookUrlError);
    });

    it('rejects localhost and metadata hostnames', () => {
      expect(() =>
        parseMerchantWebhookUrl('https://localhost/webhook'),
      ).toThrow(UnsafeWebhookUrlError);
      expect(() =>
        parseMerchantWebhookUrl('https://metadata.google.internal/computeMetadata/v1/'),
      ).toThrow(UnsafeWebhookUrlError);
    });
  });

  describe('resolveSafeMerchantWebhookTarget', () => {
    it('accepts public hostnames that resolve to public addresses', async () => {
      mockedLookup.mockResolvedValue([
        { address: '93.184.216.34', family: 4 },
      ] as LookupAddress[]);

      const target = await resolveSafeMerchantWebhookTarget(
        'https://example.com/webhooks/lomi',
      );

      expect(target.hostname).toBe('example.com');
      expect(target.pinnedAddresses).toEqual(['93.184.216.34']);
    });

    it('rejects hostnames that resolve to private addresses', async () => {
      mockedLookup.mockResolvedValue([
        { address: '10.0.0.8', family: 4 },
      ] as LookupAddress[]);

      await expect(
        resolveSafeMerchantWebhookTarget('https://attacker.example/webhook'),
      ).rejects.toThrow(UnsafeWebhookUrlError);
    });

    it('rejects hostnames with mixed public and private resolution', async () => {
      mockedLookup.mockResolvedValue([
        { address: '93.184.216.34', family: 4 },
        { address: '10.0.0.8', family: 4 },
      ] as LookupAddress[]);

      await expect(
        resolveSafeMerchantWebhookTarget('https://dual.example/webhook'),
      ).rejects.toThrow(UnsafeWebhookUrlError);
    });
  });
});
