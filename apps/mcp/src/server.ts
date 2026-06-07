import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import manifestJson from './generated/tools-manifest.json' with { type: 'json' };
import { parseManifest } from './manifest-parse.js';
import { getOptionalMerchantApiKey } from './env-config.js';
import { wireMcpServer } from './wire-mcp-server.js';

export async function startStdioServer(): Promise<void> {
  const manifest = parseManifest(manifestJson);

  const server = wireMcpServer({
    manifest,
    mode: 'stdio',
    getApiKey: getOptionalMerchantApiKey,
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
