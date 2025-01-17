import { describe, expect, it } from '@jest/globals';
import { BaseClient } from '../../src/client/BaseClient';

describe('BaseClient', () => {
  it('should be instantiated with baseUrl', () => {
    const client = new BaseClient('https://api.test.com');
    expect(client).toBeInstanceOf(BaseClient);
  });

  it('should be instantiated with baseUrl and apiKey', () => {
    const client = new BaseClient('https://api.test.com', 'test-api-key');
    expect(client).toBeInstanceOf(BaseClient);
  });
}); 