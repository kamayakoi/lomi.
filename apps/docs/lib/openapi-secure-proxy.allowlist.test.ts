/* @proprietary license */

import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  getSandboxAllowedOrigins,
  isOriginAllowedForProxy,
} from './openapi-secure-proxy';

test('defaults to sandbox production origin', () => {
  const origins = getSandboxAllowedOrigins();
  assert.ok(origins.includes('https://sandbox.api.lomi.africa'));
});

test('allows extra origins from LOMI_DOCS_SANDBOX_ALLOWED_ORIGINS', () => {
  process.env.LOMI_DOCS_SANDBOX_ALLOWED_ORIGINS =
    'http://127.0.0.1:3333,http://localhost:9999';
  try {
    const origins = getSandboxAllowedOrigins();
    assert.ok(origins.includes('http://127.0.0.1:3333'));
    assert.ok(origins.includes('http://localhost:9999'));
  } finally {
    delete process.env.LOMI_DOCS_SANDBOX_ALLOWED_ORIGINS;
  }
});

test('rejects wrong host and non-http(s) URLs', () => {
  const list = ['https://sandbox.api.lomi.africa'];
  assert.equal(
    isOriginAllowedForProxy('https://sandbox.api.lomi.africa/foo', list),
    true,
  );
  assert.equal(
    isOriginAllowedForProxy('https://api.lomi.africa/accounts', list),
    false,
  );
  assert.equal(isOriginAllowedForProxy('file:///etc/passwd', list), false);
});
