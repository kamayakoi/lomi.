import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import manifestJson from './generated/tools-manifest.json' with { type: 'json' };
import { parseManifest } from './manifest-parse.js';
import { registerMerchantTools } from './register-tools.js';
import { getLomiApiBaseUrl } from './env-config.js';

export async function startStdioServer(): Promise<void> {
  const manifest = parseManifest(manifestJson);
  const baseUrl = getLomiApiBaseUrl();

  const server = new McpServer(
    { name: 'lomi.', version: manifest.apiVersion },
    {
      instructions: [
        'Tools call the public lomi. merchant REST API using your API key.',
        `Default base URL: ${baseUrl}. Override with LOMI_API_BASE_URL (e.g. https://sandbox.api.lomi.africa).`,
        'Authentication: set LOMI_API_KEY or X_API_KEY in the MCP server environment before invoking tools.',
        'Writes support optional idempotency_key → Idempotency-Key header.',
        `OpenAPI contract version in manifest: ${manifest.apiTitle} ${manifest.apiVersion} (${manifest.toolCount} tools).`,
      ].join('\n'),
    },
  );

  registerMerchantTools(server, manifest);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
