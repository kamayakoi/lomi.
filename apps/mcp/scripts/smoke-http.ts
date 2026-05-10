/**
 * Smoke test: hosted MCP HTTP initializes and lists tools (no merchant API calls).
 */
import http from 'node:http';
import type { AddressInfo } from 'node:net';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

import manifestJson from '../src/generated/tools-manifest.json' with { type: 'json' };
import { createHttpApplication } from '../src/http.ts';
import { parseManifest } from '../src/manifest-parse.ts';

const bearer = process.env.LOMI_MCP_BEARER_TOKEN ?? 'smoke-local-token';
process.env.LOMI_MCP_BEARER_TOKEN = bearer;
const demoMerchantKey =
  process.env.LOMI_TEST_MERCHANT_API_KEY ?? 'mcp-smoke-placeholder-key';

async function main(): Promise<void> {
  const manifest = parseManifest(manifestJson);
  const app = createHttpApplication(manifest);
  const server = await new Promise<http.Server>((resolve, reject) => {
    const s = http.createServer(app);
    s.listen(0, '127.0.0.1', () => resolve(s));
    s.on('error', reject);
  });

  const addr = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${addr.port}/mcp`;

  const transport = new StreamableHTTPClientTransport(new URL(baseUrl), {
    requestInit: {
      headers: {
        Authorization: `Bearer ${bearer}`,
        'x-lomi-api-key': demoMerchantKey,
      },
    },
  });

  const client = new Client({ name: 'lomi-mcp-smoke', version: '0.0.1' });
  await client.connect(transport);

  const listed = await client.listTools();
  if (!listed.tools?.length) {
    throw new Error('Expected non-empty tools list from MCP server');
  }

  await client.close();
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });

  console.log(`smoke-http: ok (${listed.tools.length} tools)`);
}

await main().catch((err) => {
  console.error(err);
  process.exit(1);
});
