import { afterEach, describe, expect, it, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env };

async function loadEnvConfig() {
  vi.resetModules();
  return import('../src/env-config.js');
}

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.restoreAllMocks();
});

describe('env-config validation', () => {
  it('throws helpful error for conflicting API base URLs', async () => {
    process.env.LOMI_API_BASE_URL = 'https://api.lomi.africa';
    process.env.LOMI_API_URL = 'https://sandbox.api.lomi.africa';
    const cfg = await loadEnvConfig();
    expect(() => cfg.getLomiApiBaseUrl()).toThrow(
      /conflicts with legacy LOMI_API_URL/,
    );
  });

  it('throws helpful error for malformed host allowlist entry', async () => {
    process.env.LOMI_MCP_ALLOWED_HOSTS =
      'mcp.lomi.africa,https://bad.example.com/mcp';
    const cfg = await loadEnvConfig();
    expect(() => cfg.listenHostOptions()).toThrow(/hostnames only/);
  });

  it('throws helpful error for malformed outbound allowlist', async () => {
    process.env.LOMI_API_BASE_URL_ALLOWLIST = 'api.lomi.africa,,sandbox.api.lomi.africa';
    const cfg = await loadEnvConfig();
    expect(() => cfg.getLomiApiBaseUrl()).toThrow(/contains empty entries/);
  });

  it('throws helpful error for ambiguous merchant keys', async () => {
    process.env.LOMI_API_KEY = 'lomi_sk_one';
    process.env.X_API_KEY = 'lomi_sk_two';
    const cfg = await loadEnvConfig();
    expect(() => cfg.getOptionalMerchantApiKey()).toThrow(
      /Multiple merchant key env vars are set/,
    );
  });

  it('accepts comma-separated LOMI_MCP_BEARER_TOKEN for rotation', async () => {
    process.env.LOMI_MCP_BEARER_TOKEN = 'alpha-secret,beta-secret';
    const cfg = await loadEnvConfig();
    expect(cfg.getMcpHttpBearerTokens()).toEqual(['alpha-secret', 'beta-secret']);
    expect(cfg.isMcpTransportBearerToken('beta-secret')).toBe(true);
  });

  it('throws for duplicate bearer tokens in LOMI_MCP_BEARER_TOKEN', async () => {
    process.env.LOMI_MCP_BEARER_TOKEN = 'same,same';
    const cfg = await loadEnvConfig();
    expect(() => cfg.getMcpHttpBearerTokens()).toThrow(/duplicate/);
  });

  it('throws for empty segment in LOMI_MCP_BEARER_TOKEN', async () => {
    process.env.LOMI_MCP_BEARER_TOKEN = 'a,,b';
    const cfg = await loadEnvConfig();
    expect(() => cfg.getMcpHttpBearerTokens()).toThrow(/empty entry/);
  });

  it('throws helpful error for invalid custom MCP path', async () => {
    process.env.LOMI_MCP_HTTP_PATH = '/mcp?foo=bar';
    const cfg = await loadEnvConfig();
    expect(() => cfg.mcpHttpBasePath()).toThrow(/Use a URL path like "\/mcp"/);
  });
});
