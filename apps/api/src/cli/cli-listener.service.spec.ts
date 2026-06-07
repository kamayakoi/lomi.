import { ForbiddenException } from '@nestjs/common';
import { CliListenerService } from './cli-listener.service';

describe('CliListenerService', () => {
  let service: CliListenerService;

  beforeEach(() => {
    service = new CliListenerService();
  });

  describe('assertListenAllowed', () => {
    it('allows test environment', () => {
      expect(() => service.assertListenAllowed('test')).not.toThrow();
    });

    it('blocks live environment by default', () => {
      expect(() => service.assertListenAllowed('live')).toThrow(
        ForbiddenException,
      );
    });

    it('allows live when explicitly enabled on API and client', () => {
      process.env.CLI_LISTEN_ALLOW_PRODUCTION = 'true';
      expect(() => service.assertListenAllowed('live', true)).not.toThrow();
      delete process.env.CLI_LISTEN_ALLOW_PRODUCTION;
    });
  });
});
